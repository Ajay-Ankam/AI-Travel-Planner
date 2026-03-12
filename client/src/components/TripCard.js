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
  Sparkles,
  Star,
  ExternalLink,
  AlertCircle,
} from "lucide-react";

export default function TripCard({ trip, onRegenerate }) {
  const {
    destination,
    duration,
    groupSize,
    budget,
    itinerary,
    hotelRecommendations,
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
            ${budgetBreakdown?.totalEstimated || 0}
          </p>
        </div>
      </div>

      {/* 2. Itinerary Section (Original UI Maintained) */}
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
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-blue-600 text-sm uppercase tracking-wider mb-1">
                  Day {day.day}
                </h4>
                <p className="text-lg font-bold text-gray-900">{day.theme}</p>
              </div>
              <button
                onClick={() => onRegenerate(day.day)}
                className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all text-xs font-bold border border-blue-100 print:hidden"
              >
                <Sparkles size={14} /> Refine
              </button>
            </div>
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

      {/* 3. Refined Hotels & Cost Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* REFINED HOTEL SECTION */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
            <Hotel className="text-indigo-600" /> Stay Recommendations
          </h3>

          {hotelRecommendations?.length > 0 ? (
            hotelRecommendations.map((hotel, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all group"
              >
                {/* Hotel Thumbnail */}
                <div className="h-40 w-full relative bg-gray-100">
                  <img
                    src={
                      hotel.imageUrl ||
                      `https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80`
                    }
                    alt={hotel.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-bold text-gray-900 shadow-sm">
                    <Star
                      size={12}
                      className="text-yellow-500 fill-yellow-500"
                    />{" "}
                    {hotel.rating || "4.5"}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h5 className="font-bold text-gray-900 leading-tight">
                      {hotel.name}
                    </h5>
                    <span className="text-[10px] font-black bg-indigo-50 text-indigo-600 px-2 py-1 rounded uppercase tracking-tighter">
                      {hotel.priceCategory}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-4">
                    {hotel.description}
                  </p>

                  <a
                    href={
                      hotel.bookingUrl ||
                      `https://www.google.com/search?q=${encodeURIComponent(hotel.name + " " + destination)}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 bg-gray-50 hover:bg-indigo-600 hover:text-white text-gray-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all border border-gray-100"
                  >
                    View on Map/Booking <ExternalLink size={14} />
                  </a>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-8 border border-dashed border-gray-200 text-center">
              <div className="bg-gray-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Hotel className="text-gray-300" size={24} />
              </div>
              <p className="text-gray-900 font-bold text-sm">No hotels found</p>
              <p className="text-gray-400 text-xs mt-1">
                Refine the trip to generate stays.
              </p>
            </div>
          )}
        </div>

        {/* COST BREAKDOWN WITH FALLBACKS */}
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2 px-2">
            <DollarSign className="text-emerald-600" /> Cost Breakdown
          </h3>
          <div className="bg-gray-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            <div className="space-y-6 relative z-10">
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
                showWarning={
                  !budgetBreakdown?.accommodation ||
                  budgetBreakdown?.accommodation === 0
                }
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

function BudgetBar({ label, amount, color, total, showWarning }) {
  const percentage = total > 0 ? (amount / total) * 100 : 0;
  return (
    <div>
      <div className="flex justify-between items-center text-xs mb-2 font-bold uppercase tracking-wider">
        <span className="opacity-60">{label}</span>
        <span className="flex items-center gap-1.5">
          {showWarning && <AlertCircle size={12} className="text-amber-400" />}
          <span className={showWarning ? "text-amber-400" : ""}>
            {amount > 0 ? `$${amount}` : "Price Pending"}
          </span>
        </span>
      </div>
      <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
        <div
          className={`${color} h-full transition-all duration-1000 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
