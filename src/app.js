import express from "express";
import cors from "cors";
import connectDB from "./database/db.js";
import HoldingsModel from "./models/holdingModel.js";
import PositionsModel from "./models/positionModel.js";
import OrdersModel from "./models/OrderModel.js";
import authRoutes from "./routes/authRoutes.js";

// database connection
connectDB();

const app = express();

// Use the auth routes
app.use("/auth", authRoutes);

// Enable CORS
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// Middleware to parse JSON and URL-encoded data with a size limit of 40kb
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ extended: true, limit: "40kb" }));

app.set("port", process.env.PORT || 3000);


// GET all holdings
app.get("/allHoldings", async (req, res) => {
  try {
    const allHoldings = await HoldingsModel.find({});
    res.json(allHoldings);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch holdings" });
  }
});


// GET all positions
app.get("/allPositions", async (req, res) => {
  try {
    const allPositions = await PositionsModel.find({});
    res.json(allPositions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch positions" });
  }
});


// Create new order
app.post("/newOrder", async (req, res) => {
  try {
    const newOrder = new OrdersModel({
      name: req.body.name,
      qty: req.body.qty,
      price: req.body.price,
      mode: req.body.mode,
    });

    await newOrder.save();

    res.send("Order saved!");
  } catch (error) {
    res.status(500).json({ error: "Failed to save order" });
  }
});


// Start server
const startServer = () => {
  app.listen(app.get("port"), () => {
    console.log(`Server is running on port ${app.get("port")}`);
  });
};

startServer();