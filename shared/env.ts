// Environment configuration
export const APP_CONFIG = {
  APP_NAME: "天命解析 - Astrolife",
  APP_VERSION: "1.0.0",
  DESCRIPTION: "結合命理、心理測評、行為追蹤的個性化人生導航系統",
  
  // 廣告配置
  AD_ENABLED: true,
  REWARD_AD_BONUS: 2, // 看一個廣告 +2 次分析機會
  MAX_ANALYSIS_PER_DAY: 3,
  
  // API 限制
  MAX_TOKENS: 4096,
  ANALYSIS_TIMEOUT: 30000, // 30秒超時
  
  // 成本估算（每月）
  ESTIMATED_COSTS: {
    description: "根據 1000 活躍用戶估算",
    apiCosts: "NT$3,000-30,000/月",
    serverCosts: "NT$200-500/月",
    cdnCosts: "NT$100-300/月",
  },
  
  // 廣告收益估算
  ESTIMATED_REVENUE: {
    description: "根據台灣 CPM 估算",
    cpm: "NT$10-70 per 1000 impressions",
    perUserDaily: "NT$0.1-1",
    perUserMonthly: "NT$3-30",
    breakeven: "100-1000 活躍用戶",
  },
};
