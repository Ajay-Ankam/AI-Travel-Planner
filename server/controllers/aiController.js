import { GoogleGenAI } from "@google/genai";
import { TRAVEL_PLANNER_PROMPT } from "../utils/promptHelper.js";
import dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export const getTravelPlan = async (req, res) => {
  const { message, history } = req.body;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `${TRAVEL_PLANNER_PROMPT}
              
              Conversation History:
              ${JSON.stringify(history)}
              
              User Message:
              ${message}
              
              Remember: Respond ONLY in valid JSON format.`,
            },
          ],
        },
      ],
    });

    // Clean the response: sometimes LLMs wrap JSON in markdown blocks
    let cleanedText = response.text.replace(/```json|```/g, "").trim();
    const parsedData = JSON.parse(cleanedText);

    // --- BUDGET & RECOMMENDATION VALIDATION ---
    if (parsedData.ui === "final" && typeof parsedData.resp === "object") {
      const plan = parsedData.resp;
      const groupMultiplier = parseInt(plan.tripSummary?.totalGroupSize) || 1;
      const duration = parseInt(plan.tripSummary?.duration) || 1;

      // 1. Validate Flight Totals (Ensure it's per group, not per person)
      if (plan.flightRecommendations) {
        plan.flightRecommendations = plan.flightRecommendations.map(
          (flight) => ({
            ...flight,
            // If the AI gave a tiny number, it likely forgot the multiplier
            estimatedCostTotal:
              flight.estimatedCostTotal < 100
                ? flight.estimatedCostTotal * groupMultiplier
                : flight.estimatedCostTotal,
          }),
        );
      }

      // 2. Sync the Budget Breakdown
      // We ensure the totalEstimated field matches the sum of its parts
      if (plan.budgetBreakdown) {
        const { flights, accommodation, food, activities } =
          plan.budgetBreakdown;
        plan.budgetBreakdown.totalEstimated =
          flights + accommodation + food + activities;
      }
    }

    res.status(200).json(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);

    // Handle Rate Limiting Specifically
    if (error.status === 429) {
      return res.status(429).json({
        resp: "The travel agent is currently busy. Please wait a moment before asking again.",
        ui: "error",
      });
    }

    res.status(500).json({
      resp: "I'm having trouble processing that right now. Could we try again?",
      ui: "source",
    });
  }
};
