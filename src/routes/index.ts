import { Router } from "express";
import { ApiResponse } from "../types";
import { openaiService } from "../services/openai";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

// Import existing routes
import authRoutes from "./auth";
import summaryRoutes from "./summary";
import userRoutes from "./user";
import linkedinRoutes from "./linkedin";
import websiteSummaryRoutes from "./website"; // NEW IMPORT

const router = Router();

// Health check endpoint
router.get("/health", async (req, res) => {
  try {
    // Test database connection
    await prisma.$queryRaw`SELECT 1`;

    // Test OpenAI connection
    const openaiTest = await openaiService.testConnection();

    const response: ApiResponse = {
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        services: {
          database: "connected",
          openai: openaiTest.success ? "connected" : "disconnected",
        },
        version: "1.0.0",
        uptime: process.uptime(),
      },
    };

    res.json(response);
  } catch (error) {
    logger.error("Health check failed", { error });

    const response: ApiResponse = {
      success: false,
      error: "Health check failed",
      data: {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
      },
    };

    res.status(503).json(response);
  }
});

// API information endpoint
router.get("/", (req, res) => {
  const response: ApiResponse = {
    success: true,
    data: {
      name: "Knugget AI API",
      version: "1.0.0",
      description: "AI-powered content summarization API for YouTube videos, LinkedIn posts, and website articles",
      environment: process.env.NODE_ENV,
      endpoints: {
        auth: "/api/auth",
        summary: "/api/summary",
        user: "/api/user",
        linkedin: "/api/linkedin",
        website: "/api/website", // NEW ENDPOINT
        health: "/api/health",
      },
      documentation: "https://docs.knugget.com/api",
    },
  };

  res.json(response);
});

// Mount route modules
router.use("/auth", authRoutes);
router.use("/summary", summaryRoutes);
router.use("/user", userRoutes);
router.use("/linkedin", linkedinRoutes);
router.use("/website", websiteSummaryRoutes); // NEW ROUTE MOUNT

export default router;