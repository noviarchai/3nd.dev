<?php
/**
 * Customizer settings for Dandito's Special Saus
 *
 * @package Danditos_Special_Saus
 */

/**
 * Add Customizer settings.
 */
function danditos_customize_register( $wp_customize ) {

    // Add panel for theme options
    $wp_customize->add_panel( 'danditos_theme_options', array(
        'title'    => __( 'Theme Options', 'danditos-special-saus' ),
        'priority' => 130,
    ) );

    // ==========================================================================
    // Header Settings
    // ==========================================================================
    $wp_customize->add_section( 'danditos_header', array(
        'title'    => __( 'Header', 'danditos-special-saus' ),
        'panel'    => 'danditos_theme_options',
        'priority' => 10,
    ) );

    $wp_customize->add_setting( 'danditos_header_cta_text', array(
        'default'           => __( 'Shop Now', 'danditos-special-saus' ),
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( 'danditos_header_cta_text', array(
        'label'    => __( 'Header CTA Text', 'danditos-special-saus' ),
        'section'  => 'danditos_header',
        'type'     => 'text',
    ) );

    $wp_customize->add_setting( 'danditos_header_cta_url', array(
        'default'           => '/shop',
        'sanitize_callback' => 'esc_url_raw',
    ) );

    $wp_customize->add_control( 'danditos_header_cta_url', array(
        'label'    => __( 'Header CTA URL', 'danditos-special-saus' ),
        'section'  => 'danditos_header',
        'type'     => 'url',
    ) );

    // ==========================================================================
    // Footer Settings
    // ==========================================================================
    $wp_customize->add_section( 'danditos_footer', array(
        'title'    => __( 'Footer', 'danditos-special-saus' ),
        'panel'    => 'danditos_theme_options',
        'priority' => 20,
    ) );

    $wp_customize->add_setting( 'danditos_footer_newsletter_text', array(
        'default'           => __( 'Get the inside scoop on new flavors, limited batches, and where to find us.', 'danditos-special-saus' ),
        'sanitize_callback' => 'sanitize_textarea_field',
    ) );

    $wp_customize->add_control( 'danditos_footer_newsletter_text', array(
        'label'    => __( 'Newsletter Text', 'danditos-special-saus' ),
        'section'  => 'danditos_footer',
        'type'     => 'textarea',
    ) );

    $wp_customize->add_setting( 'danditos_footer_copyright', array(
        'default'           => __( '© 2026 Dandito\'s Special Saus', 'danditos-special-saus' ),
        'sanitize_callback' => 'sanitize_text_field',
    ) );

    $wp_customize->add_control( 'danditos_footer_copyright', array(
        'label'    => __( 'Copyright Text', 'danditos-special-saus' ),
        'section'  => 'danditos_footer',
        'type'     => 'text',
    ) );

    // ==========================================================================
    // Social Settings
    // ==========================================================================
    $wp_customize->add_section( 'danditos_social', array(
        'title'    => __( 'Social Media', 'danditos-special-saus' ),
        'panel'    => 'danditos_theme_options',
        'priority' => 30,
    ) );

    $social_networks = array(
        'facebook'  => 'Facebook',
        'instagram' => 'Instagram',
        'twitter'   => 'Twitter / X',
    );

    foreach ( $social_networks as $network => $label ) {
        $wp_customize->add_setting( 'danditos_social_' . $network, array(
            'default'           => '#',
            'sanitize_callback' => 'esc_url_raw',
        ) );

        $wp_customize->add_control( 'danditos_social_' . $network, array(
            'label'   => $label . ' URL',
            'section' => 'danditos_social',
            'type'    => 'url',
        ) );
    }

    // ==========================================================================
    // Colors
    // ==========================================================================
    $wp_customize->add_section( 'danditos_colors', array(
        'title'    => __( 'Colors', 'danditos-special-saus' ),
        'panel'    => 'danditos_theme_options',
        'priority' => 40,
    ) );

    $wp_customize->add_setting( 'danditos_primary_color', array(
        'default'           => '#e74c3c',
        'sanitize_callback' => 'sanitize_hex_color',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'danditos_primary_color', array(
        'label'    => __( 'Primary Color (Fire Red)', 'danditos-special-saus' ),
        'section'  => 'danditos_colors',
    ) ) );

    $wp_customize->add_setting( 'danditos_accent_color', array(
        'default'           => '#e67e22',
        'sanitize_callback' => 'sanitize_hex_color',
    ) );

    $wp_customize->add_control( new WP_Customize_Color_Control( $wp_customize, 'danditos_accent_color', array(
        'label'    => __( 'Accent Color (Ember Orange)', 'danditos-special-saus' ),
        'section'  => 'danditos_colors',
    ) ) );

}
add_action( 'customize_register', 'danditos_customize_register' );

/**
 * Output custom CSS from Customizer settings.
 */
function danditos_customizer_css() {
    ?>
    <style type="text/css">
        :root {
            <?php if ( get_theme_mod( 'danditos_primary_color' ) ) : ?>
            --color-fire-red: <?php echo esc_attr( get_theme_mod( 'danditos_primary_color' ) ); ?>;
            <?php endif; ?>
            <?php if ( get_theme_mod( 'danditos_accent_color' ) ) : ?>
            --color-ember-orange: <?php echo esc_attr( get_theme_mod( 'danditos_accent_color' ) ); ?>;
            <?php endif; ?>
        }
    </style>
    <?php
}
add_action( 'wp_head', 'danditos_customizer_css', 999 );
