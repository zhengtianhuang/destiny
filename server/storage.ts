import type { FortuneResult } from "@shared/schema";

// In-memory storage for fortune results (optional caching)
export interface IStorage {
  saveResult(result: FortuneResult): Promise<void>;
  getResult(id: string): Promise<FortuneResult | undefined>;
}

export class MemStorage implements IStorage {
  private results: Map<string, FortuneResult>;

  constructor() {
    this.results = new Map();
  }

  async saveResult(result: FortuneResult): Promise<void> {
    this.results.set(result.id, result);
  }

  async getResult(id: string): Promise<FortuneResult | undefined> {
    return this.results.get(id);
  }
}

export const storage = new MemStorage();
