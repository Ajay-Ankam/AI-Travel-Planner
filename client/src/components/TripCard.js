"use client";
import {
  Calendar,
  MapPin,
  Hotel,
  Plane,
  DollarSign,
  Clock,
  Users,
  ChevronRight,
} from "lucide-react";

export default function TripCard({ trip }) {
  // Destructure the AI-generated data
  const {
    destination,
    duration,
    groupSize,
    budget,
    itinerary,
    hotelRecommendations,
    flightRecommendations,
    budgetBreakdown,
  } = trip;

  return (
    <div className="w-full max-w-4xl mx-auto space-y-8 pb-10">
      {/* 1. Header Summary */}
      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900 flex items-center gap-2">
            <MapPin className="text-blue-600" /> {destination}
          </h2>
          <div className="flex flex-wrap gap-4 mt-3 text-gray-500 font-medium">
            <span className="flex items-center gap-1.5 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">
              <Clock size={16} /> {duration} Days
            </span>
            <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-600 px-3 py-1 rounded-full text-sm">
              <Users size={16} /> {groupSize}
            </span>
            <span className="flex items-center gap-1.5 bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm">
              <DollarSign size={16} /> {budget} Budget
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-400 uppercase tracking-widest font-bold">
            Total Estimate
          </p>
          <p className="text-3xl font-black text-gray-900">
            ${budgetBreakdown?.totalEstimated}
          </p>
        </div>
      </div>

      {/* 2. Itinerary Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
          <Calendar className="text-blue-600" /> Daily Itinerary
        </h3>
        {itinerary?.map((day, idx) => (
          <div
            key={idx}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 relative overflow-hidden group hover:border-blue-200 transition-colors"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-600"></div>
            <h4 className="font-bold text-blue-600 text-sm uppercase tracking-wider mb-1">
              Day {day.day}
            </h4>
            <p className="text-lg font-bold text-gray-900 mb-4">{day.theme}</p>
            <div className="space-y-4">
              {day.activities.map((act, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <span className="text-xs font-bold text-gray-400 mt-1 whitespace-nowrap w-16">
                    {act.time}
                  </span>
                  <div>
                    <p className="text-gray-800 font-medium">{act.activity}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {act.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 3. Hotels & Flights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hotels */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
            <Hotel className="text-indigo-600" /> Stay Recommendations
          </h3>
          {hotelRecommendations?.map((hotel, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100"
            >
              <p className="font-bold text-gray-900">{hotel.name}</p>
              <p className="text-sm text-gray-500 mt-1">{hotel.description}</p>
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs font-bold bg-gray-100 px-2 py-1 rounded text-gray-600">
                  {hotel.priceCategory}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Budget Breakdown Chart (Simplified) */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
            <DollarSign className="text-emerald-600" /> Cost Breakdown
          </h3>
          <div className="bg-gray-900 text-white rounded-2xl p-6 shadow-xl">
            <div className="space-y-4">
              <BudgetBar
                label="Flights"
                amount={budgetBreakdown?.flights}
                color="bg-blue-500"
                total={budgetBreakdown?.totalEstimated}
              />
              <BudgetBar
                label="Hotel"
                amount={budgetBreakdown?.accommodation}
                color="bg-indigo-500"
                total={budgetBreakdown?.totalEstimated}
              />
              <BudgetBar
                label="Food"
                amount={budgetBreakdown?.food}
                color="bg-emerald-500"
                total={budgetBreakdown?.totalEstimated}
              />
              <BudgetBar
                label="Activities"
                amount={budgetBreakdown?.activities}
                color="bg-amber-500"
                total={budgetBreakdown?.totalEstimated}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function BudgetBar({ label, amount, color, total }) {
  const percentage = (amount / total) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5 font-bold uppercase tracking-wider opacity-80">
        <span>{label}</span>
        <span>${amount}</span>
      </div>
      <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-1000`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
