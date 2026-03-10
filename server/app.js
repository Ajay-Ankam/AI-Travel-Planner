import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors()); // Allows your Next.js frontend to connect
app.use(express.json()); // Built-in body parser for JSON

// Basic Route
app.get("/", (req, res) => {
  res.send("AI Travel Planner API is running with ES6 Modules...");
});

// Database Connection (Placeholder for now)
const connectDB = async () => {
  try {
    // await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connection logic goes here...");
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
  );
});

export default app;
