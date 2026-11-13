"use client";

import { useState } from "react";
import { X, Loader2, AlertCircle, Video } from "lucide-react";
import { Lecture } from "@/types";
import { createLecture, updateLecture } from "@/lib/api";

interface LectureModalProps {
  isOpen: boolean;
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
  lectureToEdit?: Lecture | null;
}

function LectureForm({
  courseId,
  lectureToEdit,
  onClose,
  onSuccess,
}: {
  courseId: string;
  lectureToEdit?: Lecture | null;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [title, setTitle] = useState(lectureToEdit?.title ?? "");
  const [description, setDescription] = useState(lectureToEdit?.description ?? "");
  const [videoUrl, setVideoUrl] = useState(lectureToEdit?.videoUrl ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!videoUrl.startsWith("http://") && !videoUrl.startsWith("https://")) {
      setError("Video URL must start with http:// or https://");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        videoUrl: videoUrl.trim(),
      };
      if (lectureToEdit) {
        await updateLecture(lectureToEdit._id, payload);
      } else {
        await createLecture(courseId, payload);
      }
      onSuccess();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to save lecture");
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
        <label className="block text-xs font-semibold text-gray-700 mb-1">Lecture Title *</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Course Introduction & Setup"
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
          placeholder="Lecture overview and topics..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
        />
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1">
          Video URL *
        </label>
        <input
          type="url"
          required
          value={videoUrl}
          onChange={(e) => setVideoUrl(e.target.value)}
          placeholder="https://www.youtube.com/watch?v=..."
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-[#391486] focus:ring-1 focus:ring-[#391486]"
        />
      </div>

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
          <span>{lectureToEdit ? "Save Changes" : "Add Lecture"}</span>
        </button>
      </div>
    </form>
  );
}

export function LectureModal({ isOpen, courseId, onClose, onSuccess, lectureToEdit }: LectureModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-xl border border-purple-100 overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-purple-100 bg-purple-50/50">
          <div className="flex items-center gap-2">
            <Video className="w-5 h-5 text-[#391486]" />
            <h3 className="text-base sm:text-lg font-bold text-gray-900">
              {lectureToEdit ? "Edit Lecture" : "Add New Lecture"}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition">
            <X className="w-5 h-5" />
          </button>
        </div>
        <LectureForm key={lectureToEdit?._id ?? "new"} courseId={courseId} lectureToEdit={lectureToEdit} onClose={onClose} onSuccess={onSuccess} />
      </div>
    </div>
  );
}
