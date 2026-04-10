# Homepage & Landing Design — Dandito's Special Saus

## Homepage Layout Map (Top to Bottom)

1. **Hero Section** — Full-viewport immersive brand statement
2. **Brand Pillars** — Three-column feature strip: Small Batch / Calgary Made / No Shortcuts
3. **Featured Products** — "Our Sauces" product grid with heat level filtering
4. **Story Teaser** — Editorial split section with brand narrative and image
5. **Craft Process** — Three-step visual storytelling (Peppers → Process → Bottle)
6. **Testimonial** — Single powerful quote from a customer
7. **Find Us** — Retail locations teaser with CTA to full Where to Buy page
8. **Newsletter** — Email signup with fiery welcome copy
9. **Footer** — Links, social, copyright

---

## Hero Section Design

### Layout
- **Full-viewport height** (100vh), no scroll initially
- Background: Full-bleed dark product photography OR abstract fire/pepper imagery
- **Overlay:** Dark gradient from bottom (`rgba(15,10,5,0.7)` → transparent) to ensure text legibility
- Content positioned in bottom third of viewport (grounded, not floating)

### Content Zone
```
[Background image/video with dark overlay]
  
  [NO FACTORY SAUCE. NO SHORTCUTS.]  ← Display type, large, centered or left-aligned
  [Tagline: Every bottle tells a story...]  ← Body text, warm white
  [Shop Now] [Our Story]  ← Two CTA buttons side by side
                                          
  [↓ Scroll indicator: animated down arrow]  ← Bottom center
```

### Typography
- **NO FACTORY SAUCE. NO SHORTCUTS.:** Bebas Neue, 72px desktop / 48px mobile, warm white, letter-spacing 0.02em
- **Tagline:** Source Sans 3, 22px, warm white (`#faf8f5`), max-width 600px
- **CTAs:** Primary + Secondary button side by side

### Responsive Behavior
- Mobile: Text scales down, CTAs stack vertically
- Background image/video maintains cover, centers on focal point
- Scroll indicator hidden on mobile (swipe hint instead)

### Animation Entry
1. Page load → dark background fades in (200ms)
2. Tagline text reveals with fade-up (400ms, 200ms delay)
3. Headline text reveals with fade-up (600ms, 400ms delay)
4. CTA buttons fade up (400ms, 600ms delay)
5. Scroll indicator pulses (continuous)

---

## Brand Pillars Section

### Layout
- Background: `#1a1a1a` (slightly lighter than page base)
- Three equal columns, each with icon + heading + short text
- Horizontal rule with ember gradient on sides
- Adequate padding: `--space-3xl` top/bottom

### Content
| Column | Icon | Heading | Description |
|--------|------|---------|-------------|
| 1 | Flame SVG | SMALL BATCH | Every bottle numbered, every batch crafted with intention |
| 2 | Map Pin SVG | CALGARY MADE | Peppers sourced from local Alberta farms, made in Calgary |
| 3 | Ban Sign SVG | NO SHORTCUTS | No fillers, no artificial ingredients, no factory nonsense |

### Typography
- Heading: Bebas Neue, 28px, fire red
- Description: Source Sans 3, 16px, warm white, max 3 lines

### Animation
- Each pillar fades up with 200ms stagger (left → right)
- Triggers when section enters viewport

---

## Featured Products Section

### Layout
- Background: `#0f0f0f` (page base)
- Section heading: "OUR SAUCES" centered, Bebas Neue 42px
- Heat level filter pills below heading (All / Mild / Medium / Hot / Extremé)
- 3-column product grid (4 products shown)
- "View All Products →" text link below grid
- Padding: `--space-4xl` top/bottom

### Product Cards
- Dark charcoal card style per Visual Design System
- Heat level badge on product image
- On hover: card lifts, second image reveals, Add to Cart slides up
- Price in ember orange

### Responsive
- Desktop: 3-column grid
- Tablet: 2-column grid
- Mobile: 2-column grid, filters in horizontal scroll

---

## Story Teaser Section

### Layout
- Asymmetric 2-column layout: 55% image / 45% text
- Image: Rich product photography or founder with sauce
- Text zone: Heading, paragraph, "Read Our Story" link
- Reversed variant (text left, image right) on alternating pages if applicable
- Background: `#1a1a1a`

### Content
**Heading:** "Every Bottle Tells a Story"
**Body:** "It starts with a pepper picked at peak. Garlic roasted just right. Vinegar balanced to make your tongue dance. This isn't sauce that comes from a vat — it comes from a kitchen. Our kitchen. In Calgary."
**CTA:** "Read Our Full Story →" — text link with arrow, fire red

