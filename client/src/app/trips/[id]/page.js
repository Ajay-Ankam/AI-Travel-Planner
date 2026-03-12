"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/axios";
import TripCard from "@/components/TripCard";
import {
  Loader2,
  ArrowLeft,
  Printer,
  Share2,
  X,
  Send,
  Sparkles,
} from "lucide-react";

export default function SingleTripPage() {
  const { id } = useParams();
  const router = useRouter();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Dynamic Edit States ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [instructions, setInstructions] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    const fetchTripDetails = async () => {
      try {
        const { data } = await api.get(`/trips/${id}`);
        setTrip(data);
      } catch (err) {
        console.error("Error fetching trip details:", err);
        router.push("/trips");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTripDetails();
  }, [id, router]);

  // --- Handle Day Regeneration ---
  const handleRegenerate = async () => {
    if (!instructions.trim()) return;
    setIsUpdating(true);
    try {
      const { data } = await api.post(`/trips/${id}/regenerate-day`, {
        dayNumber: selectedDay,
        instructions: instructions,
      });

      // Update the local trip state with the new day data
      const updatedItinerary = trip.itinerary.map((day) =>
        day.day === selectedDay ? data.updatedDay : day,
      );

      setTrip({ ...trip, itinerary: updatedItinerary });
      setIsModalOpen(false);
      setInstructions("");
    } catch (error) {
      console.error("Regeneration Error:", error);
      alert("Failed to update the itinerary. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePrint = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-500 font-medium">
            Retrieving your itinerary...
          </p>
        </div>
      </div>
    );
  }

  if (!trip) return null;

  return (
    <div className="min-h-screen bg-gray-50 pb-20 relative">
      {/* Action Bar */}
      <div className="bg-white border-b border-gray-100 sticky top-16 z-40 print:hidden">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-blue-600 font-medium transition-colors"
          >
            <ArrowLeft size={20} /> Back to Dashboard
          </button>

          <div className="flex gap-3">
            <button
              onClick={handlePrint}
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              title="Print Trip"
            >
              <Printer size={20} />
            </button>
            <button
              className="p-2.5 text-gray-500 hover:bg-gray-100 rounded-xl transition-all"
              title="Share Link"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                alert("Link copied to clipboard!");
              }}
            >
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 pt-8 md:pt-12">
        <TripCard
          // Trigger modal from within TripCard/Itinerary components
          onRegenerate={(dayNum) => {
            setSelectedDay(dayNum);
            setIsModalOpen(true);
          }}
          trip={{
            ...trip,
            hotelRecommendations:
              trip.hotelRecommendations || trip.hotelOptions,
            flightRecommendations:
              trip.flightRecommendations || trip.flightDetails,
            tripSummary: trip.tripSummary || {
              destination: trip.destination,
              totalGroupSize: trip.groupSize,
              duration: trip.duration,
              budgetTier: trip.budget,
              source: trip.source,
            },
          }}
        />
      </div>

      {/* --- Simple Input Modal for Regeneration --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => !isUpdating && setIsModalOpen(false)}
          />
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 md:p-8 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2 text-blue-600 font-bold">
                <Sparkles size={20} />
                <span>Refine Day {selectedDay}</span>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <textarea
              className="w-full h-32 p-4 bg-gray-50 border border-gray-100 rounded-2xl focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none text-gray-700"
              placeholder="Ex: Make this day more nature-focused, or add a budget-friendly lunch spot..."
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={isUpdating}
            />

            <button
              onClick={handleRegenerate}
              disabled={isUpdating || !instructions.trim()}
              className="w-full mt-6 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-200"
            >
              {isUpdating ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <Send size={18} /> Update Itinerary
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Print-only Footer */}
      <div className="hidden print:block text-center text-gray-400 text-xs mt-10 italic">
        Generated by AI Travel Planner — Adventure Awaits.
      </div>
    </div>
  );
}
