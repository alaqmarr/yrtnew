import { NextRequest, NextResponse } from "next/server";
import { requireStaffOrAdmin } from "@/infrastructure/auth/guards";
import { blogService } from "@/modules/blogs/service/blog.service";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const featuredOnly = searchParams.get("featured") === "true";
    const tag = searchParams.get("tag") || undefined;

    const blogs = await blogService.getAllBlogs({ featuredOnly, tag });
    return NextResponse.json(blogs);
  } catch (error) {
    console.error("GET /api/blogs error:", error);
    return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { errorResponse } = await requireStaffOrAdmin();
    if (errorResponse) return errorResponse;

    const body = await req.json();
    const created = await blogService.createBlog(body);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("POST /api/blogs error:", error);
    return NextResponse.json(
      { error: (error as Error).message || "Failed to create blog" },
      { status: 500 }
    );
  }
}
