import { NextRequest, NextResponse } from "next/server";
import { getFilteredColleges } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;

    const search = searchParams.get("search") || undefined;
    const city = searchParams.get("city") || undefined;
    const state = searchParams.get("state") || undefined;
    const type = searchParams.get("type") || undefined;
    const ratingMin = searchParams.get("ratingMin")
      ? parseFloat(searchParams.get("ratingMin")!)
      : undefined;
    const feesMin = searchParams.get("feesMin")
      ? parseFloat(searchParams.get("feesMin")!)
      : undefined;
    const feesMax = searchParams.get("feesMax")
      ? parseFloat(searchParams.get("feesMax")!)
      : undefined;
    const sort = searchParams.get("sort") || undefined;
    const page = searchParams.get("page")
      ? parseInt(searchParams.get("page")!, 10)
      : 1;
    const limit = searchParams.get("limit")
      ? parseInt(searchParams.get("limit")!, 10)
      : 12;

    const result = getFilteredColleges({
      search,
      city,
      state,
      type,
      ratingMin,
      feesMin,
      feesMax,
      sort,
      page,
      limit,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("GET /api/colleges error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
