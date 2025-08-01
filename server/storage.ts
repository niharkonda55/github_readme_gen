import { type Profile, type InsertProfile } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUsername(username: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile | undefined>;
  deleteProfile(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private profiles: Map<string, Profile>;

  constructor() {
    this.profiles = new Map();
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    return this.profiles.get(id);
  }

  async getProfileByUsername(username: string): Promise<Profile | undefined> {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.githubUsername === username,
    );
  }

  async createProfile(insertProfile: InsertProfile): Promise<Profile> {
    const id = randomUUID();
    const now = new Date();
    const profile: Profile = { 
      ...insertProfile, 
      id, 
      bio: insertProfile.bio || "",
      email: insertProfile.email || "",
      location: insertProfile.location || "",
      website: insertProfile.website || "",
      linkedinUrl: insertProfile.linkedinUrl || "",
      twitterUrl: insertProfile.twitterUrl || "",
      kaggleUrl: insertProfile.kaggleUrl || "",
      currentFocus: insertProfile.currentFocus || "",
      technologies: insertProfile.technologies || [],
      socialLinks: insertProfile.socialLinks || [],
      customSections: insertProfile.customSections || [],
      createdAt: now,
      updatedAt: now 
    };
    this.profiles.set(id, profile);
    return profile;
  }

  async updateProfile(id: string, updateData: Partial<InsertProfile>): Promise<Profile | undefined> {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;

    const updated: Profile = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id: string): Promise<boolean> {
    return this.profiles.delete(id);
  }
}

export const storage = new MemStorage();
