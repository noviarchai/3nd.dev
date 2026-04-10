# functions.php — Starter Template

Every WordPress theme needs a `functions.php` file. This is the starter template that should be used as the base for all theme builds.

---

## Starter Template

```php
<?php
/**
 * Theme functions and definitions
 *
 * @package Theme_Name
 * @version 1.0.0
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Set theme version
define('THEME_VERSION', '1.0.0');

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function theme_setup() {
    // Make theme available for translation.
    load_theme_textdomain('theme-slug', get_template_directory() . '/languages');

    // Add default posts and comments RSS feed links to head.
    add_theme_support('automatic-feed-links');

    // Let WordPress manage the document title.
    add_theme_support('title-tag');

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support('post-thumbnails');

    // Set default thumbnail size
    set_post_thumbnail_size(1200, 800, true);

    // Add custom image sizes
    add_image_size('theme-thumbnail-hero', 1920, 1080, true);
    add_image_size('theme-thumbnail-card', 600, 400, true);
    add_image_size('theme-thumbnail-square', 400, 400, true);

    // Register navigation menus.
    register_nav_menus([
        'primary'   => esc_html__('Primary Menu', 'theme-slug'),
        'footer'    => esc_html__('Footer Menu', 'theme-slug'),
        'social'    => esc_html__('Social Links Menu', 'theme-slug'),
    ]);

    // Switch default core markup to output valid HTML5.
    add_theme_support('html5', [
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ]);

    // Set up the WordPress core custom background feature.
    add_theme_support('custom-background', [
        'default-color' => 'ffffff',
        'default-image' => '',
    ]);

    // Add theme support for Custom Logo.
    add_theme_support('custom-logo', [
        'width'       => 200,
        'height'      => 60,
        'flex-width'  => true,
        'flex-height' => true,
    ]);

    // Add theme support for selective refresh for widgets.
    add_theme_support('customize-selective-refresh-widgets');

    // WooCommerce support
    add_theme_support('woocommerce');
    add_theme_support('wc-product-gallery-zoom');
    add_theme_support('wc-product-gallery-lightbox');
    add_theme_support('wc-product-gallery-slider');

    // Gutenberg: Wide Alignment
    add_theme_support('align-wide');

    // Gutenberg: Block editor styles
    add_theme_support('editor-styles');

    // Gutenberg: Responsive embeds
    add_theme_support('responsive-embeds');
}
add_action('after_setup_theme', 'theme_setup');

/**
 * Set the content width in pixels.
 */
function theme_content_width() {
    $GLOBALS['content_width'] = apply_filters('theme_content_width', 1200);
}
add_action('after_setup_theme', 'theme_content_width', 0);

/**
 * Register widget areas.
 */
function theme_widgets_init() {
    // Primary Sidebar
    register_sidebar([
        'name'          => esc_html__('Sidebar', 'theme-slug'),
        'id'            => 'sidebar-1',
        'description'   => esc_html__('Add widgets here.', 'theme-slug'),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ]);

    // Footer Column 1
    register_sidebar([
        'name'          => esc_html__('Footer 1', 'theme-slug'),
        'id'            => 'footer-1',
        'description'   => esc_html__('First footer widget area.', 'theme-slug'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ]);

    // Footer Column 2
    register_sidebar([
        'name'          => esc_html__('Footer 2', 'theme-slug'),
        'id'            => 'footer-2',
        'description'   => esc_html__('Second footer widget area.', 'theme-slug'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ]);

    // Footer Column 3
    register_sidebar([
        'name'          => esc_html__('Footer 3', 'theme-slug'),
        'id'            => 'footer-3',
        'description'   => esc_html__('Third footer widget area.', 'theme-slug'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="widget-title">',
        'after_title'   => '</h4>',
    ]);
}
add_action('widgets_init', 'theme_widgets_init');

/**
 * Enqueue scripts and styles.
 */
function theme_scripts() {
    // Google Fonts — preconnect first
    wp_enqueue_style('google-fonts-preconnect', 'https://fonts.googleapis.com', [], null);
    wp_enqueue_style('google-fonts-preconnect-static', 'https://fonts.gstatic.com', [], null);

    // Main stylesheet
    wp_enqueue_style('theme-style', get_stylesheet_uri(), [], THEME_VERSION);

    // Google Fonts — main font
    wp_enqueue_style('theme-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Playfair+Display:wght@400;600;700&display=swap', [], null);

    // Skip link focus fix
    wp_enqueue_script('theme-skip-link-focus-fix', get_template_directory_uri() . '/assets/js/skip-link-focus-fix.js', [], THEME_VERSION, true);

    // Navigation toggle script
    wp_enqueue_script('theme-navigation', get_template_directory_uri() . '/assets/js/navigation.js', [], THEME_VERSION, true);

    // Comment reply script
    if (is_singular() && comments_open() && get_option('thread_comments')) {
        wp_enqueue_script('comment-reply');
    }
}
add_action('wp_enqueue_scripts', 'theme_scripts');

/**
 * Enqueue block editor styles.
 */
function theme_block_editor_styles() {
    wp_enqueue_style('theme-block-editor-styles', get_template_directory_uri() . '/assets/css/editor-style.css', [], THEME_VERSION);
}
add_action('enqueue_block_editor_assets', 'theme_block_editor_styles');

/**
 * Customizer: Add customizer settings and controls.
 */
require get_template_directory() . '/inc/customizer.php';

/**
 * Template functions: Custom helper functions.
 */
require get_template_directory() . '/inc/template-functions.php';

/**
 * Template tags: Functions used in template files.
 */
require get_template_directory() . '/inc/template-tags.php';

/**
 * WooCommerce support.
 */
if (class_exists('WooCommerce')) {
    require get_template_directory() . '/inc/woocommerce.php';
}
```

