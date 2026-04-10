<?php
/**
 * Template part for displaying no content found
 *
 * @package Danditos_Special_Saus
 */
?>

<section class="no-results not-found">
    <div class="page-header">
        <h1 class="page-title"><?php esc_html_e( 'Nothing Found', 'danditos-special-saus' ); ?></h1>
    </div>

    <div class="content-area">
        <?php if ( is_home() && current_user_can( 'publish_posts' ) ) : ?>
            <p><?php printf( wp_kses( __( 'Ready to publish your first post? <a href="%1$s">Get started here</a>.', 'danditos-special-saus' ), array( 'a' => array( 'href' => array() ) ) ), esc_url( admin_url( 'post-new.php' ) ) ); ?></p>
        <?php elseif ( is_search() ) : ?>
            <p><?php esc_html_e( 'Sorry, no results found. Try a different search term.', 'danditos-special-saus' ); ?></p>
            <?php get_search_form(); ?>
        <?php else : ?>
            <p><?php esc_html_e( 'It seems we can\'t find what you\'re looking for. Perhaps try a search?', 'danditos-special-saus' ); ?></p>
            <?php get_search_form(); ?>
        <?php endif; ?>
    </div>
</section>
