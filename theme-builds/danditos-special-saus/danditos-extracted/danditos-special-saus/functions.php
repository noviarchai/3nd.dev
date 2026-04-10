<?php
/**
 * Dandito's Special Saus functions and definitions
 *
 * @package Danditos_Special_Saus
 * @version 1.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// Theme version
define( 'DANDITOS_VERSION', '1.0.0' );

/**
 * Sets up theme defaults and registers support for various WordPress features.
 */
function danditos_setup() {
    // Make theme available for translation.
    load_theme_textdomain( 'danditos-special-saus', get_template_directory() . '/languages' );

    // Add default posts and comments RSS feed links to head.
    add_theme_support( 'automatic-feed-links' );

    // Let WordPress manage the document title.
    add_theme_support( 'title-tag' );

    // Enable support for Post Thumbnails on posts and pages.
    add_theme_support( 'post-thumbnails' );
    set_post_thumbnail_size( 1200, 675, true ); // 16:9 ratio
    add_image_size( 'danditos-product', 600, 600, true );
    add_image_size( 'danditos-hero', 1920, 1080, true );

    // Register navigation menus.
    register_nav_menus( array(
        'primary' => __( 'Primary Menu', 'danditos-special-saus' ),
        'footer'  => __( 'Footer Menu', 'danditos-special-saus' ),
        'mobile'  => __( 'Mobile Menu', 'danditos-special-saus' ),
    ) );

    // Switch default core markup to output valid HTML5.
    add_theme_support( 'html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
        'style',
        'script',
    ) );

    // Add support for Block Styles.
    add_theme_support( 'wp-block-styles' );

    // Add support for full and wide align images.
    add_theme_support( 'align-wide' );

    // Add support for editor styles.
    add_theme_support( 'editor-styles' );

    // Add support for responsive embedded content.
    add_theme_support( 'responsive-embeds' );

    // Add support for custom logo.
    add_theme_support( 'custom-logo', array(
        'height'      => 200,
        'width'       => 400,
        'flex-width'  => true,
        'flex-height' => true,
    ) );

    // WooCommerce support
    add_theme_support( 'woocommerce' );
    add_theme_support( 'wc-product-gallery-zoom' );
    add_theme_support( 'wc-product-gallery-lightbox' );
    add_theme_support( 'wc-product-gallery-slider' );

    // Gutenberg - disable custom colors to keep design system consistent
    add_theme_support( 'editor-color-palette', array(
        array(
            'name'  => __( 'Fire Red', 'danditos-special-saus' ),
            'slug'  => 'fire-red',
            'color' => '#e74c3c',
        ),
        array(
            'name'  => __( 'Ember Orange', 'danditos-special-saus' ),
            'slug'  => 'ember-orange',
            'color' => '#e67e22',
        ),
        array(
            'name'  => __( 'Charcoal', 'danditos-special-saus' ),
            'slug'  => 'charcoal',
            'color' => '#1a1a1a',
        ),
        array(
            'name'  => __( 'Warm White', 'danditos-special-saus' ),
            'slug'  => 'warm-white',
            'color' => '#faf8f5',
        ),
    ) );

    add_theme_support( 'editor-font-sizes', array(
        array(
            'name' => __( 'Small', 'danditos-special-saus' ),
            'size' => 14,
            'slug' => 'small',
        ),
        array(
            'name' => __( 'Normal', 'danditos-special-saus' ),
            'size' => 18,
            'slug' => 'normal',
        ),
        array(
            'name' => __( 'Large', 'danditos-special-saus' ),
            'size' => 24,
            'slug' => 'large',
        ),
        array(
            'name' => __( 'Huge', 'danditos-special-saus' ),
            'size' => 42,
            'slug' => 'huge',
        ),
    ) );

    // Gutenberg - add spacing options
    add_theme_support( 'custom-spacing' );
}
add_action( 'after_setup_theme', 'danditos_setup' );

/**
 * Register widget areas.
 */
function danditos_widgets_init() {
    register_sidebar( array(
        'name'          => __( 'Sidebar', 'danditos-special-saus' ),
        'id'            => 'sidebar-1',
        'description'   => __( 'Main sidebar for blog posts and pages', 'danditos-special-saus' ),
        'before_widget' => '<section id="%1$s" class="widget %2$s">',
        'after_widget'  => '</section>',
        'before_title'  => '<h3 class="widget-title">',
        'after_title'   => '</h3>',
    ) );

    register_sidebar( array(
        'name'          => __( 'Footer Area 1', 'danditos-special-saus' ),
        'id'            => 'footer-1',
        'description'   => __( 'First footer widget area', 'danditos-special-saus' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => __( 'Footer Area 2', 'danditos-special-saus' ),
        'id'            => 'footer-2',
        'description'   => __( 'Second footer widget area', 'danditos-special-saus' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );

    register_sidebar( array(
        'name'          => __( 'Footer Area 3', 'danditos-special-saus' ),
        'id'            => 'footer-3',
        'description'   => __( 'Third footer widget area', 'danditos-special-saus' ),
        'before_widget' => '<div id="%1$s" class="footer-widget %2$s">',
        'after_widget'  => '</div>',
        'before_title'  => '<h4 class="footer-widget-title">',
        'after_title'   => '</h4>',
    ) );
}
add_action( 'widgets_init', 'danditos_widgets_init' );

/**
 * Enqueue scripts and styles.
 */
function danditos_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'danditos-google-fonts',
        'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Oswald:wght@400;500;700&family=Source+Sans+3:wght@400;600;700&display=swap',
        array(),
        null
    );

    // Main stylesheet
    wp_enqueue_style(
        'danditos-style',
        get_stylesheet_uri(),
        array( 'danditos-google-fonts' ),
        DANDITOS_VERSION
    );

    // WooCommerce styles
    if ( class_exists( 'WooCommerce' ) ) {
        wp_enqueue_style(
            'danditos-woocommerce',
            get_template_directory_uri() . '/woocommerce.css',
            array( 'danditos-style' ),
            DANDITOS_VERSION
        );
    }

    // Main JavaScript
    wp_enqueue_script(
        'danditos-main',
        get_template_directory_uri() . '/assets/js/main.js',
        array(),
        DANDITOS_VERSION,
        true
    );

    // Comment reply script
    if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
        wp_enqueue_script( 'comment-reply' );
    }

    // Localize for AJAX
    wp_localize_script( 'danditos-main', 'danditosData', array(
        'ajaxUrl'   => admin_url( 'admin-ajax.php' ),
        'homeUrl'   => home_url( '/' ),
        'nonce'     => wp_create_nonce( 'danditos_nonce' ),
    ) );
}
add_action( 'wp_enqueue_scripts', 'danditos_scripts' );

