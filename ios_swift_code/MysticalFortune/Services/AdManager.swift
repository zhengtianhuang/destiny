import SwiftUI

@MainActor
class AdManager: ObservableObject {
    static let shared = AdManager()
    
    @Published var isAdReady = true
    @Published var isShowingAd = false
    
    func showRewardedAd(onReward: @escaping () -> Void) {
        isShowingAd = true
        
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.isShowingAd = false
            onReward()
        }
    }
    
    func canSkipAd() -> Bool {
        return SubscriptionManager.shared.isSubscribed
    }
}
