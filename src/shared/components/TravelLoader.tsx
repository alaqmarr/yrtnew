"use client";

import { motion } from "framer-motion";
import { Plane, Compass, Sparkles } from "lucide-react";

interface TravelLoaderProps {
  message?: string;
  submessage?: string;
}

export default function TravelLoader({
  message = "Yellow Ribbon Travels",
  submessage = "Preparing your bespoke travel experience...",
}: TravelLoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[360px] p-8 text-center select-none">
      {/* Flight & Compass Orbital Animation Container */}
      <div className="relative w-40 h-40 flex items-center justify-center mb-8">
        {/* Outer Pulsing Golden Orbit */}
        <div className="absolute inset-0 rounded-full border border-amber-300/40 animate-ping opacity-25" />
        <div className="absolute inset-2 rounded-full border border-dashed border-amber-400/60 animate-spin [animation-duration:18s]" />
        
        {/* Inner Glowing Cyan/Emerald Atmosphere */}
        <div className="absolute inset-6 rounded-full bg-gradient-to-tr from-amber-400/10 via-cyan-400/15 to-rose-400/10 blur-xl animate-pulse" />
        <div className="absolute inset-8 rounded-full border border-slate-200/90 bg-white/90 backdrop-blur-md shadow-card flex items-center justify-center">
          <Compass className="w-10 h-10 text-amber-500 animate-spin [animation-duration:12s]" />
        </div>

        {/* Orbiting Airplane */}
        <motion.div
          className="absolute inset-0 flex items-start justify-center"
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 4.5,
            ease: "linear",
          }}
        >
          <div className="-mt-3 flex flex-col items-center">
            <div className="w-8 h-8 rounded-full bg-amber-500 text-white shadow-md flex items-center justify-center rotate-45">
              <Plane className="w-4 h-4 fill-white text-white" />
            </div>
            {/* Jet contrail */}
            <div className="w-1 h-6 bg-gradient-to-b from-amber-400/80 to-transparent blur-[1px]" />
          </div>
        </motion.div>

        {/* Little decorative stars / destinations */}
        <div className="absolute top-2 right-2 text-cyan-500 animate-bounce">
          <Sparkles className="w-3.5 h-3.5" />
        </div>
        <div className="absolute bottom-3 left-3 text-rose-500 animate-pulse">
          <Sparkles className="w-3 h-3" />
        </div>
      </div>

      {/* Brand Title with Cursive Calligraphy */}
      <h3 className="font-cursive text-3xl sm:text-4xl text-amber-600 font-normal tracking-wide drop-shadow-xs mb-2">
        {message}
      </h3>

      {/* Subtitle with travel rhythm */}
      <p className="text-xs sm:text-sm font-semibold tracking-wider text-slate-500 uppercase">
        {submessage}
      </p>

      {/* Progress Dots */}
      <div className="flex items-center gap-1.5 mt-5">
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-bounce [animation-delay:-0.3s]" />
        <span className="w-2 h-2 rounded-full bg-cyan-500 animate-bounce [animation-delay:-0.15s]" />
        <span className="w-2 h-2 rounded-full bg-rose-500 animate-bounce" />
      </div>
    </div>
  );
}
