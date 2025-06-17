// src/routes/linkedin.ts
import { Router } from "express";
import { linkedinController } from "../controllers/linkedin";
import { authenticate } from "../middleware/auth";
import { validate } from "../middleware/validation";
import { generalRateLimit } from "../middleware/rateLimit";
import {
  saveLinkedinPostSchema,
  updateLinkedinPostSchema,
} from "../middleware/validation";
import { logger } from "../config/logger";

const router = Router();

// Debug endpoint to test LinkedIn routes
router.get("/test", (req, res) => {
  res.json({
    success: true,
    message: "LinkedIn routes are working",
    timestamp: new Date().toISOString(),
    auth: req.headers.authorization ? "present" : "missing",
    path: req.path,
    method: req.method,
  });
});

// Debug middleware to log all requests
router.use((req, res, next) => {
  logger.info(`LinkedIn Route: ${req.method} ${req.path}`, {
    query: req.query,
    params: req.params,
    headers: {
      authorization: req.headers.authorization ? "Bearer [REDACTED]" : "none",
      "content-type": req.headers["content-type"],
    },
  });
  next();
});

// All LinkedIn routes require authentication
router.use(authenticate as any);

// Save LinkedIn post
router.post(
  "/posts",
  generalRateLimit,
  validate(saveLinkedinPostSchema) as any,
  linkedinController.savePost
);

// Get user's LinkedIn posts with pagination and filtering
router.get("/posts", generalRateLimit, linkedinController.getPosts);

// Get LinkedIn post statistics
router.get("/posts/stats", generalRateLimit, linkedinController.getStats);

// Bulk delete LinkedIn posts (must come before /:id routes)
router.post(
  "/posts/bulk-delete",
  generalRateLimit,
  linkedinController.bulkDeletePosts
);

// Get single LinkedIn post by ID
router.get("/posts/:id", generalRateLimit, linkedinController.getPostById);

// Update LinkedIn post
router.put(
  "/posts/:id",
  generalRateLimit,
  validate(updateLinkedinPostSchema) as any,
  linkedinController.updatePost
);

// Delete LinkedIn post
router.delete("/posts/:id", generalRateLimit, linkedinController.deletePost);

export default router;
