import SwiftUI
import GoogleMobileAds

@MainActor
class AdManager: NSObject, ObservableObject {
    static let shared = AdManager()
    
    @Published var isAdReady = false
    @Published var isShowingAd = false
    
    private var rewardedAd: GADRewardedAd?
    
    // 測試用廣告 ID（上架前要換成真實 ID）
    // 真實 ID 格式: ca-app-pub-XXXXXXXXXXXXXXXX/XXXXXXXXXX
    private let adUnitID = "ca-app-pub-3940256099942544/1712485313" // Google 測試 ID
    
    private var rewardHandler: (() -> Void)?
    
    override init() {
        super.init()
        loadRewardedAd()
    }
    
    // MARK: - 載入廣告
    func loadRewardedAd() {
        let request = GADRequest()
        
        GADRewardedAd.load(withAdUnitID: adUnitID, request: request) { [weak self] ad, error in
            guard let self = self else { return }
            
            if let error = error {
                print("❌ 廣告載入失敗: \(error.localizedDescription)")
                self.isAdReady = false
                
                // 5秒後重試
                DispatchQueue.main.asyncAfter(deadline: .now() + 5) {
                    self.loadRewardedAd()
                }
                return
            }
            
            print("✅ 廣告載入成功")
            self.rewardedAd = ad
            self.rewardedAd?.fullScreenContentDelegate = self
            self.isAdReady = true
        }
    }
    
    // MARK: - 顯示廣告
    func showRewardedAd(onReward: @escaping () -> Void) {
        guard let rewardedAd = rewardedAd else {
            print("⚠️ 廣告尚未準備好")
            // 如果廣告還沒準備好，直接給獎勵（開發期間）
            onReward()
            return
        }
        
        guard let windowScene = UIApplication.shared.connectedScenes.first as? UIWindowScene,
              let rootViewController = windowScene.windows.first?.rootViewController else {
            print("⚠️ 找不到 root view controller")
            onReward()
            return
        }
        
        self.rewardHandler = onReward
        self.isShowingAd = true
        
        rewardedAd.present(fromRootViewController: rootViewController) { [weak self] in
            print("🎉 用戶完成觀看廣告，給予獎勵")
            self?.rewardHandler?()
            self?.rewardHandler = nil
        }
    }
    
    // MARK: - 檢查是否可以跳過廣告（已訂閱）
    func canSkipAd() -> Bool {
        return SubscriptionManager.shared.isSubscribed
    }
}

// MARK: - GADFullScreenContentDelegate
extension AdManager: GADFullScreenContentDelegate {
    func adDidDismissFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("廣告已關閉")
        isShowingAd = false
        // 載入下一個廣告
        loadRewardedAd()
    }
    
    func ad(_ ad: GADFullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("❌ 廣告顯示失敗: \(error.localizedDescription)")
        isShowingAd = false
        // 如果廣告失敗，直接給獎勵
        rewardHandler?()
        rewardHandler = nil
        loadRewardedAd()
    }
    
    func adWillPresentFullScreenContent(_ ad: GADFullScreenPresentingAd) {
        print("廣告即將顯示")
    }
}
