"use client";

import { useMemo } from "react";
import YellowRibbonHeader from "./YellowRibbonHeader";
import WorldSkylineFooter from "./WorldSkylineFooter";
import { Itinerary, ItineraryDay, ItineraryAccommodation, CostBreakdownItem } from "../domain/itinerary.entity";

interface OfficialQuoteDocumentProps {
  itinerary: Itinerary;
}

export default function OfficialQuoteDocument({ itinerary }: OfficialQuoteDocumentProps) {
  // Parse Days
  const days: ItineraryDay[] = useMemo(() => {
    try {
      return JSON.parse(itinerary.days_json || "[]");
    } catch {
      return [];
    }
  }, [itinerary.days_json]);

  // Parse Accommodations
  const accommodations: ItineraryAccommodation[] = useMemo(() => {
    try {
      const parsed = JSON.parse(itinerary.accommodations_json || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }

    // Default fallback accommodation if none in accommodations_json
    return [
      {
        nights: "Entire Stay",
        city: itinerary.destination,
        hotel_name: itinerary.hotel_details || "Premium Handpicked Stays",
        meal_plan: "Breakfast (CP)",
        room_type: "Classic Room",
        occupancy: itinerary.pax_label || `${itinerary.travelers_count || 2} Adults`,
      },
    ];
  }, [itinerary.accommodations_json, itinerary.destination, itinerary.hotel_details, itinerary.pax_label, itinerary.travelers_count]);

  // Parse Package Highlights
  const highlights: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(itinerary.package_highlights_json || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }

    try {
      const inclusions = JSON.parse(itinerary.inclusions_json || "[]");
      if (Array.isArray(inclusions) && inclusions.length > 0) return inclusions;
    } catch {
      // fallback
    }

    return [
      "Scenic road journeys & mountain sightseeing",
      "Handpicked clean sanitized private vehicle throughout",
      "Verified premium accommodations with daily breakfast",
      "24/7 dedicated concierge assistance",
    ];
  }, [itinerary.package_highlights_json, itinerary.inclusions_json]);

  // Parse Notes
  const notes: string[] = useMemo(() => {
    try {
      const parsed = JSON.parse(itinerary.important_notes_json || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }

    if (itinerary.notes) {
      return [itinerary.notes];
    }

    return [
      "Note: Lunch & dinner are not included, allowing guests to explore local restaurants and authentic regional cuisine according to their preference.",
      "Optional activities such as boating, adventure sports, and monument entry tickets not specifically mentioned in inclusions are payable additionally.",
    ];
  }, [itinerary.important_notes_json, itinerary.notes]);

  // Parse Custom Cost Breakdown
  const customBreakdownItems: CostBreakdownItem[] = useMemo(() => {
    try {
      const parsed = JSON.parse(itinerary.cost_breakdown_json || "[]");
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
    return [];
  }, [itinerary.cost_breakdown_json]);

  // Split days into batches for clean page distribution (approx 3 days per page)
  const dayBatches = useMemo(() => {
    const batches: ItineraryDay[][] = [];
    const chunkSize = 3;
    for (let i = 0; i < days.length; i += chunkSize) {
      batches.push(days.slice(i, i + chunkSize));
    }
    return batches.length > 0 ? batches : [[]];
  }, [days]);

  // Format Price display
  const priceDisplay = useMemo(() => {
    if (itinerary.price_per_person && itinerary.price_per_person > 0) {
      return `Amount: ₹${itinerary.price_per_person.toLocaleString("en-IN")} /- per person`;
    }
    return `Amount: ₹${itinerary.total_price.toLocaleString("en-IN")} /- total package`;
  }, [itinerary.price_per_person, itinerary.total_price]);

  return (
    <div className="quote-sheet-wrapper w-full flex flex-col items-center">
      {/* ========================================================
          PAGE 1: PACKAGE OVERVIEW
      ======================================================== */}
      <div className="quote-a4-page w-full max-w-[800px] min-h-[1100px] bg-white border border-slate-200/90 shadow-2xl print:border-none print:shadow-none p-10 sm:p-14 print:p-8 flex flex-col justify-between my-4 print:my-0 page-break-after">
        <div>
          {/* Official Banner Header */}
          <YellowRibbonHeader />

          {/* Section: Package Overview */}
          <div className="mt-8 space-y-0">
            {/* Pink Header Bar */}
            <div className="w-full bg-[#FCE4EC] border border-[#F8BBD0] py-3.5 px-6 text-center">
              <h2 className="text-[#9D174D] font-extrabold text-base sm:text-lg tracking-wide uppercase">
                Package Overview
              </h2>
            </div>

            {/* 2-Column Overview Table */}
            <table className="w-full border-collapse border border-[#CBD5E1] text-xs sm:text-sm font-sans">
              <tbody>
                {/* Destination */}
                <tr className="border-b border-[#CBD5E1] bg-white">
                  <td className="w-2/5 p-4 sm:p-5 font-bold text-slate-800 text-center border-r border-[#CBD5E1]">
                    Destination
                  </td>
                  <td className="w-3/5 p-4 sm:p-5 text-center font-black text-slate-950">
                    <mark className="bg-yellow-200 text-slate-950 px-3 py-1 rounded font-black tracking-wide inline-block shadow-xs">
                      {itinerary.destination}
                    </mark>
                  </td>
                </tr>

                {/* Start Date */}
                <tr className="border-b border-[#CBD5E1] bg-[#DCE4EC]">
                  <td className="w-2/5 p-4 sm:p-5 font-bold text-slate-800 text-center border-r border-[#CBD5E1]">
                    Start Date
                  </td>
                  <td className="w-3/5 p-4 sm:p-5 text-center font-extrabold text-slate-900 tracking-wide uppercase">
                    {itinerary.start_date
                      ? itinerary.start_date.toUpperCase()
                      : "UPON CONFIRMATION"}
                  </td>
                </tr>

                {/* Trip Duration */}
                <tr className="border-b border-[#CBD5E1] bg-white">
                  <td className="w-2/5 p-4 sm:p-5 font-bold text-slate-800 text-center border-r border-[#CBD5E1]">
                    Trip Duration
                  </td>
                  <td className="w-3/5 p-4 sm:p-5 text-center font-extrabold text-slate-900">
                    {itinerary.duration_nights} Nights / {itinerary.duration_days} Days
                  </td>
                </tr>

                {/* Vehicle */}
                <tr className="border-b border-[#CBD5E1] bg-[#DCE4EC]">
                  <td className="w-2/5 p-4 sm:p-5 font-bold text-slate-800 text-center border-r border-[#CBD5E1]">
                    Vehicle
                  </td>
                  <td className="w-3/5 p-4 sm:p-5 text-center font-extrabold text-slate-900">
                    {itinerary.vehicle || "Private Sanitized Cab (Toyota Etios)"}
                  </td>
                </tr>

                {/* Pax */}
                <tr className="bg-white">
                  <td className="w-2/5 p-4 sm:p-5 font-bold text-slate-800 text-center border-r border-[#CBD5E1]">
                    Pax
                  </td>
                  <td className="w-3/5 p-4 sm:p-5 text-center font-extrabold text-slate-900">
                    {itinerary.pax_label || `${itinerary.travelers_count || 2} Adults`}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Skyline Footer */}
        <WorldSkylineFooter />
      </div>

      {/* ========================================================
          PAGE 2: ACCOMMODATION & PRICING
      ======================================================== */}
      <div className="quote-a4-page w-full max-w-[800px] min-h-[1100px] bg-white border border-slate-200/90 shadow-2xl print:border-none print:shadow-none p-10 sm:p-14 print:p-8 flex flex-col justify-between my-4 print:my-0 page-break-after">
        <div>
          {/* Official Banner Header */}
          <YellowRibbonHeader />

          {/* Section: Accommodation */}
          <div className="mt-8 space-y-0">
            {/* Mint Green Header Bar */}
            <div className="w-full bg-[#D1F2D9] border border-[#A7F3D0] py-3.5 px-6 text-center">
              <h2 className="text-[#166534] font-extrabold text-base sm:text-lg tracking-wide uppercase">
                Accommodation
              </h2>
            </div>

            {/* Accommodation Table */}
            <table className="w-full border-collapse border border-[#CBD5E1] text-[11px] sm:text-xs font-sans">
              <thead>
                <tr className="border-b border-[#CBD5E1] bg-white text-slate-900">
                  <th className="p-3 font-bold border-r border-[#CBD5E1] text-center w-[18%]">
                    Nights
                  </th>
                  <th className="p-3 font-bold border-r border-[#CBD5E1] text-center w-[16%]">
                    City
                  </th>
                  <th className="p-3 font-bold border-r border-[#CBD5E1] text-center w-[28%]">
                    Hotel Name
                  </th>
                  <th className="p-3 font-bold border-r border-[#CBD5E1] text-center w-[18%]">
                    Meal Plan
                  </th>
                  <th className="p-3 font-bold text-center w-[20%]">
                    Accommodation
                  </th>
                </tr>
              </thead>
              <tbody>
                {accommodations.map((acc, idx) => {
                  const isEven = idx % 2 === 0;
                  return (
                    <tr
                      key={idx}
                      className={`border-b border-[#CBD5E1] ${
                        isEven ? "bg-[#DCE4EC]" : "bg-white"
                      }`}
                    >
                      <td className="p-3 border-r border-[#CBD5E1] text-center font-medium text-slate-800 leading-snug">
                        {acc.nights}
                      </td>
                      <td className="p-3 border-r border-[#CBD5E1] text-center font-bold text-slate-950">
                        {acc.city}
                      </td>
                      <td className="p-3 border-r border-[#CBD5E1] text-center font-bold text-slate-900 leading-snug">
                        {acc.hotel_name}
                      </td>
                      <td className="p-3 border-r border-[#CBD5E1] text-center text-slate-700 leading-snug">
                        {acc.meal_plan || "Breakfast (CP)"}
                      </td>
                      <td className="p-3 text-center leading-snug">
                        <span className="font-bold text-slate-950 block">
                          {acc.room_type || "Classic Room"}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-slate-600 block">
                          {acc.occupancy || itinerary.pax_label || "2 Adults"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Amount Callout in authentic Yellow Ribbon font */}
            <div className="pt-6 pb-2 text-left">
              <span className="font-serif font-black text-xl sm:text-2xl text-slate-950 tracking-tight">
                Amount: ₹
                {itinerary.price_per_person && itinerary.price_per_person > 0
                  ? itinerary.price_per_person.toLocaleString("en-IN")
                  : itinerary.total_price.toLocaleString("en-IN")}{" "}
                /-{" "}
                <em className="font-serif italic font-normal text-slate-800 text-lg sm:text-xl">
                  {itinerary.price_per_person && itinerary.price_per_person > 0
                    ? "per person"
                    : "total package"}
                </em>
              </span>
            </div>

            {/* Detailed Commercial Proposal & Cost Breakdown Table */}
            <div className="mt-4 border border-[#CBD5E1] rounded-none overflow-hidden bg-white shadow-xs">
              <div className="bg-[#D1F2D9] border-b border-[#A7F3D0] px-4 py-2.5 flex items-center justify-between">
                <span className="text-[#166534] font-black text-xs sm:text-sm tracking-wide uppercase">
                  Commercial Proposal & Cost Breakdown
                </span>
                <span className="text-[11px] font-bold text-[#166534]">
                  Currency: {itinerary.currency || "INR"}
                </span>
              </div>

              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100/90 border-b border-slate-200 text-slate-700 font-bold uppercase text-[10px] tracking-wider">
                    <th className="p-2.5 text-left pl-3.5">Component / Service</th>
                    <th className="p-2.5 text-left">Coverage & Specifications</th>
                    <th className="p-2.5 text-right pr-3.5">Status / Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-slate-800">
                  {customBreakdownItems.length > 0 ? (
                    customBreakdownItems.map((cb, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#F8FAFC]"}>
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          {cb.item}
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {cb.description || "As per confirmed itinerary schedule"}
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-black text-slate-950">
                          {cb.is_included || cb.amount === null || cb.amount === 0
                            ? "Included"
                            : `₹${Number(cb.amount).toLocaleString("en-IN")}`}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      <tr className="bg-white">
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          Hotel Stays & Daily Breakfast (CP)
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {itinerary.duration_nights} Nights verified handpicked hotels/resorts with breakfast
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-bold text-slate-950">
                          Included
                        </td>
                      </tr>
                      <tr className="bg-[#F8FAFC]">
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          Dedicated Private Vehicle & Sightseeing
                        </td>
                        <td className="p-2.5 text-slate-600">
                          {itinerary.vehicle || "Private AC Vehicle"} throughout entire tour (transfers & excursions)
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-bold text-slate-950">
                          Included
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          Driver Allowance, Tolls, Fuel & Parking
                        </td>
                        <td className="p-2.5 text-slate-600">
                          Driver night charges, fuel, interstate permits & parking (no hidden surcharges)
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-bold text-slate-950">
                          Included
                        </td>
                      </tr>
                      <tr className="bg-[#F8FAFC]">
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          Applicable Government Taxes & 5% GST
                        </td>
                        <td className="p-2.5 text-slate-600">
                          All mandatory travel operator statutory GST & charges
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-bold text-slate-950">
                          Included
                        </td>
                      </tr>
                      <tr className="bg-white">
                        <td className="p-2.5 pl-3.5 font-bold text-slate-950">
                          24/7 Dedicated Concierge Support
                        </td>
                        <td className="p-2.5 text-slate-600">
                          Personal travel architect on standby for seamless logistics & assistance
                        </td>
                        <td className="p-2.5 pr-3.5 text-right font-bold text-emerald-700">
                          Complimentary
                        </td>
                      </tr>
                    </>
                  )}
                </tbody>
              </table>

              {/* Total Summary Footer Strip */}
              <div className="bg-[#F8FAFC] border-t border-slate-300 p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="space-y-0.5">
                  <div className="text-slate-600 font-semibold">
                    Calculation Base: <span className="font-bold text-slate-900">{itinerary.pax_label || `${itinerary.travelers_count || 2} Adults`}</span> ({itinerary.duration_nights} Nights / {itinerary.duration_days} Days)
                  </div>
                  {itinerary.price_per_person && itinerary.price_per_person > 0 ? (
                    <div className="text-slate-600">
                      Rate Per Person: <strong className="text-slate-950 text-sm">₹{itinerary.price_per_person.toLocaleString("en-IN")} /-</strong>
                    </div>
                  ) : null}
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 sm:border-l border-slate-300 pt-2 sm:pt-0 sm:pl-5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
                    Grand Total Package Cost
                  </span>
                  <span className="font-black text-xl sm:text-2xl text-slate-950 tracking-tight text-emerald-800 block">
                    ₹{itinerary.total_price.toLocaleString("en-IN")} /-
                  </span>
                  <span className="text-[10px] font-semibold text-emerald-700 block">
                    ✓ All-Inclusive · Net Payable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Skyline Footer */}
        <WorldSkylineFooter />
      </div>

      {/* ========================================================
          PAGES 3 & 4: ITINERARY DAY-BY-DAY
      ======================================================== */}
      {dayBatches.map((batch, batchIdx) => (
        <div
          key={batchIdx}
          className="quote-a4-page w-full max-w-[800px] min-h-[1100px] bg-white border border-slate-200/90 shadow-2xl print:border-none print:shadow-none p-10 sm:p-14 print:p-8 flex flex-col justify-between my-4 print:my-0 page-break-after"
        >
          <div>
            {/* Official Banner Header */}
            <YellowRibbonHeader />

            {/* Itinerary Green Header (Shown on the first day batch) */}
            {batchIdx === 0 && (
              <div className="mt-8 mb-6 w-full bg-[#D1F2D9] border border-[#A7F3D0] py-3.5 px-6 text-center">
                <h2 className="text-[#166534] font-extrabold text-base sm:text-lg tracking-wide uppercase">
                  Itinerary
                </h2>
              </div>
            )}

            {/* Day Schedule List */}
            <div className="space-y-6 pt-2">
              {batch.map((dayItem, dIdx) => (
                <div key={dIdx} className="space-y-2 text-xs sm:text-[13px] leading-relaxed">
                  {/* Day Heading */}
                  <h3 className="font-black text-slate-950 uppercase tracking-wide text-xs sm:text-sm">
                    {dayItem.title || `DAY ${String(dayItem.day).padStart(2, "0")}`}
                  </h3>

                  {/* Main Paragraph Description */}
                  {dayItem.description && (
                    <p className="text-slate-800 whitespace-pre-line leading-relaxed">
                      {dayItem.description}
                    </p>
                  )}

                  {/* Sightseeing / Visit Bullets */}
                  {dayItem.visit_points && dayItem.visit_points.length > 0 && (
                    <div className="pt-1">
                      <strong className="font-bold text-slate-900 block mb-0.5">
                        {dayItem.visit_label || "Visit:"}
                      </strong>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-800 pl-1">
                        {dayItem.visit_points.map((pt, pIdx) => (
                          <li key={pIdx}>{pt}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Overnight & Meals Info */}
                  <div className="pt-1 space-y-0.5 text-slate-800 font-medium">
                    {dayItem.overnight && (
                      <div>
                        Overnight: <span className="text-slate-900">{dayItem.overnight}</span>
                      </div>
                    )}
                    {dayItem.meals && (
                      <div>
                        Meals: <span className="text-slate-900">{dayItem.meals}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Skyline Footer */}
          <WorldSkylineFooter />
        </div>
      ))}

      {/* ========================================================
          PAGE 5: PACKAGE HIGHLIGHTS & IMPORTANT NOTES
      ======================================================== */}
      <div className="quote-a4-page w-full max-w-[800px] min-h-[1100px] bg-white border border-slate-200/90 shadow-2xl print:border-none print:shadow-none p-10 sm:p-14 print:p-8 flex flex-col justify-between my-4 print:my-0">
        <div>
          {/* Official Banner Header */}
          <YellowRibbonHeader />

          <div className="mt-8 space-y-6">
            {/* Package Highlights Heading */}
            <h2 className="text-base sm:text-lg font-black text-slate-950 uppercase tracking-wider">
              Package Highlights
            </h2>

            {/* Highlights Bullets */}
            <ul className="list-disc list-inside space-y-1.5 text-xs sm:text-sm text-slate-800 pl-1 font-medium">
              {highlights.map((item, idx) => (
                <li key={idx} className="leading-snug">
                  {item}
                </li>
              ))}
            </ul>

            {/* Notes Section */}
            <div className="pt-4 space-y-3 text-xs sm:text-[13px] text-slate-800 leading-relaxed">
              {notes.map((noteText, idx) => (
                <p key={idx} className="leading-relaxed">
                  {noteText}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Skyline Footer */}
        <WorldSkylineFooter />
      </div>
    </div>
  );
}
