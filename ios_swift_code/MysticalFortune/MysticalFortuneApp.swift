import SwiftUI

@main
struct MysticalFortuneApp: App {
    @StateObject private var appState = AppState()
    
    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
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
