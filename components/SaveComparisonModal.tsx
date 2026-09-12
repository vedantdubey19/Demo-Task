"use client";

import React, { useState } from "react";
import { Sparkles, X, Check, Loader2 } from "lucide-react";
import confetti from "canvas-confetti";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export function SaveComparisonModal({
  collegeSlugs,
  isOpen,
  onClose,
}: {
  collegeSlugs: string[];
  isOpen: boolean;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [label, setLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname + window.location.search)}`);
      return;
    }

    if (!label.trim()) {
      setError("Please provide a matrix label.");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const res = await fetch("/api/saved/comparisons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          collegeIds: collegeSlugs,
          label: label.trim(),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save comparison");
      }

      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
        colors: ["#D4AF6A", "#38BDF8", "#10B981"],
      });

      setIsSaved(true);
      setTimeout(() => {
        setIsSaved(false);
        setLabel("");
        onClose();
        router.refresh();
      }, 1400);
    } catch (err: any) {
      setError(err.message || "Failed to save comparison set");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#12121A] border border-white/10 rounded-2xl p-6 sm:p-7 space-y-5 shadow-2xl">
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
            <span>Persist Decision Benchmarks</span>
          </div>
          <h2 className="font-serif text-xl text-[#ECECEE] tracking-tight">
            Save Comparison Matrix
          </h2>
          <p className="font-serif italic text-xs text-[#8C8C94]">
            Save this side-by-side benchmarking matrix to your personal candidate dossier for rapid reference.
          </p>
        </div>

        {isSaved ? (
          <div className="py-8 text-center space-y-2">
            <div className="w-10 h-10 rounded-full bg-[#10B981]/10 border border-[#10B981]/30 flex items-center justify-center text-[#10B981] mx-auto">
              <Check className="w-5 h-5 stroke-[3]" />
            </div>
            <h3 className="font-serif text-base text-[#ECECEE]">Matrix Saved to Dashboard</h3>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs">
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block font-mono text-[10px] uppercase tracking-wider text-[#8C8C94]">
                Matrix Name / Title
              </label>
              <input
                type="text"
                required
                autoFocus
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="e.g. Top CS Engineering Contenders 2026"
                className="w-full bg-[#1A1A26] border border-white/10 rounded-lg px-3.5 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A] transition-colors"
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
                disabled={isSaving}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Matrix</span>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
