"use client";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Plane, Sparkles, Map, ShieldCheck, ArrowRight } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="relative isolate overflow-hidden min-h-screen flex items-center">
      {/* Background Decorative Gradients - Keep Aesthetics */}
      <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
        <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-200 to-indigo-400 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
      </div>

      {/* FIXED: Max-width and centering container for ALL content */}
      <div className="max-w-7xl mx-auto px-6 py-16 sm:py-24 lg:px-8">
        {/* FIXED: Used a centered grid structure on desktop */}
        <div className="grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:gap-x-16 lg:items-center">
          {/* Hero Content (Left Side) */}
          <div className="max-w-2xl mx-auto lg:mx-0">
            <div className="mb-8">
              <span className="rounded-full bg-blue-600/10 px-3 py-1.5 text-sm font-semibold leading-6 text-blue-600 ring-1 ring-inset ring-blue-600/10 flex items-center gap-2 w-fit">
                <Sparkles className="h-4 w-4" /> Gemini 3 Flash Powered
              </span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl leading-[1.1]">
              Your Personal{" "}
              <span className="text-blue-600">AI Travel Agent</span>
            </h1>
            <p className="mt-8 text-lg sm:text-xl leading-8 text-gray-600">
              Stop spending hours planning. Get a personalized, day-by-day
              itinerary with real-world budget estimates, hotels, and hidden
              gems in seconds.
            </p>
            <div className="mt-12 flex flex-col sm:flex-row items-center gap-6">
              <Link
                href={user ? "/chat" : "/register"}
                className="w-full sm:w-auto rounded-xl bg-blue-600 px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 flex items-center justify-center gap-2 transition-all active:scale-95 shadow-blue-100"
              >
                Start Planning Now <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/trips"
                className="text-base font-semibold leading-6 text-gray-900 flex items-center gap-1.5 hover:text-blue-600 transition-colors"
              >
                View Examples <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          {/* Feature Cards Grid (Right Side) - Now constrained */}
          <div className="mx-auto mt-16 lg:mt-0 w-full max-w-2xl">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <FeatureCard
                icon={<Map className="text-blue-600 h-6 w-6" />}
                title="Smart Itineraries"
                desc="Optimized routes and timing for every day of your trip."
              />
              <FeatureCard
                icon={<ShieldCheck className="text-indigo-600 h-6 w-6" />}
                title="Budget Estimates"
                desc="Calculated costs for flights, hotels, and daily spending."
              />
              {/* This card is visible on small screens and grid on medium+ */}
              <FeatureCard
                icon={<Plane className="text-sky-600 h-6 w-6" />}
                title="Live Recommendations"
                desc="Real-world airline and hotel suggestions based on your tier."
                className="sm:col-span-2" // Important adjustment for 3rd card
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, desc, className = "" }) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-lg p-7 rounded-3xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 ${className}`}
    >
      <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner border border-gray-100 mb-5">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-gray-950">{title}</h3>
      <p className="mt-2.5 text-base text-gray-600 leading-relaxed">{desc}</p>
    </div>
  );
}
