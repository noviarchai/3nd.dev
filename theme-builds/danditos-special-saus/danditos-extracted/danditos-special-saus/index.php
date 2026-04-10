<?php
/**
 * The main fallback template
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="content-area">
    <?php
    if ( have_posts() ) :
        while ( have_posts() ) :
            the_post();
    ?>
    <article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
        <header class="entry-header">
            <h1 class="entry-title"><?php the_title(); ?></h1>
        </header>
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    </article>
    <?php
        endwhile;
    else :
    ?>
    <div class="entry-content">
        <p><?php esc_html_e( 'It seems we can\'t find what you\'re looking for. Perhaps try a search?', 'danditos-special-saus' ); ?></p>
        <?php get_search_form(); ?>
    </div>
    <?php endif; ?>
</div>

<?php get_footer(); ?>
