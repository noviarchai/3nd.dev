# WordPress Theme File Reference

Complete reference of files a WordPress theme should include, their purpose, and when they're required vs. optional.

---

## Required Theme Files (Minimum)

### `style.css` — REQUIRED
**Purpose:** Main stylesheet. Must include a valid theme header comment block.
```
/*
Theme Name: Theme Name
Theme URI: https://example.com/theme
Author: Author Name
Author URI: https://example.com
Description: A premium WordPress theme for [niche].
Version: 1.0.0
Requires at least: 6.0
Tested up to: 6.4
Requires PHP: 7.4
License: GNU General Public License v2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html
Text Domain: theme-slug
Tags: e-commerce, blog, custom-menu, custom-logo, featured-images, threaded-comments
*/
```

### `index.php` — REQUIRED
**Purpose:** The main fallback template. If no other template is found, WordPress uses this. Should contain the main loop.

### `functions.php` — REQUIRED
**Purpose:** Theme setup, enqueue scripts/styles, theme supports, nav menus, widget areas, Customizer settings.
**Note:** Unlike style.css, functions.php is loaded automatically. Use an opening PHP tag only, no HTML.

---

## Template Hierarchy Templates

### `front-page.php`
**Purpose:** Static front page (when front page is set to "A static page")
**Priority:** Highest — overrides any home.php

### `home.php`
**Purpose:** Blog posts index (when front page is set to "Your latest posts")
**Priority:** Falls back to index.php

### `single.php`
**Purpose:** Single post view
**Priority:** Falls back to singular.php → index.php

### `page.php`
**Purpose:** Single page view
**Priority:** Falls back to singular.php → index.php

### `archive.php`
**Purpose:** Category, tag, author, date, custom taxonomy archives
**Priority:** Falls back to index.php

### `category.php`, `tag.php`, `author.php`, `date.php`
**Purpose:** Specific archive types
**Priority:** Falls back to archive.php → index.php

### `search.php`
**Purpose:** Search results page
**Priority:** Falls back to index.php

### `single-{post-type}.php`
**Purpose:** Custom post type single view
**Priority:** Falls back to single.php → singular.php → index.php

### `archive-{post-type}.php`
**Purpose:** Custom post type archive
**Priority:** Falls back to archive.php → index.php

### `404.php`
**Purpose:** Not-found page (HTTP 404)
**Priority:** Only used for 404 errors

### `attachment.php`
**Purpose:** Single attachment view (images, PDFs, etc.)
**Priority:** Falls back to single.php → index.php

### `searchform.php`
**Purpose:** Custom search form markup
**Usage:** `get_search_form()` includes this automatically

---

## Template Parts (get_template_part)

### `header.php`
**Purpose:** Document head (`<head>`), opening `<body>`, site header (logo, nav, utilities)
**Usage:** `get_header()` at top of all templates

### `footer.php`
**Purpose:** Site footer, closing </body> and </html>
**Usage:** `get_footer()` at bottom of all templates

### `sidebar.php`
**Purpose:** Sidebar/widget area markup
**Usage:** `get_sidebar()` — conditionally included

### `comments.php`
**Purpose:** Comment display and comment form
**Usage:** `comments_template()` inside the loop

### `template-parts/content-{name}.php`
**Purpose:** Reusable content blocks
**Usage:** `get_template_part('template-parts/content', 'page')`

---

## `inc/` Directory Files (Theme Includes)

### `customizer.php`
**Purpose:** All Customizer panels, sections, settings, and controls
**Registration:** Called from functions.php via `require get_template_directory() . '/inc/customizer.php'`

### `template-functions.php`
**Purpose:** Custom helper functions used in templates (not template tags)
**Examples:** `theme_get_post_view_count()`, `theme_get_reading_time()`

### `template-tags.php`
**Purpose:** Functions specifically designed for use in template files (often with echo)
**Examples:** `theme_posted_on()`, `theme_post_thumbnail()`, `theme_entry_footer()`

---

## `template-parts/` Directory Structure

```
template-parts/
├── content.php                    # Generic post content
├── content-{post-type}.php        # Post type-specific content (content-page.php, content-product.php)
├── content-{status}.php           # Sticky, format-specific (content-image.php, content-video.php)
├── entry-meta.php                 # Post meta (date, author, categories, tags)
├── entry-thumb.php                # Featured image/thumbnail
├── entry-title.php                 # Post/page title
├── entry-summary.php              # Excerpt/summary display
├── navigation/
│   ├── menu-primary.php           # Primary nav menu
│   └── menu-social.php            # Social links menu
├── hero/
│   ├── hero-homepage.php         # Homepage hero section
│   └── hero-page.php              # Interior page hero
├── section-*.php                  # Homepage sections
└── widget/
    └── widget-{name}.php          # Custom widget templates
```

---

## `assets/` Directory Structure

```
assets/
├── css/
│   ├── style.css                  # Main compiled stylesheet
│   ├── editor-style.css           # Block editor styles
│   └── woocommerce.css            # WooCommerce-specific styles (if separate)
├── js/
│   ├── main.js                    # Primary theme JS
│   ├── navigation.js              # Mobile menu behavior
│   ├── skip-link-focus-fix.js     # Accessibility: keyboard nav
│   └── customize-preview.js       # Customizer live preview
├── images/
│   ├── screenshot.png             # Theme screenshot (1200x900, in root)
│   └── placeholder.svg             # Image placeholder
└── fonts/                          # Local font files (if not using Google Fonts)
```

---

## Block Editor (Gutenberg) Support Files

### `theme.json`
**Purpose:** Block editor configuration, global styles, and settings
**Location:** Root of theme directory
**Content:** CSS custom properties, typography, colors, spacing, and block defaults

### `assets/css/editor-style.css`
**Purpose:** Styles that apply only in the block editor
**Enqueue:** Via `add_editor_style()` in functions.php

---

## Screenshot

### `screenshot.png`
**Size:** 1200px × 900px
**Format:** PNG (or JPG)
**Location:** Root of theme, named `screenshot.png`
**Purpose:** Preview image shown in Appearance → Themes

---

## Optional Theme Files

### `rtl.css`
**Purpose:** Right-to-left styles for languages like Arabic, Hebrew
**Enqueue:** WordPress handles automatically when RTL language is active

### `woocommerce.php`
**Purpose:** WooCommerce archive pages fallback (before using woocommerce/ folder overrides)
**Note:** Usually not needed if `woocommerce/` template overrides are used

### `buddypress.php`, `bbpress.php`
**Purpose:** Plugin-specific templates if supporting BuddyPress or bbPress

---

## Files NOT to Include

- `node_modules/` — never package
- `.git/` — never package
- `.DS_Store` — never package
- `*.map` files (source maps) — never package
- `.sass`, `.scss` source files — package only compiled CSS
- `package.json` — only if using a build process (may include for child theme dev)

---

## WordPress Theme Review Requirements (Basic Checklist)

From the Theme Review team:
- [ ] Valid theme header in style.css
- [ ] No broken template files (all get_template_part() targets exist)
- [ ] No Direct PHP Warnings notices in admin
- [ ] Tested up to and Requires at least fields set
- [ ] All enqueued scripts/styles have version numbers
- [ ] Google Fonts loaded with font-display: swap
- [ ] No frontend assets loaded in admin without checking `is_admin()`
- [ ] No get_bloginfo('url') (use home_url())
- [ ] No get_bloginfo('wpurl') (use site_url())
- [ ] No deprecated functions
- [ ] Text domain matches theme slug
- [ ] All strings translatable
- [ ] No incorrect license declarations (GPL v2+ required)
