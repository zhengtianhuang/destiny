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
      
      console.log("📸 Photo provided:", !!input.photoBase64);
      if (input.photoBase64) {
        console.log("📸 Photo base64 length:", input.photoBase64.length);
      }
      
      // Get main fortune analysis
      const result = await analyzeFortuneWithAI(input);
      
      // If photo is provided, add face reading analysis
      if (input.photoBase64) {
        console.log("🔍 Starting face reading analysis...");
        try {
          const faceReading = await analyzeFaceWithAI(input.photoBase64);
          console.log("✅ Face reading completed:", faceReading);
          (result as any).faceReading = faceReading;
        } catch (error) {
          console.error("❌ Face reading error:", error);
          // Continue without face reading if it fails
        }
      }
      
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

  // Face reading only endpoint
  app.post("/api/analyze-face", async (req, res) => {
    try {
      const { photoBase64 } = req.body;
      
      if (!photoBase64 || typeof photoBase64 !== "string") {
        res.status(400).json({ 
          success: false, 
          error: "請提供照片進行面相分析" 
        });
        return;
      }
      
      console.log("🔍 Starting face-only analysis...");
      const faceReading = await analyzeFaceWithAI(photoBase64);
      console.log("✅ Face reading completed:", faceReading);
      
      res.json({ success: true, faceReading });
    } catch (error) {
      console.error("Face analysis error:", error);
      res.status(500).json({ 
        success: false, 
        error: "面相分析過程發生錯誤，請稍後再試" 
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
