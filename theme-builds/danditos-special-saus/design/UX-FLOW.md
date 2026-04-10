# UX Flow & Interaction Document — Dandito's Special Saus

## Overview
Bold, fiery, warm — every interaction feels like handling something hand-crafted with care. The theme doesn't just look good, it feels alive with subtle heat and motion.

---

## User Journey Maps

### Journey 1: Browse → Discover → Buy
1. User lands on homepage hero → scrolls through brand story sections
2. Encounters featured products → clicks product card
3. Product page loads → explores gallery, reads story, adds to cart
4. Mini-cart slides open → proceeds to checkout
5. Completes checkout → sees confirmation with order number

### Journey 2: Direct Product Search
1. User navigates to Shop → browses product grid
2. Filters by heat level → finds desired product
3. Clicks product → lands on product page
4. Adds to cart → continues shopping or checks out

### Journey 3: Brand Discovery
1. User clicks "Our Story" in nav
2. Reads brand narrative → scrolls through craft process photos
3. Visits "Where to Buy" → finds local retailer
4. Signs up for newsletter → follows on Instagram

---

## Interaction Principles

1. **Fire warmth in every touch** — hover states glow like embers, not cold color shifts
2. **Immediate feedback** — every click, tap, scroll has instant visual response
3. **No action wasted** — every element earns its place, nothing decorative-only
4. **Mobile-first precision** — touch targets generous, interactions intuitive on small screens
5. **Story flows forward** — scroll reveals content like chapters, user always knows where they are

---

## Scroll Behavior

- **Smooth scroll:** `scroll-behavior: smooth` on all anchor links
- **Section reveals:** Content fades up from 20px below, opacity 0→1, 600ms ease-out, staggered 100ms between children
- **Parallax:** Subtle parallax on hero background (0.3x scroll speed), disabled on mobile
- **Sticky elements:** Header becomes sticky with condensed height after 100px scroll
- **Scroll progress:** Subtle fire-red progress bar at very top of viewport on long pages

---

## Micro-interaction Inventory

### Buttons
- **Default:** Fire red background (`#e74c3c`), white text, 4px border-radius
- **Hover:** Background brightens 10%, subtle box-shadow glow (0 0 20px rgba(231,76,60,0.4)), cursor pointer
- **Active:** Scale 0.98, shadow reduces
- **Disabled:** 50% opacity, no cursor change
- **Loading:** Text changes to "...", subtle pulse animation

