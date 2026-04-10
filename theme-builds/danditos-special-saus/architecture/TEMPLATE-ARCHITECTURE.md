# Template Architecture — Dandito's Special Saus

## Template Hierarchy Map

```
WordPress Template Hierarchy → This Theme's Templates

front-page.php              → Static homepage (highest priority)
home.php                    → Blog posts index
single.php                  → Single blog post
singular (page)             → page.php (falls back to singular.php)
page.php                    → Generic page
  └── page-{slug}.php       → Specific page templates (page-about.php, etc.)
page-about.php              → About/Story page
page-where-to-buy.php        → Where to Buy page
page-contact.php             → Contact page
archive.php                  → Category, tag, author, date archives
search.php                   → Search results
singular.php                 → (WP default fallback)
single-{post_type}.php       → Custom post type singles
index.php                    → Ultimate fallback (should never be seen)
404.php                      → Not found page
```

---

## Page Type → Template File Mapping

| Page Type | Template | Layout | Sidebar |
|-----------|----------|--------|---------|
| Homepage | front-page.php | Full-width sections | No |
| Blog Index | home.php | Editorial list/grid | Yes (optional) |
| Single Post | single.php | Full-width + sidebar | Yes |
| Shop | woocommerce/archive-product.php | Product grid | No |
| Single Product | woocommerce/single-product.php | 2-col gallery + summary | No |
| Cart | woocommerce/cart/cart.php | Full-width | No |
| Checkout | woocommerce/checkout/form-checkout.php | 2-col | No |
| Generic Page | page.php | Contained + sidebar | Optional |
| About | page-about.php | Full-width editorial | No |
| Where to Buy | page-where-to-buy.php | Split content | No |
| Contact | page-contact.php | Form + info split | No |
| Archive | archive.php | Grid | Yes |
| Search | search.php | List | Yes |
| 404 | 404.php | Centered, minimal | No |

---

## Header Template Plan (header.php)

### Structure
```html
<header id="masthead" class="site-header">
    <div class="header-inner">
        <!-- Logo zone -->
        <div class="site-logo">
            <a href="/"><img src="logo.svg" alt="Dandito's Special Saus"></a>
        </div>
        
        <!-- Primary nav -->
        <nav id="site-nav" class="site-nav" aria-label="Primary">
            <?php wp_nav_menu( array( 'theme_location' => 'primary', 'container' => false ) ); ?>
        </nav>
        
        <!-- Utility bar -->
        <div class="header-utilities">
            <button class="search-toggle" aria-label="Search">
                <svg>...</svg>
            </button>
            <a href="<?php echo wc_get_cart_url(); ?>" class="cart-link" aria-label="Cart">
                <svg>...</svg>
                <span class="cart-count"><?php echo WC()->cart->get_cart_contents_count(); ?></span>
            </a>
            <button class="mobile-menu-toggle" aria-label="Menu">
                <span></span><span></span><span></span>
            </button>
        </div>
    </div>
    
    <!-- Mobile menu overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu">
        <nav aria-label="Mobile">
            <?php wp_nav_menu( array( 'theme_location' => 'mobile' ) ); ?>
        </nav>
    </div>
</header>
```

### Header Behavior
- Default: Transparent background over hero
- Scrolled (>100px): Dark `#0f0f0f` background, slight shadow
- Transition: 300ms ease on all properties

---

## Footer Template Plan (footer.php)

### Structure
```html
<footer id="colophon" class="site-footer">
    <!-- Footer widget areas -->
    <div class="footer-widgets">
        <div class="container">
            <div class="footer-grid">
                <div class="footer-col footer-brand">
                    <!-- Logo + tagline + social -->
                </div>
                <div class="footer-col">
                    <!-- Shop links widget -->
                </div>
                <div class="footer-col">
                    <!-- Company links widget -->
                </div>
                <div class="footer-col">
                    <!-- Newsletter signup -->
                </div>
            </div>
        </div>
    </div>
    
    <!-- Footer bottom -->
    <div class="footer-bottom">
        <div class="container">
            <p class="copyright">&copy; <?php echo date('Y'); ?> Dandito's Special Saus</p>
            <nav class="footer-legal">
                <?php wp_nav_menu( array( 'theme_location' => 'footer' ) ); ?>
            </nav>
        </div>
    </div>
</footer>
```

