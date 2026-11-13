import Image from "next/image";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-purple-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Image
            src="/logo.png"
            alt="Dars"
            width={100}
            height={32}
            className="h-7 w-auto object-contain"
          />
          <span className="hidden sm:inline text-gray-300">|</span>
          <p className="text-xs sm:text-sm text-gray-500">
            Structured video courses and lectures for curious learners.
          </p>
        </div>

        <div className="text-xs sm:text-sm text-gray-500">
          © {currentYear} Dars. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
