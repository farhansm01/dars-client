"use client";

import { useEffect, useState } from "react";
import { BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import { Course } from "@/types";
import { getCourses } from "@/lib/api";
import { CourseCard } from "./CourseCard";

export function CourseList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    getCourses()
      .then((data) => {
        if (!ignore) {
          setCourses(data);
          setLoading(false);
        }
      })
      .catch((err: unknown) => {
        if (!ignore) {
          const message = err instanceof Error ? err.message : "Failed to load courses";
          setError(message);
          setLoading(false);
        }
      });

    return () => {
      ignore = true;
    };
  }, []);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    getCourses()
      .then(setCourses)
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : "Failed to load courses";
        setError(message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#391486] uppercase tracking-wider mb-2">
            <BookOpen className="w-4 h-4" />
            <span>Course Catalog</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Explore All Courses
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Browse our complete collection of video courses and lectures.
          </p>
        </div>

        {!loading && !error && (
          <span className="text-xs sm:text-sm font-medium text-gray-500 bg-purple-50 px-3 py-1 rounded-full border border-purple-100 self-start sm:self-auto">
            {courses.length} {courses.length === 1 ? "Course" : "Courses"} available
          </span>
        )}
      </div>

      {/* Loading Skeleton State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div
              key={n}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse"
            >
              <div className="aspect-video w-full bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-100 rounded w-full" />
                <div className="h-4 bg-gray-100 rounded w-2/3" />
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="h-4 bg-gray-100 rounded w-1/3" />
                  <div className="h-8 bg-gray-200 rounded-lg w-24" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center max-w-lg mx-auto">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
          <h3 className="text-base font-bold text-red-800">Unable to load courses</h3>
          <p className="text-sm text-red-600 mt-1 mb-4">
            {error}. Make sure the backend server is running on port 5000.
          </p>
          <button
            type="button"
            onClick={handleRetry}
            className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-lg shadow-xs transition cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && courses.length === 0 && (
        <div className="bg-purple-50/50 border border-purple-100 rounded-2xl p-12 text-center max-w-md mx-auto">
          <BookOpen className="w-12 h-12 text-[#391486]/40 mx-auto mb-3" />
          <h3 className="text-base font-bold text-gray-900">No courses available yet</h3>
          <p className="text-sm text-gray-500 mt-1">
            New courses will appear here once created in the admin panel.
          </p>
        </div>
      )}

      {/* Loaded Course Grid */}
      {!loading && !error && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {courses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
}
