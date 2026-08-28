import express from "express";
import { getWeatherAdvisory } from "../controllers/weather.controller.js";

const router = express.Router();

router.post("/", getWeatherAdvisory);

export default router;
