"use client";

import { useState } from "react";
import { X, Loader2, AlertCircle, Image as ImageIcon } from "lucide-react";
import { Course } from "@/types";
import { createCourse, updateCourse } from "@/lib/api";

interface CourseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  courseToEdit?: Course | null;
}

function CourseForm({
  courseToEdit,
  onClose,
  onSuccess,
}: {
  courseToEdit?: Course | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(courseToEdit?.title ?? "");
  const [description, setDescription] = useState(courseToEdit?.description ?? "");
  const [price, setPrice] = useState(courseToEdit?.price?.toString() ?? "");
  const [thumbnail, setThumbnail] = useState(courseToEdit?.thumbnail ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const numPrice = parseFloat(price);
    if (isNaN(numPrice) || numPrice < 0) {
      setError("Please enter a valid price (0 or more)");
      return;
    }
    if (!thumbnail.startsWith("http://") && !thumbnail.startsWith("https://")) {
      setError("Thumbnail must be a valid URL starting with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        price: numPrice,
        thumbnail: thumbnail.trim(),
      };
      if (courseToEdit) {
        await updateCourse(courseToEdit._id, payload);
      } else {
        await createCourse(payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-4">
      {error && (
        <div className="flex items-start gap-2 p-3 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Course Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Full-Stack Web Development with React"
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">Description *</label>
        <textarea
          required
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Detailed course description covering topics and outcomes..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Price (USD) *</label>
          <input
            type="number"
            step="0.01"
            min="0"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="49.99"
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Thumbnail URL *</label>
          <input
            type="url"
            required
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            placeholder="https://images.unsplash.com/..."
            className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
          />
        </div>
      </div>

      {thumbnail && (
        <div className="p-2 border border-purple-100 rounded-lg bg-purple-50/30 flex items-center gap-3">
          <div className="w-16 h-10 rounded overflow-hidden bg-gray-100 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={thumbnail}
              alt="Preview"
              className="w-full h-full object-cover"
              onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
            />
          </div>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5 text-[#391486]" />
            Image preview
          </span>
        </div>
      )}

      <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
        <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-lg transition">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 px-5 py-2 bg-[#391486] hover:bg-[#4B1C9E] text-white text-sm font-semibold rounded-lg shadow-xs transition disabled:opacity-60 cursor-pointer"
        >
          {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          <span>{courseToEdit ? "Save Changes" : "Create Course"}</span>
        </button>
      </div>
    </form>
  );
}

export function CourseModal({ isOpen, onClose, onSuccess, courseToEdit }: CourseModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-purple-100 bg-purple-50/50">
          <h3 className="text-base sm:text-lg font-bold text-gray-900">
            {courseToEdit ? "Edit Course" : "Add New Course"}
          </h3>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        {/* key resets all form state when switching between edit targets */}
        <CourseForm key={courseToEdit?._id ?? "new"} courseToEdit={courseToEdit} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
