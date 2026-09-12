"use client";

import React from "react";
import Link from "next/link";
import { Scale, X, Trash2, ArrowRight } from "lucide-react";

export function CompareDock({
  selectedSlugs,
  collegeNamesMap,
  onRemoveSlug,
  onClearAll,
}: {
  selectedSlugs: string[];
  collegeNamesMap: Record<string, string>;
  onRemoveSlug: (slug: string) => void;
  onClearAll: () => void;
}) {
  if (selectedSlugs.length === 0) return null;

  const compareUrl = `/compare?ids=${selectedSlugs.join(",")}`;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-4xl px-4 animate-slide-up">
      <div className="glass-dock rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#D4AF6A]/30">
        <div className="flex items-center gap-3 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <div className="flex items-center gap-2 bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 px-3 py-1.5 rounded-lg shrink-0">
            <Scale className="w-4 h-4 text-[#D4AF6A] animate-pulse" />
            <span className="font-mono text-xs text-[#D4AF6A] font-bold">
              {selectedSlugs.length} / 3 Selected
            </span>
          </div>

          <div className="flex items-center gap-2">
            {selectedSlugs.map((slug) => {
              const name = collegeNamesMap[slug] || slug.replace(/-/g, " ");
              return (
                <div
                  key={slug}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1B1B28] border border-white/10 text-xs font-mono text-[#ECECEE] shadow-sm hover:border-[#D4AF6A]/30 transition-all shrink-0 max-w-[200px]"
                >
                  <span className="truncate">{name}</span>
                  <button
                    type="button"
                    onClick={() => onRemoveSlug(slug)}
                    className="p-0.5 text-[#8C8C94] hover:text-red-400 hover:bg-white/5 rounded transition-colors"
                    title={`Remove ${name}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
          <button
            type="button"
            onClick={onClearAll}
            className="flex items-center gap-1 px-2.5 py-2 rounded-lg text-[#8C8C94] hover:text-[#ECECEE] hover:bg-white/5 text-xs font-mono transition-colors"
            title="Clear all selected"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Clear</span>
          </button>

          {selectedSlugs.length >= 2 ? (
            <Link
              href={compareUrl}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-[#D4AF6A] to-[#F59E0B] text-[#08080C] font-mono text-xs font-bold shadow-lg shadow-[#D4AF6A]/20 hover:shadow-[#D4AF6A]/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <span>Launch Matrix</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </Link>
          ) : (
            <span className="font-mono text-xs text-[#8C8C94] bg-[#16161F] px-3 py-2 rounded-lg border border-white/5">
              Select 1 more to compare
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
