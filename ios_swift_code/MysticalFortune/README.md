# 天命解析 Mystical Fortune - iOS App

完整的命理分析 iOS 應用，整合星座、人類圖、紫微斗數、面相、易經、籤筒等功能。

## 💰 商業模式

| 版本 | 功能 | 價格 |
|------|------|------|
| **免費版** | 看廣告後使用全部功能 | 免費 |
| **至尊版** | 無廣告 + 無限使用 | $2.99/月 或 $19.99/年 |

## ✨ 功能特色

| 功能 | 說明 |
|------|------|
| 🌟 星座分析 | 西方占星學解讀 |
| 🧬 人類圖 | 能量類型、人生策略 |
| ☯️ 紫微斗數 | 東方命理精華 |
| 👁️ 面相分析 | AI 智慧面相解讀 |
| ☰ 易經占卜 | 古老智慧指引 |
| 🏮 籤筒求籤 | 搖動手機抽籤 |
| 📺 激勵廣告 | AdMob 獎勵廣告 |
| 💎 訂閱制 | StoreKit 2 內購 |

## 📋 系統需求

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- Apple Developer Program 帳號（$99/年）

## 🚀 安裝步驟

### 1. 建立 Xcode 專案

1. 開啟 Xcode → **Create a new Xcode project**
2. 選擇 **App** (iOS)
3. 設定：
   - Product Name: `MysticalFortune`
   - Interface: **SwiftUI**
   - Language: **Swift**

### 2. 加入 Google Mobile Ads SDK

**方法 A: Swift Package Manager（推薦）**

1. File → Add Packages
2. 輸入網址：`https://github.com/googleads/swift-package-manager-google-mobile-ads`
3. 選擇最新版本

**方法 B: CocoaPods**

```ruby
# Podfile
pod 'Google-Mobile-Ads-SDK'
```

### 3. 複製程式碼

將檔案複製到專案：

```
MysticalFortune/
├── MysticalFortuneApp.swift      → 替換 App 進入點
├── Models/
│   └── FortuneModels.swift       → 資料模型
├── Services/
│   ├── APIService.swift          → API 服務
│   ├── AdManager.swift           → 廣告管理器
│   └── SubscriptionManager.swift → 訂閱管理器
└── Views/
    ├── ContentView.swift         → 主導航
    ├── AnalyzeView.swift         → 分析表單
    ├── ResultView.swift          → 分析結果
    ├── FortuneStickView.swift    → 籤筒功能
    ├── AdGateView.swift          → 廣告閘門
    └── PaywallView.swift         → 訂閱頁面
```

### 4. 設定 Info.plist

```xml
<!-- AdMob App ID -->
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-XXXXXXXXXXXXXXXX~XXXXXXXXXX</string>

<!-- SKAdNetwork -->
<key>SKAdNetworkItems</key>
<array>
  <dict>
    <key>SKAdNetworkIdentifier</key>
    <string>cstr6suwn9.skadnetwork</string>
  </dict>
</array>

<!-- 權限 -->
<key>NSPhotoLibraryUsageDescription</key>
<string>需要存取相簿以上傳面相照片</string>

<key>NSMotionUsageDescription</key>
<string>需要偵測手機搖動來抽籤</string>

<key>NSUserTrackingUsageDescription</key>
<string>允許追蹤以提供個人化廣告體驗</string>
```

### 5. 設定 AdMob

1. 前往 [AdMob Console](https://admob.google.com/)
2. 建立新 App
3. 建立 **Rewarded Ad** 廣告單元
4. 將 Ad Unit ID 填入 `AdManager.swift`：

```swift
private let adUnitID = "ca-app-pub-XXXXXXXX/XXXXXXXXXX"
```

### 6. 設定 App Store Connect 訂閱

1. 前往 [App Store Connect](https://appstoreconnect.apple.com/)
2. 建立 App → 訂閱 → 建立訂閱群組
3. 新增兩個訂閱產品：

| 產品 ID | 價格 | 週期 |
|---------|------|------|
| `com.mysticalfortune.monthly` | $2.99 | 每月 |
| `com.mysticalfortune.yearly` | $19.99 | 每年 |

4. 更新 `SubscriptionManager.swift` 中的產品 ID

### 7. 設定 API 網址

在 `APIService.swift` 修改後端網址：

```swift
static let baseURL = "https://your-app-name.replit.app"
```

### 8. 執行測試

按 `Cmd + R` 執行。

> ⚠️ 搖籤功能需在**真機**測試！
> ⚠️ 訂閱測試需使用 **Sandbox 帳號**

## 📁 專案結構

```
MysticalFortune/
├── MysticalFortuneApp.swift      # App 進入點 + SDK 初始化
├── Models/
│   └── FortuneModels.swift       # API 資料模型
├── Services/
│   ├── APIService.swift          # 後端 API 呼叫
│   ├── AdManager.swift           # AdMob 獎勵廣告
│   └── SubscriptionManager.swift # StoreKit 2 訂閱
└── Views/
    ├── ContentView.swift         # TabView 主導航 + 設定
    ├── AnalyzeView.swift         # 命理分析表單
    ├── ResultView.swift          # 分析結果顯示
    ├── FortuneStickView.swift    # 籤筒抽籤
    ├── AdGateView.swift          # 廣告閘門元件
    └── PaywallView.swift         # 訂閱付費牆
```

## 🔄 使用流程

```
用戶開啟 App
    ↓
選擇功能（籤筒/分析）
    ↓
┌─────────────────┐
│  已訂閱會員？    │
└─────────────────┘
    ↓ 是          ↓ 否
直接使用      顯示廣告閘門
                  ↓
           ┌──────────────┐
           │ 看廣告解鎖   │
           │     或       │
           │ 升級至尊版   │
           └──────────────┘
                  ↓
              使用功能
```

## 💵 成本與收益估算

| 項目 | 金額 |
|------|------|
| 每次 AI 分析成本 | ~$0.03-0.06 |
| 每次廣告收益 | ~$0.01-0.03 |
| 月訂閱收益 | $2.99 (Apple 抽 30% = $2.09) |
| 年訂閱收益 | $19.99 (Apple 抽 30% = $13.99) |

**建議**：設計讓用戶看 2-3 次廣告後才能做一次分析，確保收支平衡。

## 📤 上傳 App Store

1. 在 Xcode 選擇 **Product → Archive**
2. 選擇 **Distribute App → App Store Connect**
3. 等待審核（通常 1-3 天）

### App Store 審核注意事項

- ✅ 必須提供「恢復購買」功能
- ✅ 必須清楚說明訂閱條款
- ✅ 必須有隱私政策和使用條款連結
- ✅ 廣告不能過於干擾使用體驗
- ⚠️ 命理類 App 可能需要額外審核

## 🧪 測試清單

- [ ] 廣告載入和顯示
- [ ] 看完廣告後解鎖功能
- [ ] 訂閱購買流程
- [ ] 訂閱恢復功能
- [ ] 訂閱後免廣告
- [ ] 籤筒搖動功能
- [ ] AI 分析 API 呼叫
- [ ] 照片上傳功能

## 📄 License

MIT License

---

🔮 **天命解析・探索命運的奧秘** 🔮
