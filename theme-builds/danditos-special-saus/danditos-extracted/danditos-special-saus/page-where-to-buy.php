<?php
/**
 * Template Name: Where to Buy
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header">
    <div class="container">
        <h1 class="page-title"><?php the_title(); ?></h1>
    </div>
</div>

<section class="section" style="padding-top: var(--space-3xl);">
    <div class="container">
        <div class="section-header animate-on-scroll" style="margin-bottom: var(--space-2xl);">
            <p style="color: var(--color-muted); font-size: 1.25rem;"><?php esc_html_e( 'Find Dandito\'s Special Saus at these fine retailers across Calgary and Southern Alberta.', 'danditos-special-saus' ); ?></p>
        </div>

        <div class="retailers-grid">
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'The Mercantile', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '1415 9 Ave SE, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'In-store & online', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Sunnyside Fine Foods', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '410 10 St NW, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'In-store only', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Fiasco Wine & Spirits', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '520 17 Ave SW, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'In-store only', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Kensington Artisan Market', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( 'Kensington Road, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'Weekend markets', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Oak & Vine', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '1017 16 Ave SW, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'In-store & online', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Community Natural Foods', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '211 4 Ave SW, Calgary', 'danditos-special-saus' ); ?></p>
                <p style="color: var(--color-muted); font-size: 0.875rem; margin-top: var(--space-sm);"><?php esc_html_e( 'In-store only', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
    </div>
</section>

<section class="section" style="background: var(--color-charcoal);">
    <div class="container text-center">
        <h2 class="section-title animate-on-scroll"><?php esc_html_e( 'CAN\'T FIND IT NEARBY?', 'danditos-special-saus' ); ?></h2>
        <p style="color: var(--color-muted); margin-bottom: var(--space-xl);" class="animate-on-scroll">
            <?php esc_html_e( 'Order directly from us — we ship across Canada. Every order supports local craft.', 'danditos-special-saus' ); ?>
        </p>
        <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-primary animate-on-scroll">
            <?php esc_html_e( 'Shop Online', 'danditos-special-saus' ); ?>
        </a>
    </div>
</section>

<?php get_footer(); ?>
