"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User, LayoutDashboard } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

export function Navbar() {
  const { data: session, isPending } = useSession();

  return (
    <>
      <nav className="sticky top-0 z-40 w-full bg-white border-b border-purple-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/logo.png"
              alt="Dars"
              width={120}
              height={40}
              className="h-9 w-auto object-contain"
              priority
            />
          </Link>

          {/* Right: Login / Admin Actions */}
          <div>
            {isPending ? (
              <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
            ) : session?.user ? (
              <div className="flex items-center gap-3">
                {/* Admin Dashboard Link */}
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-semibold text-[#391486] bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin Dashboard</span>
                </Link>

                {/* User info */}
                <div className="hidden md:flex items-center gap-1.5 text-xs text-gray-700">
                  <User className="w-3.5 h-3.5 text-[#391486]" />
                  <span className="font-medium max-w-[120px] truncate">
                    {session.user.name || session.user.email}
                  </span>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={() => signOut()}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-2 px-4 py-2 bg-[#391486] hover:bg-[#4B1C9E] text-white text-xs sm:text-sm font-medium rounded-lg transition shadow-xs cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Admin Login</span>
              </Link>
            )}
          </div>

        </div>
      </nav>
    </>
  );
}
