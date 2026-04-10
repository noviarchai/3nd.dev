<?php
/**
 * Template part for displaying post meta
 *
 * @package Danditos_Special_Saus
 */
?>

<div class="entry-meta">
    <span class="posted-on">
        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
            <?php echo esc_html( get_the_date() ); ?>
        </time>
    </span>

    <?php if ( has_category() ) : ?>
    <span class="cat-links">
        <?php esc_html_e( 'In', 'danditos-special-saus' ); ?>
        <?php the_category( ', ' ); ?>
    </span>
    <?php endif; ?>

    <?php if ( has_tag() ) : ?>
    <span class="tag-links">
        <?php the_tags( '', ', ' ); ?>
    </span>
    <?php endif; ?>

    <span class="comments-link">
        <a href="<?php comments_link(); ?>">
            <?php
            printf(
                esc_html( _nx( 'One comment', '%1$s comments', get_comments_number(), 'comments title', 'danditos-special-saus' ) ),
                number_format_i18n( get_comments_number() )
            );
            ?>
        </a>
    </span>
</div>
