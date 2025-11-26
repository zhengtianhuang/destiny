import SwiftUI

struct ContentView: View {
    @StateObject private var viewModel = FortuneViewModel()
    @State private var showingResult = false
    
    var body: some View {
        NavigationStack {
            ZStack {
                FortuneTheme.backgroundGradient
                    .ignoresSafeArea()
                
                if viewModel.analysisResult != nil {
                    ResultView(viewModel: viewModel)
                } else if viewModel.currentStep > 0 && !viewModel.name.isEmpty {
                    AnalyzeView(viewModel: viewModel)
                } else {
                    HomeView(viewModel: viewModel)
                }
            }
            .preferredColorScheme(.dark)
        }
        .alert("錯誤", isPresented: $viewModel.showError) {
            Button("確定", role: .cancel) {}
        } message: {
            Text(viewModel.errorMessage ?? "發生未知錯誤")
        }
    }
}

struct FortuneTheme {
    static let primaryPurple = Color(red: 139/255, green: 92/255, blue: 246/255)
    static let secondaryGold = Color(red: 217/255, green: 165/255, blue: 32/255)
    static let darkBackground = Color(red: 15/255, green: 10/255, blue: 25/255)
    static let cardBackground = Color(red: 30/255, green: 20/255, blue: 45/255)
    static let cardBorder = Color(red: 139/255, green: 92/255, blue: 246/255).opacity(0.3)
    
    static var backgroundGradient: LinearGradient {
        LinearGradient(
            colors: [
                darkBackground,
                Color(red: 25/255, green: 15/255, blue: 40/255),
                darkBackground
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    static var cardGradient: LinearGradient {
        LinearGradient(
            colors: [
                cardBackground,
                cardBackground.opacity(0.8)
            ],
            startPoint: .topLeading,
            endPoint: .bottomTrailing
        )
    }
    
    static var accentGradient: LinearGradient {
        LinearGradient(
            colors: [primaryPurple, primaryPurple.opacity(0.8)],
            startPoint: .leading,
            endPoint: .trailing
        )
    }
}

#Preview {
    ContentView()
}
