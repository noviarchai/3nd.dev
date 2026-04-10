<?php
/**
 * Template part for displaying featured image
 *
 * @package Danditos_Special_Saus
 */
?>

<?php if ( has_post_thumbnail() ) : ?>
<div class="entry-thumbnail">
    <a href="<?php the_permalink(); ?>" aria-hidden="true">
        <?php
        the_post_thumbnail( 'large', array(
            'alt' => get_the_title(),
            'loading' => 'lazy',
        ) );
        ?>
    </a>
</div>
<?php endif; ?>
