"use client";

import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { Course } from "@/types";

interface CourseCardProps {
  course: Course;
}

export function CourseCard({ course }: CourseCardProps) {
  return (
    <div className="group flex flex-col bg-white rounded-2xl border border-purple-100/90 overflow-hidden shadow-xs hover:shadow-md transition duration-200">
      <div className="relative aspect-video w-full overflow-hidden bg-purple-50">
        {course.thumbnail ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={course.thumbnail}
            alt={course.title}
            className="h-full w-full object-cover group-hover:scale-105 transition duration-300"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80";
            }}
          />
        ) : (
          <div className="h-full w-full flex items-center justify-center text-purple-300">
            <BookOpen className="w-12 h-12" />
          </div>
        )}

        <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full shadow-xs text-xs font-bold text-[#391486] ring-1 ring-purple-100">
          {course.price === 0 ? "Free" : `৳ ${course.price}`}
        </div>
      </div>

      <div className="flex flex-col flex-1 p-5">
        <h3 className="text-lg font-bold text-gray-900 group-hover:text-[#391486] transition line-clamp-1">
          {course.title}
        </h3>

        <p className="mt-2 text-sm text-gray-600 line-clamp-2 leading-relaxed flex-1">
          {course.description}
        </p>

        <div className="mt-5 pt-4 border-t border-purple-50 flex items-center justify-between">
          <span className="text-xs font-medium text-gray-500">
            Full Course & Lectures
          </span>

          <Link
            href={`/courses/${course._id}`}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#391486] hover:bg-[#4B1C9E] text-white text-xs font-medium rounded-lg transition active:scale-95"
          >
            <span>View Course</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
