import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/infrastructure/auth/auth-options";
import { galleryLikeRepository } from "@/modules/gallery/repository/gallery-like.repository";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const counts = await galleryLikeRepository.getLikeCounts();

    let userLikedIds: string[] = [];
    if (session?.user) {
      const userId = (session.user as { id?: string }).id || session.user.email!;
      userLikedIds = await galleryLikeRepository.getUserLikes(userId);
    }

    return NextResponse.json({
      counts,
      userLikedIds,
      isAuthenticated: Boolean(session?.user),
    });
  } catch (err: unknown) {
    console.error("Gallery likes bulk error:", err);
    return NextResponse.json(
      { error: (err as Error).message || "Internal server error" },
      { status: 500 }
    );
  }
}
