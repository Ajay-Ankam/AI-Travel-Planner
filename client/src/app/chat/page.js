"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation"; // Added for redirecting
import api from "@/lib/axios";
import { useAuth } from "@/context/AuthContext";
import { Send, Bot, User, Loader2, Save, CheckCircle } from "lucide-react";
import Button from "@/components/UI/Button";
import TripCard from "@/components/TripCard"; // Import the card we just built

export default function ChatPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [messages, setMessages] = useState([
    {
      role: "model",
      parts: [
        {
          text: '{"resp": "Hi! I\'m your AI Travel Planner ✈️. Let\'s start planning your trip. Where will you be traveling from?", "ui": "source"}',
        },
      ],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false); // New state for DB saving
  const [currentUI, setCurrentUI] = useState("source");
  const scrollRef = useRef(null);

  // Helper to get the last AI response object
  const getLatestTripData = () => {
    const lastMsg = messages[messages.length - 1];
    if (lastMsg?.role === "model") {
      try {
        const parsed = JSON.parse(lastMsg.parts[0].text);
        return parsed.ui === "final" ? parsed.resp : null;
      } catch (e) {
        return null;
      }
    }
    return null;
  };

  const handleSaveTrip = async () => {
    const tripData = getLatestTripData();
    if (!tripData) return;

    setSaving(true);
    try {
      // Mapping the AI response to your Mongoose Schema fields
      await api.post("/trips", {
        source: tripData.tripSummary.source,
        destination: tripData.tripSummary.destination,
        groupSize: tripData.tripSummary.totalGroupSize,
        budget: tripData.tripSummary.budgetTier,
        duration: tripData.tripSummary.duration,
        interests: tripData.tripSummary.interests,
        itinerary: tripData.itinerary,
        hotelOptions: tripData.hotelRecommendations,
        flightDetails: tripData.flightRecommendations,
        budgetBreakdown: {
          totalEstimated: tripData.budgetBreakdown.totalEstimated,
          flights: tripData.budgetBreakdown.flights,
          hotels: tripData.budgetBreakdown.accommodation,
          food: tripData.budgetBreakdown.food,
          activities: tripData.budgetBreakdown.activities,
        },
      });

      router.push("/trips"); // Redirect to dashboard after success
    } catch (err) {
      alert("Failed to save trip. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ... (previous sendMessage logic remains the same)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)] bg-gray-50">
      <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-6">
        <div className="max-w-4xl mx-auto space-y-6">
          {messages.map((msg, idx) => {
            const isAI = msg.role === "model";
            let parsed = null;
            try {
              parsed = isAI ? JSON.parse(msg.parts[0].text) : null;
            } catch (e) {}

            return (
              <div key={idx} className="space-y-4">
                <div
                  className={`flex ${isAI ? "justify-start" : "justify-end"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[85%] ${isAI ? "flex-row" : "flex-row-reverse"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isAI ? "bg-blue-600" : "bg-gray-800"}`}
                    >
                      {isAI ? (
                        <Bot size={18} className="text-white" />
                      ) : (
                        <User size={18} className="text-white" />
                      )}
                    </div>
                    <div
                      className={`p-4 rounded-2xl shadow-sm ${isAI ? "bg-white text-gray-800" : "bg-blue-600 text-white"}`}
                    >
                      <p className="text-sm md:text-base">
                        {isAI ? parsed.resp : msg.parts[0].text}
                      </p>
                    </div>
                  </div>
                </div>

                {/* If AI returns 'final', show the TripCard directly in the chat! */}
                {isAI && parsed?.ui === "final" && (
                  <div className="mt-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <TripCard trip={parsed.resp} />
                  </div>
                )}
              </div>
            );
          })}
          <div ref={scrollRef} />
        </div>
      </div>

      {/* Dynamic Input Area */}
      <div className="bg-white border-t border-gray-100 p-4 md:p-6 sticky bottom-0">
        <div className="max-w-3xl mx-auto">
          {currentUI === "final" ? (
            <div className="flex gap-3">
              <Button
                onClick={handleSaveTrip}
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <Save size={20} />
                )}
                {saving ? "Saving to Cloud..." : "Save Trip to Dashboard"}
              </Button>
            </div>
          ) : (
            <form
              onSubmit={sendMessage}
              className="relative flex items-center gap-2"
            >
              <input
                type="text"
                placeholder={`Tell me your ${currentUI}...`}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={loading}
                className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none pr-14 transition-all"
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="absolute right-2 p-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
              >
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
