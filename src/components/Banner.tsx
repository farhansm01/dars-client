"use client";

import Image from "next/image";
import { ArrowRight, BookOpen, PlayCircle } from "lucide-react";

export function Banner() {
  const scrollToCourses = () => {
    const section = document.getElementById("courses-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      {/* Hero Banner Card with your Artwork Image */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl shadow-xs border border-purple-100 bg-[#391486] min-h-[340px] sm:min-h-[400px] flex items-center">
        
        {/* Background Banner Image */}
        <Image
          src="/banner.png"
          alt="Online Learning Banner"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Gradient Overlay for crystal clear readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#20084d]/95 via-[#391486]/80 to-transparent sm:to-black/20" />

        {/* Banner Content */}
        <div className="relative z-10 max-w-xl p-6 sm:p-12 text-white">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs sm:text-sm font-medium mb-4 ring-1 ring-white/20">
            <BookOpen className="w-4 h-4 text-purple-200" />
            <span>Open Learning Platform</span>
          </div>

          {/* Heading */}
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
            Learn at Your Own Pace with <span className="text-purple-200">Dars</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-3 sm:mt-4 text-sm sm:text-base text-purple-100/90 leading-relaxed max-w-lg">
            Watch step-by-step video lectures, explore diverse topics, and master new skills whenever you're ready.
          </p>

          {/* Action Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={scrollToCourses}
              className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-white text-[#391486] hover:bg-purple-50 font-semibold text-xs sm:text-sm rounded-xl shadow-xs transition active:scale-95 cursor-pointer"
            >
              <PlayCircle className="w-4 h-4 text-[#391486]" />
              <span>Browse Courses</span>
              <ArrowRight className="w-4 h-4 text-[#391486]" />
            </button>
          </div>

        </div>

      </div>

      {/* 3 Quick Highlights Section */}
      <div className="grid grid-cols-3 gap-3 sm:gap-6 mt-6 max-w-4xl mx-auto text-center">
        <div className="bg-white border border-purple-100/80 rounded-xl py-3.5 px-3 sm:py-5 sm:px-4 shadow-xs">
          <p className="text-xl sm:text-3xl font-extrabold text-[#391486]">100%</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Free Access</p>
        </div>
        <div className="bg-white border border-purple-100/80 rounded-xl py-3.5 px-3 sm:py-5 sm:px-4 shadow-xs">
          <p className="text-xl sm:text-3xl font-extrabold text-[#391486]">Video</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Rich Lectures</p>
        </div>
        <div className="bg-white border border-purple-100/80 rounded-xl py-3.5 px-3 sm:py-5 sm:px-4 shadow-xs">
          <p className="text-xl sm:text-3xl font-extrabold text-[#391486]">Simple</p>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 font-medium">Direct Learning</p>
        </div>
      </div>
    </section>
  );
}
