"use client";

import { useState, useEffect, useRef } from "react";

interface HeroVideoBackgroundProps {
  videos: string[];
  poster?: string;
}

const DEFAULT_VIDEOS = [
  "https://videos.pexels.com/video-files/31733343/13520588_1920_1080_30fps.mp4",
  "https://videos.pexels.com/video-files/4010511/4010511-hd_1920_1080_25fps.mp4",
  "https://videos.pexels.com/video-files/4010941/4010941-uhd_2560_1440_25fps.mp4",
  "https://videos.pexels.com/video-files/37999130/16126233_2560_1440_30fps.mp4",
  "https://videos.pexels.com/video-files/29045884/12556561_2560_1440_60fps.mp4",
];

export default function HeroVideoBackground({
  videos,
  poster = "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=2400&q=85",
}: HeroVideoBackgroundProps) {
  const validVideos = (videos?.filter((v) => Boolean(v?.trim())) || []).slice(0, 5);
  const playlist = validVideos.length > 0 ? validVideos : DEFAULT_VIDEOS;

  const [activeIndex, setActiveIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  // Ensure activeIndex stays in bounds if playlist changes
  useEffect(() => {
    if (activeIndex >= playlist.length) {
      setActiveIndex(0);
    }
  }, [playlist.length, activeIndex]);

  // Play the active video from the start and pause inactive ones
  useEffect(() => {
    videoRefs.current.forEach((videoEl, idx) => {
      if (!videoEl) return;
      if (idx === activeIndex) {
        videoEl.currentTime = 0;
        videoEl.play().catch(() => {
          // Autoplay fallback if browser requires interaction
        });
      } else {
        videoEl.pause();
      }
    });
  }, [activeIndex, playlist]);

  // Advance to the next video when the current clip finishes
  const handleVideoEnded = () => {
    if (playlist.length > 1) {
      setActiveIndex((prev) => (prev + 1) % playlist.length);
    }
  };

  return (
    <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
      {playlist.map((videoUrl, idx) => {
        const isActive = idx === activeIndex;
        return (
          <video
            key={`${idx}-${videoUrl}`}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={videoUrl}
            autoPlay={isActive}
            loop={playlist.length === 1}
            muted
            playsInline
            preload={idx === 0 || idx === 1 ? "auto" : "metadata"}
            poster={idx === 0 ? poster : undefined}
            onEnded={isActive ? handleVideoEnded : undefined}
            onError={() => {
              // Skip broken video URL automatically if multiple exist
              if (isActive && playlist.length > 1) {
                setActiveIndex((prev) => (prev + 1) % playlist.length);
              }
            }}
            className={`absolute inset-0 w-full h-full object-cover object-center scale-105 transition-opacity duration-1000 ease-in-out ${
              isActive ? "opacity-100 z-[1]" : "opacity-0 z-0"
            }`}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        );
      })}
    </div>
  );
}
