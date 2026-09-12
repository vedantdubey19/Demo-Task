import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavedComparisons, saveComparison } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-1";

    const savedComparisons = getSavedComparisons(userId);
    return NextResponse.json({ savedComparisons });
  } catch (error) {
    console.error("GET /api/saved/comparisons error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-1";

    const body = await request.json();
    const collegeIds = body?.collegeIds;
    const label = body?.label || "Custom Comparison Matrix";

    if (!Array.isArray(collegeIds) || collegeIds.length === 0) {
      return NextResponse.json(
        { error: "collegeIds must be a non-empty array" },
        { status: 400 }
      );
    }

    const saved = saveComparison(userId, label, collegeIds);
    return NextResponse.json({ savedComparison: saved }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/saved/comparisons error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
