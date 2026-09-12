"use client";

import React from "react";
import Link from "next/link";
import {
  Award,
  MapPin,
  IndianRupee,
  TrendingUp,
  Check,
  ArrowRight,
} from "lucide-react";
import { College } from "@/lib/types";
import { Badge } from "./Badge";
import { RatingStars } from "./RatingStars";
import { ShortlistButton } from "./ShortlistButton";

export function CollegeCard({
  college,
  isCompared = false,
  onToggleCompare,
  showCompareToggle = true,
}: {
  college: College;
  isCompared?: boolean;
  onToggleCompare?: (slug: string) => void;
  showCompareToggle?: boolean;
}) {
  const placement =
    college.placements && college.placements.length > 0
      ? college.placements[0]
      : null;

  const formatFee = (val: number) =>
    val >= 100000
      ? `₹${(val / 100000).toFixed(1)}L`
      : `₹${val.toLocaleString("en-IN")}`;

  const typeVariant =
    college.type === "Govt"
      ? "gold"
      : college.type === "Deemed"
      ? "ice"
      : "surface";

  return (
    <div className="group relative flex flex-col justify-between bg-[#12121A] rounded-2xl border border-white/10 overflow-hidden college-card-hover shadow-lg shadow-black/40">
      {/* Header bar */}
      <div className="p-4 border-b border-white/5 bg-[#161622]/60 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge
            variant={typeVariant}
            className="text-[10px] uppercase font-mono tracking-wider"
          >
            {college.type === "Govt" ? "Govt Autonomous" : college.type}
          </Badge>
          <span className="font-mono text-[10px] text-[#9494A3]">
            Estd. {college.establishedYear}
          </span>
        </div>
        <ShortlistButton collegeId={college.id} />
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <RatingStars rating={college.rating} size="sm" showScore={true} />
            <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
              <Award className="w-2.5 h-2.5" />
              <span>NIRF Verified</span>
            </span>
          </div>

          <Link
            href={`/colleges/${college.slug}`}
            className="block group-hover:text-[#D4AF6A] transition-colors"
          >
            <h3 className="font-serif font-normal text-lg text-[#ECECEE] leading-snug line-clamp-2">
              {college.name}
            </h3>
          </Link>

          <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9494A3]">
            <MapPin className="w-3 h-3 text-[#D4AF6A] shrink-0" />
            <span className="truncate">
              {college.city}, {college.state}
            </span>
          </div>
        </div>

        {/* Telemetry boxes */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-white/5 font-mono text-xs">
          <div className="p-2.5 rounded-xl bg-[#181824] border border-white/5 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-[#9494A3] flex items-center gap-1">
              <IndianRupee className="w-2.5 h-2.5 text-[#D4AF6A]" />
              <span>Tuition Range</span>
            </div>
            <div className="font-bold text-[#ECECEE] text-xs truncate">
              {formatFee(college.feesMin)} – {formatFee(college.feesMax)}
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-[#181824] border border-white/5 space-y-1">
            <div className="text-[9px] uppercase tracking-wider text-[#9494A3] flex items-center gap-1">
              <TrendingUp className="w-2.5 h-2.5 text-[#38BDF8]" />
              <span>Avg Package</span>
            </div>
            <div className="font-bold text-[#D4AF6A] text-xs">
              {placement ? `₹${placement.avgPackage} LPA` : "₹12.5 LPA"}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="pt-2 flex items-center justify-between gap-3 border-t border-white/5">
          {showCompareToggle && onToggleCompare && (
            <button
              type="button"
              onClick={() => onToggleCompare(college.slug)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-[11px] uppercase tracking-wider border transition-all cursor-pointer select-none ${
                isCompared
                  ? "bg-[#D4AF6A] text-[#08080C] border-[#D4AF6A] font-bold shadow-sm shadow-[#D4AF6A]/30"
                  : "bg-transparent text-[#9494A3] border-white/10 hover:border-white/20 hover:text-[#ECECEE] hover:bg-white/5"
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded flex items-center justify-center border transition-all ${
                  isCompared
                    ? "bg-[#08080C] border-[#08080C] text-[#D4AF6A]"
                    : "border-[#616172]"
                }`}
              >
                {isCompared && <Check className="w-2.5 h-2.5 stroke-[4]" />}
              </div>
              <span>{isCompared ? "Selected" : "Compare"}</span>
            </button>
          )}

          <Link
            href={`/colleges/${college.slug}`}
            className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-wider text-[#9494A3] hover:text-[#D4AF6A] ml-auto transition-colors group/link font-semibold"
          >
            <span>Dossier</span>
            <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
