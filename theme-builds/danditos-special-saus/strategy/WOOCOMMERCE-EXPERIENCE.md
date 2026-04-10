# WooCommerce Experience Blueprint — Dandito's Special Saus

## Overview
Premium hot sauce e-commerce experience that feels hand-crafted, warm, and intentional — not like a generic WooCommerce template. Every product is presented as a story, every interaction feels like handling something special.

---

## Shop Archive Design

### Layout
- **Desktop:** 3-column product grid on desktop, generous gaps between products, horizontal filter bar at top
- **Mobile:** 2-column grid, filters in slide-out drawer triggered by filter button
- **Sidebar:** Optional left sidebar for category filtering (toggleable)
- **Product cards:** Dark charcoal card background, large product image (hover reveals second image), heat level badge top-left, product name, price, "Add to Cart" appears on hover

### Product Card Design
- Dark card surface (`#1a1a1a` or theme dark)
- Product image: square crop, hover shows alternate angle (second image)
- Heat level badge: pill-shaped, positioned top-left of image
  - MILD: Warm orange
  - MEDIUM: Orange-red
  - HOT: Bright red
  - EXTREMÉ: Deep crimson with flame icon
- Product name: Bold, white, 18px
- Price: Ember orange accent color, bold
- Sale badge: "SALE" — bright red pill top-right of image
- Hover state: Card lifts (box-shadow increase), "Add to Cart" slides up from bottom
- Featured badge: "NEW" — warm gold/yellow pill

### Filtering UI
- Horizontal filter bar: Sort by (Price, Newest, Best Seller), Heat Level toggle pills
- Active filters shown as removable chips
- "Clear All" link when filters active
- Result count: "Showing 6 of 12 sauces"

---

## Single Product Layout

### Desktop Layout (2-column)
```
[Gallery - 55%]          | [Summary - 45%]
Large main image         | Product name
Thumbnail strip below    | Heat level badge
                         | Price (sale struck)
                         | Short description
                         | -----
                         | Add to Cart + Qty
                         | Product story snippet
                         | -----
                         | Accordion: Ingredients, Nutrition, Shipping
```

### Gallery Behavior
- Main image: Large, zoom on hover (scale 1.5x centered on cursor)
- Thumbnails: Horizontal strip below main image, click to swap, active state has ember border
- Lightbox: Click main image opens fullscreen lightbox with navigation arrows
- Mobile: Swipeable thumbnail carousel, tap to open lightbox

### Summary Section
- Heat level badge: Large pill with flame icon and level text
- Price: Large, ember orange. If on sale: original struck through in muted color
- Short description: 2-3 sentences of product story
- Divider: Subtle flame/ember gradient line
- Add to Cart: Large bold button, fire red background, glow on hover
  - Quantity input: Elegant stepper (+/-)
  - "Add to Cart" → Changes to "Added ✓" briefly on success
- Product story snippet: 1-2 sentences about what makes this sauce special
- Accordion tabs: Ingredients | Nutrition Facts | Shipping Info
  - Smooth expand/collapse with rotation on arrow
  - Content fades in

### Related Products
- 4 products shown in horizontal row below product
- Same card style as shop archive
- Heading: "You Might Also Love"

### Upsell Products
- "Complete Your Collection" — shown above related products
- 2-3 products in horizontal scroll

---

## Cart Experience

### Mini-Cart (Slide-out Panel)
- Trigger: Cart icon in header (shows item count badge)
- Slide-in from right, dark overlay on rest of page
- Header: "Your Cart (X items)"
- Product list: Image thumbnail, name, qty stepper, price, remove (X) button
- Subtotal prominently shown
- "View Cart" text link + "Checkout" CTA button
- Free shipping progress bar: "You're $X away from free shipping!"
- Empty state: Illustrated empty bottle, "Your cart is empty — let's fix that" with Shop link

### Full Cart Page (`cart.php`)
- Full-width page layout
- Left: Cart items (image, name, qty stepper, price, remove)
- Right: Cart totals card (subtotal, shipping estimate, total, Checkout button)
- Cross-sell section below: "Complete Your Order" with related products
- "Continue Shopping" link

---

## Checkout Styling

- Single-page checkout with sections expanding/collapsing
- Trust badges: "Secure Checkout", payment icons
- Form fields: Dark input backgrounds, ember-orange focus border
- Order summary sidebar: Sticky on desktop
- Progress indicator: Shipping → Payment → Confirmation
- "Place Order" button: Large, bold, fire red

---

## Account Pages

### Login/Register
- Split layout: Left side has brand imagery/story, right side has form
- Social login options: Apple, Google
- "Forgot password" link

### Dashboard
- Welcome message with customer name
- Quick links: Recent Orders, Addresses, Account Details
- Recent orders with status badges

### Orders
- Table layout: Order #, Date, Status, Total
- Status badges: Processing (orange), Shipped (blue), Delivered (green)

---

## Badge/Label System

| Badge | Style | Color |
|-------|-------|-------|
| MILD | Pill, flame icon | `#e67e22` orange |
| MEDIUM | Pill, flame icon | `#e74c3c` orange-red |
| HOT | Pill, double flame | `#c0392b` red |
| EXTREMÉ | Pill, triple flame, bold | `#922b21` deep red |
| SALE | Pill | `#e74c3c` red |
| NEW | Pill | `#f39c12` gold |
| BESTSELLER | Pill | `#9b59b6` purple |

---

## Mini Cart Design

- Background: Dark charcoal `#1a1a1a`
- Header bar: "Your Cart" with close button
- Items: 64px thumbnail, name, qty, price per row
- Quantity: Clean +/- stepper, 32px touch targets
- Remove: Small X icon, red on hover
- Subtotal: Bold, large, ember orange
- Shipping bar: Progress indicator, warm orange fill
- CTA: Full-width "Checkout" button, fire red
- Footer: "or continue shopping" text link

---

## Mobile Store Experience

- **Gallery:** Full-width swipeable images, dots indicator, tap for lightbox
- **Sticky Add to Cart:** Fixed bar at bottom with price + "Add to Cart" button, appears after scrolling past main CTA
- **Filters:** Slide-out drawer from left, full-height, filter by heat level
- **Product cards:** 2-column grid, compact card, essential info only
- **Touch targets:** All buttons minimum 44x44px
- **Performance:** Lazy load images, skeleton screens on scroll

---

## WooCommerce Customizer Options

```php
// In Customizer:
- woocommerce_shop_page_columns        : 3 or 4
- danditos_sale_badge_style            : pill | badge
- danditos_product_card_style           : standard | compact
- danditos_show_new_badge               : yes/no
- danditos_mini_cart_trigger            : icon_click | hover
```

---

## Add to Cart Animation

1. User clicks "Add to Cart"
2. Button text changes to "Adding..." with subtle pulse
3. Button flashes green briefly
4. Button text changes to "Added ✓" 
5. Mini-cart auto-opens (if setting enabled)
6. Cart icon in header bounces and count updates
7. After 3 seconds, button returns to "Add to Cart"
