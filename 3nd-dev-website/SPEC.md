# 3ND.DEV — Website Specification

## Concept & Vision

3ND.DEV is the premium web presence for ThreeNudeDudes — a multi-venture development collective founded by Saucy Dan, Ryan, and Podcast Jay. The site communicates raw entrepreneurial energy: *"We build businesses across industries and win."* Dark, cinematic, neon-soaked — like a startup studio meets content brand meets lifestyle movement. Every scroll should feel like flipping through a highlight reel of winners.

---

## Design Language

### Aesthetic Direction
**Reference:** Cyberpunk tropical nightclub meets high-end startup studio. Think Blade Runner's neon + Miami Vice's heat + modern SaaS polish. Nighttime only. Glossy. Bold. Unapologetically loud.

### Color Palette
| Role | Color | Hex |
|------|-------|-----|
| Background (primary) | Near-black | `#0a0a0a` |
| Background (secondary) | Dark charcoal | `#111111` |
| Card/surface | Dark gray | `#1a1a1a` |
| 3ND Brand (primary) | Electric purple | `#9D4EDD` |
| Saucy Dan accent | Heat red/orange | `#FF4500` |
| Ryan accent | Clean blue | `#00B4D8` |
| Podcast Jay accent | Hot pink/gold | `#FF006E` |
| Text (primary) | White | `#FFFFFF` |
| Text (secondary) | Muted gray | `#A0A0A0` |
| Glow effects | Purple/blue/pink | `rgba(157,78,221,0.5)` |

### Typography
- **Headlines:** "Bebas Neue" (Google Fonts) — all caps, massive, bold
- **Subheadlines/Labels:** "Rajdhani" (Google Fonts) — techy, sharp
- **Body:** "Inter" (Google Fonts) — clean, readable
- **Accent Numbers:** "Orbitron" (Google Fonts) — futuristic, digital feel

### Spatial System
- Base unit: 8px
- Section padding: 120px vertical (desktop), 80px (mobile)
- Card padding: 32px
- Gap rhythm: 16 / 24 / 32 / 48 / 64px
- Max content width: 1200px

### Motion Philosophy
- **Entrance animations:** Fade up + slight scale (0.95 → 1.0), 600ms ease-out, staggered 150ms between elements
- **Hover states:** Lift effect (translateY -4px) + glow intensification, 200ms
- **Section transitions:** Subtle parallax on scroll (background moves slower)
- **Neon pulse:** Subtle box-shadow pulse on key elements (2s infinite, 0.3 → 0.6 opacity)
- **Scroll-triggered reveals:** Elements animate in when 20% visible via Intersection Observer

### Visual Assets
- **Icons:** Phosphor Icons (thin weight for elegance, bold for emphasis)
- **Images:** Dark cinematic stock for ventures section; logo for header
- **Decorative:** Neon line accents, gradient glows, grid patterns, palm silhouettes
- **Texture:** Subtle noise overlay (5% opacity) on dark backgrounds

---

## Layout & Structure

### Page Flow (Single Page, Sections)

1. **HERO** — Full viewport, centered statement, logo + tagline
2. **THE FOUNDERS** — 3-column founder cards with distinct accent colors
3. **OUR VENTURES** — Grid of venture cards (expanding ecosystem feel)
4. **HOW WE BUILD** — Horizontal process flow (Idea → Build → Launch → Scale)
5. **LIFESTYLE** — Full-width cinematic band, bold manifesto text
6. **FOOTER** — Minimal, social links, copyright

### Visual Pacing
- Hero: Maximum breathing room, single focal point
- Founders: Dense information, 3 equal columns
- Ventures: Medium density, card grid
- Process: Clean horizontal flow, icons + text
- Lifestyle: Dramatic, minimal text, maximum visual impact
- Footer: Compact, functional

### Responsive Strategy
- Desktop (1200px+): Full 3-column layouts, large typography
- Tablet (768-1199px): 2-column grids collapse, reduced spacing
- Mobile (<768px): Single column, stacked founder cards, hamburger nav

---

## Features & Interactions

### Navigation
- Sticky top bar, transparent → solid black on scroll
- Logo left, nav links right (desktop)
- Hamburger menu on mobile (slide-in drawer from right)
- Links: Founders, Ventures, Process, Contact
- Smooth scroll to sections on click

### Hero Section
- Full viewport height (100vh)
- Centered content: Logo, "WE BUILD VENTURES" headline, tagline
- Subtle animated gradient glow behind headline
- Scroll indicator (bouncing chevron) at bottom
- Background: dark with subtle grid pattern + palm tree silhouettes