/**
 * Enqueue block editor assets.
 */
function danditos_editor_styles() {
    add_editor_style( 'assets/css/editor-style.css' );
}
add_action( 'after_setup_theme', 'danditos_editor_styles' );

/**
 * Custom excerpt length.
 */
function danditos_excerpt_length( $length ) {
    return 25;
}
add_filter( 'excerpt_length', 'danditos_excerpt_length' );

/**
 * Custom excerpt more.
 */
function danditos_excerpt_more( $more ) {
    return ' &hellip;';
}
add_filter( 'excerpt_more', 'danditos_excerpt_more' );

/**
 * Add custom body classes.
 */
function danditos_body_classes( $classes ) {
    if ( is_singular() ) {
        $classes[] = 'singular';
    }

    if ( is_active_sidebar( 'sidebar-1' ) && ! is_woocommerce() ) {
        $classes[] = 'has-sidebar';
    }

    return $classes;
}
add_filter( 'body_class', 'danditos_body_classes' );

/**
 * Add preconnect for Google Fonts.
 */
function danditos_resource_hints( $urls, $relation_type ) {
    if ( 'preconnect' === $relation_type ) {
        $urls[] = array(
            'href' => 'https://fonts.googleapis.com',
            'crossorigin' => true,
        );
        $urls[] = array(
            'href' => 'https://fonts.gstatic.com',
            'crossorigin' => true,
        );
    }
    return $urls;
}
add_filter( 'wp_resource_hints', 'danditos_resource_hints', 10, 2 );

/**
 * WooCommerce: Change number of products per row.
 */
if ( ! function_exists( 'danditos_woocommerce_columns' ) ) {
    function danditos_woocommerce_columns( $columns ) {
        return 3;
    }
}
add_filter( 'loop_shop_columns', 'danditos_woocommerce_columns' );

/**
 * WooCommerce: Change related products count.
 */
if ( ! function_exists( 'danditos_related_products_args' ) ) {
    function danditos_related_products_args( $args ) {
        $args['posts_per_page'] = 4;
        $args['columns'] = 4;
        return $args;
    }
}
add_filter( 'woocommerce_output_related_products_args', 'danditos_related_products_args' );

/**
 * WooCommerce: Archive product thumbnail.
 */
remove_action( 'woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
add_action( 'woocommerce_after_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );

/**
 * Add SVG icons to the theme.
 */
function danditos_get_svg( $icon ) {
    $icons = array(
        'flame' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>',
        'map-pin' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>',
        'ban' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>',
        'search' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
        'cart' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>',
        'chevron-down' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
        'close' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
        'arrow-right' => '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>',
        'instagram' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>',
        'facebook' => '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>',
        'menu' => '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
        'pepper' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2c-1 0-2 .5-2 2v2c-4.33 1.33-7 5.67-7 10 0 5.52 4.48 10 10 10s10-4.48 10-10c0-4.33-2.67-8.67-7-10V4c0-1.5-1-2-2-2z"/></svg>',
        'store' => '<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
    );

    return isset( $icons[ $icon ] ) ? $icons[ $icon ] : '';
}

/**
 * Mini cart AJAX update.
 */
function danditos_ajax_add_to_cart() {
    check_ajax_referer( 'danditos_nonce', 'nonce' );

    WC()->cart->add_to_cart( $_POST['product_id'], $_POST['quantity'] );

    wp_send_json( array(
        'cart_count' => WC()->cart->get_cart_contents_count(),
        'cart_total' => WC()->cart->get_cart_total(),
    ) );

    wp_die();
}
add_action( 'wp_ajax_danditos_add_to_cart', 'danditos_ajax_add_to_cart' );
add_action( 'wp_ajax_nopriv_danditos_add_to_cart', 'danditos_ajax_add_to_cart' );

/**
 * Get heat level for a product.
 */
function danditos_get_heat_level( $product_id = null ) {
    if ( ! $product_id ) {
        $product_id = get_the_ID();
    }
    return strtolower( get_post_meta( $product_id, '_heat_level', true ) ?: 'mild' );
}

/**
 * Mini cart AJAX update fragment.
 */
function danditos_get_mini_cart() {
    if ( ! function_exists( 'WC' ) ) {
        return '';
    }
    ob_start();
    woocommerce_mini_cart();
    return ob_get_clean();
}

/**
 * Flush rewrite rules on theme activation.
 */
function danditos_rewrite_flush() {
    danditos_setup();
    flush_rewrite_rules();
}
add_action( 'after_switch_theme', 'danditos_rewrite_flush' );