### Product Cards
- **Default:** Dark card (#1a1a1a), product image fills top 70%
- **Hover:** Card lifts 8px (translateY(-8px)), shadow increases, "Add to Cart" button slides up from bottom, second product image fades in
- **Active:** Scale 0.98 briefly

### Navigation Links
- **Default:** White text, no underline
- **Hover:** Fire red color (`#e74c3c`), underline slides in from left
- **Active (current page):** Fire red color, underline persists

### Image Galleries
- **Thumbnail hover:** Scale 1.05, ember border appears
- **Lightbox open:** Backdrop fades in (rgba(0,0,0,0.95)), image scales from 0.8→1
- **Lightbox close:** Click backdrop or X button, fades out

### Form Fields
- **Default:** Dark background (#2a2a2a), subtle border (#444)
- **Focus:** Border transitions to ember orange (#e67e22), subtle glow
- **Error:** Border red (#e74c3c), error message slides down below field
- **Success:** Brief green border flash on valid submission

### Accordion Tabs
- **Closed:** Title with + icon to right
- **Open:** Title stays, icon rotates 45° to become ×, content fades in 300ms
- **Hover on closed:** Title color shifts to ember orange

### Cart Quantity Stepper
- **Default:** - and + buttons flanking number input
- **Hover on +/-:** Background fills with semi-transparent white
- **Active:** Number briefly highlights in fire red
- **Disabled (at min/max):** Respective button dims to 40% opacity

### Mini-Cart Panel
- **Closed:** Cart icon in header with item count badge (fire red pill)
- **Open trigger:** Click cart icon → panel slides from right, 300ms ease-out
- **Backdrop:** Semi-transparent dark overlay fades in simultaneously
- **Close:** Click backdrop, click X, or click checkout (closes mini-cart)
- **Item added:** Panel auto-opens, added item briefly pulses green border

---

## Navigation Interaction

### Desktop Header
- Logo left, primary nav center, utility icons right (search, cart)
- On scroll past 100px: Header shrinks (padding reduces), background becomes more opaque
- Cart icon shows count badge when items > 0
- Search: Click icon → search bar expands inline below nav

### Mobile Hamburger Menu
- Hamburger icon (3 lines) in header right
- Tap → Full-screen overlay slides down (dark charcoal background)
- Large nav links stacked vertically, generous spacing
- Close: Tap X or swipe down
- Menu links have hover state (fire red color)

### Mega Menu (Desktop)
- Hover on "Shop" → Dropdown appears below, full-width or mega panel
- Shows category images, featured products
- Smooth fade-in, 200ms

---

## Modal/Overlay Rules

- **When modals used:** Newsletter signup (exit-intent or scroll-triggered), lightbox for product gallery, any inline product quick-view
- **Open:** Fade in backdrop (300ms), scale content from 0.95→1 (300ms ease-out)
- **Close:** Click backdrop, click X, press Escape key
- **Focus trap:** Tab cycles within modal until closed
- **Backdrop:** `rgba(15, 10, 5, 0.92)` — very dark, slightly warm

---

## Form Interaction Design

### Contact Form
- Fields: Name, Email, Subject (dropdown), Message
- Real-time validation on blur: red border + message below for errors
- Submit button: "Send Message" → "Sending..." → "Message Sent ✓"
- Success: Form replaced with thank-you message
- Error: Toast notification if server error

### Newsletter Form
- Single-line: Email input + "Subscribe" button
- Button: Full-width on mobile, side-by-side on desktop
- Success: Input replaced with "You're in! 🌶️" message
- Error: "Hmm, try again" inline message

---

## Loading States

- **Page transitions:** Fade to warm dark, fade in new content
- **Product grid:** Skeleton cards with subtle shimmer animation
- **Product images:** Low-res placeholder blur, fades to full image on load
- **Buttons:** Text change + subtle pulse during async actions
- **Form submit:** Button text changes, spinner icon appears

---

## Empty/Error States

### Empty Cart
- Illustration: Stylized empty hot sauce bottle (SVG)
- Text: "Your cart is empty — let's fix that"
- CTA: "Browse Our Sauces" button

### No Search Results
- Text: "No results for '[query]'"
- Suggestions: "Try searching for 'hot', 'garlic', or 'medium'"
- CTA: "Browse All Products" link

### 404 Page
- Headline: "404 — This page got too hot to handle"
- Subtext: "Looks like this sauce has run out. Let's get you back on track."
- Search widget embedded
- CTA buttons: "Go Home", "Shop All"
- Background: Subtle flame animation

### Product Not Found
- "This sauce has sold out or moved"
- Related products shown below

---

## Animation Motion Specs

| Animation | Duration | Easing | Type |
|-----------|----------|--------|------|
| Fade up reveal | 600ms | ease-out | CSS |
| Stagger delay | 100ms | linear | CSS |
| Hover lift | 300ms | ease-out | CSS transform |
| Button glow | 200ms | ease | box-shadow |
| Panel slide | 300ms | ease-out | CSS transform |
| Lightbox | 300ms | ease-out | opacity + scale |
| Accordion | 300ms | ease-in-out | max-height |
| Skeleton shimmer | 1.5s | ease-in-out | background-position |

---

## Mobile-Specific Flows

- **Swipe gestures:** Product gallery swipe between images
- **Pull to refresh:** On mobile when applicable
- **Bottom sticky CTA:** "Add to Cart" sticky bar appears after scrolling past main CTA
- **Tap targets:** Minimum 44x44px for all interactive elements
- **Thumb zone:** Primary CTAs placed in lower 60% of mobile screen
