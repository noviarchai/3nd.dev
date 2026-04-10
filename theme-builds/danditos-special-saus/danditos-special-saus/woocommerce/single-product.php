<?php
/**
 * The Template for displaying single product pages
 *
 * @package Danditos_Special_Saus
 */

get_header();

while ( have_posts() ) :
    the_post();
    global $product;
    $heat_level = get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild';
?>

<section class="section" style="padding-top: calc(var(--header-height) + var(--space-2xl));">
    <div class="container">
        <?php woocommerce_show_product_sale_flash(); ?>

        <div class="products-grid" style="grid-template-columns: 55% 42%; gap: var(--space-3xl);">
            <!-- Product Gallery -->
            <div class="product-gallery animate-on-scroll">
                <?php
                /**
                 * Hook: woocommerce_before_single_product_summary.
                 */
                do_action( 'woocommerce_before_single_product_summary' );
                ?>
            </div>

            <!-- Product Summary -->
            <div class="product-summary animate-on-scroll">
                <span class="product-heat-badge <?php echo esc_attr( $heat_level ); ?>">
                    <?php echo danditos_get_svg( 'flame' ); ?>
                    <?php echo esc_html( ucfirst( $heat_level ) ); ?>
                </span>

                <?php
                /**
                 * Hook: woocommerce_single_product_summary.
                 */
                do_action( 'woocommerce_single_product_summary' );
                ?>

                <?php woocommerce_template_single_excerpt(); ?>

                <div style="margin-top: var(--space-xl);">
                    <?php woocommerce_template_single_add_to_cart(); ?>
                </div>

                <?php
                // Product story snippet
                $product_story = get_post_meta( get_the_ID(), '_product_story', true );
                if ( $product_story ) :
                ?>
                <div style="margin-top: var(--space-xl); padding-top: var(--space-xl); border-top: 1px solid var(--color-line);">
                    <p style="font-style: italic; color: var(--color-warm-white); font-size: 0.9375rem;">
                        "<?php echo esc_html( $product_story ); ?>"
                    </p>
                </div>
                <?php endif; ?>
            </div>
        </div>

        <!-- Product Tabs -->
        <div style="margin-top: var(--space-4xl);">
            <?php
            /**
             * Hook: woocommerce_after_single_product_summary.
             */
            do_action( 'woocommerce_after_single_product_summary' );
            ?>
        </div>

        <!-- Related Products -->
        <?php
        $related_ids = wc_get_related_products( get_the_ID(), 4 );
        if ( ! empty( $related_ids ) ) :
        ?>
        <div class="related-products" style="margin-top: var(--space-4xl); padding-top: var(--space-3xl); border-top: 1px solid var(--color-line);">
            <h2 class="section-title text-center" style="margin-bottom: var(--space-2xl);"><?php esc_html_e( 'YOU MIGHT ALSO LOVE', 'danditos-special-saus' ); ?></h2>
            <div class="products-grid" style="grid-template-columns: repeat(4, 1fr);">
                <?php
                $related = new WP_Query( array(
                    'post__in'    => $related_ids,
                    'post_type'   => 'product',
                    'posts_per_page' => 4,
                    'orderby'    => 'post__in',
                ) );
                while ( $related->have_posts() ) :
                    $related->the_post();
                    global $product;
                    $rel_heat = get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild';
                ?>
                <article id="product-<?php the_ID(); ?>" <?php post_class( 'product-card' ); ?>>
                    <div class="product-card-image">
                        <?php
                        if ( has_post_thumbnail() ) :
                            the_post_thumbnail( 'danditos-product', array( 'alt' => get_the_title() ) );
                        else :
                            echo '<img src="' . esc_url( wc_placeholder_img_src() ) . '" alt="' . esc_attr__( 'Placeholder', 'danditos-special-saus' ) . '">';
                        endif;
                        ?>
                        <span class="product-badge badge-<?php echo esc_attr( $rel_heat ); ?>"><?php echo esc_html( ucfirst( $rel_heat ) ); ?></span>
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
                </article>
                <?php endwhile; ?>
                <?php wp_reset_postdata(); ?>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php endwhile; ?>

<?php get_footer(); ?>
