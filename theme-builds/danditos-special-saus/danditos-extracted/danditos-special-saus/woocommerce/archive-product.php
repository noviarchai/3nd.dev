<?php
/**
 * The Template for displaying product archives (shop page) — Editorial Gallery Layout
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="shop-hero">
    <div class="container">
        <div class="shop-hero-inner">
            <span class="shop-eyebrow"><?php esc_html_e( 'Our lineup', 'danditos-special-saus' ); ?></span>
            <h1 class="shop-title"><?php woocommerce_page_title(); ?></h1>
            <p class="shop-subtitle"><?php esc_html_e( 'Small batch. Big flavor. No shortcuts.', 'danditos-special-saus' ); ?></p>
        </div>
    </div>
</div>

<section class="section shop-editorial">
    <div class="container">
        <?php if ( woocommerce_product_loop() ) : ?>

            <?php
            $products = array();
            while ( have_posts() ) :
                the_post();
                global $product;
                $products[] = $product;
            endwhile;
            rewind_posts();
            ?>

            <?php $count = count( $products); ?>

            <?php if ( $count === 1 ) : ?>
                <!-- Single product — hero feature -->
                <?php while ( have_posts() ) : the_post(); global $product; ?>
                <div class="shop-feature-single">
                    <div class="shop-feature-media">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail( 'full', array( 'class' => 'shop-feature-img' ) ); ?>
                        <?php else : ?>
                            <img src="<?php echo esc_url( wc_placeholder_img_src() ); ?>" alt="<?php the_title(); ?>" class="shop-feature-img">
                        <?php endif; ?>
                        <div class="shop-feature-overlay">
                            <span class="heat-badge heat-<?php echo esc_attr( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild' ); ?>">
                                <?php echo esc_html( strtoupper( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'MILD' ) ); ?>
                            </span>
                        </div>
                    </div>
                    <div class="shop-feature-content">
                        <span class="shop-feature-label"><?php esc_html_e( 'Featured Sauce', 'danditos-special-saus' ); ?></span>
                        <h2 class="shop-feature-title"><?php the_title(); ?></h2>
                        <div class="shop-feature-price"><?php woocommerce_template_single_price(); ?></div>
                        <p class="shop-feature-desc"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 30 ) ); ?></p>
                        <div class="shop-feature-actions">
                            <?php woocommerce_template_loop_add_to_cart(); ?>
                            <a href="<?php the_permalink(); ?>" class="btn btn-outline"><?php esc_html_e( 'Learn More', 'danditos-special-saus' ); ?></a>
                        </div>
                    </div>
                </div>
                <?php endwhile; ?>

            <?php elseif ( $count === 2 ) : ?>
                <!-- Two products — side by side feature -->
                <div class="shop-duo">
                    <?php $i = 0; while ( have_posts() ) : the_post(); global $product; $i++; ?>
                    <div class="shop-duo-item <?php echo $i === 1 ? 'shop-duo-item--left' : 'shop-duo-item--right'; ?>">
                        <div class="shop-duo-media">
                            <?php if ( has_post_thumbnail() ) : ?>
                                <?php the_post_thumbnail( 'large', array( 'class' => 'shop-duo-img' ) ); ?>
                            <?php else : ?>
                                <img src="<?php echo esc_url( wc_placeholder_img_src() ); ?>" alt="<?php the_title(); ?>" class="shop-duo-img">
                            <?php endif; ?>
                        </div>
                        <div class="shop-duo-content">
                            <span class="heat-badge heat-<?php echo esc_attr( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild' ); ?>">
                                <?php echo esc_html( strtoupper( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'MILD' ) ); ?>
                            </span>
                            <h2 class="shop-duo-title"><?php the_title(); ?></h2>
                            <div class="shop-duo-price"><?php woocommerce_template_single_price(); ?></div>
                            <p class="shop-duo-desc"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 20 ) ); ?></p>
                            <div class="shop-duo-actions">
                                <?php woocommerce_template_loop_add_to_cart(); ?>
                                <a href="<?php the_permalink(); ?>" class="btn btn-ghost"><?php esc_html_e( 'Story', 'danditos-special-saus' ); ?></a>
                            </div>
                        </div>
                    </div>
                    <?php endwhile; ?>
                </div>

            <?php else : ?>
                <!-- 3+ products — magazine grid with first product hero -->
                <?php $i = 0; while ( have_posts() ) : the_post(); global $product; $i++; ?>

                    <?php if ( $i === 1 ) : ?>
                <div class="shop-editorial-hero">
                    <div class="shop-editorial-hero-media">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail( 'full', array( 'class' => 'shop-editorial-hero-img' ) ); ?>
                        <?php else : ?>
                            <img src="<?php echo esc_url( wc_placeholder_img_src() ); ?>" alt="<?php the_title(); ?>" class="shop-editorial-hero-img">
                        <?php endif; ?>
                        <div class="shop-editorial-hero-overlay">
                            <span class="heat-badge heat-<?php echo esc_attr( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild' ); ?>">
                                <?php echo esc_html( strtoupper( get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'MILD' ) ); ?>
                            </span>
                        </div>
                    </div>
                    <div class="shop-editorial-hero-content">
                        <span class="shop-editorial-label"><?php esc_html_e( 'Our Flagship', 'danditos-special-saus' ); ?></span>
                        <h2 class="shop-editorial-title"><?php the_title(); ?></h2>
                        <div class="shop-editorial-price"><?php woocommerce_template_single_price(); ?></div>
                        <p class="shop-editorial-desc"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 35 ) ); ?></p>
                        <div class="shop-editorial-actions">
                            <?php woocommerce_template_loop_add_to_cart(); ?>
                            <a href="<?php the_permalink(); ?>" class="btn btn-outline-light"><?php esc_html_e( 'Read the Story', 'danditos-special-saus' ); ?></a>
                        </div>
                    </div>
                </div>

                <?php else : ?>
                    <?php
                    $heat_level = get_post_meta( get_the_ID(), '_heat_level', true ) ?: 'mild';
                    $classes = 'shop-editorial-card';
                    if ( $i === 2 ) $classes .= ' shop-editorial-card--wide';
                    ?>
                <div class="<?php echo esc_attr( $classes ); ?>">
                    <div class="shop-editorial-card-media">
                        <?php if ( has_post_thumbnail() ) : ?>
                            <?php the_post_thumbnail( 'medium_large', array( 'class' => 'shop-editorial-card-img' ) ); ?>
                        <?php else : ?>
                            <img src="<?php echo esc_url( wc_placeholder_img_src() ); ?>" alt="<?php the_title(); ?>" class="shop-editorial-card-img">
                        <?php endif; ?>
                        <span class="heat-badge heat-<?php echo esc_attr( $heat_level ); ?>">
                            <?php echo esc_html( strtoupper( $heat_level ) ); ?>
                        </span>
                        <?php if ( $product->is_on_sale() ) : ?>
                        <span class="product-badge badge-sale"><?php esc_html_e( 'Sale', 'danditos-special-saus' ); ?></span>
                        <?php endif; ?>
                    </div>
                    <div class="shop-editorial-card-content">
                        <h3 class="shop-editorial-card-title">
                            <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                        </h3>
                        <div class="shop-editorial-card-price"><?php woocommerce_template_single_price(); ?></div>
                        <div class="shop-editorial-card-actions">
                            <?php woocommerce_template_loop_add_to_cart(); ?>
                            <a href="<?php the_permalink(); ?>" class="btn btn-ghost"><?php esc_html_e( 'Story', 'danditos-special-saus' ); ?></a>
                        </div>
                    </div>
                </div>
                    <?php endif; ?>

                <?php endwhile; ?>
            <?php endif; ?>

        <?php else : ?>
            <div class="shop-empty">
                <div class="shop-empty-inner">
                    <span class="shop-empty-icon">🌶️</span>
                    <h2 class="shop-empty-title"><?php esc_html_e( 'Nothing here yet', 'danditos-special-saus' ); ?></h2>
                    <p class="shop-empty-text"><?php esc_html_e( 'The collection is coming. Stay spicy.', 'danditos-special-saus' ); ?></p>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>

<style>
/* Shop Hero */
.shop-hero {
    padding: var(--space-4xl) 0 var(--space-2xl);
    text-align: center;
    background: linear-gradient(to bottom, var(--color-charcoal) 0%, var(--color-warm-black) 100%);
}
.shop-hero-inner {
    max-width: 600px;
    margin: 0 auto;
}
.shop-eyebrow {
    display: inline-block;
    font-family: var(--font-accent);
    font-size: 0.875rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-fire-red);
    margin-bottom: var(--space-md);
}
.shop-title {
    font-family: var(--font-display);
    font-size: clamp(3rem, 8vw, 5.5rem);
    line-height: 1;
    letter-spacing: 0.02em;
    color: var(--color-white-smoke);
    margin-bottom: var(--space-lg);
}
.shop-subtitle {
    font-size: 1.25rem;
    color: var(--color-muted);
    margin: 0;
}

