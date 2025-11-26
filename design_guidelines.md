# Design Guidelines: Mystical Fortune Analysis Platform

## Design Approach
**Reference-Based**: Drawing inspiration from premium astrology apps (Co-Star, Sanctuary, The Pattern) while incorporating traditional Eastern mystical aesthetics. This application requires an immersive, contemplative experience that builds trust through visual sophistication.

## Core Design Principles
1. **Mystical Immersion**: Create a sacred, contemplative atmosphere through dramatic visuals and generous spacing
2. **Progressive Disclosure**: Two-step form flow - essential inputs first, then optional enrichments
3. **Visual Symbolism**: Incorporate Eastern mystical iconography (zodiac symbols, trigrams, constellation patterns) throughout
4. **Trust & Credibility**: Professional polish with elegant typography and refined layouts

## Typography System
**Primary Font**: Noto Serif TC (traditional Chinese serif) for headers and important text - conveys wisdom and tradition
**Secondary Font**: Noto Sans TC (simplified sans) for body text and UI elements - ensures readability
**English Accent**: Playfair Display for English headings if needed

**Hierarchy**:
- Hero Headline: text-6xl to text-7xl, font-semibold
- Section Headers: text-4xl to text-5xl, font-medium
- Card Titles: text-2xl to text-3xl, font-medium
- Body Text: text-base to text-lg, font-normal
- Captions: text-sm, font-light

## Layout System
**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24 for consistent rhythm
- Component padding: p-6 to p-8
- Section spacing: py-16 to py-24 (desktop), py-12 to py-16 (mobile)
- Card gaps: gap-6 to gap-8
- Form field spacing: space-y-6

**Container Strategy**:
- Hero: Full-width with max-w-7xl inner container
- Content sections: max-w-6xl centered
- Form: max-w-2xl centered for focus
- Results grid: max-w-7xl with multi-column cards

## Key Page Structures

### Landing Page (5-6 sections)
1. **Hero Section** (80vh): Full-bleed mystical imagery (cosmic/celestial theme with subtle Eastern elements), centered headline and CTA, subtle overlay for text readability
2. **How It Works**: 3-column grid explaining the analysis systems (star charts, Human Design, face reading, Zi Wei Dou Shu, I-Ching)
3. **Sample Insights**: 2-column showcase of analysis types with example cards
4. **Why Trust Us**: Social proof, methodology explanation, testimonials in 3-column grid
5. **Begin Your Journey**: Final CTA section with form preview
6. **Footer**: Comprehensive footer with about, privacy, social links, newsletter signup

### Analysis Input Page
**Two-Step Flow**:

**Step 1 - Essential Info** (centered, max-w-2xl):
- Large form card with generous padding (p-8 to p-12)
- Name, birth date, gender inputs with ample spacing (space-y-6)
- Clear "Continue" CTA

**Step 2 - Enrich Analysis** (same container):
- Photo upload zone (large drop area with elegant dashed border)
- Birth time picker, location inputs
- Optional indicators with light styling
- "Generate Analysis" primary CTA

### Results Dashboard
**Multi-Section Layout**:
1. **User Summary Header**: Full-width banner with key details, mystical avatar/photo display
2. **Core Analysis Grid** (2-3 columns on desktop):
   - Personality card (larger, featured)
   - Star chart visualization
   - Human Design chart
   - Career suggestions card
   - Zi Wei Dou Shu insights
   - I-Ching reading
3. **Daily Fortune Section** (2-column): Lucky colors visual display, lottery numbers in elegant presentation
4. **Detailed Breakdowns**: Accordion sections for deep dives

## Component Library

### Cards
- Elevated cards with subtle borders, rounded-2xl
- Internal padding: p-6 to p-8
- Hover state: subtle lift effect (translate-y)
- Icon placement: Top-left or centered above title

### Form Inputs
- Large touch targets (h-12 to h-14)
- Rounded-lg borders
- Focus states with ring treatment
- Label above input with mb-2 spacing
- Helper text below with text-sm

### Buttons
- Primary CTA: Large (px-8 py-4), rounded-full, font-semibold
- Secondary: Outlined variant, same sizing
- Icon buttons: Square (w-12 h-12), rounded-full
- Blur background when over images (backdrop-blur-sm)

### Data Visualization
- Chart containers: Aspect ratio preserved, responsive scaling
- Legend positioning: Bottom or right side
- Minimal gridlines, focus on data
- Smooth curves for flow charts

### Navigation
- Sticky header (top-0 sticky) with backdrop blur
- Logo left, navigation center, CTA right
- Mobile: Hamburger menu with full-screen overlay

## Images

**Hero Image**: Full-width cosmic/celestial scene - deep space imagery with subtle Eastern constellation patterns, golden star trails, or mystical nebula. Should evoke wonder and ancient wisdom. Place as background with dark overlay (bg-opacity-40) for text legibility.

**Section Images**: 
- Feature cards: Symbolic icons representing each analysis system (hand-drawn style illustrations)
- Testimonials: User avatars or mystical symbols
- Results page: Generated charts, zodiac wheels, trigram diagrams

**Photo Upload**: Large, prominent upload zone with mystical frame treatment when photo is added

## Special Considerations

**Cultural Sensitivity**: Respect traditional Chinese fortune-telling aesthetics while maintaining modern web standards - balance ornate mystical elements with clean, readable layouts

**Loading States**: Mystical animation during analysis (rotating symbols, flowing energy patterns) - use sparingly and purposefully

**Mobile Optimization**: All multi-column grids collapse to single column, maintain generous spacing, large touch targets for form inputs

**Accessibility**: High contrast text, ARIA labels for mystical symbols, keyboard navigation for all interactions, alt text describing symbolic imagery

This design creates an immersive, trustworthy fortune-telling experience that honors Eastern mystical traditions while delivering a modern, polished web application.