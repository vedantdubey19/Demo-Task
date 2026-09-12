"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Bookmark,
  Scale,
  Building2,
  TrendingUp,
  Trash2,
  Calendar,
  Zap,
  Loader2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { SavedCollege, SavedComparison } from "@/lib/types";
import { Badge, SectionBadge } from "@/components/Badge";
import { CollegeCard } from "@/components/CollegeCard";

export default function SavedPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"colleges" | "comparisons">("colleges");
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [savedComparisons, setSavedComparisons] = useState<SavedComparison[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingCompId, setDeletingCompId] = useState<string | null>(null);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  useEffect(() => {
    async function loadSaved() {
      if (status !== "authenticated") {
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const [resColleges, resComparisons] = await Promise.all([
          fetch("/api/saved/colleges"),
          fetch("/api/saved/comparisons"),
        ]);

        if (resColleges.ok) {
          const jsonC = await resColleges.json();
          setSavedColleges(jsonC.savedColleges || []);
        }

        if (resComparisons.ok) {
          const jsonM = await resComparisons.json();
          setSavedComparisons(jsonM.savedComparisons || []);
        }
      } catch (err) {
        console.error("Failed to load saved items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadSaved();
  }, [status]);

  const handleDeleteComparison = async (id: string) => {
    setDeletingCompId(id);
    try {
      const res = await fetch(`/api/saved/comparisons/${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setSavedComparisons((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete comparison:", err);
    } finally {
      setDeletingCompId(null);
    }
  };

  const handleDemoLogin = async () => {
    setIsDemoLoading(true);
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: "demo@unipulse.edu",
        password: "Password123!",
      });
      if (!res?.error) {
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const collegesCount = savedColleges.length;
  const avgCTC =
    collegesCount > 0
      ? (
          savedColleges.reduce((acc, sc) => {
            const avg = sc.college.placements?.[0]?.avgPackage || 15;
            return acc + Number(avg);
          }, 0) / collegesCount
        ).toFixed(1)
      : "0";

  const compareAllUrl =
    collegesCount >= 2
      ? `/compare?ids=${savedColleges
          .slice(0, 3)
          .map((sc) => sc.college.slug)
          .join(",")}`
      : "/compare";

  if (status === "loading" || (status === "authenticated" && loading)) {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center p-4 aurora-glow">
        <div className="max-w-md w-full bg-[#12121A] border border-white/10 rounded-3xl p-8 text-center space-y-6 shadow-2xl">
          <div className="w-12 h-12 rounded-2xl bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 flex items-center justify-center text-[#D4AF6A] mx-auto">
            <Bookmark className="w-6 h-6" />
          </div>

          <div className="space-y-2">
            <h2 className="font-serif text-2xl text-[#ECECEE]">
              Candidate Shortlist & Matrices
            </h2>
            <p className="font-serif italic text-xs text-[#8C8C94]">
              Sign in to manage your saved institutions and decision telemetry matrices.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={handleDemoLogin}
              disabled={isDemoLoading}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all shadow-lg shadow-[#D4AF6A]/10 cursor-pointer"
            >
              {isDemoLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Zap className="w-4 h-4 fill-current" />
              )}
              <span>1-Click Candidate Demo Login</span>
            </button>

            <Link
              href="/login?callbackUrl=/saved"
              className="block w-full py-3 rounded-xl bg-[#181824] hover:bg-[#1E1E2C] border border-white/10 text-xs font-mono font-semibold text-[#ECECEE] transition-all"
            >
              Sign In with Credentials
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#08080C] pb-24 aurora-glow">
      {/* Header Banner */}
      <section className="border-b border-white/10 bg-[#0E0E16]/80 py-10 md:py-14 hero-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <SectionBadge dotColor="gold">Personal Candidate Dashboard</SectionBadge>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F1F1F5] tracking-tight">
                Shortlisted{" "}
                <span className="italic text-[#D4AF6A]">
                  Institutes & Matrices
                </span>
              </h1>
              <p className="font-serif italic text-sm text-[#9494A3] mt-1">
                Your curated shortlist of apex universities and customized decision telemetry matrices.
              </p>
            </div>

            {/* Tab switch */}
            <div className="flex items-center gap-1.5 p-1.5 bg-[#14141E] border border-white/10 rounded-2xl font-mono text-xs shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab("colleges")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "colleges"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE]"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Colleges ({savedColleges.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("comparisons")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all cursor-pointer ${
                  activeTab === "comparisons"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE]"
                }`}
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Saved Matrices ({savedComparisons.length})</span>
              </button>
            </div>
          </div>

          {/* Metric cards */}
          {collegesCount > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 font-mono text-xs">
              <div className="p-4 rounded-2xl bg-[#14141E] border border-white/5 flex items-center justify-between">
                <span className="text-[#9494A3] flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-[#D4AF6A]" />
                  <span>Shortlisted Institutes</span>
                </span>
                <span className="text-base font-bold text-[#ECECEE]">
                  {collegesCount}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141E] border border-white/5 flex items-center justify-between">
                <span className="text-[#9494A3] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#38BDF8]" />
                  <span>Avg Shortlist CTC</span>
                </span>
                <span className="text-base font-bold text-[#D4AF6A]">
                  ₹{avgCTC} LPA
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#14141E] border border-white/5 flex items-center justify-between">
                <span className="text-[#9494A3] flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#10B981]" />
                  <span>Status</span>
                </span>
                <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded-full">
                  Candidate Active
                </span>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Tab 1: Shortlisted Colleges */}
        {activeTab === "colleges" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <SectionBadge dotColor="gold">
                SHORTLISTED INSTITUTES
              </SectionBadge>

              {collegesCount >= 2 && (
                <Link
                  href={compareAllUrl}
                  className="inline-flex items-center gap-1.5 font-mono text-xs text-[#D4AF6A] hover:underline"
                >
                  <span>Compare Top 3 Shortlisted →</span>
                </Link>
              )}
            </div>

            {collegesCount === 0 ? (
              <div className="py-24 text-center rounded-3xl bg-[#12121A] border border-white/10 p-8 space-y-4 max-w-lg mx-auto shadow-2xl">
                <Bookmark className="w-10 h-10 text-[#616172] mx-auto stroke-[1.5]" />
                <p className="font-serif italic text-base text-[#9494A3]">
                  &ldquo;No colleges bookmarked in your candidate dossier yet.&rdquo;
                </p>
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all"
                >
                  Explore Institutional Directory →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedColleges.map((sc) => (
                  <CollegeCard
                    key={sc.id}
                    college={sc.college}
                    showCompareToggle={false}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Saved Comparison Sets */}
        {activeTab === "comparisons" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <SectionBadge dotColor="ice">
                SAVED COMPARISON SETS
              </SectionBadge>
              <span className="font-mono text-xs text-[#9494A3]">
                {savedComparisons.length} saved matrices
              </span>
            </div>

            {savedComparisons.length === 0 ? (
              <div className="py-24 text-center rounded-3xl bg-[#12121A] border border-white/10 p-8 space-y-4 max-w-lg mx-auto shadow-2xl">
                <Scale className="w-10 h-10 text-[#616172] mx-auto stroke-[1.5]" />
                <p className="font-serif italic text-base text-[#9494A3]">
                  &ldquo;No comparative sets saved yet.&rdquo;
                </p>
                <Link
                  href="/compare"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all"
                >
                  Build Comparison Matrix →
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
                {savedComparisons.map((comp) => {
                  let ids: string[] = [];
                  if (Array.isArray(comp.collegeIds)) {
                    ids = comp.collegeIds;
                  } else {
                    try {
                      ids = JSON.parse(comp.collegeIds);
                    } catch {
                      ids = String(comp.collegeIds).split(",").filter(Boolean);
                    }
                  }

                  const isDeleting = deletingCompId === comp.id;

                  return (
                    <div
                      key={comp.id}
                      className="p-6 rounded-2xl bg-[#12121A] border border-white/10 hover:border-[#D4AF6A]/30 transition-all space-y-4 shadow-xl"
                    >
                      <div className="flex items-center justify-between">
                        <Badge variant="gold">
                          {ids.length} Institutions
                        </Badge>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] text-[#616172]">
                            {new Date(comp.createdAt).toLocaleDateString("en-IN", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleDeleteComparison(comp.id)}
                            disabled={isDeleting}
                            className="text-[#9494A3] hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors cursor-pointer"
                            title="Delete this comparison set"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      <h3 className="font-serif text-lg text-[#ECECEE]">
                        {comp.label || "Custom Comparison Matrix"}
                      </h3>

                      <div className="flex flex-wrap gap-2">
                        {ids.map((id) => (
                          <span
                            key={id}
                            className="px-2.5 py-1 rounded-lg bg-[#181824] border border-white/5 text-[11px] text-[#ECECEE]"
                          >
                            {id.replace(/-/g, " ")}
                          </span>
                        ))}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex items-center justify-end">
                        <Link
                          href={`/compare?ids=${ids.join(",")}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D4AF6A] text-[#08080C] font-bold hover:bg-[#E5C384] transition-all"
                        >
                          <span>Launch Matrix</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
