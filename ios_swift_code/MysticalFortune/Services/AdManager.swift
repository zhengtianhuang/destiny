import SwiftUI
import GoogleMobileAds

@MainActor
class AdManager: NSObject, ObservableObject {
    static let shared = AdManager()
    
    @Published var isAdReady = false
    @Published var isShowingAd = false
    
    private var rewardedAd: RewardedAd?
    
    // 測試用廣告 ID（上架前要換成真實 ID）
    private let adUnitID = "ca-app-pub-3940256099942544/1712485313"
    
    private var rewardHandler: (() -> Void)?
    
    override init() {
        super.init()
        loadRewardedAd()
    }
    
    func loadRewardedAd() {
        let request = Request()
        
        RewardedAd.load(with: adUnitID, request: request) { [weak self] ad, error in
            guard let self = self else { return }
            
            if let error = error {
                print("❌ 廣告載入失敗: \(error.localizedDescription)")
                self.isAdReady = false
                
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
    
    func showRewardedAd(onReward: @escaping () -> Void) {
        guard let rewardedAd = rewardedAd else {
            print("⚠️ 廣告尚未準備好")
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
        
        rewardedAd.present(from: rootViewController) { [weak self] in
            print("🎉 用戶完成觀看廣告")
            self?.rewardHandler?()
            self?.rewardHandler = nil
        }
    }
    
    func canSkipAd() -> Bool {
        return SubscriptionManager.shared.isSubscribed
    }
}

extension AdManager: FullScreenContentDelegate {
    func adDidDismissFullScreenContent(_ ad: FullScreenPresentingAd) {
        print("廣告已關閉")
        isShowingAd = false
        loadRewardedAd()
    }
    
    func ad(_ ad: FullScreenPresentingAd, didFailToPresentFullScreenContentWithError error: Error) {
        print("❌ 廣告顯示失敗: \(error.localizedDescription)")
        isShowingAd = false
        rewardHandler?()
        rewardHandler = nil
        loadRewardedAd()
    }
    
    func adWillPresentFullScreenContent(_ ad: FullScreenPresentingAd) {
        print("廣告即將顯示")
    }
}
