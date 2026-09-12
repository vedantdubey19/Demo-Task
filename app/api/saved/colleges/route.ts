import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getSavedColleges, saveCollege } from "@/lib/db";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const userId = (session?.user as { id?: string })?.id || "demo-user-1";

    const savedColleges = getSavedColleges(userId);
    return NextResponse.json({ savedColleges });
  } catch (error) {
    console.error("GET /api/saved/colleges error:", error);
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
    const collegeId = body?.collegeId;

    if (!collegeId) {
      return NextResponse.json(
        { error: "collegeId is required" },
        { status: 400 }
      );
    }

    const saved = saveCollege(userId, collegeId);
    return NextResponse.json({ savedCollege: saved }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/saved/colleges error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
