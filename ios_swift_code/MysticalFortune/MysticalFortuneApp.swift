import SwiftUI

@main
struct MysticalFortuneApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
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
