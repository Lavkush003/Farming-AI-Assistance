import express from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import fs from "fs";
import path from "path";

const LOG_FILE = path.join(process.cwd(), "login_logs.json");

const router = express.Router();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post(
  "/register",
  [
    body("name", "Name is required").not().isEmpty(),
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password must be at least 6 characters").isLength({
      min: 6,
    }),
    body("address", "Address is required").not().isEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password, address, phone } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "User already exists" }] });
      }

      user = new User({
        name,
        email,
        password,
        address,
        phone,
      });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error(err.message);
      res.status(503).json({ error: "Database unavailable. Please try again shortly." });
    }
  }
);

// @route   POST /api/auth/login
// @desc    Authenticate user & get token (or just success for now)
// @access  Public
router.post(
  "/login",
  [
    body("email", "Please include a valid email").isEmail(),
    body("password", "Password is required").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: "Invalid Credentials" }] });
      }

      // --- LOGGING LOGIC ---
      try {
        // 1. Update MongoDB
        user.loginCount = (user.loginCount || 0) + 1;
        await user.save();

        // 2. Update JSON File
        let logs = {};
        if (fs.existsSync(LOG_FILE)) {
          const fileData = fs.readFileSync(LOG_FILE, "utf-8");
          try {
            logs = JSON.parse(fileData);
          } catch (e) {
            logs = {}; // Reset if corrupted
          }
        }

        // Use User ID as key
        logs[user._id] = (logs[user._id] || 0) + 1;

        fs.writeFileSync(LOG_FILE, JSON.stringify(logs, null, 2));

      } catch (logErr) {
        console.error("Error logging login:", logErr);
        // Do not fail the login response if logging fails, mostly
      }
      // ---------------------

      // Return user info excluding password
      const userPayload = {
        id: user._id,
        name: user.name,
        email: user.email,
        address: user.address,
      };

      res.json({ message: "Login successful", user: userPayload });
    } catch (err) {
      console.error(err.message);
      res.status(503).json({ error: "Database unavailable. Please try again shortly." });
    }
  }
);

export default router;