/* Single Product Feature */
.shop-feature-single {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-3xl);
    align-items: center;
    padding: var(--space-3xl) 0;
}
.shop-feature-media {
    position: relative;
    border-radius: var(--radius-xl);
    overflow: hidden;
}
.shop-feature-img {
    width: 100%;
    aspect-ratio: 1:1;
    object-fit: cover;
}
.shop-feature-overlay {
    position: absolute;
    top: var(--space-lg);
    left: var(--space-lg);
}
.shop-feature-label {
    display: block;
    font-family: var(--font-accent);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-ember-orange);
    margin-bottom: var(--space-sm);
}
.shop-feature-title {
    font-family: var(--font-display);
    font-size: 3rem;
    letter-spacing: 0.02em;
    margin-bottom: var(--space-md);
}
.shop-feature-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-fire-red);
    margin-bottom: var(--space-lg);
}
.shop-feature-desc {
    color: var(--color-muted);
    font-size: 1.125rem;
    line-height: 1.8;
    margin-bottom: var(--space-xl);
}
.shop-feature-actions {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
}

/* Two Product Duo */
.shop-duo {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-xl);
    padding: var(--space-xl) 0;
}
.shop-duo-item {
    display: flex;
    flex-direction: column;
    gap: var(--space-lg);
}
.shop-duo-item--left {
    align-items: flex-start;
}
.shop-duo-item--right {
    align-items: flex-end;
}
.shop-duo-media {
    width: 100%;
    border-radius: var(--radius-xl);
    overflow: hidden;
}
.shop-duo-img {
    width: 100%;
    aspect-ratio: 1:1;
    object-fit: cover;
}
.shop-duo-content {
    max-width: 400px;
}
.shop-duo-title {
    font-family: var(--font-display);
    font-size: 2.25rem;
    margin: var(--space-sm) 0 var(--space-md);
}
.shop-duo-price {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--color-fire-red);
    margin-bottom: var(--space-md);
}
.shop-duo-desc {
    color: var(--color-muted);
    margin-bottom: var(--space-lg);
}
.shop-duo-actions {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
}

