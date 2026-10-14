"use client";

import { useState } from "react";
import { ItineraryDay } from "../domain/tour.entity";
import { ChevronDown, MapPin } from "lucide-react";

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
            onClick={expandAll}
            className="text-amber-600 hover:text-amber-700 font-semibold"
          >
            Expand All
          </button>
          <span className="text-slate-300">|</span>
          <button
            onClick={collapseAll}
            className="text-slate-500 hover:text-slate-700 font-semibold"
          >
            Collapse All
          </button>
        </div>
      </div>

      <div className="relative border-l-2 border-amber-200 ml-4 pl-6 space-y-6">
        {itinerary.map((item) => {
          const isOpen = openDays.includes(item.day);
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
                  className="w-full text-left p-4 flex items-center justify-between gap-4 bg-slate-50/50 hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-sm text-slate-900">
                      Day {item.day}:
                    </span>
                    <span className="text-sm font-semibold text-slate-800">
                      {item.title}
                    </span>
                  </div>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-amber-600" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="p-4 pt-2 text-sm text-slate-600 leading-relaxed border-t border-slate-100 bg-white">
                    <p>{item.description}</p>
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
