"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateWebsiteUrl = exports.getWebsiteSummarySchema = exports.createWebsiteSummarySchema = exports.linkedinPostQuerySchema = exports.updateLinkedinPostSchema = exports.saveLinkedinPostSchema = exports.validate = exports.summaryQuerySchema = exports.paginationSchema = exports.updateSummarySchema = exports.saveSummarySchema = exports.generateSummarySchema = exports.updateProfileSchema = exports.verifyEmailSchema = exports.resetPasswordSchema = exports.forgotPasswordSchema = exports.refreshTokenSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
exports.registerSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password too long"),
        name: zod_1.z
            .string()
            .min(1, "Name is required")
            .max(100, "Name too long")
            .optional(),
    }),
});
exports.loginSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
        password: zod_1.z.string().min(1, "Password is required"),
    }),
});
exports.refreshTokenSchema = zod_1.z.object({
    body: zod_1.z.object({
        refreshToken: zod_1.z.string().min(1, "Refresh token is required"),
    }),
});
exports.forgotPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        email: zod_1.z.string().email("Invalid email format").min(1, "Email is required"),
    }),
});
exports.resetPasswordSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
        password: zod_1.z
            .string()
            .min(8, "Password must be at least 8 characters")
            .max(128, "Password too long"),
    }),
});
exports.verifyEmailSchema = zod_1.z.object({
    body: zod_1.z.object({
        token: zod_1.z.string().min(1, "Token is required"),
    }),
});
exports.updateProfileSchema = zod_1.z.object({
    body: zod_1.z.object({
        name: zod_1.z
            .string()
            .min(1, "Name cannot be empty")
            .max(100, "Name too long")
            .optional(),
        avatar: zod_1.z.string().url("Invalid avatar URL").optional(),
    }),
});
const transcriptSegmentSchema = zod_1.z.object({
    timestamp: zod_1.z.string().min(1, "Timestamp is required"),
    text: zod_1.z.string().min(1, "Text is required"),
    startSeconds: zod_1.z.number().optional(),
    endSeconds: zod_1.z.number().optional(),
});
const videoMetadataSchema = zod_1.z.object({
    videoId: zod_1.z.string().min(1, "Video ID is required"),
    title: zod_1.z.string().min(1, "Video title is required"),
    channelName: zod_1.z.string().min(1, "Channel name is required"),
    duration: zod_1.z.string().optional(),
    url: zod_1.z.string().url("Invalid video URL"),
    thumbnailUrl: zod_1.z.string().url("Invalid thumbnail URL").optional(),
    description: zod_1.z.string().optional(),
    publishedAt: zod_1.z.string().optional(),
    viewCount: zod_1.z.number().optional(),
    likeCount: zod_1.z.number().optional(),
});
exports.generateSummarySchema = zod_1.z.object({
    body: zod_1.z.object({
        transcript: zod_1.z
            .array(transcriptSegmentSchema)
            .min(1, "Transcript segments are required"),
        videoMetadata: videoMetadataSchema,
    }),
});
exports.saveSummarySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().min(1, "Title is required").max(200, "Title too long"),
        keyPoints: zod_1.z.array(zod_1.z.string()).min(1, "Key points are required"),
        fullSummary: zod_1.z
            .string()
            .min(1, "Full summary is required")
            .max(5000, "Summary too long"),
        tags: zod_1.z.array(zod_1.z.string()).max(10, "Too many tags"),
        videoMetadata: videoMetadataSchema,
        transcript: zod_1.z.array(transcriptSegmentSchema).optional(),
        transcriptText: zod_1.z.string().optional(),
    }),
});
exports.updateSummarySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, "Title cannot be empty")
            .max(200, "Title too long")
            .optional(),
        keyPoints: zod_1.z.array(zod_1.z.string()).optional(),
        fullSummary: zod_1.z
            .string()
            .min(1, "Summary cannot be empty")
            .max(5000, "Summary too long")
            .optional(),
        tags: zod_1.z.array(zod_1.z.string()).max(10, "Too many tags").optional(),
    }),
});
exports.paginationSchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1))
            .default("1"),
        limit: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1).max(100))
            .default("20"),
    }),
});
exports.summaryQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1))
            .default("1")
            .optional(),
        limit: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1).max(100))
            .default("20")
            .optional(),
        search: zod_1.z.string().max(100).optional(),
        status: zod_1.z.enum(["PENDING", "PROCESSING", "COMPLETED", "FAILED"]).optional(),
        videoId: zod_1.z.string().optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        sortBy: zod_1.z
            .enum(["createdAt", "title", "videoTitle"])
            .default("createdAt")
            .optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc").optional(),
    }),
});
const validate = (schema) => {
    return (req, res, next) => {
        try {
            const result = schema.safeParse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            if (!result.success) {
                const errors = result.error.errors.map((error) => ({
                    field: error.path.join("."),
                    message: error.message,
                }));
                const response = {
                    success: false,
                    error: "Validation failed",
                    data: { errors },
                };
                return res.status(400).json(response);
            }
            req.validatedData = result.data;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.validate = validate;
exports.saveLinkedinPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().max(500, "Title too long").optional(),
        content: zod_1.z.string().min(1, "Content is required").max(10000, "Content too long"),
        author: zod_1.z.string().min(1, "Author is required").max(200, "Author name too long"),
        postUrl: zod_1.z.string().url("Invalid post URL"),
        linkedinPostId: zod_1.z.string().optional(),
        platform: zod_1.z.string().default("linkedin"),
        engagement: zod_1.z.object({
            likes: zod_1.z.number().min(0).optional(),
            comments: zod_1.z.number().min(0).optional(),
            shares: zod_1.z.number().min(0).optional(),
        }).optional(),
        metadata: zod_1.z.object({
            timestamp: zod_1.z.string().optional(),
            source: zod_1.z.string().optional(),
        }).optional(),
    }),
});
exports.updateLinkedinPostSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string().max(500, "Title too long").optional(),
        content: zod_1.z.string().min(1, "Content cannot be empty").max(10000, "Content too long").optional(),
        author: zod_1.z.string().min(1, "Author cannot be empty").max(200, "Author name too long").optional(),
        engagement: zod_1.z.object({
            likes: zod_1.z.number().min(0).optional(),
            comments: zod_1.z.number().min(0).optional(),
            shares: zod_1.z.number().min(0).optional(),
        }).optional(),
        metadata: zod_1.z.object({
            timestamp: zod_1.z.string().optional(),
            source: zod_1.z.string().optional(),
        }).optional(),
    }),
});
exports.linkedinPostQuerySchema = zod_1.z.object({
    query: zod_1.z.object({
        page: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1))
            .default("1")
            .optional(),
        limit: zod_1.z
            .string()
            .transform(Number)
            .pipe(zod_1.z.number().int().min(1).max(100))
            .default("20")
            .optional(),
        search: zod_1.z.string().max(100).optional(),
        author: zod_1.z.string().max(200).optional(),
        startDate: zod_1.z.string().datetime().optional(),
        endDate: zod_1.z.string().datetime().optional(),
        sortBy: zod_1.z
            .enum(["savedAt", "createdAt", "author", "title"])
            .default("savedAt")
            .optional(),
        sortOrder: zod_1.z.enum(["asc", "desc"]).default("desc").optional(),
    }),
});
exports.createWebsiteSummarySchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string()
            .min(1, "Title is required")
            .max(500, "Title too long")
            .trim(),
        content: zod_1.z
            .string()
            .min(100, "Content too short. Minimum 100 characters required for meaningful summarization.")
            .max(100000, "Content too long. Maximum 100,000 characters allowed.")
            .trim(),
        url: zod_1.z
            .string()
            .url("Invalid URL format")
            .max(2000, "URL too long"),
    }),
});
exports.getWebsiteSummarySchema = zod_1.z.object({
    query: zod_1.z.object({
        url: zod_1.z
            .string()
            .url("Invalid URL format")
            .max(2000, "URL too long"),
    }),
});
const validateWebsiteUrl = (url) => {
    try {
        const urlObj = new URL(url);
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }
        const hostname = urlObj.hostname.toLowerCase();
        if (hostname === 'localhost' ||
            hostname === '127.0.0.1' ||
            hostname.startsWith('192.168.') ||
            hostname.startsWith('10.') ||
            hostname.startsWith('172.16.') ||
            hostname.startsWith('172.17.') ||
            hostname.startsWith('172.18.') ||
            hostname.startsWith('172.19.') ||
            hostname.startsWith('172.20.') ||
            hostname.startsWith('172.21.') ||
            hostname.startsWith('172.22.') ||
            hostname.startsWith('172.23.') ||
            hostname.startsWith('172.24.') ||
            hostname.startsWith('172.25.') ||
            hostname.startsWith('172.26.') ||
            hostname.startsWith('172.27.') ||
            hostname.startsWith('172.28.') ||
            hostname.startsWith('172.29.') ||
            hostname.startsWith('172.30.') ||
            hostname.startsWith('172.31.')) {
            return false;
        }
        return true;
    }
    catch {
        return false;
    }
};
exports.validateWebsiteUrl = validateWebsiteUrl;
//# sourceMappingURL=validation.js.map