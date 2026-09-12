import { NextRequest, NextResponse } from "next/server";
import { addReview } from "@/lib/db";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const body = await request.json();

    if (!body || !body.rating || !body.title || !body.body) {
      return NextResponse.json(
        { error: "Rating, title, and review body are required." },
        { status: 400 }
      );
    }

    const review = addReview(slug, {
      rating: Number(body.rating),
      title: String(body.title),
      body: String(body.body),
      authorName: body.authorName,
      authorRole: body.authorRole,
    });

    return NextResponse.json({ review }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/colleges/[slug]/reviews error:", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
