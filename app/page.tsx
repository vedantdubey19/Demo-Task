"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Search,
  X,
  Filter,
  RotateCcw,
  Sparkles,
  Zap,
  Building2,
  TrendingUp,
  ShieldCheck,
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { College } from "@/lib/types";
import { CollegeCard } from "@/components/CollegeCard";
import { CompareDock } from "@/components/CompareDock";
import { ScorecardGauge } from "@/components/ScorecardGauge";
import { SectionBadge } from "@/components/Badge";

const STATES = [
  "All",
  "Maharashtra",
  "Delhi",
  "Tamil Nadu",
  "Karnataka",
  "Telangana",
  "West Bengal",
  "Uttar Pradesh",
  "Rajasthan",
  "Gujarat",
  "Punjab",
];

const TYPES = [
  { label: "All Types", value: "All" },
  { label: "Govt Autonomous", value: "Govt" },
  { label: "Private Institute", value: "Private" },
  { label: "Deemed University", value: "Deemed" },
];

const RATINGS = [
  { label: "Any Rating", value: "" },
  { label: "4.8+ ★ (Apex)", value: "4.8" },
  { label: "4.5+ ★ (Premier)", value: "4.5" },
  { label: "4.0+ ★ (Accredited)", value: "4.0" },
];

const BUDGETS = [
  { label: "Any Budget", min: "", max: "" },
  { label: "< ₹1.5 Lakh/yr", min: "0", max: "150000" },
  { label: "₹1.5L – ₹3L/yr", min: "150000", max: "300000" },
  { label: "₹3L – ₹6L/yr", min: "300000", max: "600000" },
  { label: "> ₹6 Lakhs/yr", min: "600000", max: "" },
];

const SORTS = [
  { label: "Highest Rating", value: "rating" },
  { label: "Fees: Low to High", value: "feesMin" },
  { label: "Fees: High to Low", value: "feesMax" },
  { label: "Established: Oldest", value: "establishedYear" },
];