/* Editorial Hero (3+ products) */
.shop-editorial-hero {
    display: grid;
    grid-template-columns: 1.2fr 1fr;
    gap: 0;
    border-radius: var(--radius-xl);
    overflow: hidden;
    margin-bottom: var(--space-2xl);
    background: var(--color-charcoal);
    min-height: 500px;
}
.shop-editorial-hero-media {
    position: relative;
    overflow: hidden;
}
.shop-editorial-hero-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 500px;
    transition: transform 600ms var(--ease-out);
}
.shop-editorial-hero:hover .shop-editorial-hero-img {
    transform: scale(1.03);
}
.shop-editorial-hero-overlay {
    position: absolute;
    top: var(--space-xl);
    left: var(--space-xl);
}
.shop-editorial-hero-content {
    padding: var(--space-3xl);
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.shop-editorial-label {
    display: inline-block;
    font-family: var(--font-accent);
    font-size: 0.75rem;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--color-ember-orange);
    margin-bottom: var(--space-md);
}
.shop-editorial-title {
    font-family: var(--font-display);
    font-size: clamp(2rem, 4vw, 3.5rem);
    line-height: 1.1;
    letter-spacing: 0.02em;
    margin-bottom: var(--space-lg);
}
.shop-editorial-price {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--color-fire-red);
    margin-bottom: var(--space-lg);
}
.shop-editorial-desc {
    color: var(--color-muted);
    font-size: 1.0625rem;
    line-height: 1.8;
    margin-bottom: var(--space-xl);
}
.shop-editorial-actions {
    display: flex;
    gap: var(--space-md);
    flex-wrap: wrap;
}

