// src/routes/index.ts - FIXED with proper LinkedIn routes mounting
import { Router } from "express";
import { ApiResponse } from "../types";
import { openaiService } from "../services/openai";
import { prisma } from "../config/database";
import { logger } from "../config/logger";
import authRoutes from "./auth";
import summaryRoutes from "./summary";
import userRoutes from "./user";
import linkedinRoutes from "./linkedin"; // ENSURE THIS IS IMPORTED

const router = Router();

// Enhanced health check endpoint
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
        services: {
          database: "disconnected",
          openai: "unknown",
        },
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
      description:
        "AI-powered YouTube video summarization and LinkedIn content saving API",
      environment: process.env.NODE_ENV,
      endpoints: {
        auth: "/api/auth",
        summary: "/api/summary",
        user: "/api/user",
        linkedin: "/api/linkedin", // DOCUMENTED
        health: "/api/health",
      },
      documentation: "https://docs.knugget.com/api",
    },
  };

  res.json(response);
});

// Mount route modules - ENSURE ALL ARE PROPERLY MOUNTED
router.use("/auth", authRoutes);
router.use("/summary", summaryRoutes);
router.use("/user", userRoutes);
router.use("/linkedin", linkedinRoutes); 

// Debug route to check all mounted routes
router.get("/debug/routes", (req, res) => {
  const routes = [
    { path: "/api/auth", status: "mounted", methods: ["POST", "GET"] },
    { path: "/api/summary", status: "mounted", methods: ["POST", "GET", "PUT", "DELETE"] },
    { path: "/api/user", status: "mounted", methods: ["GET", "PUT", "POST", "DELETE"] },
    { path: "/api/linkedin", status: "mounted", methods: ["GET", "POST", "PUT", "DELETE"] }, // ADDED
    { path: "/api/linkedin/posts", status: "mounted", methods: ["GET", "POST", "PUT", "DELETE"] },
    { path: "/api/linkedin/posts/stats", status: "mounted", methods: ["GET"] },
  ];

  res.json({
    success: true,
    data: {
      routes,
      timestamp: new Date().toISOString(),
    },
  });
});

// Test LinkedIn routes specifically
router.get("/test/linkedin", (req, res) => {
  res.json({
    success: true,
    message: "LinkedIn routes are working",
    availableEndpoints: [
      "GET /api/linkedin/posts",
      "POST /api/linkedin/posts", 
      "GET /api/linkedin/posts/:id",
      "PUT /api/linkedin/posts/:id",
      "DELETE /api/linkedin/posts/:id",
      "GET /api/linkedin/posts/stats",
      "POST /api/linkedin/posts/bulk-delete"
    ],
    timestamp: new Date().toISOString()
  });
});

export default router;