function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const inputRef = useRef<HTMLInputElement>(null);

  const initialSearch = searchParams.get("search") || "";
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  useEffect(() => {
    setSearchTerm(searchParams.get("search") || "");
  }, [searchParams]);

  // Keyboard shortcut '/'
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === "/" &&
        document.activeElement !== inputRef.current &&
        !["input", "textarea"].includes(
          (document.activeElement?.tagName || "").toLowerCase()
        )
      ) {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (searchTerm.trim()) {
        params.set("search", searchTerm.trim());
      } else {
        params.delete("search");
      }
      params.set("page", "1");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, pathname, router, searchParams]);

  return (
    <div className="relative w-full">
      <div className="relative flex items-center bg-[#16161A] border border-white/10 rounded-[8px] focus-within:border-[#D4AF6A] focus-within:shadow-[0_0_0_1px_rgba(212,175,106,0.3)] transition-all">
        <Search className="w-4 h-4 text-[#8C8C94] ml-4 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by institution name, city (e.g. Bombay, Delhi, Bangalore), or state..."
          className="w-full bg-transparent px-3 py-3.5 text-xs text-[#ECECEE] placeholder:text-[#5C5C64] focus:outline-none"
        />
        <div className="flex items-center gap-2 pr-3">
          {searchTerm ? (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                const params = new URLSearchParams(searchParams.toString());
                params.delete("search");
                params.set("page", "1");
                router.push(`${pathname}?${params.toString()}`, {
                  scroll: false,
                });
                inputRef.current?.focus();
              }}
              className="p-1 text-[#8C8C94] hover:text-[#ECECEE] transition-colors"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 font-mono text-[10px] text-[#8C8C94] bg-[#1C1C21] border border-white/10 rounded-[2px]">
              /
            </kbd>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentType = searchParams.get("type") || "All";
  const currentState = searchParams.get("state") || "All";
  const currentRating = searchParams.get("ratingMin") || "";
  const currentFeesMin = searchParams.get("feesMin") || "";
  const currentFeesMax = searchParams.get("feesMax") || "";
  const currentSort = searchParams.get("sort") || "rating";

  const hasActiveFilters =
    currentType !== "All" ||
    currentState !== "All" ||
    currentRating !== "" ||
    currentFeesMin !== "" ||
    currentFeesMax !== "" ||
    currentSort !== "rating" ||
    searchParams.has("search");

  const updateParam = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val && val !== "All") {
      params.set(key, val);
    } else {
      params.delete(key);
    }
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  const updateBudget = (min: string, max: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (min) params.set("feesMin", min);
    else params.delete("feesMin");

    if (max) params.set("feesMax", max);
    else params.delete("feesMax");

    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-6 bg-[#12121A] p-5 rounded-2xl border border-white/10 shadow-xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#D4AF6A]" />
          <span className="font-mono text-xs font-bold text-[#ECECEE] uppercase tracking-wider">
            Telemetry Filters
          </span>
        </div>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => router.push("/")}
            className="flex items-center gap-1 font-mono text-[10px] text-[#38BDF8] hover:text-[#60A5FA] uppercase tracking-wider transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Sort Rankings By */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9494A3] font-semibold">
          Sort Rankings By
        </label>
        <select
          value={currentSort}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#181824] border border-white/10 text-xs text-[#ECECEE] font-mono focus:outline-none focus:border-[#D4AF6A] cursor-pointer"
        >
          {SORTS.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#181824]">
              {s.label}
            </option>
          ))}
        </select>
      </div>

      {/* Governance / Type */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9494A3] font-semibold">
          Governance / Type
        </label>
        <div className="grid grid-cols-1 gap-1.5 font-mono text-xs">
          {TYPES.map((t) => {
            const active = currentType === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => updateParam("type", t.value)}
                className={`flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? "bg-[#D4AF6A]/10 border-[#D4AF6A]/40 text-[#D4AF6A] font-bold shadow-sm"
                    : "bg-[#181824] border-white/5 text-[#9494A3] hover:text-[#ECECEE] hover:bg-[#1E1E2C]"
                }`}
              >
                <span>{t.label}</span>
                {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Annual Tuition Budget */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9494A3] font-semibold">
          Annual Tuition Budget
        </label>
        <div className="space-y-1.5 font-mono text-xs">
          {BUDGETS.map((b) => {
            const active =
              currentFeesMin === b.min && currentFeesMax === b.max;
            return (
              <button
                key={b.label}
                type="button"
                onClick={() => updateBudget(b.min, b.max)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? "bg-[#D4AF6A]/10 border-[#D4AF6A]/40 text-[#D4AF6A] font-bold shadow-sm"
                    : "bg-[#181824] border-white/5 text-[#9494A3] hover:text-[#ECECEE] hover:bg-[#1E1E2C]"
                }`}
              >
                <span>{b.label}</span>
                {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Student Rating Cutoff */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9494A3] font-semibold">
          Student Rating Cutoff
        </label>
        <div className="space-y-1.5 font-mono text-xs">
          {RATINGS.map((r) => {
            const active = currentRating === r.value;
            return (
              <button
                key={r.label}
                type="button"
                onClick={() => updateParam("ratingMin", r.value)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl border text-left transition-all cursor-pointer ${
                  active
                    ? "bg-[#D4AF6A]/10 border-[#D4AF6A]/40 text-[#D4AF6A] font-bold shadow-sm"
                    : "bg-[#181824] border-white/5 text-[#9494A3] hover:text-[#ECECEE] hover:bg-[#1E1E2C]"
                }`}
              >
                <span>{r.label}</span>
                {active && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Geographic Territory */}
      <div className="space-y-2">
        <label className="block font-mono text-[10px] uppercase tracking-wider text-[#9494A3] font-semibold">
          Geographic Territory
        </label>
        <select
          value={currentState}
          onChange={(e) => updateParam("state", e.target.value)}
          className="w-full px-3 py-2 rounded-xl bg-[#181824] border border-white/10 text-xs text-[#ECECEE] font-mono focus:outline-none focus:border-[#D4AF6A] cursor-pointer"
        >
          {STATES.map((s) => (
            <option key={s} value={s} className="bg-[#181824]">
              {s}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
}

function DirectoryContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { data: session } = useSession();

  const [colleges, setColleges] = useState<College[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 12,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(true);
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [isDemoLoading, setIsDemoLoading] = useState(false);
  const [namesMap, setNamesMap] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchColleges() {
      setLoading(true);
      try {
        const query = searchParams.toString();
        const res = await fetch(`/api/colleges?${query}`);
        if (res.ok) {
          const json = await res.json();
          setColleges(json.data || []);
          setPagination({
            page: json.page || 1,
            limit: json.limit || 12,
            total: json.total || 0,
            totalPages: json.totalPages || 1,
          });

          setNamesMap((prev) => {
            const next = { ...prev };
            (json.data || []).forEach((c: College) => {
              next[c.slug] = c.name;
            });
            return next;
          });
        }
      } catch (err) {
        console.error("Failed to fetch colleges:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchColleges();
  }, [searchParams]);

  const toggleCompare = (slug: string) => {
    setSelectedSlugs((prev) => {
      if (prev.includes(slug)) {
        return prev.filter((s) => s !== slug);
      }
      if (prev.length >= 3) {
        alert("You can select up to 3 institutions for side-by-side comparison.");
        return prev;
      }
      return [...prev, slug];
    });
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.totalPages) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`${pathname}?${params.toString()}`);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handlePreset = (key: string, val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, val);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`);
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
        router.push("/saved");
        router.refresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08080C] pb-32 aurora-glow">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10 py-12 md:py-16 hero-grid-pattern">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="admit-card-pass rounded-3xl p-6 sm:p-10 border border-[#D4AF6A]/30 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="hologram-stamp">
                    <Sparkles
                      className="w-3 h-3 animate-spin"
                      style={{ animationDuration: "6s" }}
                    />
                    <span>★ NIRF AUDITED DISCOVERY PASS ★</span>
                  </span>
                  <span className="font-mono text-[10px] text-[#38BDF8] bg-[#38BDF8]/10 border border-[#38BDF8]/20 px-2 py-0.5 rounded-full font-bold">
                    SESSION 2026–27
                  </span>
                </div>
                <div className="font-mono text-[11px] text-[#9494A3]">
                  National Higher Education Telemetry & Verification Framework •
                  Roll No:{" "}
                  <span className="text-[#ECECEE] font-bold">
                    UNIPULSE-0482
                  </span>
                </div>
              </div>

              {!session && (
                <button
                  type="button"
                  onClick={handleDemoLogin}
                  disabled={isDemoLoading}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#D4AF6A]/10 hover:bg-[#D4AF6A]/20 border border-[#D4AF6A]/40 text-[#D4AF6A] font-mono text-xs font-bold transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-[#D4AF6A]" />
                  <span>
                    {isDemoLoading ? "Logging In..." : "1-Click Evaluator Demo"}
                  </span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center pt-8">
              <div className="lg:col-span-7 space-y-6">
                <div className="space-y-3">
                  <SectionBadge dotColor="gold">
                    Decision Intelligence Platform
                  </SectionBadge>
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#F1F1F5] tracking-tight leading-[1.12]">
                    Benchmark higher education with{" "}
                    <span className="italic text-[#D4AF6A]">audited data</span>,
                    not marketing claims.
                  </h1>
                </div>

                <p className="font-serif italic text-base text-[#9494A3] max-w-2xl leading-relaxed">
                  Compare official NIRF statistics, verifiable placement
                  packages, and transparent fee structures across India&apos;s
                  apex engineering and management institutes.
                </p>

                <div className="grid grid-cols-3 gap-3 pt-2 font-mono text-xs max-w-xl">
                  <div className="p-3.5 rounded-xl bg-[#181824] border border-white/5 space-y-1 shadow-inner">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-[#38BDF8]" />
                      <span>Institutes</span>
                    </div>
                    <div className="font-bold text-[#ECECEE] text-sm">
                      45+ Premier
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181824] border border-white/5 space-y-1 shadow-inner">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1">
                      <TrendingUp className="w-3 h-3 text-[#D4AF6A]" />
                      <span>Salary CTC</span>
                    </div>
                    <div className="font-bold text-[#D4AF6A] text-sm">
                      ₹6.5L – ₹33L
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#181824] border border-white/5 space-y-1 shadow-inner">
                    <div className="text-[10px] text-[#9494A3] uppercase tracking-wider flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#10B981]" />
                      <span>Audit Rule</span>
                    </div>
                    <div className="font-bold text-[#10B981] text-sm">
                      100% NIRF
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-wider text-[#9494A3]">
                    Instant Telemetry Presets:
                  </div>
                  <div className="flex flex-wrap gap-2 font-mono text-xs">
                    <button
                      type="button"
                      onClick={() => handlePreset("search", "IIT")}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1C2A] hover:bg-[#D4AF6A]/20 border border-white/10 hover:border-[#D4AF6A]/40 text-[#ECECEE] transition-all cursor-pointer"
                    >
                      🏆 Top IITs
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset("type", "Govt")}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1C2A] hover:bg-[#D4AF6A]/20 border border-white/10 hover:border-[#D4AF6A]/40 text-[#ECECEE] transition-all cursor-pointer"
                    >
                      🏛️ Govt Flagships
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset("ratingMin", "4.8")}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1C2A] hover:bg-[#D4AF6A]/20 border border-white/10 hover:border-[#D4AF6A]/40 text-[#ECECEE] transition-all cursor-pointer"
                    >
                      ⭐ 4.8+ Apex Tier
                    </button>
                    <button
                      type="button"
                      onClick={() => handlePreset("state", "Maharashtra")}
                      className="px-3 py-1.5 rounded-lg bg-[#1C1C2A] hover:bg-[#D4AF6A]/20 border border-white/10 hover:border-[#D4AF6A]/40 text-[#ECECEE] transition-all cursor-pointer"
                    >
                      📍 Maharashtra
                    </button>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5">
                <ScorecardGauge
                  score={94}
                  placementScore={96}
                  feeValueScore={91}
                  pedigreeScore={95}
                  collegeName="Indian Benchmark"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Discovery Directory */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">
        <SearchBar />

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          <FilterSidebar />

          <main className="flex-1 w-full space-y-6">
            <div className="flex items-center justify-between font-mono text-xs text-[#9494A3]">
              <div>
                Showing{" "}
                <span className="text-[#ECECEE] font-bold">
                  {colleges.length}
                </span>{" "}
                of{" "}
                <span className="text-[#ECECEE] font-bold">
                  {pagination.total}
                </span>{" "}
                institutions
              </div>
              <div>
                Page {pagination.page} of {pagination.totalPages}
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-72 rounded-2xl bg-[#12121A] border border-white/5 animate-pulse"
                  />
                ))}
              </div>
            ) : colleges.length === 0 ? (
              <div className="py-24 text-center rounded-3xl bg-[#12121A] border border-white/10 p-8 space-y-4 shadow-2xl">
                <Building2 className="w-12 h-12 text-[#616172] mx-auto stroke-[1.5]" />
                <h3 className="font-serif text-xl text-[#ECECEE]">
                  No matching institutions found
                </h3>
                <p className="font-serif italic text-xs text-[#9494A3] max-w-sm mx-auto">
                  Try broadening your search query or reset active filters.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="px-4 py-2 rounded-xl bg-[#D4AF6A] text-[#08080C] font-mono text-xs font-bold"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {colleges.map((college) => (
                  <CollegeCard
                    key={college.id}
                    college={college}
                    isCompared={selectedSlugs.includes(college.slug)}
                    onToggleCompare={toggleCompare}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="pt-8 flex items-center justify-center gap-2 font-mono text-xs">
                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1}
                  className="p-2 rounded-xl bg-[#14141E] border border-white/10 disabled:opacity-30 hover:border-[#D4AF6A]/40 transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: pagination.totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = p === pagination.page;
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => handlePageChange(p)}
                      className={`w-9 h-9 rounded-xl font-bold transition-all ${
                        isActive
                          ? "bg-[#D4AF6A] text-[#08080C] shadow-md shadow-[#D4AF6A]/20"
                          : "bg-[#14141E] text-[#9494A3] border border-white/10 hover:border-white/20 hover:text-[#ECECEE]"
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages}
                  className="p-2 rounded-xl bg-[#14141E] border border-white/10 disabled:opacity-30 hover:border-[#D4AF6A]/40 transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </main>
        </div>
      </section>

      {/* Comparison Dock */}
      <CompareDock
        selectedSlugs={selectedSlugs}
        collegeNamesMap={namesMap}
        onRemoveSlug={(slug) =>
          setSelectedSlugs((prev) => prev.filter((s) => s !== slug))
        }
        onClearAll={() => setSelectedSlugs([])}
      />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#08080C] flex items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-[#14141E] animate-pulse border border-[#D4AF6A]/30" />
        </div>
      }
    >
      <DirectoryContent />
    </Suspense>
  );
}
