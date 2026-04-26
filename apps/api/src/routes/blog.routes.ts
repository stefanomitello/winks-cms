import { Router } from "express";
import {
  getPublishedPosts,
  getPublishedPostById,
} from "../controllers/post.controller";

const router = Router();

/**
 * @openapi
 * /api/blog/posts:
 *   get:
 *     produces:
 *       - application/json
 *     summary: Ottieni tutti i post
 *     responses:
 *       200:
 *         description: Lista post
 */
router.get("/posts", getPublishedPosts);

/**
 * @openapi
 * /api/blog/posts/:id:
 *   get:
 *     summary: Ottieni un post
 *     responses:
 *       200:
 *         description: Post
 */
router.get("/posts/:id", getPublishedPostById);

export default router;
