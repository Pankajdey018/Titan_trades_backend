import express from "express";
import { cancelOrder, getOrderById, getOrderHistory, placeOrder } from "../controllers/orderController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.use(protect);
router.route("/").post(placeOrder).get(getOrderHistory);
router.route("/:id").get(getOrderById).delete(cancelOrder);

export default router;
