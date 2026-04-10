<?php
/**
 * Quantity input template
 *
 * @package Danditos_Special_Saus
 */

defined( 'ABSPATH' ) || exit;

$input_id = uniqid( 'qty-' );
?>
<div class="quantity" data-role="quantity">
    <button type="button" class="qty-btn qty-minus" data-action="decrement" aria-label="<?php esc_attr_e( 'Decrease quantity', 'danditos-special-saus' ); ?>">−</button>
    <input
        type="number"
        id="<?php echo esc_attr( $input_id ); ?>"
        class="input-text qty text"
        step="<?php echo esc_attr( $step ); ?>"
        min="<?php echo esc_attr( $min_value ); ?>"
        max="<?php echo esc_attr( $max_value !== -1 ? $max_value : '' ); ?>"
        name="<?php echo esc_attr( $input_name ); ?>"
        value="<?php echo esc_attr( $input_value ); ?>"
        title="<?php echo esc_attr_x( 'Qty', 'Product quantity input tooltip', 'danditos-special-saus' ); ?>"
        placeholder="<?php echo esc_attr( $placeholder ); ?>"
        inputmode="<?php echo esc_attr( $inputmode ); ?>"
        autocomplete="<?php echo esc_attr( apply_filters( 'woocommerce_quantity_input_autocomplete', 'off' ) ); ?>"
    >
    <button type="button" class="qty-btn qty-plus" data-action="increment" aria-label="<?php esc_attr_e( 'Increase quantity', 'danditos-special-saus' ); ?>">+</button>
</div>
