# style.css Header Template

Every WordPress theme must have a `style.css` file with a valid header comment block. This is the only file required for WordPress to recognize a theme. Use this template for every theme build.

---

## Complete style.css Template

```php
/*
Theme Name:        {Theme Name}
Theme URI:         https://{example.com}/{theme-slug}
Author:            {Author Name}
Author URI:        https://{author-website.com}
Description:       {2-3 sentence description of the theme. Include niche, key features, and who it's for.}
Version:           1.0.0
Requires at least: 6.0
Tested up to:      6.4
Requires PHP:      7.4
License:           GNU General Public License v2 or later
License URI:       http://www.gnu.org/licenses/gpl-2.0.html
Text Domain:       {theme-slug}
Tags:              e-commerce, blog, custom-menu, custom-logo, featured-images, threaded-comments, translation-ready

{Optional extended description paragraph — what makes this theme special.}

------------------------------------------------------------- */
/* --- CSS Custom Properties (Design System Variables) --- */
:root {
    /* Colors */
    --color-primary:       #000000;
    --color-secondary:     #000000;
    --color-accent:       #000000;
    --color-success:      #000000;
    --color-error:        #000000;
    --color-warning:      #000000;
    --color-info:         #000000;

    /* Neutrals */
    --color-white:        #ffffff;
    --color-gray-50:      #f9fafb;
    --color-gray-100:     #f3f4f6;
    --color-gray-200:     #e5e7eb;
    --color-gray-300:     #d1d5db;
    --color-gray-400:     #9ca3af;
    --color-gray-500:     #6b7280;
    --color-gray-600:     #4b5563;
    --color-gray-700:     #374151;
    --color-gray-800:     #1f2937;
    --color-gray-900:     #111827;
    --color-black:        #000000;

    /* Typography */
    --font-primary:       'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    --font-secondary:     'Playfair Display', Georgia, serif;
    --font-mono:          'JetBrains Mono', 'Fira Code', Consolas, monospace;

    /* Font Sizes */
    --text-xs:            0.75rem;
    --text-sm:            0.875rem;
    --text-base:          1rem;
    --text-lg:            1.125rem;
    --text-xl:            1.25rem;
    --text-2xl:            1.5rem;
    --text-3xl:           1.875rem;
    --text-4xl:           2.25rem;
    --text-5xl:           3rem;
    --text-6xl:           3.75rem;

    /* Spacing */
    --space-1:            0.25rem;
    --space-2:            0.5rem;
    --space-3:            0.75rem;
    --space-4:            1rem;
    --space-5:            1.25rem;
    --space-6:            1.5rem;
    --space-8:            2rem;
    --space-10:           2.5rem;
    --space-12:           3rem;
    --space-16:           4rem;
    --space-20:           5rem;
    --space-24:           6rem;

    /* Border Radius */
    --radius-sm:          0.25rem;
    --radius-md:          0.5rem;
    --radius-lg:          0.75rem;
    --radius-xl:          1rem;
    --radius-full:        9999px;

    /* Shadows */
    --shadow-sm:          0 1px 2px 0 rgba(0, 0, 0, 0.05);
    --shadow-md:          0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
    --shadow-lg:          0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    --shadow-xl:          0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);

    /* Transitions */
    --transition-fast:    150ms ease;
    --transition-base:    250ms ease;
    --transition-slow:    400ms ease;

    /* Container */
    --container-sm:       640px;
    --container-md:        768px;
    --container-lg:        1024px;
    --container-xl:        1280px;
    --container-2xl:       1536px;
}

/* --- Reset & Base --- */
*,
*::before,
*::after {
    box-sizing: border-box;
}

html {
    scroll-behavior: smooth;
}

body {
    margin: 0;
    padding: 0;
    font-family: var(--font-primary);
    font-size: var(--text-base);
    line-height: 1.6;
    color: var(--color-gray-900);
    background-color: var(--color-white);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* --- Typography --- */
h1, h2, h3, h4, h5, h6 {
    margin: 0 0 var(--space-4);
    font-family: var(--font-secondary);
    font-weight: 700;
    line-height: 1.2;
}

h1 { font-size: var(--text-5xl); }
h2 { font-size: var(--text-4xl); }
h3 { font-size: var(--text-3xl); }
h4 { font-size: var(--text-2xl); }
h5 { font-size: var(--text-xl); }
h6 { font-size: var(--text-lg); }

p { margin: 0 0 var(--space-4); }

a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
}

a:hover {
    color: var(--color-secondary);
}

/* --- Layout Utilities --- */
.container {
    width: 100%;
    max-width: var(--container-xl);
    margin-left: auto;
    margin-right: auto;
    padding-left: var(--space-4);
    padding-right: var(--space-4);
}

/* --- Accessibility --- */
.screen-reader-text {
    clip: rect(1px, 1px, 1px, 1px);
    position: absolute !important;
    height: 1px;
    width: 1px;
    overflow: hidden;
    word-wrap: normal !important;
}

.screen-reader-text:focus {
    background-color: var(--color-gray-100);
    border-radius: var(--radius-md);
    clip: auto !important;
    color: var(--color-primary);
    display: block;
    font-size: var(--text-sm);
    font-weight: 600;
    height: auto;
    left: var(--space-2);
    line-height: normal;
    padding: var(--space-4);
    text-decoration: none;
    top: var(--space-2);
    width: auto;
    z-index: 100000;
}

/* --- Clearfix --- */
.clearfix::after {
    content: "";
    display: table;
    clear: both;
}

/* --- WordPress Required --- */
.alignleft {
    display: inline;
    float: left;
    margin-right: var(--space-4);
}

.alignright {
    display: inline;
    float: right;
    margin-left: var(--space-4);
}

.aligncenter {
    display: block;
    margin-left: auto;
    margin-right: auto;
}

.wp-caption {
    max-width: 100%;
}

.wp-caption-text {
    font-size: var(--text-sm);
    color: var(--color-gray-600);
    text-align: center;
    margin-top: var(--space-2);
}
```

---

## Tag Reference for style.css Header

**Allowed Tags (WordPress.org theme review):**
```
- accessibility-ready
- block-styles
- custom-background
- custom-colors
- custom-header
- custom-logo
- custom-menu
- dark-editor
- editor-styles
- featured-content
- featured-images
- footer-widgets
- front-page-post-form
- full-width-template
- microformats
- post-formats
- rtl-language-support
- sticky-post
- theme-options
- threaded-comments
- translation-ready
- wide-blocks
- e-commerce (for WooCommerce themes)
```

**Theme URI fields:**
- `Theme Name` — unique, marketplace-safe name
- `Theme URI` — live demo or product page
- `Author` — author/company name
- `Author URI` — author website
- `Description` — will appear on WordPress.org (if submitted) and in admin
- `Version` — semantic versioning (major.minor.patch)
- `Requires at least` — oldest WordPress version supported
- `Tested up to` — latest WordPress version tested
- `Requires PHP` — minimum PHP version required
- `License` — always `GNU General Public License v2 or later`
- `License URI` — always `http://www.gnu.org/licenses/gpl-2.0.html`
- `Text Domain` — theme slug (for translation)
- `Tags` — comma-separated list of feature tags
