import { authClient } from "./auth-client";
import { Course, Lecture } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function getAuthHeaders(): Promise<Record<string, string>> {
  const { data } = await authClient.getSession();
  if (!data?.session) return { "Content-Type": "application/json" };
  const { data: tokenData } = await authClient.token();
  const token = tokenData?.token;
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/courses`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }
  return res.json();
}

export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${API_URL}/courses/${id}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }
  return res.json();
}

export async function createCourse(data: {
  title: string;
  description: string;
  price: number;
  thumbnail: string;
}): Promise<Course> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/courses`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create course");
  }
  return res.json();
}

export async function updateCourse(
  id: string,
  data: {
    title: string;
    description: string;
    price: number;
    thumbnail: string;
  }
): Promise<Course> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update course");
  }
  return res.json();
}

export async function deleteCourse(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/courses/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete course");
  }
}

export async function getCourseLectures(courseId: string): Promise<Lecture[]> {
  const res = await fetch(`${API_URL}/courses/${courseId}/lectures`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch lectures");
  }
  return res.json();
}

export async function createLecture(
  courseId: string,
  data: {
    title: string;
    description: string;
    videoUrl: string;
  }
): Promise<Lecture> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/courses/${courseId}/lectures`, {
    method: "POST",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to create lecture");
  }
  return res.json();
}

export async function updateLecture(
  id: string,
  data: {
    title: string;
    description: string;
    videoUrl: string;
  }
): Promise<Lecture> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/lectures/${id}`, {
    method: "PUT",
    headers,
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to update lecture");
  }
  return res.json();
}

export async function deleteLecture(id: string): Promise<void> {
  const headers = await getAuthHeaders();
  const res = await fetch(`${API_URL}/lectures/${id}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new Error(error.message || "Failed to delete lecture");
  }
}
