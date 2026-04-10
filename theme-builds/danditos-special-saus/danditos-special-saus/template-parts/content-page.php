<?php
/**
 * Template part for displaying page content in page.php
 *
 * @package Danditos_Special_Saus
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <div class="entry-content">
        <?php the_content(); ?>
    </div>
</article>
