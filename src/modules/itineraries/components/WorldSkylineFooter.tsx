"use client";

/* eslint-disable @next/next/no-img-element */

export default function WorldSkylineFooter() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-6 pb-2 print:pt-4 print:pb-0 select-none">
      <div className="w-full max-w-[460px] sm:max-w-[500px] flex items-center justify-center">
        {/* Official Colourful World Landmarks Skyline Strip */}
        <img
          src="/brand/yrt-official-quote-footer.png"
          alt="World Landmarks Skyline - Yellow Ribbon Travels"
          className="w-full h-auto object-contain max-h-[65px] print:max-h-[55px]"
          loading="eager"
          decoding="sync"
        />
      </div>
    </div>
  );
}
