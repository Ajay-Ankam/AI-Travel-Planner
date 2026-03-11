import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    source: { type: String, required: true },
    destination: { type: String, required: true },
    groupSize: { type: String, required: true },
    budget: { type: String, required: true },
    duration: { type: Number, required: true },
    interests: [String],

    // Storing the AI generated plan as a mixed object
    itinerary: {
      type: Object, // This will hold the JSON returned by Gemini
      required: true,
    },

    hotelOptions: { type: Array },
    flightDetails: { type: Array },

    budgetBreakdown: {
      totalEstimated: Number,
      flights: Number,
      hotels: Number,
      food: Number,
      activities: Number,
    },
  },
  { timestamps: true },
);

const Trip = mongoose.model("Trip", tripSchema);
export default Trip;
