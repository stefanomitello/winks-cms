import { Router } from "express";
import {
  getAllPosts,
  createPost,
  publishPost,
  deletePost,
} from "../controllers/post.controller";

const router = Router();

/**
 * @openapi
 * /api/cms/posts:
 *   get:
 *     produces:
 *       - application/json
 *     summary: Ottieni tutti i post
 *     responses:
 *       200:
 *         description: Lista post
 */
router.get("/posts", getAllPosts);

/**
 * @openapi
 * /api/cms/posts:
 *   post:
 *     produces:
 *       - application/json
 *     summary: Crea un nuovo post
 *     responses:
 *       200:
 *         description: Post creato
 */
router.post("/posts", createPost);

/**
 * @openapi
 * /api/cms/posts/:id/publish:
 *   patch:
 *     summary: Pubblica un post
 *     responses:
 *       200:
 *         description: Post pubblicato
 */
router.patch("/posts/:id/publish", publishPost);

/**
 * @openapi
 * /api/cms/posts/:id:
 *   delete:
 *     summary: Elimina un post
 *     responses:
 *       200:
 *         description: Post eliminato
 */
router.delete("/posts/:id", deletePost);

export default router;
