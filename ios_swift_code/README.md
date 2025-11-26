# iOS Swift - 天命解析 (Fortune Analysis)

## Overview
This iOS Swift reference code package provides all the necessary files to build a native iOS app version of the Fortune Analysis application in Xcode.

## Project Structure

```
ios_swift_code/
├── README.md                    # This file
├── Models/
│   └── FortuneModels.swift     # Data models for fortune analysis
├── Services/
│   └── OpenAIService.swift     # OpenAI API integration
├── ViewModels/
│   └── FortuneViewModel.swift  # Business logic and state management
├── Views/
│   ├── ContentView.swift       # Main navigation container
│   ├── HomeView.swift          # Landing page with hero section
│   ├── AnalyzeView.swift       # Multi-step form for user input
│   └── ResultView.swift        # Fortune analysis results display
├── Components/
│   ├── FortuneCard.swift       # Reusable fortune card component
│   └── LuckySection.swift      # Lucky colors and numbers display
└── Resources/
    └── Colors.swift            # Color theme definitions
```

## Setup Instructions

### 1. Create New Xcode Project
1. Open Xcode
2. File → New → Project
3. Select "App" under iOS
4. Product Name: "FortuneAnalysis"
5. Interface: SwiftUI
6. Language: Swift
7. Click "Create"

### 2. Add Swift Files
Copy all the `.swift` files from this package into your Xcode project:
- Drag and drop into Xcode project navigator
- Make sure "Copy items if needed" is checked
- Add to target: FortuneAnalysis

### 3. Configure API Key
In `OpenAIService.swift`, replace the placeholder with your OpenAI API key:
```swift
private let apiKey = "YOUR_OPENAI_API_KEY"
```

For production, use environment variables or Keychain:
```swift
// Using Info.plist
private var apiKey: String {
    Bundle.main.infoDictionary?["OPENAI_API_KEY"] as? String ?? ""
}
```

### 4. Add Camera Permissions
Add to Info.plist:
```xml
<key>NSCameraUsageDescription</key>
<string>This app uses the camera for face reading analysis</string>
<key>NSPhotoLibraryUsageDescription</key>
<string>This app needs photo access for face reading analysis</string>
```

### 5. Build and Run
- Select your target device/simulator
- Press Cmd+R to build and run

## Features
- Multi-step form with birth information (step 1: required, step 2: optional)
- Photo capture/upload for face reading via PhotosPicker
- AI-powered fortune analysis using OpenAI GPT-4o
- Chinese astrology, Human Design, Zi Wei Dou Shu (紫微斗數), I-Ching (易經)
- Daily fortune with lucky colors and Taiwan lottery numbers (6 numbers 1-49)
- Dark mode optimized with purple/gold mystical theme
- Responsive design for all iOS devices

## Schema Alignment
The iOS Swift models exactly match the web application's TypeScript schema from `shared/schema.ts`:
- `FortuneInput`: User input with birth information
- `FortuneResult`: Complete analysis results including personality, career, daily fortune, astrology, humanDesign, ziWei, iChing, and optional faceReading

## Requirements
- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- OpenAI API key

## API Integration
The app communicates with OpenAI's API directly from the device. For production, consider:
1. Using a backend proxy to protect your API key
2. Implementing proper error handling and retry logic
3. Adding rate limiting

## Notes
- All text is in Traditional Chinese (繁體中文)
- Purple and gold color scheme for mystical Eastern aesthetic
- Analysis takes 15-45 seconds depending on API response time
