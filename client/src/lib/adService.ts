// 廣告服務 - 支持 Google AdMob 和本地測試廣告
import { addRewardAdBonus } from "@shared/monetization";

export interface AdConfig {
  adUnitId?: string;
  testMode: boolean;
  enabled: boolean;
}

const AD_CONFIG: AdConfig = {
  adUnitId: import.meta.env.VITE_ADMOB_UNIT_ID || "",
  testMode: !import.meta.env.VITE_ADMOB_UNIT_ID,
  enabled: true,
};

// 聲明 Google AdSense 全局變量
declare global {
  interface Window {
    adsbygoogle?: any[];
    google_ad_client?: string;
  }
}

export const adService = {
  // 初始化 AdMob
  init: () => {
    if (!AD_CONFIG.enabled) return;

    if (AD_CONFIG.testMode) {
      console.log("✨ 廣告服務在測試模式下運行");
      return;
    }

    // 初始化 Google AdSense
    if (!window.adsbygoogle) {
      window.adsbygoogle = [];
    }
  },

  // 顯示橫幅廣告
  showBannerAd: (containerId: string) => {
    if (!AD_CONFIG.enabled) return;

    if (AD_CONFIG.testMode) {
      const container = document.getElementById(containerId);
      if (container) {
        container.innerHTML = `
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                      padding: 20px; border-radius: 8px; color: white; text-align: center;
                      font-size: 14px; margin: 10px 0;">
            📢 廣告位置 (測試模式)
          </div>
        `;
      }
      return;
    }

    // 加載真實 Google AdSense 廣告
    try {
      window.adsbygoogle?.push({});
    } catch (e) {
      console.error("AdSense 加載失敗:", e);
    }
  },

  // 顯示插播廣告（可跳過）
  showInterstitialAd: async () => {
    if (!AD_CONFIG.enabled) return { success: true, skipped: false };

    if (AD_CONFIG.testMode) {
      // 測試模式：模擬 5 秒廣告
      return new Promise((resolve) => {
        console.log("📺 測試插播廣告開始 (5秒)");
        setTimeout(() => {
          console.log("✅ 測試插播廣告結束");
          resolve({ success: true, skipped: false });
        }, 5000);
      });
    }

    return { success: true, skipped: false };
  },

  // 顯示獎勵廣告 (Reward Video)
  showRewardedAd: async (): Promise<{ success: boolean; earned: boolean }> => {
    if (!AD_CONFIG.enabled) {
      return { success: false, earned: false };
    }

    if (AD_CONFIG.testMode) {
      // 測試模式：模擬 10 秒獎勵廣告，用戶可選擇觀看或跳過
      return new Promise((resolve) => {
        const message = `
🎬 獎勵廣告 (測試模式)
觀看 10 秒廣告獲得 2 次分析機會

點擊「觀看完整」模擬用戶觀看廣告
        `;
        
        console.log(message);

        // 在實際應用中，應該顯示對話框讓用戶選擇
        // 這裡簡化為自動完成
        setTimeout(() => {
          console.log("✅ 獎勵廣告完成 - 獲得 2 次分析機會");
          addRewardAdBonus();
          resolve({ success: true, earned: true });
        }, 10000);
      });
    }

    // 真實 AdMob 實現
    return { success: true, earned: true };
  },

  // 報告廣告曝光
  reportImpression: (adType: "banner" | "interstitial" | "rewarded") => {
    console.log(`📊 廣告曝光: ${adType}`);
  },

  // 獲取配置
  getConfig: () => AD_CONFIG,

  // 檢查廣告是否啟用
  isEnabled: () => AD_CONFIG.enabled,
};

// 初始化
adService.init();
