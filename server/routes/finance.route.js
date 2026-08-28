import express from "express";
import { getFinances, addFinanceRecord, deleteFinanceRecord } from "../controllers/finance.controller.js";

const router = express.Router();

router.get("/:sellerId", getFinances);
router.post("/", addFinanceRecord);
router.delete("/:id", deleteFinanceRecord);

export default router;
