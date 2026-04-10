<?php
/**
 * The template for displaying the footer
 *
 * @package Danditos_Special_Saus
 */

?>

</main><!-- #main-content -->

<footer id="colophon" class="site-footer">
    <div class="footer-widgets">
        <div class="container">
            <div class="footer-grid">
                <!-- Brand Column -->
                <div class="footer-brand">
                    <div class="site-logo">
                        <a href="<?php echo esc_url( home_url( '/' ) ); ?>" rel="home">
                            <?php
                            if ( has_custom_logo() ) {
                                the_custom_logo();
                            } else {
                                echo '<span class="site-title">' . esc_html( get_bloginfo( 'name' ) ) . '</span>';
                            }
                            ?>
                        </a>
                    </div>
                    <p class="footer-tagline"><?php esc_html_e( 'Every bottle tells a story — built with peppers that bite, garlic that hits, and flavor that sticks.', 'danditos-special-saus' ); ?></p>
                    <div class="footer-social">
                        <a href="https://instagram.com/danditos" aria-label="<?php esc_attr_e( 'Instagram', 'danditos-special-saus' ); ?>">
                            <?php echo danditos_get_svg( 'instagram' ); ?>
                        </a>
                        <a href="https://facebook.com/danditos" aria-label="<?php esc_attr_e( 'Facebook', 'danditos-special-saus' ); ?>">
                            <?php echo danditos_get_svg( 'facebook' ); ?>
                        </a>
                    </div>
                </div>

                <!-- Shop Links -->
                <div class="footer-col">
                    <h4 class="footer-heading"><?php esc_html_e( 'Shop', 'danditos-special-saus' ); ?></h4>
                    <?php if ( has_nav_menu( 'footer' ) ) : ?>
                    <ul class="footer-links">
                        <?php
                        wp_nav_menu( array(
                            'theme_location' => 'footer',
                            'container'      => false,
                            'fallback_cb'    => false,
                            'items_wrap'     => '%3$s',
                            'depth'          => 1,
                        ) );
                        ?>
                    </ul>
                    <?php else : ?>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>"><?php esc_html_e( 'All Sauces', 'danditos-special-saus' ); ?></a></li>
                        <li><a href="<?php echo esc_url( home_url( '/?heat=mild' ) ); ?>"><?php esc_html_e( 'Mild Sauces', 'danditos-special-saus' ); ?></a></li>
                        <li><a href="<?php echo esc_url( home_url( '/?heat=hot' ) ); ?>"><?php esc_html_e( 'Hot Sauces', 'danditos-special-saus' ); ?></a></li>
                        <li><a href="<?php echo esc_url( home_url( '/product-tag/gift-set' ) ); ?>"><?php esc_html_e( 'Gift Sets', 'danditos-special-saus' ); ?></a></li>
                    </ul>
                    <?php endif; ?>
                </div>

                <!-- Company Links -->
                <div class="footer-col">
                    <h4 class="footer-heading"><?php esc_html_e( 'Company', 'danditos-special-saus' ); ?></h4>
                    <ul class="footer-links">
                        <li><a href="<?php echo esc_url( home_url( '/about' ) ); ?>"><?php esc_html_e( 'Our Story', 'danditos-special-saus' ); ?></a></li>
                        <li><a href="<?php echo esc_url( home_url( '/where-to-buy' ) ); ?>"><?php esc_html_e( 'Where to Buy', 'danditos-special-saus' ); ?></a></li>
                        <li><a href="<?php echo esc_url( home_url( '/contact' ) ); ?>"><?php esc_html_e( 'Contact', 'danditos-special-saus' ); ?></a></li>
                    </ul>
                </div>

                <!-- Newsletter Column -->
                <div class="footer-col">
                    <h4 class="footer-heading"><?php esc_html_e( 'Stay in the Heat', 'danditos-special-saus' ); ?></h4>
                    <p style="color: var(--color-muted); font-size: 0.9375rem; margin-bottom: var(--space-lg);">
                        <?php esc_html_e( 'Get the inside scoop on new flavors and limited batches.', 'danditos-special-saus' ); ?>
                    </p>
                    <form class="footer-newsletter-form" action="#" method="post">
                        <input type="email" name="email" placeholder="<?php esc_attr_e( 'Your email', 'danditos-special-saus' ); ?>" required>
                        <button type="submit" class="btn btn-primary"><?php esc_html_e( 'Join', 'danditos-special-saus' ); ?></button>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <div class="footer-bottom">
        <div class="container">
            <p class="copyright">
                &copy; <?php echo esc_html( date( 'Y' ) ); ?> <?php bloginfo( 'name' ); ?>. <?php esc_html_e( 'NO FACTORY SAUCE. NO SHORTCUTS.', 'danditos-special-saus' ); ?>
            </p>
            <nav class="footer-legal">
                <a href="<?php echo esc_url( home_url( '/privacy-policy' ) ); ?>"><?php esc_html_e( 'Privacy Policy', 'danditos-special-saus' ); ?></a>
                <a href="<?php echo esc_url( home_url( '/terms' ) ); ?>"><?php esc_html_e( 'Terms of Service', 'danditos-special-saus' ); ?></a>
            </nav>
        </div>
    </div>
</footer>

<!-- Mini Cart Overlay -->
<?php if ( class_exists( 'WooCommerce' ) ) : ?>
<div class="mini-cart-overlay" id="mini-cart-overlay"></div>
<?php endif; ?>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
