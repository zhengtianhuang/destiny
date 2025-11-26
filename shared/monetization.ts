// 廣告和貨幣化系統配置

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
  const stored = localStorage.getItem("analysisCount");
  const lastDate = localStorage.getItem("analysisDate");
  const today = new Date().toDateString();

  if (lastDate !== today) {
    localStorage.setItem("analysisCount", "0");
    localStorage.setItem("analysisDate", today);
    return 0;
  }

  return parseInt(stored || "0", 10);
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
  const stored = localStorage.getItem("rewardAdCount");
  const lastDate = localStorage.getItem("rewardAdDate");
  const today = new Date().toDateString();

  if (lastDate !== today) {
    localStorage.setItem("rewardAdCount", "0");
    localStorage.setItem("rewardAdDate", today);
    return 0;
  }

  return parseInt(stored || "0", 10);
}

export function addRewardAdBonus(): void {
  const current = getRewardAdCount();
  localStorage.setItem("rewardAdCount", String(current + 1));
  
  // 每看一個廣告 +2 次分析機會
  const analysisCount = getLocalAnalysisCount();
  const limit = MONETIZATION_SETTINGS.API_THROTTLE.analysisPerDay;
  const bonus = MONETIZATION_SETTINGS.API_THROTTLE.rewardAdBonus;
  
  localStorage.setItem(
    "analysisCount",
    String(Math.max(0, analysisCount - bonus))
  );
}