---

## Required accompanying files (for functions.php to work)

### `inc/customizer.php` — Basic structure:
```php
<?php
/**
 * Customizer settings and controls
 *
 * @package Theme_Name
 */

/**
 * Add Customizer options
 */
function theme_customize_register($wp_customize) {
    // Add theme color setting
    $wp_customize->add_setting('theme_primary_color', [
        'default'           => '#0a0a0a',
        'sanitize_callback' => 'sanitize_hex_color',
        'transport'         => 'refresh',
    ]);

    $wp_customize->add_control(new WP_Customize_Color_Control($wp_customize, 'theme_primary_color', [
        'label'    => __('Primary Color', 'theme-slug'),
        'section'  => 'colors',
        'settings' => 'theme_primary_color',
    ]));
}
add_action('customize_register', 'theme_customize_register');
```

### `inc/template-functions.php` — Basic structure:
```php
<?php
/**
 * Template functions
 *
 * @package Theme_Name
 */

/**
 * Get read time for post.
 */
function theme_get_reading_time($post_id = null) {
    $post_id = $post_id ?: get_the_ID();
    $content = get_post_field('post_content', $post_id);
    $word_count = str_word_count(wp_strip_all_tags($content));
    $reading_time = ceil($word_count / 200);
    return $reading_time;
}
```

### `inc/template-tags.php` — Basic structure:
```php
<?php
/**
 * Template tags
 *
 * @package Theme_Name
 */

/**
 * Display entry meta.
 */
function theme_entry_meta() {
    echo '<div class="entry-meta">';
    if (has_category()) {
        echo '<span class="cat-links">' . get_the_category_list(', ') . '</span>';
    }
    echo '<span class="posted-on">' . get_the_date() . '</span>';
    echo '</div>';
}

/**
 * Display post thumbnail.
 */
function theme_post_thumbnail() {
    if (post_password_required() || is_attachment()) {
        return;
    }
    if (!has_post_thumbnail()) {
        return;
    }
    ?>
    <div class="post-thumbnail">
        <?php the_post_thumbnail(); ?>
    </div>
    <?php
}
```
