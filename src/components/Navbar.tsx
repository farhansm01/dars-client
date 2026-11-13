"use client";

import Link from "next/link";
import Image from "next/image";
import { LogIn, LogOut, User } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";

interface NavbarProps {
  onLoginClick?: () => void;
}

export function Navbar({ onLoginClick }: NavbarProps) {
  const { data: session, isPending } = useSession();

  return (
    <nav className="sticky top-0 z-50 w-full bg-white border-b border-purple-100 shadow-xs">
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

        {/* Right: Login / Admin */}
        <div>
          {isPending ? (
            <div className="h-9 w-20 bg-gray-100 rounded-lg animate-pulse" />
          ) : session?.user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-sm text-gray-700">
                <User className="w-4 h-4 text-[#391486]" />
                <span className="font-medium hidden sm:inline">
                  {session.user.name || session.user.email}
                </span>
                <span className="text-xs bg-[#391486]/10 text-[#391486] px-2 py-0.5 rounded-full font-semibold">
                  Admin
                </span>
              </div>

              <button
                type="button"
                onClick={() => signOut()}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={onLoginClick}
              className="flex items-center gap-2 px-4 py-2 bg-[#391486] hover:bg-[#4B1C9E] text-white text-sm font-medium rounded-lg transition shadow-xs"
            >
              <LogIn className="w-4 h-4" />
              <span>Login</span>
            </button>
          )}
        </div>

      </div>
    </nav>
  );
}
