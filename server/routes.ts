import type { Express } from "express";
import { createServer, type Server } from "http";
import { fortuneInputSchema, type FortuneInput } from "@shared/schema";
import { analyzeFortuneWithAI, analyzeFaceWithAI } from "./openai";
import { ZodError } from "zod";
import { fromError } from "zod-validation-error";

export async function registerRoutes(app: Express): Promise<Server> {
  // Fortune analysis endpoint
  app.post("/api/analyze", async (req, res) => {
    try {
      // Validate input
      const input = fortuneInputSchema.parse(req.body) as FortuneInput;
      
      // Get main fortune analysis
      const result = await analyzeFortuneWithAI(input);
      
      res.json({ success: true, result });
    } catch (error) {
      console.error("Analysis error:", error);
      
      if (error instanceof ZodError) {
        const validationError = fromError(error);
        res.status(400).json({ 
          success: false, 
          error: validationError.message 
        });
        return;
      }
      
      res.status(500).json({ 
        success: false, 
        error: "分析過程發生錯誤，請稍後再試" 
      });
    }
  });

  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  const httpServer = createServer(app);

  return httpServer;
}
