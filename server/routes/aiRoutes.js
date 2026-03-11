import express from "express";
import { getTravelPlan } from "../controllers/aiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Only authenticated users can access the AI Travel Agent
router.post("/plan", protect, getTravelPlan);

export default router;
