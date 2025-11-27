import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // 首頁
            HomeView()
                .tabItem {
                    Image(systemName: "sparkles")
                    Text("首頁")
                }
                .tag(0)
            
            // 運勢分析
            AnalyzeView()
                .tabItem {
                    Image(systemName: "person.crop.circle")
                    Text("命理分析")
                }
                .tag(1)
            
            // 籤筒
            FortuneStickView()
                .tabItem {
                    Image(systemName: "wand.and.stars")
                    Text("求籤")
                }
                .tag(2)
            
            // 歷史記錄
            HistoryView()
                .tabItem {
                    Image(systemName: "clock.arrow.circlepath")
                    Text("歷史")
                }
                .tag(3)
        }
        .tint(.yellow)
    }
}

// MARK: - 首頁
struct HomeView: View {
    var body: some View {
        NavigationStack {
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
                
                ScrollView {
                    VStack(spacing: 32) {
                        // Logo 區域
                        VStack(spacing: 16) {
                            Text("🔮")
                                .font(.system(size: 80))
                            
                            Text("天命解析")
                                .font(.system(size: 42, weight: .bold, design: .serif))
                                .foregroundColor(.white)
                            
                            Text("Mystical Fortune Analysis")
                                .font(.system(size: 16, weight: .light))
                                .foregroundColor(.white.opacity(0.6))
                        }
                        .padding(.top, 40)
                        
                        // 功能介紹
                        VStack(spacing: 16) {
                            FeatureCard(
                                icon: "🌟",
                                title: "星座運勢",
                                description: "西方占星學分析"
                            )
                            
                            FeatureCard(
                                icon: "🧬",
                                title: "人類圖",
                                description: "能量類型與人生策略"
                            )
                            
                            FeatureCard(
                                icon: "☯️",
                                title: "紫微斗數",
                                description: "東方命理精華"
                            )
                            
                            FeatureCard(
                                icon: "👁️",
                                title: "面相分析",
                                description: "AI 智慧面相解讀"
                            )
                            
                            FeatureCard(
                                icon: "☰",
                                title: "易經占卜",
                                description: "古老智慧指引"
                            )
                            
                            FeatureCard(
                                icon: "🏮",
                                title: "籤筒求籤",
                                description: "搖動手機抽籤"
                            )
                        }
                        .padding(.horizontal, 20)
                        
                        // 開始按鈕
                        NavigationLink(destination: AnalyzeView()) {
                            HStack(spacing: 12) {
                                Image(systemName: "sparkles")
                                Text("開始分析")
                                    .font(.system(size: 18, weight: .semibold))
                            }
                            .foregroundColor(.black)
                            .padding(.horizontal, 48)
                            .padding(.vertical, 16)
                            .background(
                                LinearGradient(
                                    gradient: Gradient(colors: [.yellow, .orange]),
                                    startPoint: .leading,
                                    endPoint: .trailing
                                )
                            )
                            .cornerRadius(30)
                            .shadow(color: .yellow.opacity(0.3), radius: 10)
                        }
                        .padding(.top, 20)
                        .padding(.bottom, 40)
                    }
                }
            }
            .navigationBarHidden(true)
        }
    }
}

// MARK: - 功能卡片
struct FeatureCard: View {
    let icon: String
    let title: String
    let description: String
    
    var body: some View {
        HStack(spacing: 16) {
            Text(icon)
                .font(.system(size: 36))
                .frame(width: 60)
            
            VStack(alignment: .leading, spacing: 4) {
                Text(title)
                    .font(.system(size: 18, weight: .semibold))
                    .foregroundColor(.white)
                
                Text(description)
                    .font(.system(size: 14))
                    .foregroundColor(.white.opacity(0.6))
            }
            
            Spacer()
            
            Image(systemName: "chevron.right")
                .foregroundColor(.white.opacity(0.3))
        }
        .padding(16)
        .background(
            RoundedRectangle(cornerRadius: 16)
                .fill(Color.white.opacity(0.08))
                .overlay(
                    RoundedRectangle(cornerRadius: 16)
                        .stroke(Color.white.opacity(0.1), lineWidth: 1)
                )
        )
    }
}

// MARK: - 歷史記錄（暫時）
struct HistoryView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.08, green: 0.05, blue: 0.15)
                    .ignoresSafeArea()
                
                VStack(spacing: 20) {
                    Image(systemName: "clock.arrow.circlepath")
                        .font(.system(size: 60))
                        .foregroundColor(.white.opacity(0.3))
                    
                    Text("尚無歷史記錄")
                        .font(.system(size: 18))
                        .foregroundColor(.white.opacity(0.5))
                    
                    Text("完成分析後會自動儲存")
                        .font(.system(size: 14))
                        .foregroundColor(.white.opacity(0.3))
                }
            }
            .navigationTitle("歷史記錄")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
}
