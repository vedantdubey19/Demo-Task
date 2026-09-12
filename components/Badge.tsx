import React from "react";

export interface BadgeProps {
  children: React.ReactNode;
  variant?: "gold" | "ice" | "success" | "surface" | "muted";
  className?: string;
}

export function Badge({
  children,
  variant = "surface",
  className = "",
}: BadgeProps) {
  const variantStyles = {
    gold: "bg-[#D4AF6A]/10 text-[#D4AF6A] border-[#D4AF6A]/30",
    ice: "bg-[#7FB2D9]/10 text-[#7FB2D9] border-[#7FB2D9]/30",
    success: "bg-[#6FCF8E]/10 text-[#6FCF8E] border-[#6FCF8E]/30",
    surface: "bg-[#1C1C21] text-[#ECECEE] border-white/10",
    muted: "bg-[#16161A] text-[#8C8C94] border-white/5",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[2px] border font-mono text-[10px] uppercase tracking-wider font-semibold ${variantStyles} ${className}`}
    >
      {children}
    </span>
  );
}

export function SectionBadge({
  children,
  className = "",
  dotColor,
}: {
  children: React.ReactNode;
  className?: string;
  dotColor?: "gold" | "ice" | "success";
}) {
  const dotStyles =
    dotColor === "success"
      ? "bg-[#6FCF8E]"
      : dotColor === "ice"
      ? "bg-[#7FB2D9]"
      : "bg-[#D4AF6A]";

  return (
    <div
      className={`inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.12em] text-[#8C8C94] ${className}`}
    >
      {dotColor && <span className={`w-1.5 h-1.5 rounded-full ${dotStyles}`} />}
      <span>{children}</span>
    </div>
  );
}
