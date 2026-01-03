# Mystical Fortune Analysis Platform - 天命解析

## Overview

This is a comprehensive fortune-telling and mystical analysis web application that combines multiple Eastern and Western divination systems. The platform collects user birth information (including optional photos) and generates personalized fortune readings using AI-powered analysis of astrology, Human Design, Zi Wei Dou Shu (紫微斗數), face reading, and I-Ching.

The application is built as a full-stack TypeScript application with a React frontend and Express backend, designed to deliver an immersive, mystical user experience with traditional Chinese aesthetics.

**This project includes:**
1. A fully functional web application deployed on Replit
2. Complete iOS Swift code reference for building a native iOS app in Xcode (located in `ios_swift_code/`)

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React 18 with TypeScript, using Vite as the build tool and development server.

**Routing**: Wouter - A lightweight client-side router with three main routes:
- `/` - Landing page introducing the platform's features
- `/analyze` - Two-step form for collecting user birth data and optional photo
- `/result` - Displays comprehensive fortune analysis results

**UI Component Library**: Shadcn UI (New York variant) built on top of Radix UI primitives, providing accessible, customizable components. All UI components follow a consistent design system with custom color tokens and spacing primitives defined in Tailwind configuration.

**Styling**: Tailwind CSS with custom design tokens for mystical aesthetics:
- Typography: Noto Serif TC (headers), Noto Sans TC (body), Playfair Display (English accents)
- Color scheme: Purple/mystical primary colors with support for light/dark themes
- Custom elevation system using opacity-based shadows
- Responsive spacing following 4px baseline grid

**State Management**: 
- TanStack Query (React Query) for server state management with optimistic updates disabled
- React Hook Form with Zod validation for form state
- React Context for theme management (light/dark mode)

**Form Handling**: Multi-step form on `/analyze` page:
1. Essential info: name, birth date, gender
2. Optional enrichments: birth time, location, photo upload (base64 encoded)

### Backend Architecture

**Server Framework**: Express.js with TypeScript running on Node.js

**Development vs Production**:
- Development: Vite dev server with HMR (hot module replacement) middleware
- Production: Pre-built static assets served from `dist/public`

**API Structure**: RESTful API with three main endpoints:
- `POST /api/analyze` - Accepts user input, performs AI analysis, returns fortune results
- `POST /api/analyze-face` - Face-only analysis endpoint for re-analyzing just the face reading
- `GET /api/health` - Health check endpoint

**Input Validation**: Zod schemas shared between client and server (`shared/schema.ts`) ensure type safety across the stack.

**Error Handling**: Centralized error handling with ZodError conversion to user-friendly messages.

### Data Models

**Core Schema** (`shared/schema.ts`):
- `FortuneInput`: User birth data with required fields (name, birthYear, birthMonth, birthDay, gender) and optional fields (birthHour, birthMinute, birthPlace, currentLocation, photoBase64)
- `FortuneResult`: Comprehensive analysis including:
  - `PersonalityAnalysis`: traits, strengths, weaknesses, description
  - `CareerAnalysis`: suitable/avoid fields, advice
  - `DailyFortune`: lucky colors/numbers, overall fortune, advice
  - `AstrologyAnalysis`: Western zodiac interpretation
  - `HumanDesignAnalysis`: energy type, strategy, authority
  - `ZiWeiAnalysis`: Traditional Chinese astrology
  - `FaceReadingAnalysis`: AI-powered facial feature interpretation (optional) with fun elements:
    - `attractivenessScore`: Score from 75-98 (always high for entertainment)
    - `faceType`: Face style description (e.g., "精緻小臉派", "高級臉天花板")
    - `todayFortune`: Personalized daily fortune tip
    - `luckyItem`: Lucky item of the day
    - `specialTraits`: Hidden special traits
  - `IChing`: I-Ching hexagram interpretation

**Storage**: In-memory storage implementation (`server/storage.ts`) using Map for caching fortune results. The architecture allows easy swapping to persistent storage solutions.

**History Storage** (`client/src/lib/historyStorage.ts`):
- Stores up to 20 analysis results in localStorage
- Photo data (base64) is stripped to save storage space
- `hasPhoto` flag tracks if photo was uploaded for face-only re-analysis
- Supports view, re-analyze (full), re-analyze (face only), and delete operations

### AI Integration

**OpenAI Integration** (`server/openai.ts`):
- Uses OpenAI GPT-4o model for generating fortune analysis
- Text analysis: Structured prompts requesting specific fortune-telling insights based on user data
- Vision analysis: For face reading when photo is provided
- Zodiac calculation: Client-side calculation of Western zodiac sign based on birth date
- Fallback handling: If face reading fails, continues with main analysis

**Analysis Flow**:
1. Server receives validated user input
2. Calculates zodiac sign from birth date
3. Constructs comprehensive prompt with all user data
4. Calls OpenAI API for text-based fortune analysis
5. If photo provided, makes separate vision API call for face reading
6. Combines results into unified `FortuneResult` object
7. Returns to client for display

### Database Configuration

