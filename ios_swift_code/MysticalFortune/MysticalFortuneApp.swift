import SwiftUI
import GoogleMobileAds

@main
struct MysticalFortuneApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var adManager = AdManager.shared
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    init() {
        // 初始化 Google Mobile Ads SDK (新版語法)
        MobileAds.shared.start(completionHandler: nil)
    }
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(adManager)
                .environmentObject(subscriptionManager)
                .preferredColorScheme(.dark)
        }
    }
}

// MARK: - App State
class AppState: ObservableObject {
    @Published var isAnalyzing = false
    @Published var analysisResult: FortuneResult?
    @Published var errorMessage: String?
}