### Animation
- Image: Slides in from left (opacity + translateX)
- Text: Slides in from right
- Triggers when section enters viewport

---

## Craft Process Section

### Layout
- Background: `#2d2d2d` (slightly elevated)
- Section heading centered: "FROM PEPPER TO BOTTLE"
- Three-step horizontal flow on desktop, vertical stack on mobile
- Each step: Number badge, icon, heading, short description
- Connecting line/arrow between steps

### Steps
| Step | Icon | Heading | Description |
|------|------|---------|-------------|
| 1 | Pepper SVG | THE PEPPER | Local Alberta peppers, hand-selected for perfect heat-to-flavor ratio |
| 2 | Pot/Flame SVG | THE CRAFT | Small-batch cooking in our Calgary kitchen — no rush, no shortcuts |
| 3 | Bottle SVG | THE SAUCE | Hand-bottled, numbered, and shipped to your door |

### Animation
- Steps reveal sequentially on scroll (300ms stagger)
- Number badge has subtle pulse/glow when in view

---

## Testimonial Section

### Layout
- Full-width, centered
- Background: Dark with subtle flame texture overlay
- Large quotation marks (fire red, decorative)
- Quote text: Source Sans 3, 28px, italic, warm white
- Attribution: "— [Customer Name]" in caption style

### Content Example
> "Finally, a hot sauce that actually tastes like something. Not just heat for heat's sake — there's depth here. Garlic, pepper, a little sweetness. I've put this on everything."
> — Marcus T., Calgary

### Animation
- Quote fades in with slight scale (0.95→1)
- Attribution slides up 200ms after quote

---

## Find Us Section

### Layout
- Split layout: Left = map/location imagery, Right = text + CTA
- Or: Full-width with embedded map and retailer cards below
- Background: `#1a1a1a`

### Content
- Heading: "FIND US IN THE WILD"
- Subtext: "Dandito's Special Saus is available at these fine Calgary locations"
- List: 3-4 retailer cards (name, address, icon)
- CTA: "See All Locations →" button

### Responsive
- Mobile: Retailer cards stack vertically, map above

---

## Newsletter Section

### Layout
- Full-width, centered
- Background: Gradient from `#1a1a1a` to `#0f0f0f`
- Email input + Subscribe button (side by side on desktop, stacked on mobile)
- Privacy note: "No spam. Unsubscribe anytime. We hate factory sauce too."

### Content
- Heading: "JOIN THE SAUCE"
- Subtext: "Get the inside scoop on new flavors, limited batches, and where to find us."

### Success State
- Input area replaced with: "You're in! 🌶️ Check your inbox for a welcome heat wave."

### Animation
- Section fades in, form elements stagger up

---

## Footer

### Layout
- Background: `#0a0a0a` (deepest dark)
- 4-column grid: Logo+Tagline | Shop | Company | Connect
- Below grid: Divider line, then copyright + policy links centered
- Social icons row in Connect column

### Columns
| Column | Heading | Links |
|--------|---------|-------|
| 1 | Logo + tagline | — |
| 2 | Shop | All Sauces, Heat Levels, Gift Sets, Merch |
| 3 | Company | Our Story, Where to Buy, Contact |
| 4 | Connect | Instagram, Facebook, hello email |

### Animation
- Footer columns fade up on scroll into view

---

## First-Fold Specifications

| Breakpoint | Visible Content |
|------------|----------------|
| 1440px | Full hero, "NO FACTORY SAUCE" headline, tagline, two CTAs, scroll indicator |
| 1024px | Full hero, headline, tagline, CTAs, scroll indicator |
| 768px | Full hero, headline (smaller), tagline, stacked CTAs, scroll indicator |
| 375px | Full hero, headline, tagline (2 lines), stacked CTAs |

---

## Conversion Zone Design

- **Primary CTA (Shop Now):** Fire red, always visible in hero
- **Secondary CTA (Our Story):** Ghost/outline style, drives brand engagement
- **Product Add to Cart:** Prominent on hover in product grid
- **Newsletter:** Mid-page emotional engagement point
- **Mobile sticky CTA:** "Add to Cart" bar on product pages after scroll

---

## Animation Sequence

1. **0ms:** Page load, dark background
2. **200ms:** Hero image visible
3. **400ms:** Tagline fades up
4. **600ms:** Headline fades up
5. **800ms:** CTAs fade up
6. **1000ms:** Scroll indicator appears and pulses
7. **On scroll:** Each section fades up as it enters viewport (Intersection Observer)
8. **Product hover:** Card lift, second image, Add to Cart reveal
