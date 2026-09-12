"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import {
  Sparkles,
  Building2,
  Scale,
  Bookmark,
  LogOut,
  Zap,
  Loader2,
} from "lucide-react";
import { Badge } from "./Badge";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const navLinks = [
    { href: "/", label: "Directory", icon: Building2 },
    { href: "/compare", label: "Compare Matrix", icon: Scale },
    { href: "/saved", label: "Shortlist", icon: Bookmark },
  ];

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "demo@unipulse.edu",
        password: "Password123!",
      });
      if (!res?.error) {
        router.push("/saved");
        router.refresh();
      }
    } catch (err) {
      console.error("Quick demo login error:", err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080C]/85 backdrop-blur-xl border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#1C1C2A] to-[#12121A] border border-[#D4AF6A]/40 flex items-center justify-center text-[#D4AF6A] group-hover:border-[#D4AF6A] group-hover:shadow-[0_0_15px_rgba(212,175,106,0.3)] transition-all">
              <Sparkles className="w-4 h-4 text-[#D4AF6A]" />
            </div>
            <div>
              <span className="font-serif text-lg text-[#ECECEE] tracking-tight group-hover:text-[#D4AF6A] transition-colors">
                Uni<span className="italic text-[#D4AF6A]">Pulse</span>
              </span>
            </div>
          </Link>
          <Badge
            variant="gold"
            className="hidden sm:inline-flex text-[9px] uppercase tracking-widest font-mono"
          >
            DECISION INTELLIGENCE
          </Badge>
        </div>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1 font-mono text-xs bg-[#12121A]/60 p-1 rounded-xl border border-white/5">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg transition-all ${
                  isActive
                    ? "bg-[#1E1E2C] text-[#D4AF6A] border border-white/10 font-bold shadow-sm shadow-[#D4AF6A]/5"
                    : "text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5"
                }`}
              >
                <Icon
                  className={`w-3.5 h-3.5 ${
                    isActive ? "text-[#D4AF6A]" : "text-[#9494A3]"
                  }`}
                />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right side auth */}
        <div className="flex items-center gap-2.5">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-lg bg-[#14141E] animate-pulse" />
          ) : session ? (
            <div className="flex items-center gap-3 bg-[#14141E] border border-white/10 pl-3 pr-2 py-1 rounded-xl">
              <div className="hidden sm:flex flex-col text-right">
                <span className="font-serif text-xs text-[#ECECEE] leading-tight font-medium">
                  {session.user?.name || "Candidate"}
                </span>
                <span className="font-mono text-[10px] text-[#D4AF6A] truncate max-w-[130px]">
                  {session.user?.email === "demo@unipulse.edu"
                    ? "⚡ Demo Account"
                    : session.user?.email}
                </span>
              </div>
              <div className="w-7 h-7 rounded-lg bg-[#1E1E2C] border border-[#D4AF6A]/40 flex items-center justify-center text-[#D4AF6A] font-mono text-xs font-bold">
                {session.user?.name ? session.user.name[0].toUpperCase() : "U"}
              </div>
              <button
                type="button"
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-1.5 rounded-lg text-[#9494A3] hover:text-red-400 hover:bg-white/5 transition-all"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isDemoLoading}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 text-[#D4AF6A] hover:bg-[#D4AF6A]/20 font-mono text-xs font-bold transition-all cursor-pointer"
                title="Log in immediately as demo user"
              >
                {isDemoLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Zap className="w-3.5 h-3.5 fill-current" />
                )}
                <span>1-Click Demo</span>
              </button>
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg text-xs font-mono font-semibold text-[#ECECEE] hover:bg-white/5 border border-white/10 transition-all"
              >
                Log In
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
