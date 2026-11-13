"use client";

import { Navbar } from "@/components/Navbar";
import { Banner } from "@/components/Banner";
import { CourseList } from "@/components/CourseList";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar onLoginClick={() => console.log("Login clicked")} />

      <main className="flex-1 flex flex-col">
        {/* Hero Banner */}
        <Banner />

        {/* Student Course Listing Section */}
        <section id="courses-section" className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 flex-1">
          <CourseList />
        </section>
      </main>

      <Footer />
    </div>
  );
}
