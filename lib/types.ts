export interface Course {
  id: string;
  collegeId: string;
  name: string;
  duration: string;
  feesTotal: number;
  seats: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Placement {
  id: string;
  collegeId: string;
  year: number;
  avgPackage: number;
  highestPackage: number;
  medianPackage: number;
  placementRate: number;
  createdAt?: string;
}

export interface Review {
  id: string;
  collegeId: string;
  userId?: string;
  rating: number;
  title: string;
  body: string;
  authorName?: string;
  authorRole?: string;
  createdAt: string;
}

export interface College {
  id: string;
  slug: string;
  name: string;
  city: string;
  state: string;
  type: string;
  establishedYear: number;
  rating: number;
  feesMin: number;
  feesMax: number;
  logoUrl?: string | null;
  bannerUrl?: string | null;
  overview: string;
  createdAt: string;
  updatedAt: string;
  courses?: Course[];
  placements?: Placement[];
  reviews?: Review[];
  _count?: {
    courses: number;
    placements: number;
    reviews: number;
  };
}

export interface SavedCollege {
  id: string;
  userId: string;
  collegeId: string;
  createdAt: string;
  college: College;
}

export interface SavedComparison {
  id: string;
  userId: string;
  label: string;
  collegeIds: string[];
  createdAt: string;
  colleges?: College[];
}

export interface CollegesResponse {
  data: College[];
  total: number;
  page: number;
  totalPages: number;
  limit?: number;
}