**ORM**: Drizzle ORM configured for PostgreSQL
- Schema definition location: `shared/schema.ts`
- Migrations output: `./migrations`
- Database provider: Neon Serverless (PostgreSQL)

**Note**: While Drizzle is configured, the current implementation uses in-memory storage. The database setup is prepared for future persistence of user analyses and results.

## External Dependencies

### Third-Party UI Libraries
- **Radix UI**: Comprehensive collection of accessible component primitives (dialogs, dropdowns, accordions, etc.)
- **Lucide React**: Icon library providing consistent mystical and UI icons
- **Class Variance Authority**: Utility for managing component variant styles
- **Tailwind CSS**: Utility-first CSS framework with custom configuration
- **Embla Carousel**: Carousel component for showcasing features

### Backend Services
- **OpenAI API**: Core AI service for generating fortune analysis
  - GPT-4o model for text generation
  - Vision API for face reading analysis
  - Requires `OPENAI_API_KEY` environment variable

### Database & ORM
- **Neon Serverless**: PostgreSQL database platform
- **Drizzle ORM**: TypeScript ORM with Zod integration
- **Drizzle Kit**: Database migration toolkit
- Requires `DATABASE_URL` environment variable

### Development Tools
- **Vite**: Frontend build tool and dev server with React plugin
- **TypeScript**: Static type checking across full stack
- **ESBuild**: Fast JavaScript bundler for production builds
- **TSX**: TypeScript execution for development server

### Form & Validation
- **React Hook Form**: Performant form state management
- **Zod**: Schema validation with TypeScript inference
- **@hookform/resolvers**: Bridge between React Hook Form and Zod

### Routing & State
- **Wouter**: Lightweight client-side routing (~1.5KB)
- **TanStack Query**: Server state management with caching

### Styling & Animation
- **Tailwind Merge**: Utility for merging Tailwind classes
- **CLSX**: Conditional className utility
- **PostCSS**: CSS transformation with Autoprefixer

### Session Management
- **connect-pg-simple**: PostgreSQL session store for Express (configured but not actively used in current implementation)

### Font Resources
- **Google Fonts**: 
  - Noto Serif TC (Traditional Chinese serif for headers)
  - Noto Sans TC (Simplified Chinese sans for body text)
  - Playfair Display (English accent font)

## iOS Swift Reference Code

The `ios_swift_code/` directory contains complete SwiftUI implementations for building native iOS apps in Xcode.

### MysticalFortune - 完整命理分析 App（含變現機制）

整合所有網頁功能的主要 iOS App，透過 API 與後端連接，並包含完整的廣告和訂閱變現系統。

```
ios_swift_code/MysticalFortune/
├── README.md                         # 完整說明文件
├── MysticalFortuneApp.swift         # App 進入點 + SDK 初始化
├── Models/
│   └── FortuneModels.swift          # API 資料模型
├── Services/
│   ├── APIService.swift             # 後端 API 呼叫
│   ├── AdManager.swift              # AdMob 獎勵廣告管理器
│   └── SubscriptionManager.swift    # StoreKit 2 訂閱管理器
└── Views/
    ├── ContentView.swift            # TabView 主導航 + 設定頁
    ├── AnalyzeView.swift            # 命理分析表單
    ├── ResultView.swift             # 分析結果顯示
    ├── FortuneStickView.swift       # 籤筒抽籤
    ├── AdGateView.swift             # 廣告閘門元件
    └── PaywallView.swift            # 訂閱付費牆
```

**功能特色**：
- 🌟 星座分析 + 🧬 人類圖 + ☯️ 紫微斗數
- 👁️ 面相分析（照片上傳）
- ☰ 易經占卜
- 🏮 籤筒求籤（CoreMotion 搖動偵測）
- 透過 REST API 呼叫後端 AI 分析
- 📺 AdMob 獎勵廣告整合
- 💎 StoreKit 2 訂閱制（月付 $2.99 / 年付 $19.99）

**商業模式**：
- 免費版：使用籤筒或 AI 分析前需觀看廣告
- 至尊版：訂閱後免廣告、無限使用

**架構決策**：
- OpenAI 金鑰保留在後端（安全考量，避免 App 反編譯洩漏）
- iOS App 透過 REST API 呼叫後端，後端統一處理 AI 分析

### FortuneStick - 獨立籤筒 App

輕量級獨立籤筒應用，包含 100+ 籤詩。

```
ios_swift_code/FortuneStick/
├── README.md
├── FortuneStickApp.swift
├── Models/
│   └── FortuneStickModels.swift     # 100+ 籤詩資料
└── Views/
    └── ShakeFortuneView.swift       # 搖籤介面
```

### iOS 開發架構決策

- **選擇 Swift** 而非 Expo/React Native
- **原因**：CoreMotion 搖動偵測、相機整合、原生效能
- **後端整合**：iOS App 呼叫現有 `/api/analyze` API，不重複 OpenAI 邏輯

### Requirements
- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- 後端 API 網址設定

See `ios_swift_code/MysticalFortune/README.md` for complete setup instructions.