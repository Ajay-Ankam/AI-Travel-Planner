import Trip from "../models/Trip.js";

import { GoogleGenAI } from "@google/genai";
import { REGENERATE_DAY_PROMPT } from "../utils/promptHelper.js";

// import dotenv from "dotenv";

// dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const regenerateTripDay = async (req, res) => {
  const { id } = req.params; // Trip ID
  const { dayNumber, instructions } = req.body;

  try {
    const trip = await Trip.findById(id);
    if (!trip) return res.status(404).json({ message: "Trip not found" });

    // Verify ownership
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // Find the specific day in the itinerary array
    const dayToChange = trip.itinerary.find((d) => d.day === dayNumber);
    if (!dayToChange)
      return res.status(400).json({ message: "Invalid day number" });

    // Call Gemini
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${REGENERATE_DAY_PROMPT}
          Context: Trip to ${trip.destination}, Budget: ${trip.budget}.
          Current Day Data: ${JSON.stringify(dayToChange)}
          User Instructions: ${instructions}`,
            },
          ],
        },
      ],
    });

    const cleanedText = response.text.replace(/```json|```/g, "").trim();
    const updatedDayData = JSON.parse(cleanedText);

    // Update the itinerary array in the database
    const dayIndex = trip.itinerary.findIndex((d) => d.day === dayNumber);
    trip.itinerary[dayIndex] = updatedDayData;

    // Use markModified because itinerary is a Mixed/Object type in Mongoose
    trip.markModified("itinerary");
    await trip.save();

    res.json({
      message: `Day ${dayNumber} updated successfully`,
      updatedDay: updatedDayData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to regenerate day" });
  }
};

// @desc    Save a newly generated trip
// @route   POST /api/trips
export const createTrip = async (req, res) => {
  try {
    const {
      source,
      destination,
      groupSize,
      budget,
      duration,
      interests,
      itinerary,
      hotelOptions,
      flightDetails,
      budgetBreakdown,
    } = req.body;

    const trip = new Trip({
      user: req.user._id, // From protect middleware
      source,
      destination,
      groupSize,
      budget,
      duration,
      interests,
      itinerary,
      hotelOptions,
      flightDetails,
      budgetBreakdown,
    });

    const savedTrip = await trip.save();
    res.status(201).json(savedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get a single trip by ID
// @route   GET /api/trips/:id
export const getTripById = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ensure the user owns the trip
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    res.json(trip);
  } catch (error) {
    res.status(500).json({ message: "Server error fetching trip details" });
  }
};

// @desc    Get all trips for the logged-in user
// @route   GET /api/trips
export const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(trips);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a specific trip (e.g., manual edits to itinerary)
// @route   PUT /api/trips/:id
export const updateTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    // Ensure the user owns the trip
    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const updatedTrip = await Trip.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(updatedTrip);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a trip
// @route   DELETE /api/trips/:id
export const deleteTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id);

    if (!trip) {
      return res.status(404).json({ message: "Trip not found" });
    }

    if (trip.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: "Not authorized" });
    }

    await trip.deleteOne();
    res.json({ message: "Trip removed successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
