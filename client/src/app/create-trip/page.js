"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import SelectionCards from "@/components/Form/SelectionCards";
import Button from "@/components/UI/Button";
import Input from "@/components/UI/Input";
import LoadingOverlay from "@/components/UI/LoadingOverlay";
import {
  Sparkles,
  Loader2,
  PlaneTakeoff,
  MapPin,
  Navigation,
} from "lucide-react";

const BUDGET_OPTIONS = [
  { id: 1, title: "Low", desc: "Budget-friendly stays and eats", icon: "💰" },
  {
    id: 2,
    title: "Medium",
    desc: "Comfortable hotels & popular spots",
    icon: "🏢",
  },
  { id: 3, title: "High", desc: "Luxury resorts and fine dining", icon: "💎" },
];

const GROUP_OPTIONS = [
  { id: 1, title: "Solo", desc: "A solo explorer", icon: "🧘" },
  { id: 2, title: "Couple", desc: "Two people traveling together", icon: "👩‍❤️‍👨" },
  { id: 3, title: "Family", desc: "Fun for the whole family", icon: "👨‍👩‍👧‍👦" },
  { id: 4, title: "Friends", desc: "A group of adventure seekers", icon: "🥂" },
];

export default function CreateTrip() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    source: "",
    destination: "",
    duration: "",
    budget: "",
    groupSize: "",
    interests: [],
  });

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGenerate = async () => {
    if (
      !formData.source ||
      !formData.destination ||
      !formData.duration ||
      !formData.budget
    ) {
      alert("Please fill in all the core trip details!");
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/ai/plan", { formData });
      router.push(`/trips/${data._id}`);
    } catch (error) {
      console.error("Generation Error:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <LoadingOverlay isOpen={loading} />
      
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4 flex items-center justify-center gap-3">
          Tell us your <span className="text-blue-600">Travel Preferences</span>{" "}
          <PlaneTakeoff className="text-blue-600" />
        </h1>
        <p className="text-gray-500 text-lg">
          Just provide some basic information and our AI will build your perfect
          itinerary.
        </p>
      </div>

      <div className="space-y-12 bg-white p-8 rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50">
        {/* Step 1: Destination & Source (Now using standard Input) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Navigation size={18} className="text-blue-600" /> Starting Point
            </label>
            <Input
              placeholder="Ex: New York, USA"
              value={formData.source}
              onChange={(e) => handleInputChange("source", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <label className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <MapPin size={18} className="text-blue-600" /> Destination
            </label>
            <Input
              placeholder="Ex: Paris, France"
              value={formData.destination}
              onChange={(e) => handleInputChange("destination", e.target.value)}
            />
          </div>
        </div>

        {/* Step 2: Duration */}
        <div className="max-w-xs">
          <label className="text-lg font-bold text-gray-900 block mb-2">
            How many days is your trip?
          </label>
          <Input
            type="number"
            placeholder="Ex: 5"
            value={formData.duration}
            onChange={(e) => handleInputChange("duration", e.target.value)}
          />
        </div>

        {/* Step 3: Budget */}
        <SelectionCards
          label="What is your budget tier?"
          options={BUDGET_OPTIONS}
          selectedValue={formData.budget}
          onSelect={(v) => handleInputChange("budget", v)}
        />

        {/* Step 4: Group Size */}
        <SelectionCards
          label="Who are you traveling with?"
          options={GROUP_OPTIONS}
          selectedValue={formData.groupSize}
          onSelect={(v) => handleInputChange("groupSize", v)}
        />

        {/* Submit Section */}
        <div className="pt-8 border-t border-gray-100 flex justify-end">
          <Button
            disabled={loading}
            onClick={handleGenerate}
            className="px-10 py-4 text-lg font-bold rounded-2xl flex items-center gap-2 shadow-lg shadow-blue-100 transition-all hover:scale-105 active:scale-95"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" /> Generating
                Itinerary...
              </>
            ) : (
              <>
                Generate Trip <Sparkles className="h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
