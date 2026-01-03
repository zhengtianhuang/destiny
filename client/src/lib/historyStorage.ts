import type { FortuneResult } from "@shared/schema";

const HISTORY_KEY = "fortuneHistory";
const MAX_HISTORY_ITEMS = 20;

export interface HistoryItem {
  id: string;
  name: string;
  date: string;
  result: FortuneResult;
}

export function getHistory(): HistoryItem[] {
  try {
    const stored = localStorage.getItem(HISTORY_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as HistoryItem[];
  } catch {
    return [];
  }
}

export function addToHistory(result: FortuneResult): void {
  try {
    const history = getHistory();
    
    const newItem: HistoryItem = {
      id: result.id,
      name: result.input.name,
      date: new Date().toISOString(),
      result,
    };
    
    const existingIndex = history.findIndex((item) => item.id === result.id);
    if (existingIndex !== -1) {
      history[existingIndex] = newItem;
    } else {
      history.unshift(newItem);
    }
    
    const trimmed = history.slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
  } catch (error) {
    console.error("Failed to save to history:", error);
  }
}

export function getHistoryItem(id: string): HistoryItem | undefined {
  const history = getHistory();
  return history.find((item) => item.id === id);
}

export function deleteHistoryItem(id: string): void {
  try {
    const history = getHistory();
    const filtered = history.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete history item:", error);
  }
}

export function clearHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history:", error);
  }
}
