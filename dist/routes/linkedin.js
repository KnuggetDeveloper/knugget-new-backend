"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const linkedin_1 = require("../controllers/linkedin");
const auth_1 = require("../middleware/auth");
const validation_1 = require("../middleware/validation");
const validation_2 = require("../middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.post('/posts', (0, validation_1.validate)(validation_2.saveLinkedinPostSchema), linkedin_1.linkedinController.savePost);
router.get('/posts', linkedin_1.linkedinController.getPosts);
router.get('/posts/stats', linkedin_1.linkedinController.getStats);
router.get('/posts/:id', linkedin_1.linkedinController.getPostById);
router.put('/posts/:id', (0, validation_1.validate)(validation_2.updateLinkedinPostSchema), linkedin_1.linkedinController.updatePost);
router.delete('/posts/:id', linkedin_1.linkedinController.deletePost);
router.post('/posts/bulk-delete', linkedin_1.linkedinController.bulkDeletePosts);
exports.default = router;
//# sourceMappingURL=linkedin.js.map