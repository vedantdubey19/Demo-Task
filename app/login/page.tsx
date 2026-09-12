"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Sparkles, Zap, Lock, Mail, Loader2, ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/Badge";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || searchParams.get("redirect") || "/saved";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (res?.error) {
        setError("Invalid email or password credentials.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setDemoLoading(true);
    setError(null);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "demo@unipulse.edu",
        password: "Password123!",
      });

      if (res?.error) {
        setError("Demo login failed.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Failed to login with demo account.");
    } finally {
      setDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4 py-16 aurora-glow">
      <div className="w-full max-w-md bg-[#12121A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1 text-center">
          <SectionBadge dotColor="gold">Candidate Authentication</SectionBadge>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#F1F1F5] tracking-tight">
            Sign in to <span className="text-[#ECECEE]">Uni</span>
            <span className="italic text-[#D4AF6A]">Pulse</span>
          </h1>
          <p className="font-serif italic text-xs text-[#8C8C94]">
            Access institutional telemetry, saved dossiers, and side-by-side matrices.
          </p>
        </div>

        {/* 1-Click Instant Demo Box */}
        <div className="p-4 rounded-2xl bg-[#181824] border border-[#D4AF6A]/30 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-[#D4AF6A] font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Evaluator Access</span>
            </span>
            <span className="text-[10px] text-[#9494A3]">Pre-configured</span>
          </div>
          <div className="text-[11px] font-mono text-[#8C8C94] space-y-0.5">
            <div>
              Email: <span className="text-[#ECECEE]">demo@unipulse.edu</span>
            </div>
            <div>
              Password: <span className="text-[#ECECEE]">Password123!</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={demoLoading || loading}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#D4AF6A] hover:bg-[#E5C384] text-[#08080C] font-mono text-xs font-bold transition-all shadow-md shadow-[#D4AF6A]/20 cursor-pointer"
          >
            {demoLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 fill-current" />
            )}
            <span>{demoLoading ? "Authenticating Demo User..." : "Instant Demo Login"}</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-white/10 w-full" />
          <span className="bg-[#12121A] px-3 font-mono text-[10px] text-[#616172] uppercase tracking-wider shrink-0">
            or credentials
          </span>
          <div className="border-t border-white/10 w-full" />
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-[#8C8C94]">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#8C8C94] absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-[#181824] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-[#8C8C94]">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#8C8C94] absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#181824] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || demoLoading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#1C1C2A] hover:bg-[#232336] border border-white/10 hover:border-[#D4AF6A]/40 text-[#ECECEE] font-mono text-xs font-bold transition-all cursor-pointer"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{loading ? "Authenticating..." : "Sign In with Credentials"}</span>
          </button>
        </form>

        <div className="text-center font-mono text-xs text-[#8C8C94] pt-2">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-[#D4AF6A] hover:underline font-semibold"
          >
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
        </div>
      }
    >
      <LoginContent />
    </Suspense>
  );
}
