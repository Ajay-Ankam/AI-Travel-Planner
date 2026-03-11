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
      model: "gemini-2.0-flash", // Using the latest stable high-speed model
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

    // Clean the response: sometimes LLMs wrap JSON in ```json blocks
    let cleanedText = response.text.replace(/```json|```/g, "").trim();

    const parsedData = JSON.parse(cleanedText);
    res.status(200).json(parsedData);
  } catch (error) {
    console.error("AI Generation Error:", error);
    res.status(500).json({
      resp: "I'm having trouble processing that right now. Could we try again?",
      ui: "source",
    });
  }
};
