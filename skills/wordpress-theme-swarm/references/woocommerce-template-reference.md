# WooCommerce Template Override Reference

WooCommerce allows themes to override its default templates by copying them into a `woocommerce/` folder within the theme. This reference lists all overrideable templates and their purpose.

---

## WooCommerce Template Hierarchy

```
woocommerce/
├── archive-product.php              # Shop main page / product category archive
├── single-product.php               # Single product detail page
├── content-single-product.php       # Product content inside single-product
├── single-product/
│   ├── product-image.php            # Main product image / gallery
│   ├── product-thumbnails.php       # Thumbnail navigation
│   ├── product-gallery.php          # Gallery wrapper
│   ├── product-summary.php          # Product title, price, excerpt (add-to-cart area)
│   ├── product-attributes.php       # Additional attributes display
│   ├── product-meta.php             # SKU, categories, tags
│   ├── related-products.php         # Related products section
│   ├── tabs/
│   │   ├── tabs.php                 # Product tabs (description, reviews)
│   │   └── tab-reviews.php          # Reviews tab content
│   └── add-to-cart/
│       ├── simple.php               # Add to cart for simple products
│       ├── variable.php             # Add to cart for variable products (variation select)
│       ├── grouped.php              # Add to cart for grouped products
│       └── external.php             # Add to cart for external products
├── cart/
│   ├── cart.php                     # Full cart page
│   ├── mini-cart.php                # Mini-cart in header/sidebar (used via AJAX)
│   ├── cart-empty.php                # Empty cart message
│   └── cart-totals.php              # Cart totals section
├── checkout/
│   ├── form-checkout.php            # Main checkout form
│   ├── form-login.php              # Login form inside checkout (if guest checkout disabled)
│   ├── checkout-header.php         # Checkout page header
│   ├── form-billing.php            # Billing address form
│   ├── form-shipping.php           # Shipping address form
│   ├── order-review.php            # Order review sidebar (totals, payment)
│   └── payment-method.php         # Payment gateway selection
├── myaccount/
│   ├── myaccount.php               # My account dashboard
│   ├── form-login.php              # Login / registration form
│   ├── form-edit-account.php      # Edit account details
│   ├── form-edit-address.php      # Edit shipping/billing address
│   ├── orders.php                  # Order history
│   ├── view-order.php             # Single order detail
│   ├── order-tracking.php         # Order tracking
│   └──-lost-password.php          # Password recovery
├── global/
│   ├── quantity-input.php         # Quantity +/- input field
│   ├── wrapper-start.php          # Opening wrapper div (before content)
│   ├── wrapper-end.php            # Closing wrapper div (after content)
│   ├── breadcrumb.php             # WooCommerce breadcrumb
│   └── notice.php                 # Generic notice template
├── loop/
│   ├── loop-start.php             # Before product grid
│   ├── loop-end.php              # After product grid
│   ├── no-products-found.php     # No products message
│   ├── pagination.php            # Product archive pagination
│   ├── result-count.php          # "Showing 1-12 of 23 products"
│   ├── ordering.php              # Sort dropdown
│   ├── sale-flash.php            # "Sale!" badge
│   └── add-to-cart.php          # Add to cart button in loop
├── notices/
│   ├── success.php               # Success notice
│   ├── error.php                 # Error notice
│   ├── info.php                  # Info notice
│   └── notice.php                # Generic notice
└── auth/
    └── form-grant-access.php     # OAuth grant access prompt
```

---

## WooCommerce Hooks Reference

### Archive/Shop Page Hooks
```php
woocommerce_before_main_content      // Before shop content
woocommerce_archive_description       // Category description
woocommerce_before_shop_loop          // Before product grid
woocommerce_before_shop_loop_item     // Before each product
woocommerce_shop_loop_item_title      // Product title
woocommerce_after_shop_loop_item       // After each product
woocommerce_after_shop_loop            // After product grid
woocommerce_no_products_found         // No products found message
woocommerce_after_main_content         // After shop content
```

