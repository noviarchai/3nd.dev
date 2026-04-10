# WP Strategy Blueprint — Dandito's Special Saus

## Overview
Premium artisanal hot sauce brand theme for WordPress with full WooCommerce integration. Built for storytelling, product showcase, and e-commerce excellence.

---

## Template Hierarchy Plan

| Page Type | Template File | Notes |
|-----------|--------------|-------|
| Static Front Page | `front-page.php` | Custom homepage with sections |
| Blog Posts Index | `home.php` | Latest posts, editorial layout |
| Single Post | `single.php` | Full-width editorial with sidebar option |
| Single Product | `woocommerce/single-product.php` | Custom override |
| Shop Archive | `woocommerce/archive-product.php` | Custom override |
| Generic Page | `page.php` | Full-width option, sidebar option |
| About Page | `page-about.php` | Custom template |
| Where to Buy | `page-where-to-buy.php` | Custom template |
| Contact | `page-contact.php` | Custom template with form |
| Category Archive | `archive.php` | Blog categories |
| Tag Archive | `archive.php` | Blog tags |
| Search Results | `search.php` | Branded search results |
| 404 | `404.php` | On-brand error page |

---

## Required Theme Files

```
danditos-special-saus/
├── style.css                     # Main stylesheet
├── functions.php                 # Theme setup, enqueue, supports
├── index.php                      # Main fallback template
├── front-page.php                 # Static front page (homepage)
├── home.php                       # Blog posts index
├── single.php                     # Single blog post
├── page.php                       # Generic page template
├── page-about.php                 # About page template
├── page-where-to-buy.php          # Where to Buy page template
├── page-contact.php               # Contact page template
├── archive.php                    # Archive fallback
├── search.php                     # Search results
├── 404.php                        # 404 page
├── header.php                     # Document head + header
├── footer.php                     # Footer + closing tags
├── sidebar.php                    # Main sidebar
├── comments.php                   # Comments template
├── screenshot.png                 # Theme screenshot (1200x900)
├── template-parts/
│   ├── content-single.php         # Single post content
│   ├── content-page.php           # Page content
│   ├── content-none.php           # No results found
│   ├── entry-meta.php             # Post meta (date, author, categories)
│   ├── entry-thumb.php            # Featured image
│   ├── entry-title.php            # Entry title
│   ├── navigation.php              # Main navigation
│   ├── navigation-mobile.php       # Mobile hamburger menu
│   ├── hero.php                   # Hero section
│   ├── section-features.php        # Brand pillars/features
│   ├── section-products.php       # Featured products section
│   ├── section-story.php          # Brand story teaser
│   ├── section-newsletter.php     # Newsletter signup
│   └── footer/
│       ├── footer-widgets.php     # Footer widget areas
│       ├── footer-social.php      # Social links
│       └── footer-legal.php       # Copyright, policies
├── assets/
│   ├── css/
│   │   └── style.css              # Compiled main styles
│   ├── js/
│   │   └── main.js                # Main JS (menu, scroll, animations)
│   └── images/
│       └── (theme images)
├── inc/
│   ├── customizer.php              # Customizer options
│   ├── template-functions.php      # Helper functions
│   └── template-tags.php           # Reusable template tags
├── woocommerce/
│   ├── archive-product.php         # Shop page
│   ├── single-product.php          # Product detail
│   ├── content-single-product.php  # Product content wrapper
│   ├── cart/
│   │   ├── cart.php                # Full cart page
│   │   └── mini-cart.php          # Slide-out mini cart
│   ├── checkout/
│   │   └── form-checkout.php       # Checkout form
│   ├── loop/
│   │   ├── add-to-cart.php        # Add to cart button
│   │   └── sale-flash.php         # Sale badge
│   └── global/
│       └── quantity-input.php      # Quantity selector
└── README.md
```

---

## Theme Supports

```php
add_theme_support( 'title-tag' );
add_theme_support( 'post-thumbnails' );
add_theme_support( 'custom-logo', array(
    'height' => 200,
    'width'  => 400,
    'flex-width' => true,
    'flex-height' => true,
) );
add_theme_support( 'automatic-feed-links' );
add_theme_support( 'html5', array( 'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script' ) );
add_theme_support( 'woocommerce' );
add_theme_support( 'wc-product-gallery-zoom' );
add_theme_support( 'wc-product-gallery-lightbox' );
add_theme_support( 'wc-product-gallery-slider' );
add_theme_support( 'responsive-embeds' );
add_theme_support( 'align-wide' );
add_theme_support( 'editor-styles' );
add_theme_support( 'wp-block-styles' );
```

