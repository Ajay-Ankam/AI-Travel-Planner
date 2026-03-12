import { GoogleGenAI } from "@google/genai";
import { generateTripPrompt } from "../utils/promptHelper.js";
import Trip from "../models/Trip.js"; // IMPORT TRIP MODEL
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const getTravelPlan = async (req, res) => {
  const { formData } = req.body;

  if (!formData) {
    return res.status(400).json({ error: "Missing trip details." });
  }

  try {
    const promptText = generateTripPrompt(formData);

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            { text: `${promptText}\nRemember: Respond ONLY in valid JSON.` },
          ],
        },
      ],
    });

    let cleanedText = response.text.replace(/```json|```/g, "").trim();
    let parsedData = JSON.parse(cleanedText);

    // Get the actual data object (handle potential 'resp' wrapper from helper)
    const tripData = parsedData.resp || parsedData;

    // --- SAVE TO DATABASE ---
    const newTrip = new Trip({
      user: req.user._id, // Available via 'protect' middleware
      source: formData.source,
      destination: formData.destination,
      duration: formData.duration,
      budget: formData.budget,
      groupSize: formData.groupSize,
      interests: formData.interests || [],
      // Map AI response fields to Schema fields
      itinerary: tripData.itinerary,
      hotelOptions: tripData.hotelOptions,
      flightDetails: tripData.flightDetails,
      budgetBreakdown: tripData.budgetBreakdown,
    });

    const savedTrip = await newTrip.save();

    // Send the saved trip (with its new _id) back to frontend
    res.status(201).json(savedTrip);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({ error: "Failed to generate and save trip." });
  }
};
