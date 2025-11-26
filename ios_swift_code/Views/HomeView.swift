import SwiftUI

struct HomeView: View {
    @ObservedObject var viewModel: FortuneViewModel
    @State private var animateSymbols = false
    
    var body: some View {
        ScrollView {
            VStack(spacing: 40) {
                Spacer()
                    .frame(height: 60)
                
                VStack(spacing: 16) {
                    ZStack {
                        Circle()
                            .fill(FortuneTheme.primaryPurple.opacity(0.2))
                            .frame(width: 120, height: 120)
                            .blur(radius: 20)
                        
                        Image(systemName: "sparkles")
                            .font(.system(size: 60))
                            .foregroundStyle(
                                LinearGradient(
                                    colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                                    startPoint: .topLeading,
                                    endPoint: .bottomTrailing
                                )
                            )
                            .rotationEffect(.degrees(animateSymbols ? 5 : -5))
                            .animation(
                                .easeInOut(duration: 2).repeatForever(autoreverses: true),
                                value: animateSymbols
                            )
                    }
                    
                    Text("天命解析")
                        .font(.system(size: 42, weight: .bold))
                        .foregroundColor(.white)
                    
                    Text("探索命運的奧秘")
                        .font(.title3)
                        .foregroundColor(.white.opacity(0.7))
                }
                
                VStack(spacing: 20) {
                    Text("揭開屬於您的命運密碼")
                        .font(.title2)
                        .fontWeight(.semibold)
                        .foregroundColor(.white)
                        .multilineTextAlignment(.center)
                    
                    Text("結合星盤、人類圖、紫微斗數、面相、易經等多種命理系統，\n為您提供專屬的運勢分析與生活指引")
                        .font(.body)
                        .foregroundColor(.white.opacity(0.7))
                        .multilineTextAlignment(.center)
                        .lineSpacing(4)
                        .padding(.horizontal)
                }
                
                LazyVGrid(columns: [
                    GridItem(.flexible()),
                    GridItem(.flexible())
                ], spacing: 16) {
                    FeatureCard(
                        icon: "star.circle.fill",
                        title: "星盤分析",
                        description: "探索星座與行星的影響"
                    )
                    FeatureCard(
                        icon: "person.crop.circle.badge.moon.fill",
                        title: "人類圖",
                        description: "了解您的能量類型"
                    )
                    FeatureCard(
                        icon: "sparkle.magnifyingglass",
                        title: "紫微斗數",
                        description: "解讀命盤十二宮位"
                    )
                    FeatureCard(
                        icon: "face.smiling.inverse",
                        title: "面相分析",
                        description: "從面相看運勢"
                    )
                    FeatureCard(
                        icon: "hexagon.fill",
                        title: "易經占卜",
                        description: "獲取古老智慧指引"
                    )
                    FeatureCard(
                        icon: "number.circle.fill",
                        title: "幸運號碼",
                        description: "專屬樂透數字預測"
                    )
                }
                .padding(.horizontal)
                
                Button(action: {
                    withAnimation(.spring(response: 0.5, dampingFraction: 0.7)) {
                        viewModel.currentStep = 1
                    }
                }) {
                    HStack(spacing: 12) {
                        Image(systemName: "sparkles")
                            .font(.title3)
                        Text("開始解析")
                            .font(.title3)
                            .fontWeight(.semibold)
                    }
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 18)
                    .background(FortuneTheme.accentGradient)
                    .cornerRadius(16)
                    .shadow(color: FortuneTheme.primaryPurple.opacity(0.4), radius: 12, y: 4)
                }
                .padding(.horizontal, 40)
                .padding(.top, 20)
                
                Spacer()
                    .frame(height: 40)
                
                VStack(spacing: 8) {
                    Text("以 AI 技術驅動")
                        .font(.footnote)
                        .foregroundColor(.white.opacity(0.5))
                    
                    Text("天命解析 2025")
                        .font(.caption)
                        .foregroundColor(.white.opacity(0.3))
                }
            }
            .padding()
        }
        .onAppear {
            animateSymbols = true
        }
    }
}

struct FeatureCard: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        VStack(spacing: 12) {
            Image(systemName: icon)
                .font(.system(size: 28))
                .foregroundStyle(
                    LinearGradient(
                        colors: [FortuneTheme.primaryPurple, FortuneTheme.secondaryGold],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
            
            Text(title)
                .font(.subheadline)
                .fontWeight(.semibold)
                .foregroundColor(.white)
            
            Text(description)
                .font(.caption)
                .foregroundColor(.white.opacity(0.6))
                .multilineTextAlignment(.center)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(FortuneTheme.cardGradient)
        .cornerRadius(16)
        .overlay(
            RoundedRectangle(cornerRadius: 16)
                .stroke(FortuneTheme.cardBorder, lineWidth: 1)
        )
    }
}

#Preview {
    ZStack {
        FortuneTheme.backgroundGradient.ignoresSafeArea()
        HomeView(viewModel: FortuneViewModel())
    }
    .preferredColorScheme(.dark)
}
