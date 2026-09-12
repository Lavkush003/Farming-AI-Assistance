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

// ==========================================
// Check required environment variables
// ==========================================

if (process.env.GEMINI_API_KEY) {
  console.log("✅ GEMINI_API_KEY loaded successfully");
} else {
  console.error("❌ GEMINI_API_KEY is NOT configured");
}

// ==========================================
// Connect to MongoDB
// ==========================================

await connectDB();

// ==========================================
// Create Express application
// ==========================================

const app = express();

// ==========================================
// CORS Configuration
// ==========================================

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://farming-ai-assistance-a6gev55vk-lavkush003s-projects.vercel.app",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests without an Origin header
      // such as Postman/server-to-server requests.
      if (!origin) {
        return callback(null, true);
      }

      // Check if origin matches allowed origins or is a Vercel deployment
      if (allowedOrigins.includes(origin) || origin.includes("vercel.app")) {
        return callback(null, true);
      }

      console.warn(`⚠️ CORS blocked origin: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ==========================================
// Body Parsers
// ==========================================

app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ limit: "20mb", extended: true }));

// ==========================================
// API Routes
// ==========================================

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

// ==========================================
// Health Check
// ==========================================

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "FarmingHub API is running successfully",
  });
});

// ==========================================
// 404 Handler
// ==========================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
    path: req.originalUrl,
  });
});

// ==========================================
// Global Error Handler
// ==========================================

app.use((err, req, res, next) => {
  console.error("❌ Server Error:", err);

  // Handle CORS errors
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      error: "CORS origin not allowed",
    });
  }

  res.status(500).json({
    success: false,
    error: "Internal server error",
  });
});

// ==========================================
// Start Server
// ==========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log("==========================================");
  console.log("🚀 FarmingHub backend started successfully");
  console.log(`📡 Port: ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
  console.log("==========================================");
  console.log(`💬 Chat API: /api/chat`);
  console.log(`🌦️ Weather API: /api/weather-advisory`);
  console.log(`📸 Vision API: /api/vision`);
  console.log(`💬 Forum API: /api/forum`);
  console.log(`💰 Finance API: /api/finance`);
  console.log(`🚜 Equipment API: /api/equipment`);
  console.log("==========================================");
});