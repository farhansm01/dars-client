"use client";

import Link from "next/link";
import { BookOpen, Video, ExternalLink, LogOut, Shield } from "lucide-react";
import { signOut, useSession } from "@/lib/auth-client";

interface AdminSidebarProps {
  currentView: "courses" | "lectures";
  onSelectCourses: () => void;
  onSelectLectures: () => void;
}

export function AdminSidebar({
  currentView,
  onSelectCourses,
  onSelectLectures,
}: AdminSidebarProps) {
  const { data: session } = useSession();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shrink-0 min-h-screen">
      <div className="p-5 border-b border-gray-100">
        <Link
          href="/"
          className="flex items-center justify-between group"
          title="Return to Homepage"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Dars Logo"
            className="h-8 object-contain"
          />
          <span className="text-[11px] font-semibold tracking-wide uppercase px-2 py-0.5 bg-purple-50 text-[#391486] rounded-md border border-purple-100 group-hover:bg-[#391486] group-hover:text-white transition">
            Admin
          </span>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Management
        </div>

        <button
          type="button"
          onClick={onSelectCourses}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            currentView === "courses"
              ? "bg-[#391486] text-white shadow-xs"
              : "text-gray-600 hover:bg-purple-50 hover:text-[#391486]"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Courses</span>
        </button>

        <button
          type="button"
          onClick={onSelectLectures}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition cursor-pointer ${
            currentView === "lectures"
              ? "bg-[#391486] text-white shadow-xs"
              : "text-gray-600 hover:bg-purple-50 hover:text-[#391486]"
          }`}
        >
          <Video className="w-4 h-4" />
          <span>Lectures</span>
        </button>

        <div className="pt-4 px-3 py-2 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
          Quick Links
        </div>

        <Link
          href="/"
          className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-purple-50 hover:text-[#391486] transition"
        >
          <span className="flex items-center gap-3">
            <ExternalLink className="w-4 h-4" />
            <span>Public Website</span>
          </span>
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-100 bg-gray-50/50">
        {session?.user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-purple-100 text-[#391486] flex items-center justify-center font-bold text-xs shrink-0">
                <Shield className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-gray-900 truncate">
                  {session.user.name || "Admin"}
                </p>
                <p className="text-[11px] text-gray-500 truncate">
                  {session.user.email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </div>
        ) : null}
      </div>
    </aside>
  );
}
