import { randomUUID } from "crypto";

export class MemStorage {
  constructor() {
    this.profiles = new Map();
  }

  async getProfile(id) {
    return this.profiles.get(id);
  }

  async getProfileByUsername(username) {
    return Array.from(this.profiles.values()).find(
      (profile) => profile.githubUsername === username,
    );
  }

  async createProfile(insertProfile) {
    const id = randomUUID();
    const now = new Date();
    const profile = { 
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

  async updateProfile(id, updateData) {
    const existing = this.profiles.get(id);
    if (!existing) return undefined;

    const updated = {
      ...existing,
      ...updateData,
      updatedAt: new Date(),
    };
    this.profiles.set(id, updated);
    return updated;
  }

  async deleteProfile(id) {
    return this.profiles.delete(id);
  }
}

export const storage = new MemStorage();