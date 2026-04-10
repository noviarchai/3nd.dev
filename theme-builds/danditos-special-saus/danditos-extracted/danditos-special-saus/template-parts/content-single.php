<?php
/**
 * Template part for displaying single post content
 *
 * @package Danditos_Special_Saus
 */
?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php if ( has_post_thumbnail() ) : ?>
    <div class="entry-thumbnail">
        <?php the_post_thumbnail(); ?>
    </div>
    <?php endif; ?>

    <header class="entry-header">
        <h1 class="entry-title"><?php the_title(); ?></h1>
        <div class="entry-meta">
            <?php
            printf(
                esc_html__( 'By %s', 'danditos-special-saus' ),
                '<span class="author vcard">' . esc_html( get_the_author() ) . '</span>'
            );
            ?>
            <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                <?php echo esc_html( get_the_date() ); ?>
            </time>
        </div>
    </header>

    <div class="entry-content">
        <?php
        the_content();

        wp_link_pages( array(
            'before' => '<div class="page-links">' . esc_html__( 'Pages:', 'danditos-special-saus' ),
            'after'  => '</div>',
        ) );
        ?>
    </div>
</article>