### Founders Section
- 3 cards in a row (desktop), stacked (mobile)
- Each card:
  - Neon-bordered top strip (founder's accent color)
  - Name in large Bebas Neue
  - Role label in Rajdhani (smaller, accent color)
  - Description paragraph
  - Subtle glow matching accent color on hover
- Cards animate in staggered (left → center → right)

### Ventures Section
- 2x2 grid (desktop), 1 column (mobile)
- Cards:
  - Dark surface with gradient border on hover
  - Venture name (bold)
  - Category tag
  - Brief description
  - "Coming Soon" badge for future ventures
  - Hover: lift + glow effect
- Ventures: Dandito's Hot Sauce, Pool Services, Podcast Brand, Future (placeholder)

### Process Section
- 4-step horizontal timeline
- Each step: Icon (Phosphor), number, label, short description
- Connected by neon line
- Steps animate in sequentially on scroll
- Mobile: vertical timeline

### Lifestyle Section
- Full-width dark image background (city + tropical vibe)
- Overlay gradient (dark bottom for text readability)
- Large bold text: "Work Hard. Help People. Live Free."
- Subtle parallax on scroll

### Footer
- Dark background (#0a0a0a)
- Logo + tagline
- Social icons (Instagram, Twitter/X, YouTube, TikTok)
- Copyright + "ThreeNudeDudes"

### Micro-Interactions
- Button hover: scale(1.02) + glow intensify
- Card hover: translateY(-4px) + shadow expand
- Nav link hover: underline slides in from left
- Logo: subtle pulse animation on load

---

## Component Inventory

### NavBar
- States: transparent (top), solid (scrolled), mobile-open
- Logo: 3ND.DEV text in Bebas Neue with purple glow
- Nav links: white text, purple underline on hover/active

### HeroBlock
- States: default only (full viewport)
- Animated gradient background
- Staggered text reveal on load

### FounderCard
- States: default, hover (glow + lift)
- Accent color stripe at top (unique per founder)
- All text left-aligned

### VentureCard
- States: default, hover, "coming soon" variant
- Image area (or gradient placeholder), content below
- Badge in corner for "Coming Soon"

### ProcessStep
- States: default, active (in view), completed
- Icon in circle with neon ring
- Connected line to next step

### CTASection (Lifestyle band)
- States: default only
- Background image with dark gradient overlay
- Centered text

### Footer
- States: default only
- Social icons with hover glow

---

## Technical Approach

### Stack
- Single HTML file with embedded CSS and JavaScript
- Vanilla JS (no frameworks needed for a one-page site)
- Google Fonts via CDN (Bebas Neue, Rajdhani, Inter, Orbitron)
- Phosphor Icons via CDN

### Architecture
- `index.html` — complete single-page implementation
- CSS custom properties for theming
- CSS Grid + Flexbox for layout
- Intersection Observer API for scroll animations
- Smooth scroll behavior via CSS

### Key Implementation Notes
- All assets from CDN or inline (no external image dependencies except logo)
- Logo embedded as inline SVG or provided image path
- Neon glow effects via CSS box-shadow and text-shadow
- Responsive via CSS media queries (single breakpoint at 768px)
- Scroll-triggered animations via Intersection Observer (no scroll libraries)
- Mobile menu: CSS transform + JS toggle

---

## Content

### Hero
- Headline: "WE BUILD VENTURES"
- Tagline: "Three Minds. Multiple Businesses. One Engine."

### Founders

**Saucy Dan**
- Label: "Product / Flavor / Chaos"
- Description: "The one who turns ideas into physical products you can taste, hold, and love. If it involves heat, heart, or brand — Dan makes it happen."

**Ryan**
- Label: "Systems / Service / Execution"
- Description: "The operator. Ryan turns complexity into clean systems and service businesses that run like clockwork. No chaos, just results."

**Podcast Jay**
- Label: "Media / Audience / Growth"
- Description: "The growth engine. Jay builds audiences, creates content, and turns listeners into customers. The brand multiplier."

### Ventures
1. **Dandito's Hot Sauce** — "From kitchen experiment to shelf presence. The flagship physical product."
2. **Pool Services** — "Crystal clear results. Ryan's service business keeping pools perfect."
3. **Podcast Brand** — "Content that builds audiences. Jay's media machine."
4. **Future Ventures** — "The next thing is always brewing..."

### Process
1. **IDEA** — "Identify opportunities across industries"
2. **BUILD** — "Develop, test, and create"
3. **LAUNCH** — "Get it to market and validated"
4. **SCALE** — "Grow and expand the ecosystem"

### Lifestyle
- Main text: "Work Hard. Help People. Live Free."
- Subtext: "We build because we love it. We win together."

### Footer
- Tagline: "Three Minds. Multiple Businesses. One Engine."
- Social: Instagram | Twitter/X | YouTube | TikTok
- Copyright: "© 2026 ThreeNudeDudes. All rights reserved."