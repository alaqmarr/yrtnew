"use client";

import { useState } from "react";
import { ItineraryDay } from "../domain/tour.entity";
import { ChevronDown, MapPin, Utensils, Compass, BedDouble } from "lucide-react";

interface ItineraryAccordionProps {
  itinerary: ItineraryDay[];
}

export default function ItineraryAccordion({ itinerary }: ItineraryAccordionProps) {
  const [openDays, setOpenDays] = useState<number[]>([1]); // First day open by default

  const toggleDay = (dayNum: number) => {
    setOpenDays((prev) =>
      prev.includes(dayNum) ? prev.filter((d) => d !== dayNum) : [...prev, dayNum]
    );
  };

  const expandAll = () => {
    setOpenDays(itinerary.map((item) => item.day));
  };

  const collapseAll = () => {
    setOpenDays([]);
  };

  if (!itinerary || itinerary.length === 0) {
    return (
      <div className="p-6 bg-slate-50 rounded-xl text-center text-sm text-slate-500">
        Detailed day-wise itinerary will be shared upon customized inquiry.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center pb-2">
        <span className="text-xs text-slate-500 font-medium">
          {itinerary.length} Days Detailed Plan
        </span>
        <div className="flex items-center gap-3 text-xs">
          <button
            type="button"
            onClick={expandAll}
            className="text-amber-600 hover:text-amber-700 font-semibold cursor-pointer"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            type="button"
            onClick={collapseAll}
            className="text-slate-500 hover:text-slate-700 font-semibold cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="relative border-l-2 border-amber-200 ml-4 pl-6 space-y-6">
        {itinerary.map((item) => {
          const isOpen = openDays.includes(item.day);
          const hasVisitPoints = Array.isArray(item.visit_points) && item.visit_points.length > 0;
          return (
            <div key={item.day} className="relative group">
              {/* Timeline Dot */}
              <div
                className={`absolute -left-[35px] top-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold transition-colors ${
                  isOpen
                    ? "bg-amber-500 text-white ring-4 ring-amber-100"
                    : "bg-white border-2 border-amber-400 text-amber-600 group-hover:bg-amber-50"
                }`}
              >
                {item.day}
              </div>

              {/* Accordion Card */}
              <div className="bg-white rounded-xl border border-slate-200/80 overflow-hidden shadow-sm hover:shadow transition-shadow">
                <button
                  type="button"
                  onClick={() => toggleDay(item.day)}
                  className="w-full text-left p-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-xs px-2 py-0.5 rounded-md bg-slate-900 text-amber-400">
                      Day {item.day}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {item.title}
                    </span>
                    {!isOpen && item.overnight && (
                      <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        <BedDouble className="w-3 h-3 text-amber-600" />
                        {item.overnight}
                      </span>
                    )}
                    {!isOpen && item.meals && (
                      <span className="hidden md:inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-white border border-slate-200 px-2 py-0.5 rounded-full">
                        <Utensils className="w-3 h-3 text-emerald-600" />
                        {item.meals}
                      </span>
                    )}
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 pt-3 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white space-y-3">
                    {(item.overnight || item.meals) && (
                      <div className="flex flex-wrap items-center gap-2 pb-1">
                        {item.overnight && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-900 bg-amber-50 border border-amber-200/80 px-2.5 py-1 rounded-lg">
                            <BedDouble className="w-3.5 h-3.5 text-amber-600" />
                            <span>Overnight: {item.overnight}</span>
                          </span>
                        )}
                        {item.meals && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-900 bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-lg">
                            <Utensils className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Meals: {item.meals}</span>
                          </span>
                        )}
                      </div>
                    )}

                    {item.description && (
                      <p className="whitespace-pre-line">{item.description}</p>
                    )}

                    {hasVisitPoints && (
                      <div className="pt-2 border-t border-slate-100">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-amber-500" />
                          <span>Key Sightseeing & Highlights</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {item.visit_points!.map((point, i) => (
                            <span
                              key={i}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-50 border border-slate-200/80 text-xs font-medium text-slate-700"
                            >
                              <MapPin className="w-3 h-3 text-amber-500 shrink-0" />
                              {point}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
