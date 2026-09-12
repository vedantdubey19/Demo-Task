"use client";

import React, { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Award,
  MapPin,
  Building2,
  TrendingUp,
  GraduationCap,
  MessageSquare,
  IndianRupee,
  Calendar,
  Sparkles,
  Scale,
  Search,
  Loader2,
} from "lucide-react";
import { College, Review } from "@/lib/types";
import { Badge, SectionBadge } from "@/components/Badge";
import { RatingStars } from "@/components/RatingStars";
import { ShortlistButton } from "@/components/ShortlistButton";
import { ScorecardGauge } from "@/components/ScorecardGauge";
import { ReviewModal } from "@/components/ReviewModal";

export default function CollegeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = use(params);
  const slug = resolvedParams.slug;

  const [college, setCollege] = useState<College | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "overview" | "placements" | "courses" | "reviews"
  >("overview");
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  // Courses tab search and filter
  const [courseSearch, setCourseSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All");

  useEffect(() => {
    async function loadCollege() {
      setLoading(true);
      try {
        const res = await fetch(`/api/colleges/${encodeURIComponent(slug)}`);
        if (res.status === 404) {
          notFound();
        }
        if (res.ok) {
          const data = await res.json();
          setCollege(data);
          setReviews(data.reviews || []);
        }
      } catch (err) {
        console.error("Failed to load college:", err);
      } finally {
        setLoading(false);
      }
    }

    loadCollege();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#D4AF6A] animate-spin" />
      </div>
    );
  }

  if (!college) {
    return notFound();
  }

  const formatFee = (val: number) =>
    val >= 100000
      ? `₹${(val / 100000).toFixed(2)}L`
      : `₹${val?.toLocaleString("en-IN")}`;

  const placements = college.placements || [];
  const latestPlacement = placements[0] || null;

  // Highest salary in placement list for scale
  const maxHistoricSalary = Math.max(
    ...placements.map((p) => Number(p.highestPackage) || 0),
    50
  );

  // Filtered courses
  const filteredCourses = (college.courses || []).filter((crs) => {
    const matchesSearch =
      !courseSearch.trim() ||
      crs.name.toLowerCase().includes(courseSearch.toLowerCase());
    const matchesFilter =
      courseFilter === "All" ||
      crs.name.toLowerCase().includes(courseFilter.toLowerCase());
    return matchesSearch && matchesFilter;
  });

  const onReviewAdded = (newRev: Review) => {
    setReviews((prev) => [newRev, ...prev]);
  };

  return (
    <div className="min-h-screen bg-[#08080C] pb-24 aurora-glow">
      {/* Hero Dossier Header */}
      <section className="relative border-b border-white/10 bg-[#0E0E16]/80 py-10 md:py-14 hero-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-xs text-[#9494A3] hover:text-[#D4AF6A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Institutional Directory</span>
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="space-y-3 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge
                  variant={college.type === "Govt" ? "gold" : "ice"}
                  className="font-mono text-xs uppercase"
                >
                  {college.type === "Govt"
                    ? "Govt Autonomous Flagship"
                    : `${college.type} University`}
                </Badge>
                <span className="font-mono text-[11px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2.5 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <Award className="w-3 h-3" />
                  <span>NIRF Accredited</span>
                </span>
                <span className="font-mono text-[11px] text-[#9494A3]">
                  Estd. {college.establishedYear}
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F1F1F5] tracking-tight">
                {college.name}
              </h1>

              <div className="flex flex-wrap items-center gap-4 font-mono text-xs text-[#9494A3]">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#D4AF6A]" />
                  <span>
                    {college.city}, {college.state}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <RatingStars
                    rating={college.rating}
                    size="sm"
                    showScore={true}
                  />
                  <span className="text-[#616172]">
                    ({reviews.length} verified reviews)
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <ShortlistButton
                collegeId={college.id}
                variant="button"
                className="px-4 py-2.5 rounded-xl font-bold"
              />
              <Link
                href={`/compare?ids=${college.slug}`}
                className="inline-flex items-center justify-center gap-2 rounded-[2px] transition-all cursor-pointer select-none px-4 py-2 text-xs font-semibold bg-transparent hover:bg-[#1C1C21] text-[#ECECEE] border border-white/10 hover:border-white/20"
              >
                <Scale className="w-3.5 h-3.5" />
                <span>Add to Matrix</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dossier Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Dossier Left Column */}
          <div className="lg:col-span-8 space-y-8">
            {/* Tab Navigation */}
            <div className="flex items-center gap-1.5 p-1.5 rounded-2xl bg-[#12121A] border border-white/10 overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab("overview")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === "overview"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5"
                }`}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>Overview</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("placements")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === "placements"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5"
                }`}
              >
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Placements & CTC ({placements.length} Years)</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("courses")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === "courses"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Degree Programs ({college.courses?.length || 0})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("reviews")}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-mono text-xs transition-all cursor-pointer shrink-0 ${
                  activeTab === "reviews"
                    ? "bg-[#D4AF6A] text-[#08080C] font-bold shadow-md shadow-[#D4AF6A]/20"
                    : "text-[#9494A3] hover:text-[#ECECEE] hover:bg-white/5"
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Verified Reviews ({reviews.length})</span>
              </button>
            </div>

            {/* Tab: Overview */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                <div className="bg-[#12121A] p-7 rounded-2xl border border-white/10 space-y-4 shadow-xl">
                  <SectionBadge dotColor="gold">
                    Institutional Profile & Heritage
                  </SectionBadge>
                  <p className="font-serif italic text-base sm:text-lg text-[#ECECEE] leading-relaxed">
                    {college.overview}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
                  <div className="p-5 rounded-2xl bg-[#14141E] border border-white/10 space-y-2">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-[#D4AF6A]" />
                      <span>Governance & Status</span>
                    </div>
                    <div className="text-sm font-bold text-[#ECECEE]">
                      {college.type === "Govt"
                        ? "Govt Autonomous Flagship"
                        : `${college.type} University`}
                    </div>
                    <div className="text-[11px] text-[#9494A3]">
                      Estd. {college.establishedYear} • Institute of National Distinction
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#14141E] border border-white/10 space-y-2">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5 text-[#38BDF8]" />
                      <span>Annual Tuition Band</span>
                    </div>
                    <div className="text-sm font-bold text-[#38BDF8]">
                      {formatFee(college.feesMin)} – {formatFee(college.feesMax)}
                    </div>
                    <div className="text-[11px] text-[#9494A3]">
                      Subsidized hostel and academic grants eligible
                    </div>
                  </div>

                  <div className="p-5 rounded-2xl bg-[#14141E] border border-white/10 space-y-2">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-[#10B981]" />
                      <span>Placement Baseline</span>
                    </div>
                    <div className="text-sm font-bold text-[#10B981]">
                      {latestPlacement
                        ? `₹${latestPlacement.avgPackage} LPA Avg`
                        : "₹15.0 LPA Avg"}
                    </div>
                    <div className="text-[11px] text-[#9494A3]">
                      {latestPlacement
                        ? `${latestPlacement.placementRate}% Batch Placed`
                        : "Verified Track"}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Placements & CTC */}
            {activeTab === "placements" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#12121A] border border-white/10 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                    <div>
                      <SectionBadge dotColor="ice">
                        Year-over-Year CTC Trends
                      </SectionBadge>
                      <h3 className="font-serif text-xl text-[#ECECEE] mt-1">
                        Salary Telemetry & Placement Rates
                      </h3>
                    </div>
                    <span className="font-mono text-[10px] text-[#D4AF6A] bg-[#D4AF6A]/10 border border-[#D4AF6A]/20 px-2.5 py-1 rounded-full uppercase font-bold">
                      NIRF Audited Records
                    </span>
                  </div>

                  <div className="space-y-5 font-mono text-xs">
                    {placements.map((p) => {
                      const peakPct = Math.min(
                        Math.round((Number(p.highestPackage) / maxHistoricSalary) * 100),
                        100
                      );
                      const avgPct = Math.min(
                        Math.round((Number(p.avgPackage) / maxHistoricSalary) * 100),
                        100
                      );
                      const medPct = Math.min(
                        Math.round((Number(p.medianPackage) / maxHistoricSalary) * 100),
                        100
                      );

                      return (
                        <div
                          key={p.id}
                          className="p-4 rounded-xl bg-[#181824] border border-white/5 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#ECECEE] flex items-center gap-1.5">
                              <Calendar className="w-3.5 h-3.5 text-[#D4AF6A]" />
                              <span>Batch of {p.year}</span>
                            </span>
                            <span className="text-xs font-bold text-[#10B981] bg-[#10B981]/10 border border-[#10B981]/30 px-2 py-0.5 rounded-full">
                              {p.placementRate}% Placement Rate
                            </span>
                          </div>

                          <div className="space-y-2 text-[11px]">
                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[#9494A3]">
                                <span>Highest CTC Package</span>
                                <span className="text-[#38BDF8] font-bold">
                                  ₹{p.highestPackage} LPA
                                </span>
                              </div>
                              <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#38BDF8] to-[#60A5FA] rounded-full transition-all duration-700"
                                  style={{ width: `${peakPct}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[#9494A3]">
                                <span>Average CTC Package</span>
                                <span className="text-[#D4AF6A] font-bold">
                                  ₹{p.avgPackage} LPA
                                </span>
                              </div>
                              <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-[#D4AF6A] to-[#F59E0B] rounded-full transition-all duration-700"
                                  style={{ width: `${avgPct}%` }}
                                />
                              </div>
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex justify-between text-[#9494A3]">
                                <span>Median CTC Package</span>
                                <span className="text-[#ECECEE] font-bold">
                                  ₹{p.medianPackage} LPA
                                </span>
                              </div>
                              <div className="h-2 w-full bg-[#1C1C2A] rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-gray-400 to-gray-200 rounded-full transition-all duration-700"
                                  style={{ width: `${medPct}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Degree Programs */}
            {activeTab === "courses" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#12121A] border border-white/10 space-y-5 shadow-xl">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-[#9494A3] absolute left-3 top-3" />
                      <input
                        type="text"
                        value={courseSearch}
                        onChange={(e) => setCourseSearch(e.target.value)}
                        placeholder="Search program by name (e.g. Computer Science, AI, Mechanical)..."
                        className="w-full bg-[#181824] border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none focus:border-[#D4AF6A]"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 font-mono text-xs">
                      {["All", "B.Tech", "M.Tech", "MBA"].map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setCourseFilter(cat)}
                          className={`px-3 py-2 rounded-xl border transition-all cursor-pointer ${
                            courseFilter === cat
                              ? "bg-[#D4AF6A] text-[#08080C] border-[#D4AF6A] font-bold"
                              : "bg-[#181824] border-white/5 text-[#9494A3] hover:text-[#ECECEE]"
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                    {filteredCourses.length === 0 ? (
                      <div className="col-span-2 py-12 text-center text-[#9494A3]">
                        No academic degree programs found matching &ldquo;{courseSearch}&rdquo;.
                      </div>
                    ) : (
                      filteredCourses.map((crs) => (
                        <div
                          key={crs.id}
                          className="p-4 rounded-xl bg-[#181824] border border-white/5 hover:border-[#D4AF6A]/30 transition-all space-y-3"
                        >
                          <div className="space-y-1">
                            <span className="text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full font-bold">
                              {crs.duration}
                            </span>
                            <h4 className="font-serif text-sm font-semibold text-[#ECECEE] pt-1">
                              {crs.name}
                            </h4>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                            <div>
                              <span className="text-[#9494A3] block text-[10px]">
                                Seat Capacity
                              </span>
                              <span className="text-[#ECECEE] font-bold">
                                {crs.seats} Approved
                              </span>
                            </div>
                            <div className="text-right">
                              <span className="text-[#9494A3] block text-[10px]">
                                Total Program Tuition
                              </span>
                              <span className="text-[#D4AF6A] font-bold text-sm">
                                {formatFee(crs.feesTotal)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Tab: Verified Reviews */}
            {activeTab === "reviews" && (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl bg-[#12121A] border border-white/10 space-y-6 shadow-xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
                    <div>
                      <SectionBadge dotColor="success">
                        Verified Candidate Reviews
                      </SectionBadge>
                      <h3 className="font-serif text-xl text-[#ECECEE] mt-1">
                        Community Feedback ({reviews.length} Reviews)
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsReviewModalOpen(true)}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D4AF6A] to-[#F59E0B] text-[#08080C] font-mono text-xs font-bold shadow-md hover:scale-[1.02] transition-all cursor-pointer"
                    >
                      <Sparkles className="w-3.5 h-3.5 fill-current" />
                      <span>Write Verified Review</span>
                    </button>
                  </div>

                  <div className="space-y-4">
                    {reviews.length === 0 ? (
                      <div className="py-12 text-center text-[#9494A3] font-serif italic">
                        No reviews submitted yet. Be the first to share verified student voice.
                      </div>
                    ) : (
                      reviews.map((rev) => (
                        <div
                          key={rev.id}
                          className="p-5 rounded-xl bg-[#181824] border border-white/5 space-y-3 font-mono text-xs"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <RatingStars rating={rev.rating} size="xs" />
                              <span className="font-bold text-[#ECECEE] text-xs">
                                {rev.title}
                              </span>
                            </div>
                            <span className="text-[10px] text-[#616172]">
                              {new Date(rev.createdAt).toLocaleDateString("en-IN", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          <p className="font-serif italic text-xs text-[#ECECEE] leading-relaxed">
                            &ldquo;{rev.body}&rdquo;
                          </p>

                          <div className="flex items-center gap-2 text-[10px] text-[#8C8C94] pt-2 border-t border-white/5">
                            <span className="text-[#D4AF6A]">
                              {rev.authorName || "Verified Candidate"}
                            </span>
                            <span>•</span>
                            <span>{rev.authorRole || "Student"}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Scorecard Sidebar Right Column */}
          <div className="lg:col-span-4 sticky top-24 space-y-6">
            <ScorecardGauge
              score={Math.round(college.rating * 20)}
              placementScore={latestPlacement ? latestPlacement.placementRate : 92}
              feeValueScore={college.type === "Govt" ? 95 : 82}
              pedigreeScore={Math.min(
                Math.round(
                  (new Date().getFullYear() - college.establishedYear) * 0.8 + 50
                ),
                99
              )}
              collegeName="Indian Scorecard"
            />

            <div className="p-6 rounded-2xl bg-[#12121A] border border-white/10 space-y-4 font-mono text-xs shadow-xl">
              <div className="flex items-center gap-1.5 text-xs text-[#D4AF6A] font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Audited Highlights</span>
              </div>
              <div className="divide-y divide-white/5 text-xs">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9494A3]">Annual Tuition</span>
                  <span className="text-[#ECECEE] font-bold">
                    {formatFee(college.feesMin)} – {formatFee(college.feesMax)}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9494A3]">Average CTC</span>
                  <span className="text-[#D4AF6A] font-bold">
                    {latestPlacement ? `₹${latestPlacement.avgPackage} LPA` : "₹15.0 LPA"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9494A3]">Highest CTC</span>
                  <span className="text-[#38BDF8] font-bold">
                    {latestPlacement ? `₹${latestPlacement.highestPackage} LPA` : "₹45.0 LPA"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9494A3]">Placement Rate</span>
                  <span className="text-[#10B981] font-bold">
                    {latestPlacement ? `${latestPlacement.placementRate}%` : "92%"}
                  </span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#9494A3]">Degree Programs</span>
                  <span className="text-[#ECECEE] font-bold">
                    {college.courses?.length || 0} Available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      <ReviewModal
        collegeSlug={college.slug}
        collegeName={college.name}
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        onReviewAdded={onReviewAdded}
      />
    </div>
  );
}