---

## Template Part Inventory

```
template-parts/
├── content-single.php          # Single post content (with entry-header, entry-content, entry-footer)
├── content-page.php            # Page content (with page header)
├── content-none.php             # No results found (search, archive)
├── entry-meta.php              # Post meta: date, author, categories, tags
├── entry-thumb.php             # Featured image/thumbnail
├── entry-title.php             # Entry title (used in loops)
├── navigation.php              # Main navigation menu
├── navigation-mobile.php       # Mobile hamburger menu
├── header/
│   └── site-branding.php       # Logo and site title
├── footer/
│   ├── footer-widgets.php      # Footer widget areas
│   ├── footer-social.php       # Social links
│   └── footer-legal.php        # Copyright and policy links
└──woocommerce/
    ├── product-card.php        # Reusable product card
    └── product-badge.php       # Heat level / sale badges
```

---

## Archive Layout Variants

### Blog Archive (home.php)
- Full-width or sidebar layout (user choice via Customizer)
- Posts displayed in list format with featured image left, content right
- Pagination with prev/next arrows
- Optional sidebar with recent posts, categories widget

### Category/Tag Archive (archive.php)
- Page header with category/tag name
- Grid layout: 2 columns desktop, 1 mobile
- Same card style as blog
- Breadcrumb above header

### Search Results (search.php)
- Page header: "Search results for '[query]'"
- List layout with highlighted matching text
- No results: Helpful empty state with suggestions

---

## Single Post Template (single.php)

### Layout
```
[Featured Image - full width]
[Post Header: Title + Meta]
[Content - contained, max 720px, centered]
[Tags]
[Author Bio - card style]
[Related Posts - 3 cards]
[Comments]
```

### Meta Display
- Date: "April 9, 2026"
- Author: "By [Name]"
- Categories: "In: [Category], [Category]"
- Read time: "5 min read"

---

## 404 Template (404.php)

### Layout
```
[Large "404" display text]
["This page got too hot to handle"]
[Search widget]
[Home button + Shop button]
[Subtle animated flame background]
```

---

## Page Template Variants

### Full-width (default page.php)
- No sidebar
- Contained content area (max 1280px)
- Used for: Contact, Where to Buy

### With Sidebar (not used for Dandito's — kept for generic pages)
- Sidebar on right
- Content max 720px
- Used for: Generic informational pages if needed

---

## Conditional Logic

```php
// Sidebar display
if ( is_active_sidebar( 'sidebar-1' ) && ! is_woocommerce() && ! is_singular( 'product' ) ) {
    $has_sidebar = true;
}

// Header style
if ( is_front_page() ) {
    $header_class = 'header-transparent';
} else {
    $header_class = 'header-dark';
}

// WooCommerce overrides
if ( is_woocommerce() ) {
    remove_action( 'woocommerce_before_main_content', 'woocommerce_output_content_wrapper', 10 );
    // Custom wrapper functions used instead
}
```

---

## Block Editor / Gutenberg Support

- `alignwide` and `alignfull` supported for full-bleed sections
- Block patterns registered for:
  - Hero section
  - Product showcase
  - Brand story (image + text)
  - Newsletter signup
  - Testimonial
- Editor stylesheet matches front-end typography and colors
- Core blocks styled: headings (display font), buttons, galleries, quotes

---

## Comment Template Structure

```php
// comments.php structure
<?php if ( have_comments() ) : ?>
    <section class="comments-area">
        <h2 class="comments-title"><?php comments_number(); ?></h2>
        <ol class="comment-list">
            <?php wp_list_comments(); ?>
        </ol>
        <?php the_comments_pagination(); ?>
    </section>
<?php endif; ?>

<?php if ( ! comments_open() ) : ?>
    <p class="no-comments">Comments are closed.</p>
<?php endif; ?>

<?php comment_form(); ?>
```
