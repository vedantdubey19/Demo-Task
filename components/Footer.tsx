import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-white/7 bg-[#101013] py-12 text-xs text-[#8C8C94]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-serif text-lg text-[#ECECEE]">
                Uni<span className="italic text-[#D4AF6A]">Pulse</span>
              </span>
              <span className="font-mono text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 px-1.5 py-0.5 rounded-[2px]">
                v1.0 MVP
              </span>
            </div>
            <p className="font-serif italic text-xs text-[#8C8C94] max-w-md">
              Higher education decision intelligence, verified NIRF placement
              telemetry, and side-by-side college benchmarking.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-6 font-mono text-xs">
            <Link href="/" className="hover:text-[#D4AF6A] transition-colors">
              Directory
            </Link>
            <Link
              href="/compare"
              className="hover:text-[#D4AF6A] transition-colors"
            >
              Compare Matrix
            </Link>
            <Link
              href="/saved"
              className="hover:text-[#D4AF6A] transition-colors"
            >
              Shortlist
            </Link>
            <Link
              href="/sitemap.xml"
              className="hover:text-[#D4AF6A] transition-colors"
            >
              Sitemap
            </Link>
          </div>
        </div>

        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[#5C5C64]">
          <div className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8C8C94]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF6A]" />
            <span>Decision Intelligence Architecture</span>
          </div>
          <div>
            Data sourced from official NIRF institutional submissions & verified
            reports.
          </div>
        </div>
      </div>
    </footer>
  );
}
