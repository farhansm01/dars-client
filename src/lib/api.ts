import { Course, Lecture } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export async function getCourses(): Promise<Course[]> {
  const res = await fetch(`${API_URL}/courses`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch courses");
  }
  return res.json();
}

export async function getCourse(id: string): Promise<Course> {
  const res = await fetch(`${API_URL}/courses/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch course details");
  }
  return res.json();
}

export async function getCourseLectures(courseId: string): Promise<Lecture[]> {
  const res = await fetch(`${API_URL}/courses/${courseId}/lectures`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch course lectures");
  }
  return res.json();
}

