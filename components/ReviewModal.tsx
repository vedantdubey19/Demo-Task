"use client";

import React, { useState } from "react";
import { Star, Sparkles, X, CheckCircle, Loader2 } from "lucide-react";
import { Review } from "@/lib/types";

export function ReviewModal({
  collegeSlug,
  collegeName,
  isOpen,
  onClose,
  onReviewAdded,
}: {
  collegeSlug: string;
  collegeName: string;
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (review: Review) => void;
}) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) {
      setError("Please complete all required fields.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/colleges/${encodeURIComponent(collegeSlug)}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rating,
          title: title.trim(),
          body: body.trim(),
          authorName: "Verified Candidate",
          authorRole: "Class of 2025",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to submit review");
      }

      const data = await res.json();
      setIsSuccess(true);
      onReviewAdded(data.review);
      setTimeout(() => {
        setIsSuccess(false);
        setTitle("");
        setBody("");
        setRating(5);
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-[#8C8C94] hover:text-[#ECECEE] hover:bg-white/5 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="space-y-1">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[#D4AF6A] uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            <span>Verified Student Voice</span>
          </div>
          <h2 className="font-serif text-2xl text-[#ECECEE] tracking-tight">
            Review <span className="italic text-[#D4AF6A]">{collegeName}</span>
          </h2>
          <p className="font-serif italic text-xs text-[#8C8C94]">
            Share your authentic campus experience, academic rigor, and placement insights.
          </p>
        </div>

        {isSuccess ? (
          <div className="py-12 text-center space-y-3">
            <CheckCircle className="w-12 h-12 text-[#10B981] mx-auto animate-bounce" />
            <h3 className="font-serif text-lg text-[#ECECEE]">Review Published!</h3>
            <p className="font-mono text-xs text-[#8C8C94]">
              Thank you for contributing to open institutional transparency.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8C8C94]">
                Overall Institutional Rating
              </label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHoverRating(val)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-2xl transition-transform hover:scale-125 focus:outline-none"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || rating) >= val
                          ? "fill-[#D4AF6A] text-[#D4AF6A]"
                          : "text-[#3E3E50]"
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 font-mono text-xs font-bold text-[#D4AF6A]">
                  {(hoverRating || rating)}.0 / 5.0
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8C8C94]">
                Review Headline / Core Takeaway
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. World-class research ecosystem with incredible placement upside"
                className="w-full bg-[#1A1A26] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A] transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8C8C94]">
                Detailed Review
              </label>
              <textarea
                required
                rows={4}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Detail academics, hostel life, labs, faculty guidance, and placement support..."
                className="w-full bg-[#1A1A26] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A] transition-colors resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg text-xs font-mono text-[#8C8C94] hover:text-[#ECECEE] hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <span>Publish Review</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
