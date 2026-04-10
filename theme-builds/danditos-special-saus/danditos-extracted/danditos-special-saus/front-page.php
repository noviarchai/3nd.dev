<?php
/**
 * The template for displaying the homepage
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<?php
// Hero Section
$hero_image = get_template_directory_uri() . '/assets/images/hero-default.jpg';
$hero_title = __( 'NO FACTORY SAUCE.', 'danditos-special-saus' );
$hero_title2 = __( 'NO SHORTCUTS.', 'danditos-special-saus' );
$hero_subtitle = __( 'Every bottle tells a story — built with peppers that bite, garlic that hits, and flavor that sticks.', 'danditos-special-saus' );
?>

<!-- HERO SECTION -->
<section class="hero">
    <div class="hero-bg" style="background-image: url('<?php echo esc_url( $hero_image ); ?>');">
        <?php if ( is_ssl() ) : ?>
        <style>
            .hero-bg { background-image: url('<?php echo str_replace( 'http://', 'https://', $hero_image ); ?>'); }
        </style>
        <?php endif; ?>
    </div>
    <div class="hero-content">
        <h1 class="hero-tagline">
            <?php echo esc_html( $hero_title ); ?><br>
            <?php echo esc_html( $hero_title2 ); ?>
        </h1>
        <p class="hero-subtitle"><?php echo esc_html( $hero_subtitle ); ?></p>
        <div class="hero-ctas">
            <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-primary">
                <?php esc_html_e( 'Shop Now', 'danditos-special-saus' ); ?>
            </a>
            <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="btn btn-secondary">
                <?php esc_html_e( 'Our Story', 'danditos-special-saus' ); ?>
            </a>
        </div>
    </div>
    <div class="scroll-indicator">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
    </div>
</section>

<!-- BRAND PILLARS -->
<section class="brand-pillars">
    <div class="container">
        <div class="ember-divider"></div>
        <div class="pillars-grid">
            <div class="pillar animate-on-scroll">
                <div class="pillar-icon">
                    <?php echo danditos_get_svg( 'flame' ); ?>
                </div>
                <h3 class="pillar-title"><?php esc_html_e( 'SMALL BATCH', 'danditos-special-saus' ); ?></h3>
                <p class="pillar-text"><?php esc_html_e( 'Every bottle numbered, every batch crafted with intention. No mass production, ever.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="pillar animate-on-scroll">
                <div class="pillar-icon">
                    <?php echo danditos_get_svg( 'map-pin' ); ?>
                </div>
                <h3 class="pillar-title"><?php esc_html_e( 'CALGARY MADE', 'danditos-special-saus' ); ?></h3>
                <p class="pillar-text"><?php esc_html_e( 'Peppers sourced from local Alberta farms, crafted in our Calgary kitchen.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="pillar animate-on-scroll">
                <div class="pillar-icon">
                    <?php echo danditos_get_svg( 'ban' ); ?>
                </div>
                <h3 class="pillar-title"><?php esc_html_e( 'NO SHORTCUTS', 'danditos-special-saus' ); ?></h3>
                <p class="pillar-text"><?php esc_html_e( 'No fillers, no artificial ingredients, no factory nonsense. Just real food.', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
    </div>
</section>

<?php if ( class_exists( 'WooCommerce' ) ) : ?>
<!-- FEATURED PRODUCTS -->
<section class="products-section">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <h2 class="section-title"><?php esc_html_e( 'OUR SAUCES', 'danditos-special-saus' ); ?></h2>
            <p style="color: var(--color-muted);"><?php esc_html_e( 'Find your heat. From mild to extremé.', 'danditos-special-saus' ); ?></p>
        </div>

        <div class="filter-pills animate-on-scroll">
            <button class="filter-pill active" data-filter="all"><?php esc_html_e( 'All', 'danditos-special-saus' ); ?></button>
            <button class="filter-pill" data-filter="mild"><?php esc_html_e( 'Mild', 'danditos-special-saus' ); ?></button>
            <button class="filter-pill" data-filter="medium"><?php esc_html_e( 'Medium', 'danditos-special-saus' ); ?></button>
            <button class="filter-pill" data-filter="hot"><?php esc_html_e( 'Hot', 'danditos-special-saus' ); ?></button>
            <button class="filter-pill" data-filter="extreme"><?php esc_html_e( 'Extremé', 'danditos-special-saus' ); ?></button>
        </div>

        <?php
        $args = array(
            'post_type'      => 'product',
            'posts_per_page' => 4,
            'orderby'        => 'menu_order',
            'order'          => 'ASC',
        );
        $products = new WP_Query( $args );
        ?>

        <?php if ( $products->have_posts() ) : ?>
        <div class="products-grid">
            <?php
            while ( $products->have_posts() ) :
                $products->the_post();
                global $product;
                $heat_level = get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild';
            ?>
            <article id="product-<?php the_ID(); ?>" <?php post_class( 'product-card animate-on-scroll' ); ?> data-heat="<?php echo esc_attr( $heat_level ); ?>">
                <div class="product-card-image">
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
            </article>
            <?php endwhile; ?>
        </div>
        <?php endif; ?>
        <?php wp_reset_postdata(); ?>

        <div style="text-align: center; margin-top: var(--space-2xl);">
            <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-ghost">
                <?php esc_html_e( 'View All Products', 'danditos-special-saus' ); ?>
                <?php echo danditos_get_svg( 'arrow-right' ); ?>
            </a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- STORY TEASER -->
<section class="story-teaser">
    <div class="container">
        <div class="story-grid">
            <div class="story-image animate-on-scroll">
                <img src="https://images.unsplash.com/photo-1472476443507-c7a5948772fc?w=800&q=80" alt="<?php esc_attr_e( 'Handcrafted hot sauce', 'danditos-special-saus' ); ?>" loading="lazy">
            </div>
            <div class="story-content animate-on-scroll">
                <h2 class="section-title"><?php esc_html_e( 'EVERY BOTTLE TELLS A STORY', 'danditos-special-saus' ); ?></h2>
                <p><?php esc_html_e( 'It starts with a pepper picked at peak. Garlic roasted just right. Vinegar balanced to make your tongue dance. This isn\'t sauce that comes from a vat — it comes from a kitchen. Our kitchen. In Calgary.', 'danditos-special-saus' ); ?></p>
                <a href="<?php echo esc_url( home_url( '/about' ) ); ?>" class="story-link">
                    <?php esc_html_e( 'Read Our Full Story', 'danditos-special-saus' ); ?>
                    <?php echo danditos_get_svg( 'arrow-right' ); ?>
                </a>
            </div>
        </div>
    </div>
</section>

<!-- CRAFT PROCESS -->
<section class="craft-process">
    <div class="container">
        <h2 class="section-title animate-on-scroll"><?php esc_html_e( 'FROM PEPPER TO BOTTLE', 'danditos-special-saus' ); ?></h2>
        <div class="process-steps">
            <div class="process-step animate-on-scroll">
                <div class="step-number">1</div>
                <div class="step-icon">
                    <?php echo danditos_get_svg( 'flame' ); ?>
                </div>
                <h3 class="step-title"><?php esc_html_e( 'THE PEPPER', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'Local Alberta peppers, hand-selected for perfect heat-to-flavor ratio.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="process-step animate-on-scroll">
                <div class="step-number">2</div>
                <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v6"/><path d="M8 8l4 4 4-4"/><path d="M4 22h16"/><path d="M6 22v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>
                </div>
                <h3 class="step-title"><?php esc_html_e( 'THE CRAFT', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'Small-batch cooking in our Calgary kitchen — no rush, no shortcuts.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="process-step animate-on-scroll">
                <div class="step-number">3</div>
                <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 2h4"/><path d="M12 2v4"/><path d="M8 6h8l1 4H7L8 6z"/><path d="M7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10"/></svg>
                </div>
                <h3 class="step-title"><?php esc_html_e( 'THE SAUCE', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'Hand-bottled, numbered, and shipped to your door.', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
    </div>
</section>

<!-- TESTIMONIAL -->
<section class="testimonial-section">
    <div class="testimonial-quote animate-on-scroll">
        <div class="quote-marks">"</div>
        <p class="quote-text"><?php esc_html_e( 'Finally, a hot sauce that actually tastes like something. Not just heat for heat\'s sake — there\'s depth here. Garlic, pepper, a little sweetness. I\'ve put this on everything.', 'danditos-special-saus' ); ?></p>
        <p class="quote-attribution"><?php esc_html_e( '— Marcus T., Calgary', 'danditos-special-saus' ); ?></p>
    </div>
</section>

<!-- WHERE TO BUY TEASER -->
<section class="section" style="background: var(--color-charcoal);">
    <div class="container">
        <div class="section-header animate-on-scroll">
            <h2 class="section-title"><?php esc_html_e( 'FIND US IN THE WILD', 'danditos-special-saus' ); ?></h2>
            <p style="color: var(--color-muted);"><?php esc_html_e( 'Dandito\'s Special Saus is available at these fine Calgary locations.', 'danditos-special-saus' ); ?></p>
        </div>
        <div class="retailers-grid">
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'The Mercantile', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '1415 9 Ave SE, Calgary', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Sunnyside Fine Foods', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '410 10 St NW, Calgary', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="retailer-card animate-on-scroll">
                <div class="retailer-icon"><?php echo danditos_get_svg( 'store' ); ?></div>
                <h3 class="retailer-name"><?php esc_html_e( 'Fiasco Wine & Spirits', 'danditos-special-saus' ); ?></h3>
                <p class="retailer-address"><?php esc_html_e( '520 17 Ave SW, Calgary', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
        <div style="text-align: center; margin-top: var(--space-2xl);">
            <a href="<?php echo esc_url( home_url( '/where-to-buy' ) ); ?>" class="btn btn-ghost">
                <?php esc_html_e( 'See All Locations', 'danditos-special-saus' ); ?>
                <?php echo danditos_get_svg( 'arrow-right' ); ?>
            </a>
        </div>
    </div>
</section>

<!-- NEWSLETTER -->
<section class="newsletter-section">
    <div class="container">
        <div class="newsletter-title animate-on-scroll"><?php esc_html_e( 'JOIN THE SAUCE', 'danditos-special-saus' ); ?></div>
        <p class="newsletter-text animate-on-scroll"><?php esc_html_e( 'Get the inside scoop on new flavors, limited batches, and where to find us.', 'danditos-special-saus' ); ?></p>
        <form class="newsletter-form animate-on-scroll" action="#" method="post">
            <input type="email" name="email" placeholder="<?php esc_attr_e( 'Enter your email', 'danditos-special-saus' ); ?>" required>
            <button type="submit" class="btn btn-primary"><?php esc_html_e( 'Subscribe', 'danditos-special-saus' ); ?></button>
        </form>
        <p class="newsletter-privacy animate-on-scroll"><?php esc_html_e( 'No spam. Unsubscribe anytime. We hate factory sauce too.', 'danditos-special-saus' ); ?></p>
    </div>
</section>

<?php get_footer(); ?>
