"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Scale,
  X,
  Share2,
  Bookmark,
  Building2,
  MapPin,
  Check,
  Plus,
  ArrowRight,
  Loader2,
  Search,
} from "lucide-react";
import { College } from "@/lib/types";
import { Badge, SectionBadge } from "@/components/Badge";
import { RatingStars } from "@/components/RatingStars";
import { SaveComparisonModal } from "@/components/SaveComparisonModal";

function CompareMatrixContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const idsParam = searchParams.get("ids") || "";
  const selectedSlugs = idsParam
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const [colleges, setColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [swapIndex, setSwapIndex] = useState<number | null>(null);
  const [swapSearch, setSwapSearch] = useState("");
  const [diffOnly, setDiffOnly] = useState(false);

  // Fetch all colleges for dropdown swap / addition
  useEffect(() => {
    async function loadAll() {
      try {
        const res = await fetch("/api/colleges?limit=100");
        if (res.ok) {
          const json = await res.json();
          setAllColleges(json.data || []);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadAll();
  }, []);

  // Fetch selected colleges
  useEffect(() => {
    async function loadCompared() {
      if (selectedSlugs.length === 0) {
        setColleges([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch("/api/colleges/compare", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ collegeIds: selectedSlugs }),
        });
        if (res.ok) {
          const json = await res.json();
          setColleges(json.colleges || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadCompared();
  }, [idsParam]);

  const removeSlug = (slug: string) => {
    const next = selectedSlugs.filter((s) => s !== slug);
    if (next.length > 0) {
      router.push(`/compare?ids=${next.join(",")}`);
    } else {
      router.push("/compare");
    }
  };

  const addOrSwapSlug = (newSlug: string) => {
    if (swapIndex !== null) {
      const next = [...selectedSlugs];
      next[swapIndex] = newSlug;
      setSwapIndex(null);
      router.push(`/compare?ids=${next.join(",")}`);
    } else {
      if (selectedSlugs.length >= 3) {
        alert("Maximum 3 institutions can be compared simultaneously.");
        return;
      }
      const next = [...selectedSlugs, newSlug];
      router.push(`/compare?ids=${next.join(",")}`);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatFee = (val: number) =>
    val >= 100000
      ? `₹${(val / 100000).toFixed(1)}L`
      : `₹${val?.toLocaleString("en-IN")}`;

  // Highest calculation metrics
  const maxRating = Math.max(...colleges.map((c) => c.rating || 0), 0);
  const maxAvgCTC = Math.max(
    ...colleges.map((c) => (c.placements?.[0]?.avgPackage || 0)),
    0
  );
  const maxPeakCTC = Math.max(
    ...colleges.map((c) => (c.placements?.[0]?.highestPackage || 0)),
    0
  );
  const maxRate = Math.max(
    ...colleges.map((c) => (c.placements?.[0]?.placementRate || 0)),
    0
  );
  const minFees = Math.min(...colleges.map((c) => c.feesMin || Infinity));

  const availableToAdd = allColleges.filter(
    (c) =>
      !selectedSlugs.includes(c.slug) &&
      (!swapSearch.trim() ||
        c.name.toLowerCase().includes(swapSearch.toLowerCase()) ||
        c.city.toLowerCase().includes(swapSearch.toLowerCase()) ||
        c.state.toLowerCase().includes(swapSearch.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#08080C] pb-32 aurora-glow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass-panel border border-white/10 shadow-xl">
          <div className="flex items-center gap-3">
            <SectionBadge dotColor="gold">
              Decision Matrix ({colleges.length} Flagship Institutes)
            </SectionBadge>
            <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 px-2 py-0.5 rounded-full font-bold">
              MULTI-VECTOR TELEMETRY
            </span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => setDiffOnly(!diffOnly)}
              className={`px-3 py-1.5 rounded-xl border text-[11px] transition-all cursor-pointer ${
                diffOnly
                  ? "bg-[#D4AF6A]/10 border-[#D4AF6A]/40 text-[#D4AF6A] font-bold"
                  : "bg-[#14141E] border-white/10 text-[#9494A3] hover:text-[#ECECEE]"
              }`}
            >
              {diffOnly ? "Showing Differences" : "Highlight Mode"}
            </button>

            <button
              type="button"
              onClick={copyShareLink}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#14141E] border border-white/10 hover:border-white/20 text-[#ECECEE] transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#10B981]" />
                  <span>Copied URL!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-[#9494A3]" />
                  <span>Share Matrix</span>
                </>
              )}
            </button>

            {colleges.length > 0 && (
              <button
                type="button"
                onClick={() => setSaveModalOpen(true)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#D4AF6A] text-[#08080C] font-bold hover:bg-[#E5C384] transition-all cursor-pointer shadow-md shadow-[#D4AF6A]/10"
              >
                <Bookmark className="w-3.5 h-3.5 fill-current" />
                <span>Save Matrix</span>
              </button>
            )}
          </div>
        </div>

        {loading ? (
          <div className="h-96 rounded-2xl bg-[#12121A] border border-white/10 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
          </div>
        ) : colleges.length === 0 ? (
          <div className="py-24 text-center rounded-3xl bg-[#12121A] border border-white/10 p-8 space-y-6 shadow-2xl max-w-2xl mx-auto">
            <Scale className="w-12 h-12 text-[#D4AF6A] mx-auto stroke-[1.5]" />
            <div className="space-y-2">
              <h2 className="font-serif text-2xl text-[#ECECEE]">
                Decision Benchmarking Matrix is Empty
              </h2>
              <p className="font-serif italic text-xs text-[#8C8C94] max-w-md mx-auto">
                Select up to three institutions to benchmark verified placement
                packages, tuition affordability, and student satisfaction.
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold hover:bg-[#E5C384] transition-all"
              >
                <span>Browse Institutional Directory</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-wider text-[#9494A3]">
                Or Launch Curated Flagship Presets:
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2 font-mono text-xs">
                <Link
                  href="/compare?ids=iit-delhi,iit-bombay,bits-pilani"
                  className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#1E1E2C] border border-white/10 text-[#ECECEE] hover:border-[#D4AF6A]/40 transition-colors"
                >
                  ⚡ Apex Engineering (IIT Delhi vs Bombay vs BITS)
                </Link>
                <Link
                  href="/compare?ids=iim-ahmedabad,iim-bangalore"
                  className="px-3.5 py-1.5 rounded-lg bg-[#181824] hover:bg-[#1E1E2C] border border-white/10 text-[#ECECEE] hover:border-[#D4AF6A]/40 transition-colors"
                >
                  📈 Apex Management (IIM-A vs IIM-B)
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-[#12121A] shadow-2xl">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#161622] border-b border-white/10">
                  <th className="p-5 w-1/4 font-mono text-[11px] uppercase tracking-[0.14em] text-[#9494A3] align-middle">
                    Benchmarking Criteria
                  </th>

                  {colleges.map((college, idx) => (
                    <th
                      key={college.id}
                      className="p-5 w-1/4 align-top border-l border-white/10"
                    >
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <Badge
                            variant={
                              college.type === "Govt" ? "gold" : "ice"
                            }
                          >
                            {college.type === "Govt"
                              ? "Govt Autonomous"
                              : college.type}
                          </Badge>
                          <button
                            type="button"
                            onClick={() => removeSlug(college.slug)}
                            className="text-[#9494A3] hover:text-red-400 p-1 rounded hover:bg-white/5 transition-colors"
                            title="Remove from comparison"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <Link
                          href={`/colleges/${college.slug}`}
                          className="font-serif font-normal text-base text-[#ECECEE] hover:text-[#D4AF6A] transition-colors block line-clamp-2"
                        >
                          {college.name}
                        </Link>

                        <div className="flex items-center gap-1.5 font-mono text-[11px] text-[#9494A3]">
                          <MapPin className="w-3 h-3 text-[#D4AF6A] shrink-0" />
                          <span className="truncate">
                            {college.city}, {college.state}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            setSwapIndex(idx);
                            setSwapSearch("");
                          }}
                          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[#38BDF8] hover:text-[#60A5FA] bg-[#38BDF8]/10 hover:bg-[#38BDF8]/20 px-2.5 py-1 rounded-lg border border-[#38BDF8]/20 transition-all cursor-pointer"
                        >
                          <span>Swap Institution ⇄</span>
                        </button>
                      </div>
                    </th>
                  ))}

                  {/* Empty slot if less than 3 colleges */}
                  {colleges.length < 3 && (
                    <th className="p-5 w-1/4 align-top border-l border-white/10 bg-[#101016]/50">
                      <div className="h-44 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center p-4 text-center space-y-3">
                        <Plus className="w-6 h-6 text-[#9494A3]" />
                        <span className="font-mono text-xs text-[#9494A3]">
                          Add institution to complete matrix
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setSwapIndex(null);
                            setSwapSearch("");
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#D4AF6A]/10 hover:bg-[#D4AF6A]/20 border border-[#D4AF6A]/30 text-[#D4AF6A] font-mono text-[11px] font-bold transition-all"
                        >
                          + Select College
                        </button>
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              <tbody className="divide-y divide-white/5 font-mono text-xs">
                {/* Overall Student Rating */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Overall Student Rating
                  </td>
                  {colleges.map((c) => {
                    const isTop = c.rating === maxRating && maxRating > 0;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-white/10 ${
                          isTop ? "bg-[#D4AF6A]/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <RatingStars
                            rating={c.rating}
                            size="sm"
                            showScore={true}
                          />
                          {isTop && (
                            <span className="text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 px-1.5 py-0.5 rounded-full font-bold">
                              ★ Highest
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Audited Average CTC */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Audited Average CTC
                  </td>
                  {colleges.map((c) => {
                    const avg = c.placements?.[0]?.avgPackage || 0;
                    const isTop = avg === maxAvgCTC && maxAvgCTC > 0;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-white/10 ${
                          isTop ? "bg-[#D4AF6A]/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isTop ? "text-[#D4AF6A]" : "text-[#ECECEE]"
                            }`}
                          >
                            {avg > 0 ? `₹${avg} LPA` : "N/A"}
                          </span>
                          {isTop && (
                            <span className="text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 px-1.5 py-0.5 rounded-full font-bold">
                              ★ Leader
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Highest CTC Package */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Highest CTC Package
                  </td>
                  {colleges.map((c) => {
                    const peak = c.placements?.[0]?.highestPackage || 0;
                    const isTop = peak === maxPeakCTC && maxPeakCTC > 0;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-white/10 ${
                          isTop ? "bg-[#38BDF8]/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isTop ? "text-[#38BDF8]" : "text-[#ECECEE]"
                            }`}
                          >
                            {peak > 0 ? `₹${peak} LPA` : "N/A"}
                          </span>
                          {isTop && (
                            <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/30 px-1.5 py-0.5 rounded-full font-bold">
                              ★ Peak
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Placement Success Rate */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Placement Success Rate
                  </td>
                  {colleges.map((c) => {
                    const rate = c.placements?.[0]?.placementRate || 0;
                    const isTop = rate === maxRate && maxRate > 0;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-white/10 ${
                          isTop ? "bg-[#10B981]/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-bold ${
                              isTop ? "text-[#10B981]" : "text-[#ECECEE]"
                            }`}
                          >
                            {rate > 0 ? `${rate}%` : "N/A"}
                          </span>
                          {isTop && (
                            <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-1.5 py-0.5 rounded-full font-bold">
                              ★ Top
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Annual Tuition Band */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Annual Tuition Band
                  </td>
                  {colleges.map((c) => {
                    const isBudget = c.feesMin === minFees;
                    return (
                      <td
                        key={c.id}
                        className={`p-4 border-l border-white/10 ${
                          isBudget ? "bg-[#D4AF6A]/5" : ""
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-bold ${
                              isBudget ? "text-[#D4AF6A]" : "text-[#ECECEE]"
                            }`}
                          >
                            {formatFee(c.feesMin)} – {formatFee(c.feesMax)}
                          </span>
                          {isBudget && (
                            <span className="text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/30 px-1.5 py-0.5 rounded-full font-bold">
                              ★ Best Budget
                            </span>
                          )}
                        </div>
                      </td>
                    );
                  })}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Institutional Vintage */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Institutional Vintage
                  </td>
                  {colleges.map((c) => (
                    <td
                      key={c.id}
                      className="p-4 border-l border-white/10 text-[#ECECEE]"
                    >
                      Estd. {c.establishedYear} (
                      {new Date().getFullYear() - c.establishedYear} Years of
                      Heritage)
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>

                {/* Offered Degree Programs */}
                <tr className="hover:bg-[#181824]/60 transition-colors">
                  <td className="p-4 text-[#9494A3] uppercase tracking-wider text-[11px] font-semibold">
                    Offered Degree Programs
                  </td>
                  {colleges.map((c) => (
                    <td
                      key={c.id}
                      className="p-4 border-l border-white/10 text-[#ECECEE]"
                    >
                      <div className="space-y-1.5">
                        <span className="font-bold text-[#D4AF6A]">
                          {c.courses?.length || 0} Programs Audited
                        </span>
                        <div className="space-y-1">
                          {(c.courses || []).slice(0, 3).map((crs) => (
                            <div
                              key={crs.id}
                              className="text-[11px] text-[#9494A3] truncate max-w-xs"
                            >
                              • {crs.name}
                            </div>
                          ))}
                        </div>
                      </div>
                    </td>
                  ))}
                  {colleges.length < 3 && <td className="p-4 border-l border-white/10" />}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* College Selector / Swap Modal */}
      {(swapIndex !== null || colleges.length < 3 && swapSearch !== undefined && false) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#12121A] border border-white/10 rounded-2xl p-6 space-y-5 shadow-2xl">
            <button
              type="button"
              onClick={() => setSwapIndex(null)}
              className="absolute top-5 right-5 p-1.5 rounded-lg text-[#8C8C94] hover:text-[#ECECEE] hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="space-y-1">
              <h3 className="font-serif text-xl text-[#ECECEE]">
                {swapIndex !== null
                  ? `Swap Institution #${swapIndex + 1}`
                  : "Add Institution to Matrix"}
              </h3>
              <p className="font-serif italic text-xs text-[#8C8C94]">
                Choose an institution to benchmark in this slot.
              </p>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-[#8C8C94] absolute left-3.5 top-3" />
              <input
                type="text"
                autoFocus
                value={swapSearch}
                onChange={(e) => setSwapSearch(e.target.value)}
                placeholder="Search across all 45 institutions..."
                className="w-full bg-[#1A1A26] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A]"
              />
            </div>

            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {availableToAdd.slice(0, 15).map((col) => (
                <button
                  key={col.id}
                  type="button"
                  onClick={() => addOrSwapSlug(col.slug)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#181824] hover:bg-[#1E1E2C] border border-white/5 hover:border-[#D4AF6A]/40 text-left transition-all"
                >
                  <div className="space-y-0.5 max-w-xs">
                    <div className="font-serif text-xs text-[#ECECEE] truncate">
                      {col.name}
                    </div>
                    <div className="font-mono text-[10px] text-[#9494A3]">
                      {col.city}, {col.state} • Estd. {col.establishedYear}
                    </div>
                  </div>
                  <Badge variant="gold">{col.rating.toFixed(1)} ★</Badge>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Save Matrix Modal */}
      <SaveComparisonModal
        collegeSlugs={selectedSlugs}
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
      />
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
        </div>
      }
    >
      <CompareMatrixContent />
    </Suspense>
  );
}
