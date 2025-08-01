import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertProfileSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get profile by username
  app.get("/api/profiles/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const profile = await storage.getProfileByUsername(username);
      
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Create new profile
  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      
      // Check if username already exists
      const existing = await storage.getProfileByUsername(validatedData.githubUsername);
      if (existing) {
        return res.status(409).json({ message: "Profile with this username already exists" });
      }
      
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update profile
  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const validatedData = insertProfileSchema.partial().parse(req.body);
      
      const profile = await storage.updateProfile(id, validatedData);
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Validation error", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete profile
  app.delete("/api/profiles/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const deleted = await storage.deleteProfile(id);
      
      if (!deleted) {
        return res.status(404).json({ message: "Profile not found" });
      }
      
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // GitHub API proxy to avoid CORS issues
  app.get("/api/github/:username", async (req, res) => {
    try {
      const { username } = req.params;
      const response = await fetch(`https://api.github.com/users/${username}`);
      
      if (!response.ok) {
        return res.status(response.status).json({ message: "GitHub user not found" });
      }
      
      const userData = await response.json();
      res.json(userData);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch GitHub data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
