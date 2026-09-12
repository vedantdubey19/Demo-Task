import collegesData from "@/data/colleges.json";
import { College, SavedCollege, SavedComparison, Review } from "./types";

// Master dataset of colleges
const colleges: College[] = collegesData as College[];

// In-memory / runtime store for user reviews, saved colleges, and saved comparisons
interface Store {
  reviews: Record<string, Review[]>; // collegeId or slug -> Review[]
  savedColleges: SavedCollege[];
  savedComparisons: SavedComparison[];
}

const globalForStore = globalThis as unknown as { __store?: Store };

function getInitialStore(): Store {
  // Pre-seed demo user with some shortlist & saved matrix for demo@unipulse.edu
  const demoUserId = "demo-user-1";

  const iitDelhi = colleges.find((c) => c.slug === "iit-delhi") || colleges[0];
  const iitBombay = colleges.find((c) => c.slug === "iit-bombay") || colleges[1];
  const bitsPilani = colleges.find((c) => c.slug === "bits-pilani") || colleges[2];

  const preSavedColleges: SavedCollege[] = [
    {
      id: "sc-1",
      userId: demoUserId,
      collegeId: iitDelhi.id,
      createdAt: new Date().toISOString(),
      college: iitDelhi,
    },
    {
      id: "sc-2",
      userId: demoUserId,
      collegeId: iitBombay.id,
      createdAt: new Date().toISOString(),
      college: iitBombay,
    },
    {
      id: "sc-3",
      userId: demoUserId,
      collegeId: bitsPilani.id,
      createdAt: new Date().toISOString(),
      college: bitsPilani,
    },
  ];

  const preSavedComparisons: SavedComparison[] = [
    {
      id: "comp-1",
      userId: demoUserId,
      label: "Apex Engineering Flagships",
      collegeIds: [iitDelhi.slug, iitBombay.slug, bitsPilani.slug],
      createdAt: new Date().toISOString(),
      colleges: [iitDelhi, iitBombay, bitsPilani],
    },
  ];

  return {
    reviews: {},
    savedColleges: preSavedColleges,
    savedComparisons: preSavedComparisons,
  };
}

const store: Store = (globalForStore.__store ??= getInitialStore());

export function getAllColleges(): College[] {
  return colleges;
}

export function getCollegeBySlug(slug: string): College | null {
  const c = colleges.find((col) => col.slug === slug || col.id === slug);
  if (!c) return null;

  const extraReviews = store.reviews[c.id] || store.reviews[c.slug] || [];
  const mergedReviews = [...(c.reviews || []), ...extraReviews];

  return {
    ...c,
    reviews: mergedReviews,
    _count: {
      courses: c.courses?.length || c._count?.courses || 0,
      placements: c.placements?.length || c._count?.placements || 0,
      reviews: mergedReviews.length,
    },
  };
}

export function getCollegesByIds(slugsOrIds: string[]): College[] {
  const result: College[] = [];
  for (const item of slugsOrIds) {
    const col = getCollegeBySlug(item);
    if (col) {
      result.push(col);
    }
  }
  return result;
}

export interface CollegeQueryParams {
  search?: string;
  city?: string;
  state?: string;
  type?: string;
  ratingMin?: number;
  feesMin?: number;
  feesMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
}

