"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function ShortlistButton({
  collegeId,
  initialSaved = false,
  className = "",
  variant = "icon",
}: {
  collegeId: string;
  initialSaved?: boolean;
  className?: string;
  variant?: "icon" | "button";
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  // Sync if saved state is known
  useEffect(() => {
    setSaved(initialSaved);
  }, [initialSaved]);

  const toggleSave = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      // If user isn't logged in, redirect to login or prompt
      router.push("/login?callbackUrl=" + encodeURIComponent(window.location.pathname));
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        const res = await fetch(`/api/saved/colleges/${encodeURIComponent(collegeId)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setSaved(false);
          router.refresh();
        }
      } else {
        const res = await fetch("/api/saved/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeId }),
        });
        if (res.ok) {
          setSaved(true);
          router.refresh();
        }
      }
    } catch (err) {
      console.error("Failed to toggle shortlist:", err);
    } finally {
      setLoading(false);
    }
  };

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={toggleSave}
        disabled={loading}
        aria-label={saved ? "Remove from shortlist" : "Save college"}
        className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-mono font-bold text-xs transition-all cursor-pointer select-none ${
          saved
            ? "bg-[#D4AF6A] text-[#08080C] hover:bg-[#E5C384]"
            : "bg-[#14141E] text-[#ECECEE] border border-white/10 hover:border-white/20 hover:bg-[#1E1E2C]"
        } ${className}`}
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
        )}
        <span>{saved ? "Shortlisted" : "Shortlist"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleSave}
      disabled={loading}
      aria-label={saved ? "Remove from shortlist" : "Save college"}
      className={`p-2 rounded-lg border transition-all cursor-pointer ${
        saved
          ? "bg-[#D4AF6A]/10 border-[#D4AF6A] text-[#D4AF6A]"
          : "bg-[#14141E]/80 border-white/10 text-[#9494A3] hover:text-[#ECECEE] hover:border-white/20"
      } ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Bookmark className={`w-4 h-4 ${saved ? "fill-current text-[#D4AF6A]" : ""}`} />
      )}
    </button>
  );
}