### Single Product Page Hooks
```php
woocommerce_before_single_product      // Before product
woocommerce_before_single_product_summary // Before product summary
woocommerce_single_product_summary       // Product title, price, excerpt
woocommerce_before_add_to_cart_form    // Before add-to-cart
woocommerce_after_add_to_cart_form     // After add-to-cart
woocommerce_product_meta_start          // Before product meta
woocommerce_product_meta_end            // After product meta
woocommerce_share                        // Social sharing
woocommerce_after_single_product_summary // After product summary
woocommerce_after_single_product         // After product
```

### Cart Page Hooks
```php
woocommerce_before_cart                 // Before cart
woocommerce_before_cart_table          // Before cart table
woocommerce_before_cart_contents        // Before cart items
woocommerce_cart_contents              // Cart items
woocommerce_after_cart_contents         // After cart items
woocommerce_cart_totals_before_shipping // Before shipping
woocommerce_after_cart_totals           // After totals
woocommerce_proceed_to_checkout         // Checkout button
woocommerce_after_cart                  // After cart
```

### Checkout Page Hooks
```php
woocommerce_before_checkout_form        // Before checkout form
woocommerce_checkout_before_customer_details // Before customer details
woocommerce_checkout_after_customer_details // After customer details
woocommerce_checkout_before_order_review // Before order review
woocommerce_review_order_before_order_total // Before order total
woocommerce_review_order_after_order_total // After order total
woocommerce_checkout_after_order_review  // After order review
woocommerce_after_checkout_form          // After checkout form
```

---

## WooCommerce Support Registration

In `functions.php`, the theme must declare WooCommerce support:
```php
add_action('after_setup_theme', function() {
    add_theme_support('woocommerce');
});
```

Optional WooCommerce features:
```php
add_theme_support('wc-product-gallery-zoom');
add_theme_support('wc-product-gallery-lightbox');
add_theme_support('wc-product-gallery-slider');
```

---

## Common WooCommerce CSS Classes

### Product Grid (archive)
```css
.woocommerce ul.products
.woocommerce ul.products li.product
.woocommerce ul.products li.product a img
.woocommerce ul.products li.product .woocommerce-loop-product__title
.woocommerce ul.products li.product .price
.woocommerce ul.products li.product .button
.woocommerce span.onsale
```

### Single Product
```css
.woocommerce div.product
.woocommerce div.product p.price
.woocommerce div.product .product_title
.woocommerce div.product form.cart
.woocommerce div.product div.images
.woocommerce div.product div.summary
.woocommerce div.product .woocommerce-tabs
.woocommerce div.product .related products
```

### Cart
```css
.woocommerce-cart table.cart
.woocommerce-cart td.product-name
.woocommerce-cart td.product-price
.woocommerce-cart td.product-quantity input
.woocommerce-cart .wc-proceed-to-checkout
```

---

## WooCommerce Template Override Best Practices

1. **Always copy the default template** from `wp-content/plugins/woocommerce/templates/` before modifying
2. **Keep override files in `woocommerce/`** (not `woocommerce/single-product/`, etc., for root overrides)
3. **Use WooCommerce hooks** instead of removing template files when possible
4. **Declare `woocommerce_support()`** in functions.php
5. **Use conditional CSS classes** on `<body>` and `<html>` for WooCommerce-specific styling: `woocommerce-active`
6. **WooCommerce-specific CSS** should go in `woocommerce.css` (enqueued separately) or integrated into main `style.css`
7. **Mini-cart via AJAX** — use `wc_enqueue_js` for dynamic mini-cart updates, not page reloads
8. **Gallery features** — use `add_theme_support()` for gallery features, don't copy those template files unless customizing markup

---

## WooCommerce Template Priority

When WooCommerce looks for a template, it searches in this order (first found wins):
1. `{theme}/woocommerce/{template}.php`
2. `{theme}/woocommerce/{subfolder}/{template}.php`
3. `{default WooCommerce templates}`
