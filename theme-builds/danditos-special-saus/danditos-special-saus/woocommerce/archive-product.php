<?php
/**
 * The Template for displaying product archives (shop page)
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header" style="padding-top: calc(var(--header-height) + var(--space-2xl));">
    <div class="container">
        <h1 class="page-title">
            <?php
            if ( is_shop() ) {
                woocommerce_page_title();
            } elseif ( is_product_category() ) {
                single_term_title( '', true );
            } else {
                woocommerce_page_title();
            }
            ?>
        </h1>
        <?php
        /**
         * Hook: woocommerce_archive_description.
         */
        do_action( 'woocommerce_archive_description' );
        ?>
    </div>
</div>

<section class="section" style="padding-top: var(--space-2xl);">
    <div class="container">
        <?php if ( woocommerce_product_loop() ) : ?>

            <?php
            /**
             * Hook: woocommerce_before_shop_loop.
             */
            do_action( 'woocommerce_before_shop_loop' );
            ?>

            <?php woocommerce_product_loop_start(); ?>

            <?php
            while ( have_posts() ) :
                the_post();
                global $product;
                $heat_level = get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild';
            ?>
            <li <?php wc_product_class( '', $product ); ?>>
                <div class="product-archive-inner">
                    <?php
                    if ( has_post_thumbnail() ) :
                        the_post_thumbnail( 'danditos-product', array( 'alt' => get_the_title() ) );
                    else :
                        echo '<img src="' . esc_url( wc_placeholder_img_src() ) . '" alt="' . esc_attr__( 'Placeholder', 'danditos-special-saus' ) . '">';
                    endif;
                    ?>
                    <span class="product-badge badge-<?php echo esc_attr( $heat_level ); ?>"><?php echo esc_html( ucfirst( $heat_level ) ); ?></span>
                    <?php if ( $product->is_on_sale() ) : ?>
                    <span class="product-badge badge-sale"><?php esc_html_e( 'Sale', 'danditos-special-saus' ); ?></span>
                    <?php endif; ?>
                    <div class="add-to-cart-overlay">
                        <?php woocommerce_template_loop_add_to_cart(); ?>
                    </div>
                </div>
                <div class="product-card-body">
                    <h3 class="product-card-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <p class="product-card-price"><?php woocommerce_template_single_price(); ?></p>
                </div>
            </li>
            <?php endwhile; ?>

            <?php woocommerce_product_loop_end(); ?>

            <?php
            /**
             * Hook: woocommerce_after_shop_loop.
             */
            do_action( 'woocommerce_after_shop_loop' );
            ?>

        <?php else : ?>
            <div class="content-area text-center">
                <p><?php esc_html_e( 'No products found.', 'danditos-special-saus' ); ?></p>
                <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-primary">
                    <?php esc_html_e( 'View All Products', 'danditos-special-saus' ); ?>
                </a>
            </div>
        <?php endif; ?>
    </div>
</section>

<style>
.product-archive-inner {
    position: relative;
    aspect-ratio: 1:1;
    overflow: hidden;
}
.product-archive-inner img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 400ms var(--ease-out);
}
.woocommerce ul.products li.product:hover .product-archive-inner img {
    transform: scale(1.05);
}
.woocommerce ul.products li.product {
    background: var(--color-charcoal);
    border-radius: var(--radius-lg);
    overflow: hidden;
    margin: 0;
    padding: 0;
    transition: transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
}
.woocommerce ul.products li.product:hover {
    transform: translateY(-8px);
    box-shadow: var(--shadow-lg);
}
</style>

<?php get_footer(); ?>
