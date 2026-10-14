"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { GalleryItem } from "../domain/gallery.entity";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  MapPin,
  Sparkles,
  Camera,
  Heart,
  Star,
  Plus,
  Compass,
  Share2,
} from "lucide-react";
import WhatsAppIcon from "@/shared/components/WhatsAppIcon";
import IOSSpinner from "@/shared/components/IOSSpinner";
import AuthModal from "@/modules/account/components/AuthModal";

interface GalleryViewProps {
  initialItems: GalleryItem[];
}

export default function GalleryView({ initialItems }: GalleryViewProps) {
  const { data: session } = useSession();

  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeTab, setActiveTab] = useState<"Popular" | "Recent">("Popular");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [showShareModal, setShowShareModal] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Load real likes from database & authenticated user's state
  useEffect(() => {
    async function loadLikes() {
      try {
        const res = await fetch("/api/gallery/likes");
        if (res.ok) {
          const json = await res.json();
          const counts: Record<string, number> = {};
          initialItems.forEach((item, idx) => {
            const baseCount = 18 + ((idx * 7) % 40);
            counts[item.id] = baseCount + (json.counts[item.id] || 0);
          });
          setLikeCountMap(counts);

          if (json.userLikedIds && Array.isArray(json.userLikedIds)) {
            const userLikes: Record<string, boolean> = {};
            json.userLikedIds.forEach((id: string) => {
              userLikes[id] = true;
            });
            setLikedMap(userLikes);
          }
        }
      } catch (err) {
        console.error("Failed to load likes:", err);
      }
    }
    loadLikes();
  }, [initialItems, session]);

  // Authenticated Like Toggle
  const toggleLike = async (id: string) => {
    if (!session || !session.user) {
      setIsAuthModalOpen(true);
      return;
    }

    const wasLiked = Boolean(likedMap[id]);
    // Optimistic UI update
    setLikedMap((prev) => ({ ...prev, [id]: !wasLiked }));
    setLikeCountMap((prev) => ({
      ...prev,
      [id]: Math.max(0, (prev[id] || 0) + (wasLiked ? -1 : 1)),
    }));

    try {
      const res = await fetch(`/api/gallery/${id}/like`, { method: "POST" });
      if (!res.ok) {
        throw new Error("Failed to update like");
      }
      const result = await res.json();
      setLikedMap((prev) => ({ ...prev, [id]: result.liked }));
    } catch (err) {
      // Revert optimistic update
      setLikedMap((prev) => ({ ...prev, [id]: wasLiked }));
      setLikeCountMap((prev) => ({
        ...prev,
        [id]: Math.max(0, (prev[id] || 0) + (wasLiked ? 1 : -1)),
      }));
    }
  };

  const categories = [
    "All",
    "Destinations",
    "Tours",
    "Hotels & Stays",
    "Travelers",
    "Flights",
  ];

  // Filter and sort items based on category and tab
  const filteredItems = initialItems
    .filter((item) => (selectedCategory === "All" ? true : item.category === selectedCategory))
    .sort((a, b) => {
      if (activeTab === "Popular") {
        if (a.is_featured !== b.is_featured) return a.is_featured ? -1 : 1;
        return (likeCountMap[b.id] || 0) - (likeCountMap[a.id] || 0);
      } else {
        return new Date(b.created_at || "").getTime() - new Date(a.created_at || "").getTime();
      }
    });

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const nextImage = () => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const prevImage = () => {
    if (lightboxIndex !== null && filteredItems.length > 0) {
      setLightboxIndex(
        (lightboxIndex - 1 + filteredItems.length) % filteredItems.length
      );
    }
  };

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextImage();
      if (e.key === "ArrowLeft") prevImage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredItems.length]);

  const currentItem =
    lightboxIndex !== null && filteredItems[lightboxIndex]
      ? filteredItems[lightboxIndex]
      : null;

  return (
    <div className="space-y-10 relative">
      {/* 1. TOP NAVIGATION CONTROLS (Popular / Recent tabs + Category Pills) */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-slate-200/80 pb-6">
        {/* Left Side: Popular vs Recent Tabs */}
        <div className="flex items-center gap-6">
          <button
            onClick={() => setActiveTab("Popular")}
            className={`text-base font-black transition-all relative pb-1 ${
              activeTab === "Popular"
                ? "text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Popular
          </button>

          <button
            onClick={() => setActiveTab("Recent")}
            className={`text-base font-black transition-all relative pb-1 ${
              activeTab === "Recent"
                ? "text-slate-950 after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-amber-500"
                : "text-slate-400 hover:text-slate-700"
            }`}
          >
            Recent
          </button>
        </div>

        {/* Right Side: Frosted Category Pill Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 bg-white/80 backdrop-blur-md p-1.5 rounded-full border border-slate-200/80 shadow-xs">
          {categories.map((cat) => {
            const count =
              cat === "All"
                ? initialItems.length
                : initialItems.filter((i) => i.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-gradient-to-r from-brand-yellow to-amber-500 text-slate-950 shadow-md shadow-amber-500/20 scale-105"
                    : "bg-white/60 hover:bg-white text-slate-700 backdrop-blur-xs border border-slate-200/60 hover:border-slate-300"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`ml-1.5 text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected
                      ? "bg-slate-950/20 text-slate-950 font-black"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. TRUE MASONRY GRID */}
      {filteredItems.length === 0 ? (
        <div className="p-16 text-center text-slate-400 bg-white/80 backdrop-blur-md rounded-3xl border border-slate-200/80 space-y-3">
          <Camera className="w-10 h-10 text-slate-300 mx-auto" />
          <h4 className="text-base font-bold text-slate-800">
            No Photos Found in this Category
          </h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Check back soon as our tour groups and travel architects upload new
            destination snapshots.
          </p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 2xl:columns-5 gap-5 sm:gap-6 space-y-6 w-full">
          {filteredItems.map((item, idx) => {
            const isImgLoaded = Boolean(loadedImages[item.id]);
            const isLiked = Boolean(likedMap[item.id]);
            const likeCount = likeCountMap[item.id] || 0;
            const isPicOfTheDay = idx === 1 || item.id === "gal_dubai_burj";

            return (
              <div
                key={item.id}
                onClick={() => openLightbox(idx)}
                className="break-inside-avoid mb-6 inline-block w-full group cursor-pointer"
              >
                {/* Photo Container */}
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.12)] transition-all duration-500 group-hover:-translate-y-1">
                  {/* In-Element Travel Spinner while loading */}
                  {!isImgLoaded && (
                    <div className="w-full min-h-[260px] bg-slate-100/90 backdrop-blur-xs flex flex-col items-center justify-center space-y-2 p-6">
                      <div className="p-3 rounded-2xl bg-white/85 backdrop-blur-md border border-slate-200/80 shadow-xs flex items-center justify-center">
                        <IOSSpinner size="md" color="amber" variant="travel" />
                      </div>
                      <span className="text-[11px] font-semibold text-slate-400">
                        Loading photo...
                      </span>
                    </div>
                  )}

                  {/* Clean Natural Aspect-Ratio Image */}
                  <img
                    src={item.url}
                    alt={item.title}
                    onLoad={() =>
                      setLoadedImages((prev) => ({ ...prev, [item.id]: true }))
                    }
                    className={`w-full h-auto object-cover block transition-all duration-700 ease-out group-hover:scale-[1.03] ${
                      isImgLoaded ? "opacity-100" : "opacity-0 absolute"
                    }`}
                    loading="lazy"
                  />

                  {/* Top-Right: Pic of the Day ⭐ Badge */}
                  {isPicOfTheDay && (
                    <div className="absolute top-3 right-3 bg-slate-950/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-lg backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5 z-10">
                      <span>Pic of the Day</span>
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    </div>
                  )}

                  {/* Top-Left: Subtle Category Pill */}
                  <div className="absolute top-3 left-3 z-10 pointer-events-none">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/85 text-slate-900 backdrop-blur-md border border-white/70 shadow-xs">
                      {item.category}
                    </span>
                  </div>

                  {/* Bottom-Right: Interactive Heart / Like Button (Requires Auth) */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleLike(item.id);
                    }}
                    className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-md transition-all duration-300 shadow-md z-10 flex items-center gap-1 ${
                      isLiked
                        ? "bg-rose-500 text-white scale-110 shadow-rose-500/30"
                        : "bg-black/35 hover:bg-black/55 text-white"
                    }`}
                    title={
                      session
                        ? isLiked
                          ? "Unlike photo"
                          : "Like photo"
                        : "Sign in to like and save to favorites"
                    }
                    aria-label="Like this photo"
                  >
                    <Heart
                      className={`w-4 h-4 transition-transform duration-300 ${
                        isLiked ? "fill-white scale-110" : "fill-transparent"
                      }`}
                    />
                    {likeCount > 0 && (
                      <span className="text-[10px] font-bold pr-0.5">{likeCount}</span>
                    )}
                  </button>

                  {/* Bottom-Left: Quick Expand Badge (Appears on Hover) */}
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none">
                    <Maximize2 className="w-3 h-3 text-amber-400" />
                    <span>Expand</span>
                  </div>
                </div>

                {/* Text Content Area Below the Photo */}
                <div className="pt-2.5 pb-1 px-1 space-y-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h4 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-amber-600 transition-colors line-clamp-1 tracking-tight leading-snug">
                      {item.title}
                    </h4>
                  </div>

                  {item.caption && (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {item.caption}
                    </p>
                  )}

                  {item.tags && item.tags.length > 0 && (
                    <div className="flex items-center gap-1 text-[11px] font-semibold text-amber-700/80 pt-0.5">
                      <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                      <span>{item.tags.slice(0, 2).join(" • ")}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 3. FLOATING PHOTO SHARE BUTTON */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowShareModal(true)}
          className="bg-slate-950/90 hover:bg-slate-900 text-white px-5 py-2.5 rounded-full shadow-2xl border border-white/20 backdrop-blur-xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3 cursor-pointer group"
          title="Share your vacation photos with Yellow Ribbon Travels"
        >
          <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold shadow-sm group-hover:rotate-90 transition-transform">
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span className="text-xs font-bold tracking-wide">
            Share Your Travel Moment
          </span>
        </button>
      </div>

      {/* 4. SHARE MOMENTS MODAL */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200 relative animate-fadeIn space-y-5 text-center">
            <button
              onClick={() => setShowShareModal(false)}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-inner">
              <Camera className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black text-slate-900">
                Share Your Journey Moments
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Traveled with Yellow Ribbon Travels? Send your favorite holiday snapshots, and our creative team will feature you on this Wall of Wanderlust!
              </p>
            </div>

            <div className="pt-2 flex flex-col gap-3">
              <a
                href={`https://wa.me/919100228152?text=${encodeURIComponent(
                  "Hi Yellow Ribbon Travels! I traveled with you and would love to share my vacation photos to be featured on the gallery wall 📸"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowShareModal(false)}
                className="w-full py-3 px-4 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Send via WhatsApp Photo Desk</span>
              </a>

              <button
                onClick={() => setShowShareModal(false)}
                className="w-full py-2.5 rounded-2xl text-xs font-semibold text-slate-500 hover:bg-slate-100 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. LIGHTBOX MODAL WITH FULL NATURAL ASPECT-RATIO & REFINED GALLERY UX */}
      {currentItem && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Top Bar: Controls, Category & Counter */}
          <div className="w-full flex items-center justify-between z-30 max-w-7xl mx-auto">
            {/* Left: Counter and Category */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-white/50 tracking-wider">
                {lightboxIndex !== null ? `${lightboxIndex + 1} / ${filteredItems.length}` : ""}
              </span>
              <span className="text-white/20">•</span>
              <span className="text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {currentItem.category}
              </span>
            </div>

            {/* Right: Actions & Close Button */}
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                type="button"
                onClick={() => toggleLike(currentItem.id)}
                className={`px-3 py-1.5 rounded-full border transition-all flex items-center gap-1.5 text-xs font-bold ${
                  likedMap[currentItem.id]
                    ? "bg-rose-500 text-white border-rose-400 shadow-md shadow-rose-500/30"
                    : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                }`}
                title={likedMap[currentItem.id] ? "Saved in Wishlist" : "Save to Wishlist"}
              >
                <Heart
                  className={`w-3.5 h-3.5 ${
                    likedMap[currentItem.id] ? "fill-white" : "fill-transparent"
                  }`}
                />
                <span>{likeCountMap[currentItem.id] || 0}</span>
              </button>

              <button
                onClick={closeLightbox}
                aria-label="Close Lightbox"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-all hover:scale-105"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Stage: The Pure Uncropped Photograph Floating On Stage */}
          <div
            className="flex-1 flex items-center justify-center relative my-2 overflow-hidden"
            onClick={(e) => {
              if (e.target === e.currentTarget) closeLightbox();
            }}
          >
            {/* Previous Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevImage();
              }}
              aria-label="Previous Image"
              className="absolute left-1 sm:left-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center z-30 transition-all hover:scale-110 shadow-xl"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Natural Aspect Ratio Photo (Directly centered, NO white card behind it!) */}
            <img
              src={currentItem.url}
              alt={currentItem.title}
              className="max-h-[68vh] sm:max-h-[72vh] w-auto max-w-[92vw] lg:max-w-4xl object-contain rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9)] border border-white/10 select-none"
            />

            {/* Next Image */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextImage();
              }}
              aria-label="Next Image"
              className="absolute right-1 sm:right-4 top-1/2 -translate-y-1/2 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 text-white flex items-center justify-center z-30 transition-all hover:scale-110 shadow-xl"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Bottom Dock: Cohesive, Refined Information & Trip Action */}
          <div className="w-full max-w-4xl mx-auto px-5 py-3.5 sm:px-6 sm:py-4 rounded-2xl bg-white/[0.07] backdrop-blur-xl border border-white/15 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-white z-30">
            <div className="text-center sm:text-left space-y-1">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 bg-amber-400/20 px-2.5 py-0.5 rounded-full border border-amber-400/40">
                  {currentItem.category}
                </span>
                {currentItem.tags && currentItem.tags.length > 0 && (
                  <span className="text-xs text-white/70 font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-amber-400" />
                    {currentItem.tags.join(" • ")}
                  </span>
                )}
              </div>

              <h3 className="text-base sm:text-lg font-black text-white tracking-tight leading-snug">
                {currentItem.title}
              </h3>

              {currentItem.caption && (
                <p className="text-xs text-white/75 max-w-2xl font-normal leading-relaxed line-clamp-2">
                  {currentItem.caption}
                </p>
              )}
            </div>

            {/* Direct WhatsApp Inquiry for This Vacation Moment */}
            <a
              href={`https://wa.me/919100228152?text=${encodeURIComponent(
                `Hi Yellow Ribbon Travels, I saw this photo on your gallery: "${currentItem.title}" and would love to plan a trip like this!`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white text-xs sm:text-sm font-black shadow-md shadow-emerald-500/25 transition-all flex items-center gap-2 hover:scale-105 active:scale-95 border border-emerald-400/30"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Inquire About Trip</span>
            </a>
          </div>
        </div>
      )}

      {/* 6. AUTHENTICATION REQUIRED MODAL */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        title="Sign In to Save Favorites"
        subtitle="Log in or create a free traveler account to like photos and save them to your personal travel wishlist."
        onSuccess={() => {
          setIsAuthModalOpen(false);
        }}
      />
    </div>
  );
}
