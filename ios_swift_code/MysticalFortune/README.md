# 天命解析 Mystical Fortune - iOS App

完整的命理分析 iOS 應用，整合星座、人類圖、紫微斗數、面相、易經、籤筒等功能。

## ✨ 功能特色

| 功能 | 說明 |
|------|------|
| 🌟 星座分析 | 西方占星學解讀 |
| 🧬 人類圖 | 能量類型、人生策略 |
| ☯️ 紫微斗數 | 東方命理精華 |
| 👁️ 面相分析 | AI 智慧面相解讀 |
| ☰ 易經占卜 | 古老智慧指引 |
| 🏮 籤筒求籤 | 搖動手機抽籤 |

## 📋 系統需求

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+

## 🚀 安裝步驟

### 1. 建立 Xcode 專案

1. 開啟 Xcode → **Create a new Xcode project**
2. 選擇 **App** (iOS)
3. 設定：
   - Product Name: `MysticalFortune`
   - Interface: **SwiftUI**
   - Language: **Swift**

### 2. 複製程式碼

將檔案複製到專案：

```
MysticalFortune/
├── MysticalFortuneApp.swift      → 替換 App 進入點
├── Models/
│   └── FortuneModels.swift       → 資料模型
├── Services/
│   └── APIService.swift          → API 服務
└── Views/
    ├── ContentView.swift         → 主導航
    ├── AnalyzeView.swift         → 分析表單
    ├── ResultView.swift          → 分析結果
    └── FortuneStickView.swift    → 籤筒功能
```

### 3. 設定 API 網址

在 `APIService.swift` 修改後端網址：

```swift
static let baseURL = "https://your-app-name.replit.app"
```

### 4. 設定權限 (Info.plist)

```xml
<key>NSPhotoLibraryUsageDescription</key>
<string>需要存取相簿以上傳面相照片</string>
<key>NSMotionUsageDescription</key>
<string>需要偵測手機搖動來抽籤</string>
```

### 5. 執行

按 `Cmd + R` 執行。

> ⚠️ 搖籤功能需在**真機**測試！

## 📁 專案結構

```
MysticalFortune/
├── MysticalFortuneApp.swift      # App 進入點 + 全域狀態
├── Models/
│   └── FortuneModels.swift       # API 資料模型
├── Services/
│   └── APIService.swift          # 後端 API 呼叫
└── Views/
    ├── ContentView.swift         # TabView 主導航
    │   ├── HomeView              # 首頁介紹
    │   └── HistoryView           # 歷史記錄
    ├── AnalyzeView.swift         # 命理分析表單
    │   ├── Step1View             # 基本資料
    │   └── Step2View             # 進階資料 + 照片
    ├── ResultView.swift          # 分析結果顯示
    │   ├── OverviewSection       # 總覽
    │   ├── AstrologySection      # 星座
    │   ├── HumanDesignSection    # 人類圖
    │   ├── ZiWeiSection          # 紫微斗數
    │   ├── FaceReadingSection    # 面相
    │   └── IChingSection         # 易經
    └── FortuneStickView.swift    # 籤筒抽籤
        ├── FortuneStickViewModel # 搖動偵測
        └── StickResultView       # 籤詩結果
```

## 🎨 設計風格

- **配色**：深紫色背景 + 金黃色重點
- **字體**：系統字體 + Serif 設計字體
- **動畫**：搖籤動畫、籤筒晃動效果
- **主題**：暗色模式優先

## 🔗 後端整合

App 透過 REST API 與網頁後端溝通：

```
POST /api/analyze
Content-Type: application/json

{
  "name": "姓名",
  "birthYear": 1990,
  "birthMonth": 3,
  "birthDay": 15,
  "gender": "male",
  "birthHour": 10,
  "birthMinute": 30,
  "birthPlace": "台北市",
  "photoBase64": "base64..."
}
```

## 📤 上傳 GitHub

```bash
git init
git add .
git commit -m "天命解析 iOS App - 完整命理分析"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/mystical-fortune-ios.git
git push -u origin main
```

## 📱 App Store 上架

1. 申請 Apple Developer Program ($99/年)
2. 在 App Store Connect 建立 App
3. 使用 Xcode Archive 打包
4. 提交審核

## 📄 License

MIT License

---

🔮 **天命解析・探索命運的奧秘** 🔮
