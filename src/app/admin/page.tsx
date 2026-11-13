"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Plus,
  Pencil,
  Trash2,
  Video,
  ArrowLeft,
  ExternalLink,
  BookOpen,
  Loader2,
} from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { CourseModal } from "@/components/admin/CourseModal";
import { LectureModal } from "@/components/admin/LectureModal";
import { Course, Lecture } from "@/types";
import {
  getCourses,
  deleteCourse,
  getCourseLectures,
  deleteLecture,
} from "@/lib/api";

export default function AdminPage() {
  const router = useRouter();
  const { data: session, isPending: authPending } = useSession();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authPending && !session?.user) {
      router.replace("/login");
    }
  }, [authPending, session, router]);

  // State
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);
  const [courseError, setCourseError] = useState<string | null>(null);

  // Selected course for managing its lectures
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [loadingLectures, setLoadingLectures] = useState(false);
  const [lectureError, setLectureError] = useState<string | null>(null);

  // Modals state
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [courseToEdit, setCourseToEdit] = useState<Course | null>(null);
  const [isLectureModalOpen, setIsLectureModalOpen] = useState(false);
  const [lectureToEdit, setLectureToEdit] = useState<Lecture | null>(null);

  // Fetch Courses
  const loadCourses = async () => {
    setLoadingCourses(true);
    setCourseError(null);
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (err: unknown) {
      setCourseError(
        err instanceof Error ? err.message : "Failed to load courses"
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  // Fetch Lectures for Selected Course
  const loadLectures = async (courseId: string) => {
    setLoadingLectures(true);
    setLectureError(null);
    try {
      const data = await getCourseLectures(courseId);
      setLectures(data);
    } catch (err: unknown) {
      setLectureError(
        err instanceof Error ? err.message : "Failed to load lectures"
      );
    } finally {
      setLoadingLectures(false);
    }
  };

  useEffect(() => {
    let ignore = false;
    getCourses()
      .then((data) => {
        if (!ignore) setCourses(data);
      })
      .catch((err: unknown) => {
        if (!ignore)
          setCourseError(
            err instanceof Error ? err.message : "Failed to load courses"
          );
      })
      .finally(() => {
        if (!ignore) setLoadingCourses(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const handleOpenLectures = (course: Course) => {
    setSelectedCourse(course);
    loadLectures(course._id);
  };

  const handleBackToCourses = () => {
    setSelectedCourse(null);
    setLectures([]);
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (
      !confirm("Are you sure you want to delete this course and all its lectures?")
    ) {
      return;
    }
    try {
      await deleteCourse(courseId);
      await loadCourses();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete course");
    }
  };

  const handleDeleteLecture = async (lectureId: string) => {
    if (!confirm("Are you sure you want to delete this lecture?")) {
      return;
    }
    try {
      await deleteLecture(lectureId);
      if (selectedCourse) {
        await loadLectures(selectedCourse._id);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to delete lecture");
    }
  };

  if (authPending || !session?.user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-[#391486] mb-3" />
        <p className="text-sm">Checking administrator session...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-50 text-gray-900">
      {/* Admin Sidebar Navigation */}
      <AdminSidebar />

      {/* Main Content Area (No public nav or footer) */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar inside admin layout */}
        <header className="h-16 bg-white border-b border-gray-200 px-6 sm:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-semibold text-gray-800">Admin Dashboard</span>
            {selectedCourse && (
              <>
                <span className="text-gray-400">/</span>
                <span className="text-gray-500 truncate max-w-xs">
                  {selectedCourse.title}
                </span>
              </>
            )}
          </div>

          <div>
            <span className="text-xs text-gray-500">
              Logged in as <strong className="text-gray-800">{session.user.email}</strong>
            </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto">
          <div>
            {/* Header Title + Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-gray-200">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                    {selectedCourse ? "Lecture Management" : "Course Management"}
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedCourse
                      ? `Managing lectures for "${selectedCourse.title}"`
                      : "Create, view, update, and manage your course catalog."}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {selectedCourse ? (
                    <>
                      <button
                        type="button"
                        onClick={handleBackToCourses}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs sm:text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 border border-gray-200 rounded-lg transition cursor-pointer"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Courses</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setLectureToEdit(null);
                          setIsLectureModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#391486] hover:bg-[#4B1C9E] rounded-lg shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Lecture</span>
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setCourseToEdit(null);
                        setIsCourseModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-[#391486] hover:bg-[#4B1C9E] rounded-lg shadow-xs transition cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Create Course</span>
                    </button>
                  )}
                </div>
              </div>

              {/* VIEW 1: Courses Management Table */}
              {!selectedCourse && (
                <div>
                  {loadingCourses ? (
                    <div className="py-16 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#391486] mx-auto mb-2" />
                      <p className="text-sm">Loading courses...</p>
                    </div>
                  ) : courseError ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 text-sm">
                      {courseError}
                    </div>
                  ) : courses.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl shadow-xs">
                      <BookOpen className="w-12 h-12 text-[#391486]/40 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-900">No courses yet</h3>
                      <p className="text-sm text-gray-500 mt-1 mb-4">
                        Get started by creating your first course.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setCourseToEdit(null);
                          setIsCourseModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#391486] hover:bg-[#4B1C9E] rounded-lg shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Create Course</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-xs">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3.5">Course</th>
                            <th className="px-5 py-3.5">Price</th>
                            <th className="px-5 py-3.5">Description</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {courses.map((course) => (
                            <tr
                              key={course._id}
                              className="hover:bg-purple-50/20 transition"
                            >
                              {/* Course Title & Thumbnail */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <div className="flex items-center gap-3">
                                  <div className="w-14 h-9 rounded-md overflow-hidden bg-gray-100 shrink-0 border border-gray-200">
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                      src={course.thumbnail}
                                      alt={course.title}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        (e.currentTarget as HTMLImageElement).src =
                                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <span className="font-semibold text-gray-900 block max-w-xs truncate">
                                      {course.title}
                                    </span>
                                    <Link
                                      href={`/courses/${course._id}`}
                                      target="_blank"
                                      className="text-xs text-[#391486] hover:underline inline-flex items-center gap-1 mt-0.5"
                                    >
                                      <span>Preview page</span>
                                      <ExternalLink className="w-3 h-3" />
                                    </Link>
                                  </div>
                                </div>
                              </td>

                              {/* Price */}
                              <td className="px-5 py-4 whitespace-nowrap">
                                <span className="font-bold text-[#391486]">
                                  {course.price === 0 ? "Free" : `৳ ${course.price}`}
                                </span>
                              </td>

                              {/* Description */}
                              <td className="px-5 py-4 max-w-sm">
                                <p className="text-gray-500 text-xs line-clamp-2">
                                  {course.description}
                                </p>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => handleOpenLectures(course)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-[#391486] bg-purple-50 hover:bg-purple-100 border border-purple-200 rounded-lg transition cursor-pointer"
                                    title="Manage Course Lectures"
                                  >
                                    <Video className="w-3.5 h-3.5" />
                                    <span>Lectures</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      setCourseToEdit(course);
                                      setIsCourseModalOpen(true);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                    title="Edit Course"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteCourse(course._id)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                    title="Delete Course"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* VIEW 2: Lectures Management for Selected Course */}
              {selectedCourse && (
                <div>
                  {/* Course Info Banner */}
                  <div className="mb-6 p-4 bg-white border border-gray-200 rounded-xl flex items-center justify-between flex-wrap gap-4 shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-10 rounded-lg overflow-hidden bg-gray-100 border border-gray-200 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={selectedCourse.thumbnail}
                          alt={selectedCourse.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-sm">
                          {selectedCourse.title}
                        </h3>
                        <p className="text-xs text-gray-500">
                          Price: {selectedCourse.price === 0 ? "Free" : `৳ ${selectedCourse.price}`} •{" "}
                          {lectures.length} Total Lectures
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${selectedCourse._id}`}
                      target="_blank"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#391486] hover:underline"
                    >
                      <span>View Student Course Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  {loadingLectures ? (
                    <div className="py-16 text-center text-gray-400">
                      <Loader2 className="w-6 h-6 animate-spin text-[#391486] mx-auto mb-2" />
                      <p className="text-sm">Loading course lectures...</p>
                    </div>
                  ) : lectureError ? (
                    <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-center text-red-600 text-sm">
                      {lectureError}
                    </div>
                  ) : lectures.length === 0 ? (
                    <div className="p-12 text-center bg-white border border-gray-200 rounded-2xl shadow-xs">
                      <Video className="w-12 h-12 text-[#391486]/40 mx-auto mb-3" />
                      <h3 className="text-base font-bold text-gray-900">
                        No lectures added yet
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 mb-4">
                        Add video lectures so students can watch them on the course page.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setLectureToEdit(null);
                          setIsLectureModalOpen(true);
                        }}
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-[#391486] hover:bg-[#4B1C9E] rounded-lg shadow-xs transition cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add First Lecture</span>
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow-xs">
                      <table className="min-w-full divide-y divide-gray-200 text-left text-sm">
                        <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <tr>
                            <th className="px-5 py-3.5 w-12">#</th>
                            <th className="px-5 py-3.5">Lecture Title</th>
                            <th className="px-5 py-3.5">Description</th>
                            <th className="px-5 py-3.5">Video URL</th>
                            <th className="px-5 py-3.5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                          {lectures.map((lecture, index) => (
                            <tr
                              key={lecture._id}
                              className="hover:bg-purple-50/20 transition"
                            >
                              {/* Number */}
                              <td className="px-5 py-4 font-bold text-xs text-gray-400">
                                {index + 1}
                              </td>

                              {/* Title */}
                              <td className="px-5 py-4 font-semibold text-gray-900 whitespace-nowrap">
                                {lecture.title}
                              </td>

                              {/* Description */}
                              <td className="px-5 py-4 max-w-xs">
                                <p className="text-xs text-gray-500 line-clamp-2">
                                  {lecture.description}
                                </p>
                              </td>

                              {/* Video URL */}
                              <td className="px-5 py-4 max-w-xs truncate">
                                <a
                                  href={lecture.videoUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-xs text-[#391486] hover:underline inline-flex items-center gap-1 truncate"
                                >
                                  <span className="truncate">{lecture.videoUrl}</span>
                                  <ExternalLink className="w-3 h-3 shrink-0" />
                                </a>
                              </td>

                              {/* Actions */}
                              <td className="px-5 py-4 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setLectureToEdit(lecture);
                                      setIsLectureModalOpen(true);
                                    }}
                                    className="p-1.5 text-gray-500 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition cursor-pointer"
                                    title="Edit Lecture"
                                  >
                                    <Pencil className="w-4 h-4" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDeleteLecture(lecture._id)}
                                    className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition cursor-pointer"
                                    title="Delete Lecture"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </main>
        </div>

        {/* Course Modal */}
        <CourseModal
          isOpen={isCourseModalOpen}
          onClose={() => setIsCourseModalOpen(false)}
          onSuccess={loadCourses}
          courseToEdit={courseToEdit}
        />

        {/* Lecture Modal */}
        {selectedCourse && (
          <LectureModal
            isOpen={isLectureModalOpen}
            courseId={selectedCourse._id}
            onClose={() => setIsLectureModalOpen(false)}
            onSuccess={() => loadLectures(selectedCourse._id)}
            lectureToEdit={lectureToEdit}
          />
        )}
      </div>
    );
  }
