import express from "express";
import {
  createTrip,
  getMyTrips,
  getTripById, // IMPORT NEW FUNCTION
  updateTrip,
  deleteTrip,
  regenerateTripDay,
} from "../controllers/tripController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);

router.post("/", createTrip);
router.get("/", getMyTrips);

// --- Parameterized Routes ---
router.get("/:id", getTripById); // ADD THIS ROUTE
router.put("/:id", updateTrip);
router.delete("/:id", deleteTrip);
router.post("/:id/regenerate-day", regenerateTripDay);

export default router;
