# Dandito's Special Saus WordPress Theme

> **Every bottle tells a story — built with peppers that bite, garlic that hits, and flavor that sticks.**

A premium, bold, artisanal WordPress theme for Dandito's Special Saus — a hand-crafted hot sauce brand from Calgary, Alberta.

---

## Installation

1. Download the `danditos-special-saus.zip` file
2. Go to **Appearance → Themes → Add New → Upload Theme**
3. Upload the zip file and click **Install Now**
4. Activate the theme

## Setup

### Required Plugins

- **WooCommerce** — Required for e-commerce features (shop, cart, checkout)
- **Contact Form 7** — Optional, for the contact page form

### Recommended Plugins

- **WooCommerce** — For all store functionality
- **Yoast SEO** — For SEO optimization
- **WP Super Cache** — For performance

## Pages Setup

After activation, create the following pages:

1. **Homepage** — Set as static front page via Settings → Reading
2. **Shop** — Assign WooCommerce shop page template or use default
3. **Cart** — Assign WooCommerce cart page
4. **Checkout** — Assign WooCommerce checkout page
5. **My Account** — Assign WooCommerce account page
6. **About** — Use "About / Our Story" page template
7. **Where to Buy** — Use "Where to Buy" page template
8. **Contact** — Use "Contact" page template

### Navigation

Set up your menus in **Appearance → Menus**:

- **Primary Menu** — Main site navigation (Home, Shop, About, Where to Buy, Contact)
- **Footer Menu** — Footer navigation links
- **Mobile Menu** — Mobile navigation (can copy Primary Menu)

## Customization

### Theme Options (Customizer)

Access via **Appearance → Customize**:

- **Theme Options → Header** — Header CTA button text and URL
- **Theme Options → Footer** — Newsletter text, copyright text
- **Theme Options → Social Media** — Social profile URLs
- **Theme Options → Colors** — Primary (Fire Red) and Accent (Ember Orange) colors

### Custom Logo & Site Identity

Set your logo and site title via **Appearance → Customize → Site Identity**

### Widget Areas

- **Sidebar** — Appears on blog posts and pages
- **Footer Areas 1-3** — Footer widget columns

## WooCommerce Setup

### Product Heat Levels

Add a custom field to each product:

- **Key:** `_heat_level`
- **Values:** `mild`, `medium`, `hot`, `extreme`

### Product Images

Recommended image sizes:

- **Product thumbnails:** 600×600px
- **Product gallery:** 1200×900px (4:3)
- **Hero images:** 1920×1080px (16:9)

### Product Story (optional)

Add a custom field to products for the story snippet:

- **Key:** `_product_story`
- **Value:** Short text shown on single product page

## Page Templates

| Template | Purpose |
|----------|---------|
| Default | Generic page |
| About / Our Story | Brand story page with craft process |
| Where to Buy | Retail locations listing |
| Contact | Contact form and information |

## Requirements

- **WordPress:** 6.0+
- **PHP:** 7.4+
- **WooCommerce:** 7.0+ (for e-commerce)

## Changelog

### 1.0.0

- Initial release
- Full WooCommerce integration
- Dark theme with fire red and ember orange palette
- Responsive design (mobile, tablet, desktop)
- Custom page templates (About, Where to Buy, Contact)
- Mini cart with slide-out panel
- Product heat level badge system
- Scroll animations and micro-interactions
- Custom Customizer options

## Support

For questions or support, contact:

- **Email:** hello@danditos.com
- **Website:** https://danditos.com

---

*NO FACTORY SAUCE. NO SHORTCUTS.*
