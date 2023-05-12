import express from "express";
import { createPost, getUserPosts, getPostById, updatePost, deletePost, getCommentsById, commentPost, likePost } from "../controllers/posts.js";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/createPost", auth, createPost);
router.get("/getUserPosts", getUserPosts)
router.get("/getPostById", getPostById)
router.patch("/updatePost", updatePost)
router.delete("/deletePost", deletePost)
router.get("/getCommentsById", getCommentsById)
router.post("/addComment", auth, commentPost)
router.post("/likePostSpecial", auth, likePost)

export default router;