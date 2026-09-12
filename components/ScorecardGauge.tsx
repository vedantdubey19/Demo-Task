"use client";

import React, { useState, useEffect } from "react";
import { TrendingUp, ShieldCheck, Award } from "lucide-react";
import { SectionBadge } from "./Badge";

export function ScorecardGauge({
  score = 92,
  placementScore = 95,
  feeValueScore = 88,
  pedigreeScore = 94,
  collegeName,
  className = "",
}: {
  score?: number;
  placementScore?: number;
  feeValueScore?: number;
  pedigreeScore?: number;
  collegeName?: string;
  className?: string;
}) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  const tier =
    score >= 90
      ? "Apex Tier-1"
      : score >= 80
      ? "Premier Tier-2"
      : "Accredited";

  return (
    <div
      className={`rounded-2xl glass-panel border border-white/10 p-6 space-y-6 shadow-2xl relative overflow-hidden ${className}`}
    >
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#D4AF6A]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <SectionBadge dotColor="gold">
          {collegeName ? `${collegeName} Scorecard` : "Decision Matrix Index"}
        </SectionBadge>
        <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full uppercase tracking-wider font-bold">
          NIRF Audited
        </span>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-6">
        {/* Radial gauge */}
        <div className="relative w-32 h-32 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-[#1C1C2A]"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r={radius}
              className="stroke-[#D4AF6A] transition-all duration-1000 ease-out"
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              style={{
                filter: "drop-shadow(0 0 6px rgba(212, 175, 106, 0.4))",
              }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="font-mono text-3xl font-extrabold text-[#F1F1F5] tracking-tight">
              {animatedScore}
            </span>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#9494A3]">
              / 100
            </span>
            <span className="font-mono text-[9px] font-bold text-[#D4AF6A] mt-0.5">
              {tier}
            </span>
          </div>
        </div>

        {/* Breakdown bars */}
        <div className="flex-1 w-full space-y-3.5 font-mono text-xs">
          <div className="space-y-1 group">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#9494A3] flex items-center gap-1.5">
                <TrendingUp className="w-3 h-3 text-[#D4AF6A]" />
                <span>Placement Package & ROI</span>
              </span>
              <span className="text-[#D4AF6A] font-bold">
                {placementScore}%
              </span>
            </div>
            <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#D4AF6A] to-[#F59E0B] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedScore ? placementScore : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 group">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#9494A3] flex items-center gap-1.5">
                <ShieldCheck className="w-3 h-3 text-[#38BDF8]" />
                <span>Tuition ROI & Affordability</span>
              </span>
              <span className="text-[#38BDF8] font-bold">{feeValueScore}%</span>
            </div>
            <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedScore ? feeValueScore : 0}%` }}
              />
            </div>
          </div>

          <div className="space-y-1 group">
            <div className="flex justify-between text-[11px]">
              <span className="text-[#9494A3] flex items-center gap-1.5">
                <Award className="w-3 h-3 text-[#10B981]" />
                <span>Faculty & Research Pedigree</span>
              </span>
              <span className="text-[#10B981] font-bold">{pedigreeScore}%</span>
            </div>
            <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden p-0.5">
              <div
                className="h-full bg-gradient-to-r from-[#10B981] to-[#34D399] rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${animatedScore ? pedigreeScore : 0}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
