import SwiftUI
import StoreKit

struct PaywallView: View {
    @StateObject private var subscriptionManager = SubscriptionManager.shared
    @Environment(\.dismiss) var dismiss
    @State private var isPurchasing = false
    @State private var showError = false
    @State private var errorMessage = ""
    
    var body: some View {
        ZStack {
            // 背景
            LinearGradient(
                gradient: Gradient(colors: [
                    Color(red: 0.08, green: 0.05, blue: 0.15),
                    Color(red: 0.2, green: 0.1, blue: 0.3)
                ]),
                startPoint: .top,
                endPoint: .bottom
            )
            .ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    // 關閉按鈕
                    HStack {
                        Spacer()
                        Button(action: { dismiss() }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.system(size: 28))
                                .foregroundColor(.white.opacity(0.5))
                        }
                    }
                    .padding(.horizontal)
                    
                    // 標題
                    VStack(spacing: 12) {
                        Text("✨")
                            .font(.system(size: 60))
                        
                        Text("升級至尊版")
                            .font(.system(size: 28, weight: .bold, design: .serif))
                            .foregroundColor(.white)
                        
                        Text("Mystical Premium")
                            .font(.system(size: 16))
                            .foregroundColor(.yellow)
                    }
                    
                    // 功能列表
                    VStack(alignment: .leading, spacing: 16) {
                        FeatureRow(icon: "nosign", text: "無廣告體驗")
                        FeatureRow(icon: "infinity", text: "無限次命理分析")
                        FeatureRow(icon: "wand.and.stars", text: "無限次籤筒抽籤")
                        FeatureRow(icon: "star.fill", text: "優先使用新功能")
                        FeatureRow(icon: "heart.fill", text: "支持開發者")
                    }
                    .padding(20)
                    .background(
                        RoundedRectangle(cornerRadius: 16)
                            .fill(Color.white.opacity(0.08))
                    )
                    .padding(.horizontal)
                    
                    // 訂閱選項
                    if subscriptionManager.isLoading {
                        ProgressView()
                            .tint(.yellow)
                            .padding()
                    } else if subscriptionManager.products.isEmpty {
                        VStack(spacing: 12) {
                            Text("無法載入訂閱選項")
                                .foregroundColor(.white.opacity(0.6))
                            
                            Button("重試") {
                                Task {
                                    await subscriptionManager.fetchProducts()
                                }
                            }
                            .foregroundColor(.yellow)
                        }
                        .padding()
                    } else {
                        VStack(spacing: 12) {
                            ForEach(subscriptionManager.products, id: \.id) { product in
                                SubscriptionButton(
                                    product: product,
                                    isPopular: product.id.contains("yearly"),
                                    isPurchasing: isPurchasing
                                ) {
                                    await purchaseProduct(product)
                                }
                            }
                        }
                        .padding(.horizontal)
                    }
                    
                    // 已訂閱提示
                    if subscriptionManager.isSubscribed {
                        HStack(spacing: 8) {
                            Image(systemName: "checkmark.circle.fill")
                                .foregroundColor(.green)
                            Text("您已是至尊會員")
                                .foregroundColor(.green)
                        }
                        .padding()
                        .background(
                            Capsule()
                                .fill(Color.green.opacity(0.15))
                        )
                    }
                    
                    // 恢復購買
                    Button(action: {
                        Task {
                            await subscriptionManager.restorePurchases()
                        }
                    }) {
                        Text("恢復購買")
                            .font(.system(size: 14))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    .padding(.top, 8)
                    
                    // 條款說明
                    VStack(spacing: 8) {
                        Text("訂閱將自動續約，除非在當前計費週期結束前至少 24 小時取消。")
                            .font(.system(size: 11))
                            .foregroundColor(.white.opacity(0.4))
                            .multilineTextAlignment(.center)
                        
                        HStack(spacing: 16) {
                            Button("使用條款") {
                                // 開啟使用條款
                            }
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.5))
                            
                            Button("隱私政策") {
                                // 開啟隱私政策
                            }
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.5))
                        }
                    }
                    .padding(.horizontal)
                    .padding(.bottom, 30)
                }
                .padding(.top, 20)
            }
        }
        .alert("購買錯誤", isPresented: $showError) {
            Button("確定", role: .cancel) {}
        } message: {
            Text(errorMessage)
        }
    }
    
    private func purchaseProduct(_ product: Product) async {
        isPurchasing = true
        
        do {
            if let _ = try await subscriptionManager.purchase(product) {
                dismiss()
            }
        } catch {
            errorMessage = error.localizedDescription
            showError = true
        }
        
        isPurchasing = false
    }
}

// MARK: - 功能列
struct FeatureRow: View {
    let icon: String
    let text: String
    
    var body: some View {
        HStack(spacing: 14) {
            Image(systemName: icon)
                .font(.system(size: 18))
                .foregroundColor(.yellow)
                .frame(width: 24)
            
            Text(text)
                .font(.system(size: 16))
                .foregroundColor(.white)
            
            Spacer()
        }
    }
}

// MARK: - 訂閱按鈕
struct SubscriptionButton: View {
    let product: Product
    let isPopular: Bool
    let isPurchasing: Bool
    let action: () async -> Void
    
    var body: some View {
        Button {
            Task {
                await action()
            }
        } label: {
            VStack(spacing: 8) {
                if isPopular {
                    Text("最划算")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.black)
                        .padding(.horizontal, 12)
                        .padding(.vertical, 4)
                        .background(Color.yellow)
                        .cornerRadius(10)
                }
                
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text(product.displayName)
                            .font(.system(size: 18, weight: .semibold))
                            .foregroundColor(.white)
                        
                        Text(product.description)
                            .font(.system(size: 13))
                            .foregroundColor(.white.opacity(0.6))
                    }
                    
                    Spacer()
                    
                    VStack(alignment: .trailing, spacing: 2) {
                        Text(product.displayPrice)
                            .font(.system(size: 20, weight: .bold))
                            .foregroundColor(.yellow)
                        
                        Text(product.subscriptionPeriodText)
                            .font(.system(size: 12))
                            .foregroundColor(.white.opacity(0.5))
                    }
                }
            }
            .padding(16)
            .background(
                RoundedRectangle(cornerRadius: 16)
                    .fill(isPopular ? Color.yellow.opacity(0.15) : Color.white.opacity(0.08))
                    .overlay(
                        RoundedRectangle(cornerRadius: 16)
                            .stroke(isPopular ? Color.yellow.opacity(0.5) : Color.white.opacity(0.1), lineWidth: 1)
                    )
            )
        }
        .disabled(isPurchasing)
        .opacity(isPurchasing ? 0.6 : 1)
    }
}

#Preview {
    PaywallView()
}
