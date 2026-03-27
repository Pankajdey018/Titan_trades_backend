import express from "express";
import { addToWatchlist, getWatchlist, removeFromWatchlist } from "../controllers/watchlistController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").get(getWatchlist).post(addToWatchlist);
router.delete("/:symbol", removeFromWatchlist);

export default router;
