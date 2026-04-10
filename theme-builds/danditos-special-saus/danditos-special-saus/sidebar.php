<?php
/**
 * The sidebar containing the main widget area
 *
 * @package Danditos_Special_Saus
 */

if ( ! is_active_sidebar( 'sidebar-1' ) ) {
    return;
}
?>

<aside id="secondary" class="widget-area" role="complementary">
    <div class="container">
        <div style="max-width: var(--content-width); margin: 0 auto;">
            <?php dynamic_sidebar( 'sidebar-1' ); ?>
        </div>
    </div>
</aside><!-- #secondary -->
