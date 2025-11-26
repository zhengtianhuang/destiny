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

**API Structure**: RESTful API with two main endpoints:
- `POST /api/analyze` - Accepts user input, performs AI analysis, returns fortune results
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
  - `FaceReadingAnalysis`: AI-powered facial feature interpretation (optional)
  - `IChing`: I-Ching hexagram interpretation

**Storage**: In-memory storage implementation (`server/storage.ts`) using Map for caching fortune results. The architecture allows easy swapping to persistent storage solutions.

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

The `ios_swift_code/` directory contains a complete SwiftUI implementation for building a native iOS app version in Xcode.

### Structure
```
ios_swift_code/
├── README.md                    # Setup instructions
├── FortuneAnalysisApp.swift    # App entry point
├── Models/
│   └── FortuneModels.swift     # Data models matching web schema
├── Services/
│   └── OpenAIService.swift     # Direct OpenAI API integration
├── ViewModels/
│   └── FortuneViewModel.swift  # State management
└── Views/
    ├── ContentView.swift       # Navigation container
    ├── HomeView.swift          # Landing page
    ├── AnalyzeView.swift       # Multi-step form
    └── ResultView.swift        # Results display
```

### Key Features
- SwiftUI with MVVM architecture
- Direct OpenAI API integration (GPT-4o)
- Photo picker for face reading
- Purple/gold mystical theme matching web design
- Dark mode optimized
- All text in Traditional Chinese

### Requirements
- iOS 16.0+
- Xcode 15.0+
- Swift 5.9+
- OpenAI API key

See `ios_swift_code/README.md` for complete setup instructions.