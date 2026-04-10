<?php
/**
 * Checkout form template
 *
 * @package Danditos_Special_Saus
 */

defined( 'ABSPATH' ) || exit;

do_action( 'woocommerce_before_checkout_form', $checkout );

// If checkout registration is disabled and not logged in, the user cannot checkout.
if ( ! $checkout->is_registration_enabled() && $checkout->is_registration_required() && ! is_user_logged_in() ) {
    echo esc_html( apply_filters( 'woocommerce_checkout_must_be_logged_in_message', __( 'You must be logged in to checkout.', 'danditos-special-saus' ) ) );
    return;
}
?>

<div class="page-header">
    <div class="container">
        <h1 class="page-title"><?php esc_html_e( 'Checkout', 'danditos-special-saus' ); ?></h1>
    </div>
</div>

<section class="section" style="padding-top: var(--space-2xl);">
    <div class="container">
        <form name="checkout" method="post" class="checkout woocommerce-checkout" action="<?php echo esc_url( wc_get_checkout_url() ); ?>" enctype="multipart/form-data">

            <?php if ( $checkout->get_checkout_fields() ) : ?>

            <div class="col2-set" id="customer_details">
                <div class="col-1">
                    <?php do_action( 'woocommerce_checkout_billing' ); ?>
                </div>

                <div class="col-2">
                    <?php do_action( 'woocommerce_checkout_shipping' ); ?>
                </div>
            </div>

            <?php endif; ?>

            <?php do_action( 'woocommerce_checkout_before_order_review_heading' ); ?>

            <h3 id="order_review_heading"><?php esc_html_e( 'Your order', 'danditos-special-saus' ); ?></h3>

            <?php do_action( 'woocommerce_checkout_before_order_review' ); ?>

            <div id="order_review" class="woocommerce-checkout-review-order">
                <?php do_action( 'woocommerce_checkout_order_review' ); ?>
            </div>

            <?php do_action( 'woocommerce_checkout_after_order_review' ); ?>

        </form>

        <div style="margin-top: var(--space-xl); text-align: center;">
            <p style="color: var(--color-muted); font-size: 0.875rem;">
                <?php esc_html_e( 'Secure checkout powered by WooCommerce', 'danditos-special-saus' ); ?>
            </p>
        </div>
    </div>
</section>

<?php do_action( 'woocommerce_after_checkout_form', $checkout ); ?>