---

## Nav Menu Structure

```php
register_nav_menus( array(
    'primary'   => __( 'Primary Menu', 'danditos-special-saus' ),
    'footer'    => __( 'Footer Menu', 'danditos-special-saus' ),
    'mobile'    => __( 'Mobile Menu', 'danditos-special-saus' ),
) );
```

**Primary Menu:** Logo left, nav links center/right, cart icon far right
**Footer Menu:** About, Shop, Find Us, Contact, Privacy, Terms
**Mobile Menu:** Hamburger → full-screen overlay with large nav links

---

## Widget Areas

```php
register_sidebar( array(
    'name'          => __( 'Sidebar', 'danditos-special-saus' ),
    'id'            => 'sidebar-1',
    'description'   => __( 'Main sidebar for blog posts and pages', 'danditos-special-saus' ),
    'before_widget' => '<section id="%1$s" class="widget %2$s">',
    'after_widget'  => '</section>',
    'before_title'  => '<h3 class="widget-title">',
    'after_title'   => '</h3>',
) );

// Footer widget areas
register_sidebar( array(
    'name'          => __( 'Footer Area 1', 'danditos-special-saus' ),
    'id'            => 'footer-1',
    'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
    'after_widget'  => '</div>',
    'before_title'  => '<h4 class="footer-widget-title">',
    'after_title'   => '</h4>',
) );

register_sidebar( array(
    'name'          => __( 'Footer Area 2', 'danditos-special-saus' ),
    'id'            => 'footer-2',
    'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
    'after_widget'  => '</div>',
    'before_title'  => '<h4 class="footer-widget-title">',
    'after_title'   => '</h4>',
) );
```

---

## Customizer Options

```php
// Panel: Theme Options
// Section: Header
- header_cta_text    : text      (default: "Shop Now")
- header_cta_url     : url       (default: /shop)

// Section: Homepage
- featured_products   : text     (comma-separated product IDs)
- homepage_story_link : url
- homepage_cta_text   : text

// Section: Social
- social_facebook    : url
- social_instagram   : url
- social_twitter     : url

// Section: Footer
- footer_newsletter_text : textarea
- footer_copyright_text  : text   (default: "© 2026 Dandito's Special Saus")

// Section: Colors (handled by core color supports)
- primary_color      : color    (fire red)
- accent_color       : color    (ember orange)
```

---

## Block Editor Strategy

- **Editor stylesheet:** `assets/css/editor-style.css` for block editor appearance
- **Block patterns:** Register custom pattern category for "Dandito's" with:
  - Hero section pattern
  - Product showcase pattern
  - Brand story pattern
  - Newsletter signup pattern
- **Block styles:** Style for core/heading blocks with display font
- **Supports:** Wide alignment, editor styles, responsiveembeds

---

## Enqueue Plan

```php
// Styles
wp_enqueue_style( 'danditos-google-fonts', '//fonts.googleapis.com/css2?family=...', array(), null );
wp_enqueue_style( 'danditos-style', get_stylesheet_uri(), array(), '1.0.0' );
wp_enqueue_style( 'danditos-woocommerce', get_template_directory_uri() . '/woocommerce.css', array(), '1.0.0' );

// Scripts
wp_enqueue_script( 'danditos-main', get_template_directory_uri() . '/assets/js/main.js', array(), '1.0.0', true );
wp_enqueue_script( 'danditos-navigation', get_template_directory_uri() . '/assets/js/navigation.js', array(), '1.0.0', true );

// Conditionally
if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
    wp_enqueue_script( 'comment-reply' );
}
```

---

## Hook Plan

**Action hooks used:**
- `woocommerce_before_main_content` — Shop hero banner
- `woocommerce_after_single_product_summary` — Related products customization
- `woocommerce_before_add_to_cart_form` — Product story snippet
- `danditos_before_footer` — Newsletter section above footer
- `danditos_after_header` — Mobile menu overlay trigger

**Filter hooks:**
- `the_title` — Wrap in span for special styling on display fonts
- `excerpt_length` — 25 words for blog excerpts
- `excerpt_more` — Custom "read more" with arrow
- `woocommerce_product_thumbnails_columns` — 4 columns for gallery

---

## SEO Markup Pattern

- Schema.org LocalBusiness for Calgary location
- Schema.org Product for each hot sauce
- Open Graph: `og:image` = product/hero image
- Twitter Card: `summary_large_image`
- Semantic HTML5 landmarks: `<header>`, `<main>`, `<nav>`, `<aside>`, `<footer>`