/* Editorial Cards Grid */
.shop-editorial {
    padding-top: var(--space-2xl);
}
.shop-editorial-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: var(--space-xl);
}
.shop-editorial-card {
    background: var(--color-charcoal);
    border-radius: var(--radius-xl);
    overflow: hidden;
    transition: transform 300ms var(--ease-out), box-shadow 300ms var(--ease-out);
}
.shop-editorial-card:hover {
    transform: translateY(-6px);
    box-shadow: var(--shadow-lg);
}
.shop-editorial-card--wide {
    grid-column: span 2;
}
.shop-editorial-card-media {
    position: relative;
    overflow: hidden;
}
.shop-editorial-card-img {
    width: 100%;
    aspect-ratio: 4:3;
    object-fit: cover;
    transition: transform 400ms var(--ease-out);
}
.shop-editorial-card:hover .shop-editorial-card-img {
    transform: scale(1.05);
}
.shop-editorial-card--wide .shop-editorial-card-img {
    aspect-ratio: 16:9;
}
.shop-editorial-card-content {
    padding: var(--space-xl);
}
.shop-editorial-card-title {
    font-family: var(--font-display);
    font-size: 1.75rem;
    margin: 0 0 var(--space-sm);
    letter-spacing: 0.02em;
}
.shop-editorial-card-price {
    font-weight: 700;
    color: var(--color-fire-red);
    margin-bottom: var(--space-lg);
}
.shop-editorial-card-actions {
    display: flex;
    gap: var(--space-sm);
    flex-wrap: wrap;
}

/* Heat Badge */
.heat-badge {
    display: inline-block;
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-family: var(--font-accent);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
.heat-mild    { background: #27ae60; color: white; }
.heat-medium  { background: #f39c12; color: white; }
.heat-hot     { background: #e67e22; color: white; }
.heat-extreme { background: #c0392b; color: white; }

/* Product Badge */
.product-badge {
    position: absolute;
    top: var(--space-md);
    padding: 4px 12px;
    border-radius: var(--radius-full);
    font-family: var(--font-accent);
    font-size: 0.6875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}
.badge-sale { background: var(--color-fire-red); color: white; }

/* Empty State */
.shop-empty {
    text-align: center;
    padding: var(--space-4xl) 0;
}
.shop-empty-icon {
    font-size: 4rem;
    display: block;
    margin-bottom: var(--space-lg);
}
.shop-empty-title {
    font-family: var(--font-display);
    font-size: 2.5rem;
    margin-bottom: var(--space-md);
}
.shop-empty-text {
    color: var(--color-muted);
    font-size: 1.125rem;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 32px;
    border-radius: var(--radius-md);
    font-family: var(--font-body);
    font-size: 0.9375rem;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 200ms var(--ease-out);
    border: 2px solid transparent;
    text-decoration: none;
}
.btn-primary {
    background: var(--color-fire-red);
    color: white;
    border-color: var(--color-fire-red);
}
.btn-primary:hover {
    background: var(--color-deep-ember);
    border-color: var(--color-deep-ember);
    color: white;
}
.btn-outline {
    background: transparent;
    color: var(--color-fire-red);
    border-color: var(--color-fire-red);
}
.btn-outline:hover {
    background: var(--color-fire-red);
    color: white;
}
.btn-outline-light {
    background: transparent;
    color: var(--color-white-smoke);
    border-color: var(--color-white-smoke);
}
.btn-outline-light:hover {
    background: var(--color-white-smoke);
    color: var(--color-charcoal);
}
.btn-ghost {
    background: transparent;
    color: var(--color-muted);
    border-color: var(--color-line);
    padding: 10px 20px;
    font-size: 0.8125rem;
}
.btn-ghost:hover {
    color: var(--color-white-smoke);
    border-color: var(--color-muted);
}

/* WooCommerce default overrides */
.woocommerce ul.products {
    display: none; /* We use custom editorial layout instead */
}

/* Responsive */
@media (max-width: 1024px) {
    .shop-editorial-hero {
        grid-template-columns: 1fr;
    }
    .shop-editorial-hero-media {
        min-height: 350px;
    }
    .shop-editorial-hero-img {
        min-height: 350px;
    }
    .shop-feature-single {
        grid-template-columns: 1fr;
        gap: var(--space-xl);
    }
}

@media (max-width: 768px) {
    .shop-duo {
        grid-template-columns: 1fr;
    }
    .shop-duo-item--right {
        align-items: flex-start;
    }
    .shop-editorial-card--wide {
        grid-column: span 1;
    }
    .shop-editorial-card-img {
        aspect-ratio: 1:1;
    }
    .shop-editorial-card--wide .shop-editorial-card-img {
        aspect-ratio: 1:1;
    }
}

@media (max-width: 480px) {
    .shop-editorial-hero-content {
        padding: var(--space-xl);
    }
    .shop-feature-title {
        font-size: 2.25rem;
    }
    .shop-editorial-title {
        font-size: 2rem;
    }
}
</style>

<?php get_footer(); ?>
