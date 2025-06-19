"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedinController = exports.LinkedinController = void 0;
const linkedin_1 = require("../services/linkedin");
const errorHandler_1 = require("../middleware/errorHandler");
const logger_1 = require("../config/logger");
class LinkedinController {
    constructor() {
        this.savePost = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const postData = req.body;
            const result = await linkedin_1.linkedinService.savePost(req.user.id, postData);
            const response = {
                success: true,
                data: result.data,
                message: 'LinkedIn post saved successfully',
            };
            logger_1.logger.info('LinkedIn post saved', {
                userId: req.user.id,
                postId: result.data?.id,
                author: postData.author,
                postUrl: postData.postUrl,
            });
            res.json(response);
        });
        this.getPosts = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const queryParams = {
                page: req.query.page ? Math.max(1, parseInt(req.query.page) || 1) : 1,
                limit: req.query.limit ? Math.min(100, Math.max(1, parseInt(req.query.limit) || 20)) : 20,
                search: req.query.search ? String(req.query.search) : undefined,
                author: req.query.author ? String(req.query.author) : undefined,
                startDate: req.query.startDate ? String(req.query.startDate) : undefined,
                endDate: req.query.endDate ? String(req.query.endDate) : undefined,
                sortBy: req.query.sortBy || 'savedAt',
                sortOrder: req.query.sortOrder || 'desc',
            };
            const result = await linkedin_1.linkedinService.getPosts(req.user.id, queryParams);
            const response = {
                success: true,
                data: result.data,
            };
            res.json(response);
        });
        this.getPostById = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const { id } = req.params;
            const result = await linkedin_1.linkedinService.getPostById(req.user.id, id);
            const response = {
                success: true,
                data: result.data,
            };
            res.json(response);
        });
        this.updatePost = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const { id } = req.params;
            const updates = req.body;
            const result = await linkedin_1.linkedinService.updatePost(req.user.id, id, updates);
            const response = {
                success: true,
                data: result.data,
                message: 'LinkedIn post updated successfully',
            };
            logger_1.logger.info('LinkedIn post updated', {
                userId: req.user.id,
                postId: id,
                updates: Object.keys(updates),
            });
            res.json(response);
        });
        this.deletePost = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const { id } = req.params;
            await linkedin_1.linkedinService.deletePost(req.user.id, id);
            const response = {
                success: true,
                message: 'LinkedIn post deleted successfully',
            };
            logger_1.logger.info('LinkedIn post deleted', {
                userId: req.user.id,
                postId: id,
            });
            res.json(response);
        });
        this.getStats = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const result = await linkedin_1.linkedinService.getPostStats(req.user.id);
            const response = {
                success: true,
                data: result.data,
            };
            res.json(response);
        });
        this.bulkDeletePosts = (0, errorHandler_1.catchAsync)(async (req, res) => {
            if (!req.user) {
                const response = {
                    success: false,
                    error: 'User not authenticated',
                };
                return res.status(401).json(response);
            }
            const { postIds } = req.body;
            if (!Array.isArray(postIds) || postIds.length === 0) {
                const response = {
                    success: false,
                    error: 'Post IDs array is required',
                };
                return res.status(400).json(response);
            }
            const result = await linkedin_1.linkedinService.bulkDeletePosts(req.user.id, postIds);
            const response = {
                success: true,
                data: result.data,
                message: `${result.data?.deletedCount || 0} LinkedIn posts deleted successfully`,
            };
            logger_1.logger.info('LinkedIn posts bulk deleted', {
                userId: req.user.id,
                deletedCount: result.data?.deletedCount || 0,
            });
            res.json(response);
        });
    }
}
exports.LinkedinController = LinkedinController;
exports.linkedinController = new LinkedinController();
//# sourceMappingURL=linkedin.js.map