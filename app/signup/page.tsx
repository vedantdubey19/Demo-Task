"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { User, Mail, Lock, Loader2, ArrowRight } from "lucide-react";
import { SectionBadge } from "@/components/Badge";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to create account");
      }

      // Auto sign in
      const signInRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (signInRes?.error) {
        router.push("/login");
      } else {
        router.push("/saved");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4 py-16 aurora-glow">
      <div className="w-full max-w-md bg-[#12121A] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        <div className="space-y-1 text-center">
          <SectionBadge dotColor="gold">Candidate Registration</SectionBadge>
          <h1 className="font-serif text-2xl sm:text-3xl text-[#F1F1F5] tracking-tight">
            Create an Account
          </h1>
          <p className="font-serif italic text-xs text-[#8C8C94]">
            Start curating institutional telemetry and saved decision matrices.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/30 text-red-400 font-mono text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          <div className="space-y-1">
            <label className="block text-[10px] uppercase tracking-wider text-[#8C8C94]">
              Candidate Full Name
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#8C8C94] absolute left-3 top-3" />
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Rohan Sharma"
                className="w-full bg-[#181824] border border-white/10 rounded-xl pl-9 pr-3 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>
          </div>

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
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF6A] hover:bg-[#E5C384] text-[#08080C] font-mono text-xs font-bold transition-all shadow-md shadow-[#D4AF6A]/20 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>{loading ? "Creating Account..." : "Complete Registration"}</span>
          </button>
        </form>

        <div className="text-center font-mono text-xs text-[#8C8C94] pt-2">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#D4AF6A] hover:underline font-semibold"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
