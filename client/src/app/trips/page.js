"use client";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import Link from "next/link";
import {
  MapPin,
  Calendar,
  Trash2,
  Plane,
  Plus,
  Loader2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import Button from "@/components/UI/Button";

export default function TripsDashboard() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTrips = async () => {
    try {
      const { data } = await api.get("/trips");
      setTrips(data);
    } catch (err) {
      console.error("Failed to fetch trips", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const deleteTrip = async (id) => {
    if (!window.confirm("Are you sure you want to delete this adventure?"))
      return;
    try {
      await api.delete(`/trips/${id}`);
      setTrips(trips.filter((t) => t._id !== id));
    } catch (err) {
      alert("Delete failed. Try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
        <p className="text-gray-500 font-medium">Loading your adventures...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">
            My Adventures
          </h1>
          <p className="text-gray-500 mt-2 text-lg">
            You have planned {trips.length} trips so far.
          </p>
        </div>
        {/* UPDATED: Points to /create-trip */}
        <Link href="/create-trip">
          <Button className="flex items-center gap-2 px-8">
            <Plus size={20} /> Plan New Trip
          </Button>
        </Link>
      </div>

      {/* Empty State */}
      {trips.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-gray-200">
          <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Plane className="text-blue-600 h-10 w-10" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">No trips found</h2>
          <p className="text-gray-500 mt-2 max-w-sm mx-auto">
            Your travel history is empty. Let's start building your dream
            itinerary!
          </p>
          {/* UPDATED: Link and Text changed from "Chatting" to "Planning" */}
          <Link href="/create-trip" className="mt-8 inline-block">
            <Button variant="outline" className="flex items-center gap-2">
              <Sparkles size={18} /> Start Planning with AI
            </Button>
          </Link>
        </div>
      ) : (
        /* Trips Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {trips.map((trip) => (
            <div
              key={trip._id}
              className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group"
            >
              {/* Card Header (Blue Gradient) */}
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 flex justify-between items-start">
                <div className="bg-white/20 backdrop-blur-md rounded-xl p-2">
                  <Plane className="text-white h-5 w-5" />
                </div>
                <button
                  onClick={() => deleteTrip(trip._id)}
                  className="bg-white/10 hover:bg-red-500/20 p-2 rounded-xl transition-colors group/del"
                >
                  <Trash2 className="text-white group-hover/del:text-red-200 h-5 w-5" />
                </button>
              </div>

              {/* Card Body */}
              <div className="p-6 -mt-10">
                <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-50">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <MapPin size={18} className="text-blue-600" />{" "}
                      {trip.destination}
                    </h3>
                    <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
                      ${trip.budgetBreakdown?.totalEstimated}
                    </span>
                  </div>

                  <div className="flex gap-4 text-sm text-gray-500 mb-6 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={16} /> {trip.duration} Days
                    </span>
                    <span className="flex items-center gap-1.5 capitalize">
                      {trip.budget} Budget
                    </span>
                  </div>

                  <Link href={`/trips/${trip._id}`}>
                    <Button
                      variant="outline"
                      className="w-full flex items-center justify-center gap-2 group/btn"
                    >
                      View Itinerary
                      <ArrowRight
                        size={18}
                        className="group-hover/btn:translate-x-1 transition-transform"
                      />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
