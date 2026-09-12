import { NextRequest, NextResponse } from "next/server";
import { getCollegesByIds } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const collegeIds = body?.collegeIds;

    if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json(
        { error: "collegeIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const colleges = getCollegesByIds(collegeIds);
    return NextResponse.json({ colleges });
  } catch (error) {
    console.error("POST /api/colleges/compare error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
