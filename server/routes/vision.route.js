import express from "express";
import { detectDisease } from "../controllers/vision.controller.js";

const router = express.Router();

router.post("/disease-detect", detectDisease);

export default router;
