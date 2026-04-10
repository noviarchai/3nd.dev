<?php
/**
 * The template for displaying 404 pages
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="error-404">
    <div class="error-code">404</div>
    <h1 class="error-title"><?php esc_html_e( 'THIS PAGE GOT TOO HOT TO HANDLE', 'danditos-special-saus' ); ?></h1>
    <p class="error-text">
        <?php esc_html_e( 'Looks like this sauce has run out. Let\'s get you back on track.', 'danditos-special-saus' ); ?>
    </p>

    <div class="error-actions">
        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" class="btn btn-primary">
            <?php esc_html_e( 'Go Home', 'danditos-special-saus' ); ?>
        </a>
        <?php if ( class_exists( 'WooCommerce' ) ) : ?>
        <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-secondary">
            <?php esc_html_e( 'Shop All', 'danditos-special-saus' ); ?>
        </a>
        <?php endif; ?>
    </div>

    <div style="margin-top: var(--space-3xl);">
        <?php get_search_form(); ?>
    </div>
</div>

<?php get_footer(); ?>
