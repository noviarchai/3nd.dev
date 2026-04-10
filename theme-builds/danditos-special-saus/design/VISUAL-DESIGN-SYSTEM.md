# Visual Design System — Dandito's Special Saus

## Brand Personality in Design
Fire. Craft. Story. Every visual decision reinforces the brand's artisanal, rebellious, hand-crafted identity.

---

## Color Palette

### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Fire Red | `#e74c3c` | Primary CTA buttons, active states, highlights |
| Deep Ember | `#c0392b` | Hover states on primary, headers accents |
| Dark Coal | `#1a1a1a` | Primary background, cards |
| Charcoal | `#2d2d2d` | Secondary backgrounds, footer |
| Warm Black | `#0f0f0f` | Deepest backgrounds, overlays |

### Secondary Colors

| Name | Hex | Usage |
|------|-----|-------|
| Ember Orange | `#e67e22` | Price text, badges, secondary accents |
| Flame Orange | `#d35400` | Hover on orange elements |
| Warm Amber | `#f39c12` | Gold/featured badges, highlights |

### Neutrals

| Name | Hex | Usage |
|------|-----|-------|
| White Smoke | `#f5f5f5` | Primary text on dark |
| Warm White | `#faf8f5` | Body text, light backgrounds |
| Muted Gray | `#888888` | Secondary text, disabled states |
| Line Gray | `#3a3a3a` | Borders, dividers on dark |
| Subtle Gray | `#2a2a2a` | Input backgrounds, subtle cards |

### Functional Colors

| Name | Hex | Usage |
|------|-----|-------|
| Success Green | `#27ae60` | Success states, in-stock |
| Warning Amber | `#f39c12` | Low stock, warnings |
| Error Red | `#e74c3c` | Error states, required fields |
| Info Blue | `#3498db` | Informational notices |

---

## Typography

### Font Families

**Display/Headlines:** `Bebas Neue` (Google Fonts) — Bold, condensed, impactful
**Body:** `Source Sans 3` (Google Fonts) — Warm, readable, friendly sans-serif
**Accent/Badges:** `Oswald` (Google Fonts) — Medium weight for badges and labels

### Type Scale

| Element | Font | Size (Desktop) | Weight | Line Height | Letter Spacing |
|---------|------|----------------|--------|-------------|----------------|
| Display (H1) | Bebas Neue | 72px / 4.5rem | 400 | 1.1 | 0.02em |
| H1 | Bebas Neue | 56px / 3.5rem | 400 | 1.15 | 0.02em |
| H2 | Bebas Neue | 42px / 2.625rem | 400 | 1.2 | 0.01em |
| H3 | Bebas Neue | 32px / 2rem | 400 | 1.25 | 0.01em |
| H4 | Source Sans 3 | 24px / 1.5rem | 700 | 1.3 | 0 |
| H5 | Source Sans 3 | 20px / 1.25rem | 600 | 1.4 | 0 |
| H6 | Source Sans 3 | 18px / 1.125rem | 600 | 1.4 | 0 |
| Body | Source Sans 3 | 18px / 1.125rem | 400 | 1.7 | 0 |
| Body Small | Source Sans 3 | 16px / 1rem | 400 | 1.6 | 0 |
| Caption | Source Sans 3 | 14px / 0.875rem | 400 | 1.5 | 0.01em |
| Button | Source Sans 3 | 16px / 1rem | 700 | 1 | 0.05em |
| Badge | Oswald | 12px / 0.75rem | 500 | 1 | 0.08em |
| Price | Source Sans 3 | 28px / 1.75rem | 700 | 1 | 0 |

### Mobile Typography Adjustments

| Element | Mobile Size |
|---------|------------|
| Display (H1) | 48px / 3rem |
| H1 | 40px / 2.5rem |
| H2 | 32px / 2rem |
| H3 | 26px / 1.625rem |
| Body | 16px / 1rem |

---

## Spacing Scale

Based on 8px base unit.

| Token | Value | Usage |
|-------|-------|-------|
| `--space-xs` | 4px | Tight inline spacing |
| `--space-sm` | 8px | Icon gaps, tight padding |
| `--space-md` | 16px | Standard padding, gaps |
| `--space-lg` | 24px | Section internal spacing |
| `--space-xl` | 32px | Card padding, section gaps |
| `--space-2xl` | 48px | Major section spacing |
| `--space-3xl` | 64px | Hero section padding |
| `--space-4xl` | 96px | Large section breathing room |

---

## Component Specifications

### Buttons

**Primary Button**
- Background: `#e74c3c` (Fire Red)
- Text: White, `Source Sans 3` 16px, weight 700, uppercase, letter-spacing 0.05em
- Padding: 16px 32px
- Border-radius: 4px
- Hover: Background `#c0392b`, box-shadow `0 0 24px rgba(231,76,60,0.4)`
- Active: Scale 0.98, box-shadow reduces
- Transition: all 200ms ease

**Secondary Button**
- Background: transparent
- Border: 2px solid `#e74c3c`
- Text: `#e74c3c`, same style as primary
- Hover: Background fills with `#e74c3c`, text becomes white
- Active: Scale 0.98

**Ghost Button (light bg)**
- Background: transparent
- Border: 2px solid white
- Text: White
- Hover: Background white, text `#1a1a1a`

### Product Card

- Background: `#1a1a1a`
- Border-radius: 8px
- Overflow: hidden
- Image: aspect-ratio 1:1, object-fit cover
- Padding: 16px (text zone below image)
- Hover: translateY(-8px), box-shadow `0 20px 40px rgba(0,0,0,0.4)`
- Transition: transform 300ms ease-out, box-shadow 300ms ease

