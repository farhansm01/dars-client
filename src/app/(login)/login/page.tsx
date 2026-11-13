"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { LoginForm } from "@/components/LoginForm";

export default function LoginPage() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session?.user) {
      router.replace("/admin");
    }
  }, [session, router]);

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-4 py-12">
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#391486] transition font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to public website</span>
        </Link>
      </div>

      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.png"
            alt="Dars Logo"
            className="h-10 mx-auto object-contain"
          />
        </Link>
      </div>

      <LoginForm onSuccess={() => router.push("/admin")} />
    </div>
  );
}
