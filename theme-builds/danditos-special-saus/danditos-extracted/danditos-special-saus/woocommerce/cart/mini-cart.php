<?php
/**
 * Mini cart template
 *
 * @package Danditos_Special_Saus
 */

defined( 'ABSPATH' ) || exit;
?>

<div class="danditos-mini-cart" id="danditos-mini-cart">
    <div class="mini-cart-header">
        <h3><?php esc_html_e( 'Your Cart', 'danditos-special-saus' ); ?>
            (<?php echo WC()->cart->get_cart_contents_count(); ?>)
        </h3>
        <button class="mini-cart-close" aria-label="<?php esc_attr_e( 'Close cart', 'danditos-special-saus' ); ?>">
            &times;
        </button>
    </div>

    <div class="mini-cart-items">
        <?php if ( WC()->cart->is_empty() ) : ?>
            <div style="text-align: center; padding: var(--space-2xl) 0;">
                <div style="margin-bottom: var(--space-lg);">
                    <?php echo danditos_get_svg( 'pepper' ); ?>
                </div>
                <p style="color: var(--color-muted); margin-bottom: var(--space-lg);">
                    <?php esc_html_e( 'Your cart is empty — let\'s fix that.', 'danditos-special-saus' ); ?>
                </p>
                <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-primary">
                    <?php esc_html_e( 'Browse Our Sauces', 'danditos-special-saus' ); ?>
                </a>
            </div>
        <?php else : ?>
            <?php do_action( 'woocommerce_before_mini_cart_contents' ); ?>

            <?php foreach ( WC()->cart->get_cart() as $cart_item_key => $cart_item ) {
                $_product = apply_filters( 'woocommerce_cart_item_product', $cart_item['data'], $cart_item, $cart_item_key );
                $product_id = apply_filters( 'woocommerce_cart_item_product_id', $cart_item['product_id'], $cart_item, $cart_item_key );

                if ( $_product && $_product->exists() && $cart_item['quantity'] > 0 && apply_filters( 'woocommerce_cart_item_visible', true, $cart_item, $cart_item_key ) ) {
                    $product_permalink = apply_filters( 'woocommerce_cart_item_permalink', $_product->is_visible() ? $_product->get_permalink( $cart_item ) : '', $cart_item, $cart_item_key );
                    ?>
                    <div class="mini-cart-item" data-key="<?php echo esc_attr( $cart_item_key ); ?>">
                        <div class="mini-cart-item-image">
                            <?php
                            $thumbnail = apply_filters( 'woocommerce_cart_item_thumbnail', $_product->get_image(), $cart_item, $cart_item_key );
                            if ( ! $product_permalink ) {
                                echo $thumbnail;
                            } else {
                                printf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $thumbnail );
                            }
                            ?>
                        </div>
                        <div class="mini-cart-item-info">
                            <h4 class="mini-cart-item-title">
                                <?php
                                if ( ! $product_permalink ) {
                                    echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', $_product->get_name(), $cart_item, $cart_item_key ) );
                                } else {
                                    echo wp_kses_post( apply_filters( 'woocommerce_cart_item_name', sprintf( '<a href="%s">%s</a>', esc_url( $product_permalink ), $_product->get_name() ), $cart_item, $cart_item_key ) );
                                }
                                ?>
                            </h4>
                            <p class="mini-cart-item-price">
                                <?php echo apply_filters( 'woocommerce_cart_item_price', WC()->cart->get_product_price( $_product ), $cart_item, $cart_item_key ); ?>
                            </p>
                            <div class="mini-cart-item-qty">
                                <?php
                                if ( $_product->is_sold_individually() ) {
                                    $min_quantity = 1;
                                    $max_quantity = 1;
                                } else {
                                    $min_quantity = 0;
                                    $max_quantity = $_product->get_max_purchase_quantity();
                                }

                                $product_quantity = woocommerce_quantity_input(
                                    array(
                                        'input_name'   => "cart[{$cart_item_key}][qty]",
                                        'input_value'   => $cart_item['quantity'],
                                        'max_value'     => $max_quantity,
                                        'min_value'     => $min_quantity,
                                        'product_name'  => $_product->get_name(),
                                    ),
                                    $_product,
                                    false
                                );

                                echo apply_filters( 'woocommerce_cart_item_quantity', $product_quantity, $cart_item_key, $cart_item );
                                ?>
                            </div>
                        </div>
                        <div class="mini-cart-item-remove">
                            <?php
                            echo apply_filters(
                                'woocommerce_cart_item_remove_link',
                                sprintf(
                                    '<a href="%s" class="remove" aria-label="%s" data-product_id="%s" data-product_sku="%s">&times;</a>',
                                    esc_url( wc_get_cart_remove_url( $cart_item_key ) ),
                                    esc_html__( 'Remove this item', 'danditos-special-saus' ),
                                    esc_attr( $product_id ),
                                    esc_attr( $_product->get_sku() )
                                ),
                                $cart_item_key
                            );
                            ?>
                        </div>
                    </div>
                <?php } ?>
            <?php } ?>

            <?php do_action( 'woocommerce_mini_cart_contents' ); ?>
        <?php endif; ?>
    </div>

    <?php if ( ! WC()->cart->is_empty() ) : ?>
    <div class="mini-cart-footer">
        <div class="mini-cart-subtotal">
            <span><?php esc_html_e( 'Subtotal', 'danditos-special-saus' ); ?></span>
            <span class="amount"><?php wc_cart_totals_subtotal_html(); ?></span>
        </div>

        <?php do_action( 'woocommerce_mini_cart' ); ?>

        <a href="<?php echo esc_url( wc_get_checkout_url() ); ?>" class="mini-cart-checkout-btn">
            <?php esc_html_e( 'Checkout', 'danditos-special-saus' ); ?>
        </a>

        <div style="text-align: center; margin-top: var(--space-md);">
            <a href="<?php echo esc_url( wc_get_cart_url() ); ?>" style="color: var(--color-muted); font-size: 0.875rem;">
                <?php esc_html_e( 'View Cart', 'danditos-special-saus' ); ?>
            </a>
        </div>
    </div>
    <?php endif; ?>
</div>
