import { sql } from "drizzle-orm";
import { pgTable, text, varchar, json, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const profiles = pgTable("profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  githubUsername: text("github_username").notNull(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  bio: text("bio").default(""),
  email: text("email").default(""),
  location: text("location").default(""),
  website: text("website").default(""),
  linkedinUrl: text("linkedin_url").default(""),
  twitterUrl: text("twitter_url").default(""),
  kaggleUrl: text("kaggle_url").default(""),
  currentFocus: text("current_focus").default(""),
  technologies: json("technologies").$type<TechStack[]>().default([]),
  socialLinks: json("social_links").$type<SocialLink[]>().default([]),
  customSections: json("custom_sections").$type<CustomSection[]>().default([]),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const TechStackSchema = z.object({
  name: z.string(),
  category: z.enum(["language", "framework", "database", "tool", "cloud", "other"]),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"]),
  badgeUrl: z.string().optional(),
});

export const SocialLinkSchema = z.object({
  platform: z.string(),
  url: z.string(),
  badgeUrl: z.string().optional(),
});

export const CustomSectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  order: z.number(),
});

export const insertProfileSchema = createInsertSchema(profiles, {
  technologies: z.array(TechStackSchema).optional(),
  socialLinks: z.array(SocialLinkSchema).optional(),
  customSections: z.array(CustomSectionSchema).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type TechStack = z.infer<typeof TechStackSchema>;
export type SocialLink = z.infer<typeof SocialLinkSchema>;
export type CustomSection = z.infer<typeof CustomSectionSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;
