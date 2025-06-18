import { Router } from 'express';
import { linkedinController } from '../controllers/linkedin';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validation';
import {
  saveLinkedinPostSchema,
  updateLinkedinPostSchema,
} from '../middleware/validation';

const router = Router();

// All LinkedIn routes require authentication - NO RATE LIMITING
router.use(authenticate as any);

// Save LinkedIn post - NO RATE LIMITING
router.post(
  '/posts',
  validate(saveLinkedinPostSchema) as any,
  linkedinController.savePost
);

// Get user's LinkedIn posts with pagination and filtering - NO RATE LIMITING
router.get(
  '/posts',
  linkedinController.getPosts
);

// Get LinkedIn post statistics - NO RATE LIMITING
router.get(
  '/posts/stats',
  linkedinController.getStats
);

// Get single LinkedIn post by ID - NO RATE LIMITING
router.get(
  '/posts/:id',
  linkedinController.getPostById
);

// Update LinkedIn post - NO RATE LIMITING
router.put(
  '/posts/:id',
  validate(updateLinkedinPostSchema) as any,
  linkedinController.updatePost
);

// Delete LinkedIn post - NO RATE LIMITING
router.delete(
  '/posts/:id',
  linkedinController.deletePost
);

// Bulk delete LinkedIn posts - NO RATE LIMITING
router.post(
  '/posts/bulk-delete',
  linkedinController.bulkDeletePosts
);

export default router;