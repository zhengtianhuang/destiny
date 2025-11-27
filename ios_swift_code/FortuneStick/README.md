# 籤筒 Fortune Stick - iOS App

搖動手機抽籤的 iOS 原生應用，融合傳統廟宇求籤儀式感與現代科技。

## ✨ 功能特色

- **🏮 傳統儀式感** - 輸入問題，搖動手機抽籤
- **📱 加速度感應** - 使用 CoreMotion 偵測手機搖動
- **📜 100+ 籤詩** - 包含大吉、中吉、小吉、平、小凶、凶六種等級
- **🇯🇵 雙語籤詩** - 中文 + 日文籤詩對照
- **💫 精美動畫** - 搖籤動畫 + 籤筒晃動效果
- **🎨 神秘風格** - 紫金配色，營造神秘氛圍

## 📋 系統需求

- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+

## 🚀 安裝步驟

### 1. 在 Xcode 建立新專案

1. 開啟 Xcode
2. 選擇 **Create a new Xcode project**
3. 選擇 **App** (iOS)
4. 專案設定：
   - Product Name: `FortuneStick`
   - Interface: **SwiftUI**
   - Language: **Swift**
   - 取消勾選 Core Data 和 Tests

### 2. 複製程式碼

將以下檔案複製到專案中：

```
FortuneStick/
├── FortuneStickApp.swift         → 替換自動生成的 App 檔案
├── Models/
│   └── FortuneStickModels.swift  → 建立 Models 資料夾並加入
└── Views/
    └── ShakeFortuneView.swift    → 建立 Views 資料夾並加入
```

### 3. 設定權限（可選）

如需使用運動數據，在 `Info.plist` 加入：

```xml
<key>NSMotionUsageDescription</key>
<string>需要偵測手機搖動來抽籤</string>
```

### 4. 執行

按下 `Cmd + R` 在模擬器或真機上執行。

> ⚠️ 注意：搖動功能只能在**真機**上測試！模擬器無法模擬加速度計。

## 📁 專案結構

```
FortuneStick/
├── FortuneStickApp.swift           # App 進入點
├── Models/
│   └── FortuneStickModels.swift    # 資料模型
│       ├── FortuneStick           # 籤詩模型
│       ├── FortuneLevel           # 吉凶等級 (大吉～凶)
│       ├── FortuneCategory        # 類別 (綜合/感情/事業等)
│       └── FortuneStickDatabase   # 100+ 籤詩資料庫
└── Views/
    └── ShakeFortuneView.swift      # 主介面
        ├── ShakeFortuneView       # 搖籤畫面
        ├── ShakeFortuneViewModel  # 搖動偵測邏輯
        └── FortuneStickResultView # 籤詩結果頁面
```

## 🎮 使用方式

1. **輸入問題** - 在文字框中輸入您想問的問題
2. **搖動手機** - 誠心祈禱，搖動手機 5 次
3. **查看結果** - 籤詩會自動彈出，包含解籤和建議
4. **再抽一籤** - 點擊按鈕可重新開始

也可以點擊「點擊抽籤」按鈕直接抽籤（不用搖動）。

## 🎨 籤詩等級

| 等級 | 顏色 | 說明 |
|------|------|------|
| 🌟 大吉 | 金色 | 最好的籤，心想事成 |
| ✨ 中吉 | 綠色 | 運勢不錯，順利發展 |
| 🍀 小吉 | 淺綠 | 小有進展，繼續努力 |
| ☯️ 平 | 灰色 | 平穩無大變，順其自然 |
| ⚡ 小凶 | 橙色 | 有小阻礙，謹慎行事 |
| 🌙 凶 | 紅色 | 運勢不佳，避免冒險 |

## 📜 籤詩類別

- **綜合運勢** - 一般性問題
- **感情姻緣** - 戀愛、婚姻相關
- **事業財運** - 工作、投資相關
- **健康平安** - 身體健康相關
- **學業考試** - 讀書、考試相關
- **出行旅遊** - 旅行、出門相關
- **抉擇判斷** - 選擇、決定相關

## 🔧 自訂籤詩

如需新增籤詩，在 `FortuneStickDatabase.sticks` 陣列中加入：

```swift
FortuneStick(
    id: 101,
    number: "第一百零一籤",
    level: .ji,
    poem: "四句籤詩\n第二句\n第三句\n第四句",
    poemJapanese: "日文版籤詩（可選）",
    interpretation: "籤詩解讀",
    advice: "給問籤者的建議",
    categories: [.general, .love]
)
```

## 📤 上架 GitHub

1. 在 GitHub 建立新 Repository
2. 執行以下指令：

```bash
cd YourProject
git init
git add .
git commit -m "Initial commit - Fortune Stick iOS App"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fortune-stick-ios.git
git push -u origin main
```

## 📄 License

MIT License - 可自由使用和修改

---

🏮 **誠心祈願，心誠則靈** 🏮
