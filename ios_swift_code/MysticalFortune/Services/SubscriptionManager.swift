import StoreKit
import SwiftUI

@MainActor
class SubscriptionManager: ObservableObject {
    static let shared = SubscriptionManager()
    
    @Published var products: [Product] = []
    @Published var purchasedProductIDs = Set<String>()
    @Published var isLoading = false
    
    // 訂閱產品 ID（需要在 App Store Connect 設定）
    let productIDs = [
        "com.mysticalfortune.monthly",   // $2.99/月
        "com.mysticalfortune.yearly"     // $19.99/年
    ]
    
    // 訂閱群組 ID（需要在 App Store Connect 設定）
    let subscriptionGroupID = "mystical_premium"
    
    private var updateListenerTask: Task<Void, Error>?
    
    var isSubscribed: Bool {
        !purchasedProductIDs.isEmpty
    }
    
    init() {
        updateListenerTask = listenForTransactions()
        
        Task {
            await fetchProducts()
            await updatePurchasedProducts()
        }
    }
    
    deinit {
        updateListenerTask?.cancel()
    }
    
    // MARK: - 取得產品列表
    func fetchProducts() async {
        isLoading = true
        
        do {
            let products = try await Product.products(for: productIDs)
            self.products = products.sorted { $0.price < $1.price }
            print("✅ 取得 \(products.count) 個產品")
        } catch {
            print("❌ 取得產品失敗: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - 購買產品
    func purchase(_ product: Product) async throws -> Transaction? {
        isLoading = true
        
        let result = try await product.purchase()
        
        switch result {
        case .success(let verification):
            let transaction = try checkVerified(verification)
            await updatePurchasedProducts()
            await transaction.finish()
            isLoading = false
            return transaction
            
        case .userCancelled:
            print("用戶取消購買")
            isLoading = false
            return nil
            
        case .pending:
            print("購買待處理")
            isLoading = false
            return nil
            
        @unknown default:
            isLoading = false
            return nil
        }
    }
    
    // MARK: - 更新已購買產品
    func updatePurchasedProducts() async {
        var purchasedIDs = Set<String>()
        
        for await result in Transaction.currentEntitlements {
            guard case .verified(let transaction) = result else {
                continue
            }
            
            if transaction.revocationDate == nil {
                purchasedIDs.insert(transaction.productID)
            }
        }
        
        self.purchasedProductIDs = purchasedIDs
        print("✅ 已訂閱產品: \(purchasedIDs)")
    }
    
    // MARK: - 監聽交易更新
    func listenForTransactions() -> Task<Void, Error> {
        return Task.detached {
            for await result in Transaction.updates {
                guard case .verified(let transaction) = result else {
                    continue
                }
                
                await self.updatePurchasedProducts()
                await transaction.finish()
            }
        }
    }
    
    // MARK: - 驗證交易
    func checkVerified<T>(_ result: VerificationResult<T>) throws -> T {
        switch result {
        case .unverified:
            throw SubscriptionError.failedVerification
        case .verified(let safe):
            return safe
        }
    }
    
    // MARK: - 恢復購買
    func restorePurchases() async {
        isLoading = true
        
        do {
            try await AppStore.sync()
            await updatePurchasedProducts()
        } catch {
            print("❌ 恢復購買失敗: \(error)")
        }
        
        isLoading = false
    }
    
    // MARK: - 取得訂閱狀態描述
    func getSubscriptionStatus() async -> String {
        for product in products {
            guard let subscription = product.subscription else { continue }
            
            if let statuses = try? await subscription.status {
                for status in statuses {
                    switch status.state {
                    case .subscribed:
                        return "已訂閱"
                    case .expired:
                        return "已過期"
                    case .inBillingRetryPeriod:
                        return "帳單問題"
                    case .inGracePeriod:
                        return "寬限期"
                    case .revoked:
                        return "已撤銷"
                    default:
                        break
                    }
                }
            }
        }
        return "未訂閱"
    }
}

enum SubscriptionError: Error {
    case failedVerification
    case purchaseFailed
}

// MARK: - 產品擴展
extension Product {
    var subscriptionPeriodText: String {
        guard let subscription = self.subscription else { return "" }
        
        let unit = subscription.subscriptionPeriod.unit
        let value = subscription.subscriptionPeriod.value
        
        switch unit {
        case .day:
            return value == 1 ? "每日" : "每\(value)日"
        case .week:
            return value == 1 ? "每週" : "每\(value)週"
        case .month:
            return value == 1 ? "每月" : "每\(value)月"
        case .year:
            return value == 1 ? "每年" : "每\(value)年"
        @unknown default:
            return ""
        }
    }
}
