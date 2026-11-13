"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCourse, getCourseLectures } from "@/lib/api";
import { Course, Lecture } from "@/types";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import {
  ArrowLeft,
  PlayCircle,
  BookOpen,
  Tag,
  ChevronRight,
} from "lucide-react";

function getEmbedUrl(url: string): { type: "youtube" | "video"; src: string } {
  if (!url) return { type: "video", src: "" };

  const shortMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
  if (shortMatch) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${shortMatch[1]}`,
    };
  }

  const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
  if (watchMatch) {
    return {
      type: "youtube",
      src: `https://www.youtube.com/embed/${watchMatch[1]}`,
    };
  }

  if (url.includes("youtube.com/embed/")) {
    return { type: "youtube", src: url };
  }

  return { type: "video", src: url };
}

export default function CoursePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [activeLecture, setActiveLecture] = useState<Lecture | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    Promise.all([getCourse(id), getCourseLectures(id)])
      .then(([courseData, lectureData]) => {
        if (ignore) return;
        setCourse(courseData);
        setLectures(lectureData);
        if (lectureData.length > 0) setActiveLecture(lectureData[0]);
      })
      .catch((err: Error) => {
        if (ignore) return;
        setError(err.message);
      })
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-12 h-12 border-4 border-[#391486] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-gray-500 text-sm">Loading course...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex flex-col bg-white text-gray-900">
        <Navbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-red-500 font-medium">
              {error || "Course not found."}
            </p>
            <button
              onClick={() => router.push("/")}
              className="text-sm text-[#391486] hover:underline flex items-center gap-1 mx-auto"
            >
              <ArrowLeft size={14} /> Back to courses
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const embed = activeLecture ? getEmbedUrl(activeLecture.videoUrl) : null;

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <button
            onClick={() => router.push("/#courses-section")}
            className="inline-flex items-center gap-1.5 text-sm text-[#391486] hover:text-[#4B1C9E] font-medium"
          >
            <ArrowLeft size={15} />
            Back to All Courses
          </button>
        </div>

        <div className="bg-[#391486] text-white mt-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold leading-tight">
                {course.title}
              </h1>
              <p className="mt-2 text-purple-200 text-sm sm:text-base max-w-2xl">
                {course.description}
              </p>
              <div className="mt-4 flex items-center gap-4 flex-wrap">
                <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-sm font-medium">
                  <Tag size={13} />
                  {course.price === 0 ? "Free" : `৳ ${course.price}`}
                </span>
                <span className="inline-flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1 text-sm font-medium">
                  <BookOpen size={13} />
                  {lectures.length} {lectures.length === 1 ? "Lecture" : "Lectures"}
                </span>
              </div>
            </div>
            {course.thumbnail && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full sm:w-48 h-28 object-cover rounded-lg shadow-lg flex-shrink-0"
              />
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {lectures.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
              <p className="font-medium text-gray-500">No lectures yet</p>
              <p className="text-sm mt-1">Check back soon for new content.</p>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1 min-w-0">
                <div className="bg-black rounded-xl overflow-hidden aspect-video w-full shadow-lg">
                  {embed?.type === "youtube" ? (
                    <iframe
                      key={embed.src}
                      src={embed.src}
                      title={activeLecture?.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  ) : embed?.src ? (
                    <video
                      key={embed.src}
                      src={embed.src}
                      controls
                      className="w-full h-full"
                    />
                  ) : null}
                </div>

                {activeLecture && (
                  <div className="mt-4">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeLecture.title}
                    </h2>
                    {activeLecture.description && (
                      <p className="mt-1 text-sm text-gray-500">
                        {activeLecture.description}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full lg:w-80 xl:w-96 flex-shrink-0">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Course Content
                </h3>
                <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100">
                  {lectures.map((lecture, index) => {
                    const isActive = activeLecture?._id === lecture._id;
                    return (
                      <button
                        key={lecture._id}
                        onClick={() => setActiveLecture(lecture)}
                        className={`w-full text-left px-4 py-3.5 flex items-start gap-3 transition-colors ${
                          isActive
                            ? "bg-[#391486] text-white"
                            : "bg-white text-gray-700 hover:bg-purple-50"
                        }`}
                      >
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-purple-100 text-[#391486]"
                          }`}
                        >
                          {isActive ? (
                            <PlayCircle size={14} />
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium leading-snug truncate ${
                              isActive ? "text-white" : "text-gray-800"
                            }`}
                          >
                            {lecture.title}
                          </p>
                          {lecture.description && (
                            <p
                              className={`text-xs mt-0.5 truncate ${
                                isActive ? "text-purple-200" : "text-gray-400"
                              }`}
                            >
                              {lecture.description}
                            </p>
                          )}
                        </div>
                        {!isActive && (
                          <ChevronRight
                            size={14}
                            className="flex-shrink-0 text-gray-300 mt-0.5"
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
