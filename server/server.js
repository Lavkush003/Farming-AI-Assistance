// // server.js
// import express from "express";
// import dotenv from 'dotenv'
// import cors from "cors";
// import fs from "fs";
// import path from "path";
// import { body, validationResult } from "express-validator";
// import connectDB from "./config/db.js";
// import contactRouter from "./routes/contact.route.js";

// dotenv.config();

// // Database connection
// await connectDB();

// const app = express();
// app.use(express.json({ limit: "10mb" }));
// app.use(express.urlencoded({ limit: "10mb", extended: true }));
// app.use(cors());



// // JSON file path for storing contact form data
// const filePath = path.join(process.cwd(), "contact.json");


// // ------------------------ AUTH API ------------------------
// import authRouter from "./routes/auth.route.js";
// app.use("/api/auth", authRouter);



// // Contact Router
// // Contact Router
// app.use("/api/contact", contactRouter);

// // Product Router
// import productRouter from "./routes/product.route.js";
// app.use("/api/products", productRouter);

// // Chat Router
// import chatRouter from "./routes/chat.route.js";
// app.use("/api/chat", chatRouter);
// // ------------------------ START SERVER ------------------------
// const PORT = 5000;
// app.listen(PORT, () => {
//   console.log(`🚀 Server running at http://localhost:${PORT}`);
// });




import "dotenv/config";

import express from "express";
import cors from "cors";

import connectDB from "./config/db.js";

import contactRouter from "./routes/contact.route.js";
import authRouter from "./routes/auth.route.js";
import productRouter from "./routes/product.route.js";
import chatRouter from "./routes/chat.route.js";
import weatherRouter from "./routes/weather.route.js";
import visionRouter from "./routes/vision.route.js";
import forumRouter from "./routes/forum.route.js";
import financeRouter from "./routes/finance.route.js";
import equipmentRouter from "./routes/equipment.route.js";

// Check Gemini API key
if (process.env.GEMINI_API_KEY) {
  console.log("✅ GEMINI_API_KEY loaded successfully");
} else {
  console.error("❌ GEMINI_API_KEY is NOT configured");
}

// Connect to database
await connectDB();

// Create Express application
const app = express();

// Middleware
app.use(express.json({ limit: "20mb" })); // Increased limit for image uploads
app.use(express.urlencoded({ limit: "20mb", extended: true }));
app.use(cors());

// Authentication API
app.use("/api/auth", authRouter);

// Contact API
app.use("/api/contact", contactRouter);

// Product API
app.use("/api/products", productRouter);

// Chat / Gemini API
app.use("/api/chat", chatRouter);

// Weather API
app.use("/api/weather-advisory", weatherRouter);

// Vision API
app.use("/api/vision", visionRouter);

// Forum API
app.use("/api/forum", forumRouter);

// Finance API
app.use("/api/finance", financeRouter);

// Equipment API
app.use("/api/equipment", equipmentRouter);

// Home / health check
app.get("/", (req, res) => {
  res.json({
    message: "FarmingHub API is running successfully"
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found"
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Server Error:", err);

  res.status(500).json({
    error: "Internal server error"
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`💬 Chat API: http://localhost:${PORT}/api/chat`);
  console.log(`🌦️  Weather API: http://localhost:${PORT}/api/weather-advisory`);
  console.log(`📸 Vision API: http://localhost:${PORT}/api/vision/disease-detect`);
});