export function getFilteredColleges(params: CollegeQueryParams) {
  let list = [...colleges];

  // Search filter (name, city, state)
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    list = list.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q) ||
        c.state.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q)
    );
  }

  // City filter
  if (params.city && params.city !== "All") {
    const city = params.city.toLowerCase();
    list = list.filter((c) => c.city.toLowerCase() === city);
  }

  // State filter
  if (params.state && params.state !== "All") {
    list = list.filter((c) => c.state.toLowerCase() === params.state?.toLowerCase());
  }

  // Type filter
  if (params.type && params.type !== "All") {
    list = list.filter((c) => c.type.toLowerCase() === params.type?.toLowerCase());
  }

  // Rating Min
  if (params.ratingMin) {
    list = list.filter((c) => c.rating >= params.ratingMin!);
  }

  // Fees Min
  if (params.feesMin !== undefined && params.feesMin > 0) {
    list = list.filter((c) => c.feesMax >= params.feesMin!);
  }

  // Fees Max
  if (params.feesMax !== undefined && params.feesMax > 0) {
    list = list.filter((c) => c.feesMin <= params.feesMax!);
  }

  // Sorting
  const sort = params.sort || "rating";
  if (sort === "rating") {
    list.sort((a, b) => b.rating - a.rating);
  } else if (sort === "feesMin") {
    list.sort((a, b) => a.feesMin - b.feesMin);
  } else if (sort === "feesMax") {
    list.sort((a, b) => b.feesMax - a.feesMax);
  } else if (sort === "establishedYear") {
    list.sort((a, b) => a.establishedYear - b.establishedYear);
  }

  const total = list.length;
  const page = Math.max(1, Number(params.page) || 1);
  const limit = Math.max(1, Number(params.limit) || 12);
  const totalPages = Math.ceil(total / limit) || 1;

  const start = (page - 1) * limit;
  const paginatedData = list.slice(start, start + limit);

  return {
    data: paginatedData,
    total,
    page,
    totalPages,
    limit,
  };
}

// Saved Colleges
export function getSavedColleges(userId: string): SavedCollege[] {
  return store.savedColleges.filter((sc) => sc.userId === userId);
}

export function saveCollege(userId: string, collegeIdOrSlug: string): SavedCollege {
  const existing = store.savedColleges.find(
    (sc) =>
      sc.userId === userId &&
      (sc.collegeId === collegeIdOrSlug || sc.college.slug === collegeIdOrSlug)
  );
  if (existing) return existing;

  const college = getCollegeBySlug(collegeIdOrSlug);
  if (!college) {
    throw new Error("College not found");
  }

  const newSaved: SavedCollege = {
    id: "sc-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    userId,
    collegeId: college.id,
    createdAt: new Date().toISOString(),
    college,
  };

  store.savedColleges.unshift(newSaved);
  return newSaved;
}

export function unsaveCollege(userId: string, targetIdOrSlug: string): boolean {
  const index = store.savedColleges.findIndex(
    (sc) =>
      sc.userId === userId &&
      (sc.id === targetIdOrSlug ||
        sc.collegeId === targetIdOrSlug ||
        sc.college.slug === targetIdOrSlug)
  );

  if (index !== -1) {
    store.savedColleges.splice(index, 1);
    return true;
  }
  return false;
}

// Saved Comparisons
export function getSavedComparisons(userId: string): SavedComparison[] {
  return store.savedComparisons.filter((sc) => sc.userId === userId);
}

export function saveComparison(
  userId: string,
  label: string,
  collegeIds: string[]
): SavedComparison {
  const collegesList = getCollegesByIds(collegeIds);

  const newComp: SavedComparison = {
    id: "comp-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    userId,
    label: label.trim() || "Custom Comparison Matrix",
    collegeIds,
    createdAt: new Date().toISOString(),
    colleges: collegesList,
  };

  store.savedComparisons.unshift(newComp);
  return newComp;
}

export function deleteComparison(userId: string, comparisonId: string): boolean {
  const index = store.savedComparisons.findIndex(
    (sc) => sc.userId === userId && sc.id === comparisonId
  );
  if (index !== -1) {
    store.savedComparisons.splice(index, 1);
    return true;
  }
  return false;
}

// Reviews
export function addReview(slug: string, review: { rating: number; title: string; body: string; authorName?: string; authorRole?: string }) {
  const college = getCollegeBySlug(slug);
  if (!college) {
    throw new Error("College not found");
  }

  const newRev: Review = {
    id: "rev-" + Date.now() + "-" + Math.random().toString(36).substring(2, 7),
    collegeId: college.id,
    rating: review.rating,
    title: review.title,
    body: review.body,
    authorName: review.authorName || "Verified Candidate",
    authorRole: review.authorRole || "Class of 2024",
    createdAt: new Date().toISOString(),
  };

  if (!store.reviews[college.id]) {
    store.reviews[college.id] = [];
  }
  store.reviews[college.id].unshift(newRev);
  return newRev;
}
