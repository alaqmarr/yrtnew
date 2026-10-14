import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { galleryLikeRepository } from "@/modules/gallery/repository/gallery-like.repository";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Authentication required", message: "Please sign in to like photos and save them to your travel favorites." },
        { status: 401 }
      );
    }

    const { id } = await params;
    const userId = (session.user as { id?: string }).id || session.user.email!;
    const result = await galleryLikeRepository.toggleLike(id, userId);

    return NextResponse.json({
      success: true,
      liked: result.liked,
      count: result.count,
    });
  } catch (err: unknown) {
    console.error("Gallery toggle like error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
