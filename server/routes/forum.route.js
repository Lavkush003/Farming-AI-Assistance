import express from "express";
import { getAllPosts, createPost, addComment, likePost, deletePost } from "../controllers/forum.controller.js";

const router = express.Router();

router.get("/", getAllPosts);
router.post("/", createPost);
router.post("/:id/comment", addComment);
router.patch("/:id/like", likePost);
router.delete("/:id", deletePost);

export default router;