### Badges/Pills

- Border-radius: 50px (full pill)
- Padding: 4px 12px
- Font: `Oswald` 12px, weight 500, letter-spacing 0.08em, uppercase
- Background varies by type (see badge system)

### Input Fields

- Background: `#2a2a2a`
- Border: 1px solid `#3a3a3a`
- Border-radius: 4px
- Padding: 14px 16px
- Font: `Source Sans 3` 16px, color `#f5f5f5`
- Placeholder: `#888888`
- Focus: border-color `#e67e22`, box-shadow `0 0 0 3px rgba(230,126,34,0.15)`
- Transition: border-color 200ms, box-shadow 200ms

### Navigation

- Background: transparent (on hero) → `#0f0f0f` (on scroll)
- Height: 80px (desktop), 64px (mobile/scrolled)
- Transition: background 300ms ease
- Link: `Source Sans 3` 16px, color white
- Active: color `#e74c3c`
- Hover: color `#e74c3c`, underline slides in

### Dividers

- Horizontal rule: 1px solid `#3a3a3a`
- Ember gradient divider: linear-gradient from `#e74c3c` to transparent, height 2px
- Section separator: 80px margin top/bottom

---

## Border Radius Scale

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | 2px | Inputs, small elements |
| `--radius-md` | 4px | Buttons, badges |
| `--radius-lg` | 8px | Cards, panels |
| `--radius-xl` | 16px | Modals, large panels |
| `--radius-full` | 9999px | Pills, avatars |

---

## Shadow System

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 2px 8px rgba(0,0,0,0.2)` | Subtle card lift |
| `--shadow-md` | `0 8px 24px rgba(0,0,0,0.3)` | Card hover lift |
| `--shadow-lg` | `0 20px 40px rgba(0,0,0,0.4)` | Strong card lift |
| `--shadow-glow` | `0 0 24px rgba(231,76,60,0.3)` | CTA glow on hover |
| `--shadow-inset` | `inset 0 2px 4px rgba(0,0,0,0.3)` | Pressed state |

---

## Icon Style

- **Style:** Outline icons, 2px stroke weight
- **Source:** Inline SVG (hand-crafted for key icons), Feather Icons for utility icons
- **Size:** 20px default for nav/utilities, 24px for content icons, 16px for inline
- **Color:** Inherits text color, hover changes to fire red

---

## Image Treatment

### Aspect Ratios
| Context | Ratio | Notes |
|---------|-------|-------|
| Hero | 16:9 | Full-width, 100vw |
| Product Card | 1:1 | Square crop |
| Product Gallery | 4:3 | Standard product shots |
| Blog Featured | 16:9 | Editorial image |
| About/Craft | 3:2 | Process photography |

### Placeholder Style
- Low-res blurred version of image color, or
- Solid `#2d2d2d` with centered flame SVG icon
- Uses blur-up technique: tiny base64 → full image

---

## Motion Style Guide

### Character
Fire warmth — animations feel like heat rising, not mechanical precision. Ease-out curves dominate. Nothing snaps or stops abruptly.

### Easing Curves
```css
--ease-out: cubic-bezier(0.25, 0.46, 0.45, 0.94);   /* Primary ease */
--ease-in-out: cubic-bezier(0.455, 0.03, 0.515, 0.955);
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1);    /* Bouncy for cart */
```

### Duration Standards
| Type | Duration |
|------|----------|
| Micro (hover, focus) | 150-200ms |
| UI transitions | 300ms |
| Page sections | 600ms |
| Modals/overlays | 300ms |

---

## Responsive Behavior

### Breakpoints
```css
--bp-xs: 375px;   /* Small mobile */
--bp-sm: 576px;   /* Mobile landscape */
--bp-md: 768px;   /* Tablet portrait */
--bp-lg: 1024px;  /* Tablet landscape / small desktop */
--bp-xl: 1280px;  /* Desktop */
--bp-2xl: 1536px; /* Large desktop */
```

### Grid
- Desktop: 12-column grid, 24px gutters
- Tablet: 8-column grid, 20px gutters
- Mobile: 4-column grid, 16px gutters
- Max content width: 1280px
- Reading content width: 720px

### Typography Adaptation
- Scale down at each breakpoint (see mobile adjustments above)
- Line heights increase slightly on mobile for readability
- Display headings may wrap to multiple lines on mobile (allowed)

---

## Visual Texture

### Subtle Noise/Grain
- Hero sections: Subtle film grain overlay at 3-5% opacity
- Creates warmth, avoids flat digital look
- Applied via CSS `::after` pseudo-element with noise SVG filter

### Ember Glow Effects
- Primary CTAs: Subtle radial gradient glow behind button on hover
- Product images: Very subtle warm vignette overlay
- Achieved via CSS gradients and box-shadows

---

## Dark Mode

Not applicable — this is a dark-first theme. All components designed for dark backgrounds.

### Surface Elevation
| Level | Background | Usage |
|-------|------------|-------|
| Base | `#0f0f0f` | Page background |
| Surface | `#1a1a1a` | Cards, panels |
| Elevated | `#2d2d2d` | Modals, dropdowns |
| Overlay | `#3a3a3a` | Hover states |

### Text Contrast
- Primary text: `#f5f5f5` on `#0f0f0f` → ratio 16:1 ✓
- Secondary text: `#888888` on `#0f0f0f` → ratio 5.5:1 ✓
- Disabled: `#555555` on `#0f0f0f` → ratio 3:1 ✓
