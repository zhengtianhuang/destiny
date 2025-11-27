import SwiftUI

struct ContentView: View {
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @State private var selectedTab = 0
    @State private var showPaywall = false
    
    var body: some View {
        TabView(selection: $selectedTab) {
            // 首頁
            HomeView(showPaywall: $showPaywall)
                .tabItem {
                    Image(systemName: "sparkles")
                    Text("首頁")
                }
                .tag(0)
            
            // 運勢分析（需看廣告）
            AdGateView(
                title: "命理分析",
                subtitle: "結合星座、人類圖、紫微斗數\n易經、面相的 AI 智慧分析",
                icon: "🔮"
            ) {
                AnalyzeView()
            }
            .tabItem {
                Image(systemName: "person.crop.circle")
                Text("命理分析")
            }
            .tag(1)
            
            // 籤筒（需看廣告）
            AdGateView(
                title: "籤筒求籤",
                subtitle: "誠心祈願，搖動手機\n獲得神明指引",
                icon: "🏮"
            ) {
                FortuneStickView()
            }
            .tabItem {
                Image(systemName: "wand.and.stars")
                Text("求籤")
            }
            .tag(2)
            
            // 設定
            SettingsView(showPaywall: $showPaywall)
                .tabItem {
                    Image(systemName: "gearshape.fill")
                    Text("設定")
                }
                .tag(3)
        }
        .tint(.yellow)
        .sheet(isPresented: $showPaywall) {
            PaywallView()
        }
    }
}

// MARK: - 首頁
struct HomeView: View {
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @Binding var showPaywall: Bool
    
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
                            
                            // 會員狀態
                            if subscriptionManager.isSubscribed {
                                HStack(spacing: 6) {
                                    Image(systemName: "crown.fill")
                                        .foregroundColor(.yellow)
                                    Text("至尊會員")
                                        .foregroundColor(.yellow)
                                }
                                .font(.system(size: 14, weight: .medium))
                                .padding(.horizontal, 16)
                                .padding(.vertical, 8)
                                .background(
                                    Capsule()
                                        .fill(Color.yellow.opacity(0.15))
                                )
                            }
                        }
                        .padding(.top, 40)
                        
                        // 升級提示（非會員）
                        if !subscriptionManager.isSubscribed {
                            Button(action: { showPaywall = true }) {
                                HStack(spacing: 12) {
                                    Image(systemName: "crown.fill")
                                        .font(.system(size: 20))
                                    
                                    VStack(alignment: .leading, spacing: 2) {
                                        Text("升級至尊版")
                                            .font(.system(size: 16, weight: .semibold))
                                        Text("無廣告 · 無限使用")
                                            .font(.system(size: 12))
                                            .opacity(0.8)
                                    }
                                    
                                    Spacer()
                                    
                                    Image(systemName: "chevron.right")
                                }
                                .foregroundColor(.black)
                                .padding(16)
                                .background(
                                    LinearGradient(
                                        gradient: Gradient(colors: [.yellow, .orange]),
                                        startPoint: .leading,
                                        endPoint: .trailing
                                    )
                                )
                                .cornerRadius(16)
                            }
                            .padding(.horizontal, 20)
                        }
                        
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
                        
                        // 使用說明
                        VStack(spacing: 12) {
                            Text("使用方式")
                                .font(.system(size: 16, weight: .medium))
                                .foregroundColor(.white.opacity(0.6))
                            
                            if subscriptionManager.isSubscribed {
                                Text("您是至尊會員，可無限使用所有功能")
                                    .font(.system(size: 14))
                                    .foregroundColor(.yellow)
                            } else {
                                Text("觀看短片廣告後即可免費使用\n或升級至尊版享受無廣告體驗")
                                    .font(.system(size: 14))
                                    .foregroundColor(.white.opacity(0.5))
                                    .multilineTextAlignment(.center)
                            }
                        }
                        .padding(.vertical, 20)
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

// MARK: - 設定頁
struct SettingsView: View {
    @EnvironmentObject var subscriptionManager: SubscriptionManager
    @Binding var showPaywall: Bool
    @State private var subscriptionStatus = ""
    
    var body: some View {
        NavigationStack {
            ZStack {
                Color(red: 0.08, green: 0.05, blue: 0.15)
                    .ignoresSafeArea()
                
                List {
                    // 會員狀態
                    Section {
                        if subscriptionManager.isSubscribed {
                            HStack {
                                Image(systemName: "crown.fill")
                                    .foregroundColor(.yellow)
                                Text("至尊會員")
                                    .foregroundColor(.white)
                                Spacer()
                                Text(subscriptionStatus)
                                    .foregroundColor(.green)
                            }
                            .listRowBackground(Color.white.opacity(0.08))
                        } else {
                            Button(action: { showPaywall = true }) {
                                HStack {
                                    Image(systemName: "crown")
                                        .foregroundColor(.yellow)
                                    Text("升級至尊版")
                                        .foregroundColor(.white)
                                    Spacer()
                                    Text("免廣告")
                                        .foregroundColor(.yellow)
                                    Image(systemName: "chevron.right")
                                        .foregroundColor(.white.opacity(0.3))
                                }
                            }
                            .listRowBackground(Color.white.opacity(0.08))
                        }
                        
                        Button(action: {
                            Task {
                                await subscriptionManager.restorePurchases()
                            }
                        }) {
                            HStack {
                                Image(systemName: "arrow.clockwise")
                                    .foregroundColor(.white.opacity(0.6))
                                Text("恢復購買")
                                    .foregroundColor(.white)
                            }
                        }
                        .listRowBackground(Color.white.opacity(0.08))
                    } header: {
                        Text("會員")
                            .foregroundColor(.white.opacity(0.6))
                    }
                    
                    // 關於
                    Section {
                        HStack {
                            Text("版本")
                                .foregroundColor(.white)
                            Spacer()
                            Text("1.0.0")
                                .foregroundColor(.white.opacity(0.5))
                        }
                        .listRowBackground(Color.white.opacity(0.08))
                        
                        Link(destination: URL(string: "https://example.com/privacy")!) {
                            HStack {
                                Text("隱私政策")
                                    .foregroundColor(.white)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.white.opacity(0.3))
                            }
                        }
                        .listRowBackground(Color.white.opacity(0.08))
                        
                        Link(destination: URL(string: "https://example.com/terms")!) {
                            HStack {
                                Text("使用條款")
                                    .foregroundColor(.white)
                                Spacer()
                                Image(systemName: "chevron.right")
                                    .foregroundColor(.white.opacity(0.3))
                            }
                        }
                        .listRowBackground(Color.white.opacity(0.08))
                    } header: {
                        Text("關於")
                            .foregroundColor(.white.opacity(0.6))
                    }
                }
                .scrollContentBackground(.hidden)
            }
            .navigationTitle("設定")
            .navigationBarTitleDisplayMode(.inline)
            .task {
                subscriptionStatus = await subscriptionManager.getSubscriptionStatus()
            }
        }
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(AdManager.shared)
        .environmentObject(SubscriptionManager.shared)
}
