import SwiftUI

struct AdGateView<Content: View>: View {
    @StateObject private var adManager = AdManager.shared
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    
    let title: String
    let subtitle: String
    let icon: String
    let content: () -> Content
    
    @State private var hasWatchedAd = false
    @State private var showPaywall = false
    @State private var isWatchingAd = false
    
    var body: some View {
        ZStack {
            if subscriptionManager.isSubscribed || hasWatchedAd {
                // 已訂閱或已看廣告，顯示內容
                content()
            } else {
                // 需要看廣告
                adGateContent
            }
        }
        .sheet(isPresented: $showPaywall) {
            PaywallView()
        }
    }
    
    private var adGateContent: some View {
        ZStack {
            // 背景
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.08, green: 0.05, blue: 0.15),
                    Color(red: 0.15, green: 0.08, blue: 0.25)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            VStack(spacing: 30) {
                Spacer()
                
                // 圖示
                Text(icon)
                    .font(.system(size: 80))
                
                // 標題
                VStack(spacing: 12) {
                    Text(title)
                        .font(.system(size: 28, weight: .bold, design: .serif))
                        .foregroundColor(.white)
                    
                    Text(subtitle)
                        .font(.system(size: 16))
                        .foregroundColor(.white.opacity(0.6))
                        .multilineTextAlignment(.center)
                        .padding(.horizontal, 40)
                }
                
                Spacer()
                
                // 看廣告按鈕
                VStack(spacing: 16) {
                    Button(action: watchAd) {
                        HStack(spacing: 12) {
                            if isWatchingAd {
                                ProgressView()
                                    .tint(.black)
                            } else {
                                Image(systemName: "play.circle.fill")
                                    .font(.system(size: 22))
                            }
                            
                            Text(isWatchingAd ? "載入中..." : "觀看廣告解鎖")
                                .font(.system(size: 18, weight: .semibold))
                        }
                        .foregroundColor(.black)
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 16)
                        .background(
                            LinearGradient(
                                gradient: Gradient(colors: [.yellow, .orange]),
                                startPoint: .leading,
                                endPoint: .trailing
                            )
                        )
                        .cornerRadius(16)
                    }
                    .disabled(isWatchingAd)
                    .padding(.horizontal, 24)
                    
                    // 廣告狀態提示
                    if !adManager.isAdReady && !isWatchingAd {
                        HStack(spacing: 6) {
                            ProgressView()
                                .tint(.white.opacity(0.5))
                                .scaleEffect(0.8)
                            Text("廣告載入中...")
                                .font(.system(size: 13))
                                .foregroundColor(.white.opacity(0.5))
                        }
                    }
                }
                
                // 分隔線
                HStack {
                    Rectangle()
                        .fill(Color.white.opacity(0.2))
                        .frame(height: 1)
                    
                    Text("或")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.4))
                        .padding(.horizontal, 12)
                    
                    Rectangle()
                        .fill(Color.white.opacity(0.2))
                        .frame(height: 1)
                }
                .padding(.horizontal, 40)
                
                // 訂閱按鈕
                Button(action: { showPaywall = true }) {
                    HStack(spacing: 10) {
                        Image(systemName: "crown.fill")
                            .font(.system(size: 18))
                        
                        Text("升級至尊版 · 永久免廣告")
                            .font(.system(size: 16, weight: .medium))
                    }
                    .foregroundColor(.yellow)
                    .frame(maxWidth: .infinity)
                    .padding(.vertical, 14)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(Color.yellow.opacity(0.5), lineWidth: 1)
                    )
                }
                .padding(.horizontal, 24)
                
                Spacer()
                    .frame(height: 40)
            }
        }
    }
    
    private func watchAd() {
        isWatchingAd = true
        
        adManager.showRewardedAd {
            hasWatchedAd = true
            isWatchingAd = false
        }
        
        // 如果廣告還沒準備好，3秒後自動解鎖（開發用）
        if !adManager.isAdReady {
            DispatchQueue.main.asyncAfter(deadline: .now() + 2) {
                if !hasWatchedAd {
                    hasWatchedAd = true
                    isWatchingAd = false
                }
            }
        }
    }
}

#Preview {
    AdGateView(
        title: "命理分析",
        subtitle: "觀看短片廣告後\n即可免費使用",
        icon: "🔮"
    ) {
        Text("解鎖後的內容")
    }
}
