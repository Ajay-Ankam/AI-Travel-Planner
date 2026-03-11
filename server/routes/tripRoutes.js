import express from "express";
import {
  createTrip,
  getMyTrips,
  updateTrip,
  deleteTrip,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";
import { regenerateTripDay } from "../controllers/tripController.js";

const router = express.Router();

// All trip routes require authentication
router.use(protect);

// --- Base Routes (/api/trips) ---

// Create a new trip
router.post("/", createTrip);

// Get all trips for the logged-in user
router.get("/", getMyTrips);

// --- Parameterized Routes (/api/trips/:id) ---

// Update a specific trip (e.g., adding/removing activities manually)
router.put("/:id", updateTrip);

// Delete a specific trip
router.delete("/:id", deleteTrip);

// Dynamic Refinement Route
router.post('/:id/regenerate-day', regenerateTripDay);

export default router;
