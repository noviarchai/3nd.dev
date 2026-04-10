<?php
/**
 * Template functions for Dandito's Special Saus
 *
 * @package Danditos_Special_Saus
 */

/**
 * Get the heat level badge HTML.
 */
function danditos_heat_badge( $heat_level = 'mild' ) {
    $heat_level = strtolower( $heat_level );
    $labels = array(
        'mild'    => __( 'Mild', 'danditos-special-saus' ),
        'medium'  => __( 'Medium', 'danditos-special-saus' ),
        'hot'     => __( 'Hot', 'danditos-special-saus' ),
        'extreme' => __( 'Extremé', 'danditos-special-saus' ),
    );

    $label = isset( $labels[ $heat_level ] ) ? $labels[ $heat_level ] : $labels['mild'];

    return sprintf(
        '<span class="product-heat-badge %1$s">%2$s %3$s</span>',
        esc_attr( $heat_level ),
        danditos_get_svg( 'flame' ),
        esc_html( $label )
    );
}

/**
 * Get the SVG icon for a product.
 */
function danditos_product_icon() {
    return danditos_get_svg( 'pepper' );
}

/**
 * Check if we're on a WooCommerce page.
 */
function danditos_is_woocommerce_page() {
    if ( function_exists( 'is_woocommerce' ) && is_woocommerce() ) {
        return true;
    }
    return false;
}

/**
 * Get product heat level.
 */
function danditos_get_product_heat_level( $product_id = null ) {
    if ( ! $product_id ) {
        $product_id = get_the_ID();
    }
    return strtolower( get_post_meta( $product_id, '_heat_level', true ) ?: 'mild' );
}

/**
 * Display heat level in WooCommerce loop.
 */
function danditos_woocommerce_product_heat_badge() {
    global $product;
    if ( ! $product ) return;

    $heat_level = danditos_get_product_heat_level( $product->get_id() );
    echo danditos_heat_badge( $heat_level );
}

/**
 * Modify the read more link.
 */
function danditos_read_more_link() {
    return ' <a href="' . get_permalink() . '" class="read-more">' . __( 'Read more', 'danditos-special-saus' ) . ' &rarr;</a>';
}
add_filter( 'excerpt_more', 'danditos_read_more_link' );

/**
 * Add custom body classes.
 */
function danditos_extra_body_classes( $classes ) {
    if ( is_singular( 'product' ) ) {
        $classes[] = 'single-product-page';
    }

    if ( danditos_is_woocommerce_page() ) {
        $classes[] = 'woocommerce-page';
    }

    return $classes;
}
add_filter( 'body_class', 'danditos_extra_body_classes', 20 );

/**
 * Custom read more text.
 */
function danditos_custom_readmore() {
    return __( 'Continue Reading', 'danditos-special-saus' );
}
add_filter( 'woocommerce_product_single_add_to_cart_text', 'danditos_custom_readmore' );
add_filter( 'woocommerce_product_add_to_cart_text', 'danditos_custom_readmore' );
