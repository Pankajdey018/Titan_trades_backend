import express from "express";
import { getOrderHistory, placeOrder } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(placeOrder).get(getOrderHistory);

export default router;
