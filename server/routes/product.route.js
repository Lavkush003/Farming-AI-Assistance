import express from "express";
import { createProduct, getMyProducts, deleteProduct, getAllProducts } from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getAllProducts);
router.post("/", createProduct);
router.get("/my-products/:userId", getMyProducts);
router.delete("/:id", deleteProduct);

export default router;
