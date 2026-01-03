// 廣告和貨幣化系統配置

// 取得今天的日期字串（統一格式）
function getTodayString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;
}

// 清理可能損壞的 localStorage 資料
export function cleanupCorruptedData(): void {
  try {
    const keysToCheck = ['analysisCount', 'rewardAdCount', 'credits'];
    for (const key of keysToCheck) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        const num = parseInt(value, 10);
        if (isNaN(num) || num < 0 || num > 100) {
          localStorage.removeItem(key);
          console.log(`[Cleanup] Removed corrupted ${key}: ${value}`);
        }
      }
    }
    // 檢查日期格式 - 如果太長或包含奇怪字符，移除
    const dateKeys = ['analysisDate', 'rewardAdDate'];
    for (const key of dateKeys) {
      const value = localStorage.getItem(key);
      if (value !== null) {
        if (value.length > 20 || value.includes('[') || value.includes('{')) {
          localStorage.removeItem(key);
          console.log(`[Cleanup] Removed corrupted date ${key}: ${value}`);
        }
      }
    }
  } catch (e) {
    console.log('[Cleanup] Error during cleanup:', e);
  }
}

// 自動執行清理
if (typeof window !== 'undefined') {
  cleanupCorruptedData();
}

export interface AdConfig {
  enabled: boolean;
  rewardAdInterval: number; // 毫秒
  bannerAdInterval: number;
  maxAnalysisPerDay: number;
  maxFreeAnalysis: number;
}

export interface UserLimits {
  analysisCount: number;
  lastAnalysisDate: string;
  watchedRewardAds: number;
  nextFreeAnalysisTime: number;
}

export const DEFAULT_AD_CONFIG: AdConfig = {
  enabled: true,
  rewardAdInterval: 60000, // 60 秒
  bannerAdInterval: 30000, // 30 秒
  maxAnalysisPerDay: 3,
  maxFreeAnalysis: 1,
};

export const MONETIZATION_SETTINGS = {
  // 免費與付費功能
  FREE_FEATURES: ["基礎分析", "今日運勢", "星座信息"],
  PREMIUM_FEATURES: ["深度分析", "AI教練建議", "行為追蹤", "無限分析"],

  // Reward Ads 解鎖內容
  REWARD_AD_UNLOCK: {
    deepAnalysis: "深度分析", // 需要 1 個廣告
    unlimitedDaily: "今日無限次分析", // 需要 2 個廣告
    personalisedCoach: "AI教練深度建議", // 需要 3 個廣告
  },

  // 重新生成選項費用
  REROLL_COST: {
    luckyNumbers: 1, // 1 個廣告
    dailyAdvice: 1,
    guardianRole: 2,
  },

  // API 調用限制
  API_THROTTLE: {
    analysisPerDay: 3,
    rewardAdBonus: 2, // 看一個廣告 +2 次機會
  },
};

export function getLocalAnalysisCount(): number {
  try {
    const stored = localStorage.getItem("analysisCount");
    const lastDate = localStorage.getItem("analysisDate");
    const today = getTodayString();

    // 如果日期不是今天，重置計數
    if (!lastDate || lastDate !== today) {
      localStorage.setItem("analysisCount", "0");
      localStorage.setItem("analysisDate", today);
      console.log(`[Usage] Reset count for new day: ${today}`);
      return 0;
    }

    // 解析計數
    const count = parseInt(stored || "0", 10);
    
    // 如果解析失敗或數值不合理，重置為 0
    if (isNaN(count) || count < 0 || count > 100) {
      console.log(`[Usage] Invalid count detected: ${stored}, resetting to 0`);
      localStorage.setItem("analysisCount", "0");
      return 0;
    }
    
    return count;
  } catch (e) {
    console.log('[Usage] localStorage error:', e);
    // localStorage 不可用時，允許使用
    return 0;
  }
}

export function incrementAnalysisCount(): void {
  const current = getLocalAnalysisCount();
  localStorage.setItem("analysisCount", String(current + 1));
}

export function canAnalyze(): boolean {
  const count = getLocalAnalysisCount();
  return count < MONETIZATION_SETTINGS.API_THROTTLE.analysisPerDay;
}

export function getRemainingAnalysis(): number {
  const limit = MONETIZATION_SETTINGS.API_THROTTLE.analysisPerDay;
  const current = getLocalAnalysisCount();
  return Math.max(0, limit - current);
}

export function getRewardAdCount(): number {
  try {
    const stored = localStorage.getItem("rewardAdCount");
    const lastDate = localStorage.getItem("rewardAdDate");
    const today = getTodayString();

    if (!lastDate || lastDate !== today) {
      localStorage.setItem("rewardAdCount", "0");
      localStorage.setItem("rewardAdDate", today);
      return 0;
    }

    const count = parseInt(stored || "0", 10);
    if (isNaN(count) || count < 0 || count > 100) {
      localStorage.setItem("rewardAdCount", "0");
      return 0;
    }
    return count;
  } catch {
    return 0;
  }
}

export function addRewardAdBonus(): void {
  const current = getRewardAdCount();
  localStorage.setItem("rewardAdCount", String(current + 1));
  
  // 每看一個廣告 +2 次分析機會 + 100 點數
  const analysisCount = getLocalAnalysisCount();
  const limit = MONETIZATION_SETTINGS.API_THROTTLE.analysisPerDay;
  const bonus = MONETIZATION_SETTINGS.API_THROTTLE.rewardAdBonus;
  
  localStorage.setItem(
    "analysisCount",
    String(Math.max(0, analysisCount - bonus))
  );
  
  addCredits(100);
}

// ===== 點數系統 =====
export function getCredits(): number {
  const stored = localStorage.getItem("credits");
  return parseInt(stored || "0", 10);
}

export function setCredits(amount: number): void {
  localStorage.setItem("credits", String(Math.max(0, amount)));
}

export function addCredits(amount: number): void {
  const current = getCredits();
  setCredits(current + amount);
}

export function spendCredits(amount: number): boolean {
  const current = getCredits();
  if (current >= amount) {
    setCredits(current - amount);
    return true;
  }
  return false;
}

export function canUseFaceReading(): boolean {
  return getCredits() >= 50; // 面相分析需要 50 點
}

export const FACE_READING_COST = 50; // 點數
export const AD_REWARD_CREDITS = 100; // 看廣告獲得的點數

// 手動重置所有使用資料（可在瀏覽器控制台呼叫）
export function resetAllUsageData(): void {
  try {
    const keys = ['analysisCount', 'analysisDate', 'rewardAdCount', 'rewardAdDate', 'credits'];
    keys.forEach(key => localStorage.removeItem(key));
    console.log('[Reset] 已清除所有使用資料，現在可以正常使用了！');
  } catch (e) {
    console.log('[Reset] 清除失敗:', e);
  }
}

// 將 resetAllUsageData 暴露到全域，方便使用者在控制台呼叫
if (typeof window !== 'undefined') {
  (window as unknown as { resetFortuneData: typeof resetAllUsageData }).resetFortuneData = resetAllUsageData;
}
