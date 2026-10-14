"use client";

/* eslint-disable @next/next/no-img-element */

export default function YellowRibbonHeader() {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-1 pb-4 print:pt-0 print:pb-2 select-none">
      <div className="w-full max-w-[620px] sm:max-w-[650px] flex items-center justify-center">
        {/* Official Yellow Ribbon Travels High-Res Header Banner */}
        <img
          src="/brand/yrt-official-quote-header.png"
          alt="Yellow Ribbon Travels - A Premium Travel Agency"
          className="w-full h-auto object-contain max-h-[175px] print:max-h-[160px]"
          loading="eager"
          decoding="sync"
        />
      </div>
    </div>
  );
}
