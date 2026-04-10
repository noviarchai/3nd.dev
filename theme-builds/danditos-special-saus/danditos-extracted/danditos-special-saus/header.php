<?php
/**
 * The header for our theme
 *
 * @package Danditos_Special_Saus
 */

?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo( 'charset' ); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <link rel="profile" href="https://gmpg.org/xfn/11">
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<a class="skip-link" href="#main-content"><?php esc_html_e( 'Skip to content', 'danditos-special-saus' ); ?></a>

<header id="masthead" class="site-header <?php echo is_front_page() ? 'transparent' : ''; ?>">
    <div class="header-inner">
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

        <nav id="site-nav" class="site-nav" aria-label="<?php esc_attr_e( 'Primary Navigation', 'danditos-special-saus' ); ?>">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'primary',
                'container'      => false,
                'fallback_cb'    => false,
                'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            ) );
            ?>
        </nav>

        <div class="header-utilities">
            <button class="util-btn search-toggle" aria-label="<?php esc_attr_e( 'Search', 'danditos-special-saus' ); ?>">
                <?php echo danditos_get_svg( 'search' ); ?>
            </button>

            <?php if ( class_exists( 'WooCommerce' ) ) : ?>
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" class="util-btn cart-link" aria-label="<?php esc_attr_e( 'View cart', 'danditos-special-saus' ); ?>">
                <?php echo danditos_get_svg( 'cart' ); ?>
                <?php
                $cart_count = WC()->cart->get_cart_contents_count();
                if ( $cart_count > 0 ) :
                ?>
                <span class="cart-count"><?php echo esc_html( $cart_count ); ?></span>
                <?php endif; ?>
            </a>
            <?php endif; ?>

            <button class="mobile-menu-toggle" aria-label="<?php esc_attr_e( 'Open menu', 'danditos-special-saus' ); ?>" aria-expanded="false">
                <?php echo danditos_get_svg( 'menu' ); ?>
            </button>
        </div>
    </div>

    <!-- Mobile Menu Overlay -->
    <div class="mobile-menu-overlay" id="mobile-menu" aria-hidden="true">
        <button class="mini-cart-close mobile-menu-close" aria-label="<?php esc_attr_e( 'Close menu', 'danditos-special-saus' ); ?>">
            <?php echo danditos_get_svg( 'close' ); ?>
        </button>
        <nav aria-label="<?php esc_attr_e( 'Mobile Navigation', 'danditos-special-saus' ); ?>">
            <?php
            wp_nav_menu( array(
                'theme_location' => 'mobile',
                'container'       => false,
                'fallback_cb'    => false,
                'items_wrap'     => '<ul id="%1$s" class="%2$s">%3$s</ul>',
            ) );
            ?>
        </nav>
    </div>
</header>

<main id="main-content" class="site-main">
