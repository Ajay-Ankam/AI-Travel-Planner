"use client";
import React from "react";
import { Plane, Sparkles, Loader2 } from "lucide-react";

export default function LoadingOverlay({ isOpen }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 backdrop-blur-md transition-all duration-500">
      <div className="max-w-md w-full px-6 text-center">
        {/* Animated Icon Container */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25"></div>
          <div className="relative bg-blue-600 w-24 h-24 rounded-full flex items-center justify-center shadow-2xl shadow-blue-200">
            <Plane className="text-white h-12 w-12 animate-bounce" />
          </div>
          <div className="absolute -top-2 -right-2 bg-indigo-500 p-2 rounded-lg shadow-lg">
            <Sparkles className="text-white h-5 w-5 animate-pulse" />
          </div>
        </div>

        {/* Text Content */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-3">
          Mapping Your Adventure...
        </h2>
        <p className="text-gray-500 text-lg mb-8 leading-relaxed">
          Our Gemini AI is currently scanning thousands of hotels, flights, and
          hidden gems to craft your perfect itinerary.
        </p>

        {/* Progress Bar/Loader */}
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 text-blue-600 animate-spin" />
          <span className="text-sm font-bold text-blue-600 uppercase tracking-widest">
            Processing Itinerary
          </span>
        </div>
      </div>
    </div>
  );
}
