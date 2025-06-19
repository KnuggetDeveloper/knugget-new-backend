"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkedinService = exports.LinkedinService = void 0;
const database_1 = require("../config/database");
const logger_1 = require("../config/logger");
const errorHandler_1 = require("../middleware/errorHandler");
class LinkedinService {
    async savePost(userId, data) {
        try {
            const existingPost = await database_1.prisma.linkedinPost.findFirst({
                where: {
                    userId,
                    postUrl: data.postUrl,
                },
            });
            if (existingPost) {
                return {
                    success: true,
                    data: this.formatPost(existingPost),
                };
            }
            const linkedinPost = await database_1.prisma.linkedinPost.create({
                data: {
                    title: data.title || null,
                    content: data.content,
                    author: data.author,
                    postUrl: data.postUrl,
                    linkedinPostId: data.linkedinPostId || null,
                    platform: data.platform || 'linkedin',
                    engagement: data.engagement ? JSON.stringify(data.engagement) : undefined,
                    metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
                    userId,
                },
            });
            logger_1.logger.info('LinkedIn post saved successfully', {
                userId,
                postId: linkedinPost.id,
                author: data.author,
                postUrl: data.postUrl,
            });
            return {
                success: true,
                data: this.formatPost(linkedinPost),
            };
        }
        catch (error) {
            logger_1.logger.error('LinkedIn post save failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                postData: {
                    author: data.author,
                    postUrl: data.postUrl,
                },
            });
            throw error instanceof errorHandler_1.AppError
                ? error
                : new errorHandler_1.AppError('Failed to save LinkedIn post', 500);
        }
    }
    async getPosts(userId, params = {}) {
        try {
            const { page = 1, limit = 20, search, author, startDate, endDate, sortBy = 'savedAt', sortOrder = 'desc', } = params;
            const where = {
                userId,
                ...(author && {
                    author: {
                        contains: author,
                        mode: 'insensitive'
                    }
                }),
                ...(startDate &&
                    endDate && {
                    savedAt: {
                        gte: new Date(startDate),
                        lte: new Date(endDate),
                    },
                }),
                ...(search && {
                    OR: [
                        { title: { contains: search, mode: 'insensitive' } },
                        { content: { contains: search, mode: 'insensitive' } },
                        { author: { contains: search, mode: 'insensitive' } },
                    ],
                }),
            };
            const total = await database_1.prisma.linkedinPost.count({ where });
            const posts = await database_1.prisma.linkedinPost.findMany({
                where,
                orderBy: { [sortBy]: sortOrder },
                skip: (page - 1) * limit,
                take: limit,
            });
            const totalPages = Math.ceil(total / limit);
            const response = {
                data: posts.map((post) => this.formatPost(post)),
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages,
                    hasNext: page < totalPages,
                    hasPrev: page > 1,
                },
            };
            return { success: true, data: response };
        }
        catch (error) {
            logger_1.logger.error('Get LinkedIn posts failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                params,
            });
            throw new errorHandler_1.AppError('Failed to get LinkedIn posts', 500);
        }
    }
    async getPostById(userId, postId) {
        try {
            const post = await database_1.prisma.linkedinPost.findFirst({
                where: {
                    id: postId,
                    userId,
                },
            });
            if (!post) {
                throw new errorHandler_1.AppError('LinkedIn post not found', 404);
            }
            return {
                success: true,
                data: this.formatPost(post),
            };
        }
        catch (error) {
            logger_1.logger.error('Get LinkedIn post by ID failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                postId,
            });
            throw error instanceof errorHandler_1.AppError
                ? error
                : new errorHandler_1.AppError('Failed to get LinkedIn post', 500);
        }
    }
    async updatePost(userId, postId, updates) {
        try {
            const existingPost = await database_1.prisma.linkedinPost.findFirst({
                where: {
                    id: postId,
                    userId,
                },
            });
            if (!existingPost) {
                throw new errorHandler_1.AppError('LinkedIn post not found', 404);
            }
            const updatedPost = await database_1.prisma.linkedinPost.update({
                where: { id: postId },
                data: {
                    ...(updates.title !== undefined && { title: updates.title }),
                    ...(updates.content && { content: updates.content }),
                    ...(updates.author && { author: updates.author }),
                    ...(updates.engagement && {
                        engagement: JSON.stringify(updates.engagement)
                    }),
                    ...(updates.metadata && {
                        metadata: JSON.stringify(updates.metadata)
                    }),
                },
            });
            logger_1.logger.info('LinkedIn post updated successfully', {
                userId,
                postId,
                updates: Object.keys(updates),
            });
            return {
                success: true,
                data: this.formatPost(updatedPost),
            };
        }
        catch (error) {
            logger_1.logger.error('LinkedIn post update failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                postId,
            });
            throw error instanceof errorHandler_1.AppError
                ? error
                : new errorHandler_1.AppError('Failed to update LinkedIn post', 500);
        }
    }
    async deletePost(userId, postId) {
        try {
            const post = await database_1.prisma.linkedinPost.findFirst({
                where: {
                    id: postId,
                    userId,
                },
            });
            if (!post) {
                throw new errorHandler_1.AppError('LinkedIn post not found', 404);
            }
            await database_1.prisma.linkedinPost.delete({
                where: { id: postId },
            });
            logger_1.logger.info('LinkedIn post deleted successfully', {
                userId,
                postId,
                author: post.author,
            });
            return { success: true };
        }
        catch (error) {
            logger_1.logger.error('LinkedIn post deletion failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                postId,
            });
            throw error instanceof errorHandler_1.AppError
                ? error
                : new errorHandler_1.AppError('Failed to delete LinkedIn post', 500);
        }
    }
    async bulkDeletePosts(userId, postIds) {
        try {
            if (postIds.length === 0) {
                return { success: true, data: { deletedCount: 0 } };
            }
            const result = await database_1.prisma.linkedinPost.deleteMany({
                where: {
                    id: { in: postIds },
                    userId,
                },
            });
            logger_1.logger.info('LinkedIn posts bulk deleted', {
                userId,
                deletedCount: result.count,
                requestedCount: postIds.length,
            });
            return {
                success: true,
                data: { deletedCount: result.count },
            };
        }
        catch (error) {
            logger_1.logger.error('LinkedIn posts bulk deletion failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
                postCount: postIds.length,
            });
            throw new errorHandler_1.AppError('Failed to delete LinkedIn posts', 500);
        }
    }
    async getPostStats(userId) {
        try {
            const now = new Date();
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            const [totalPosts, postsThisMonth, postsThisWeek, topAuthors, recentPosts,] = await Promise.all([
                database_1.prisma.linkedinPost.count({
                    where: { userId },
                }),
                database_1.prisma.linkedinPost.count({
                    where: {
                        userId,
                        savedAt: { gte: startOfMonth },
                    },
                }),
                database_1.prisma.linkedinPost.count({
                    where: {
                        userId,
                        savedAt: { gte: startOfWeek },
                    },
                }),
                database_1.prisma.linkedinPost.groupBy({
                    by: ['author'],
                    where: { userId },
                    _count: { author: true },
                    orderBy: { _count: { author: 'desc' } },
                    take: 10,
                }),
                database_1.prisma.linkedinPost.findMany({
                    where: { userId },
                    orderBy: { savedAt: 'desc' },
                    take: 5,
                    select: {
                        id: true,
                        title: true,
                        author: true,
                        savedAt: true,
                    },
                }),
            ]);
            const stats = {
                totalPosts,
                postsThisMonth,
                postsThisWeek,
                topAuthors: topAuthors.map(item => ({
                    author: item.author,
                    count: item._count.author,
                })),
                recentActivity: recentPosts.map(post => ({
                    id: post.id,
                    title: post.title || `Post by ${post.author}`,
                    author: post.author,
                    savedAt: post.savedAt.toISOString(),
                })),
            };
            return { success: true, data: stats };
        }
        catch (error) {
            logger_1.logger.error('Get LinkedIn post stats failed', {
                error: error instanceof Error ? error.message : 'Unknown error',
                userId,
            });
            throw new errorHandler_1.AppError('Failed to get LinkedIn post statistics', 500);
        }
    }
    formatPost(post) {
        return {
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author,
            postUrl: post.postUrl,
            linkedinPostId: post.linkedinPostId,
            platform: post.platform,
            engagement: post.engagement ? JSON.parse(post.engagement) : null,
            metadata: post.metadata ? JSON.parse(post.metadata) : null,
            savedAt: post.savedAt.toISOString(),
            createdAt: post.createdAt.toISOString(),
            updatedAt: post.updatedAt.toISOString(),
        };
    }
}
exports.LinkedinService = LinkedinService;
exports.linkedinService = new LinkedinService();
//# sourceMappingURL=linkedin.js.map