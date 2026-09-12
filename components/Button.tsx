import React from "react";
import Link from "next/link";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  href?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function Button({
  variant = "primary",
  size = "md",
  href,
  icon,
  children,
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-xs font-semibold",
    lg: "px-6 py-3 text-sm font-semibold",
  }[size];

  const variantStyles = {
    primary:
      "bg-[#D4AF6A] text-[#08080C] hover:bg-[#E5C384] font-bold shadow-md shadow-[#D4AF6A]/10 border border-[#D4AF6A]",
    secondary:
      "bg-[#14141E] text-[#ECECEE] border border-white/10 hover:border-[#D4AF6A]/40 hover:bg-[#1C1C2A]",
    outline:
      "bg-transparent hover:bg-[#1C1C21] text-[#ECECEE] border border-white/10 hover:border-white/20",
    ghost: "bg-transparent text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5",
  }[variant];

  const baseStyles = `inline-flex items-center justify-center gap-2 rounded-[2px] transition-all cursor-pointer select-none disabled:opacity-40 disabled:pointer-events-none ${sizeStyles} ${variantStyles} ${className}`;

  if (href) {
    return (
      <Link href={href} className={baseStyles}>
        {icon && <span className="shrink-0">{icon}</span>}
        <span>{children}</span>
      </Link>
    );
  }

  return (
    <button className={baseStyles} disabled={disabled} {...props}>
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
