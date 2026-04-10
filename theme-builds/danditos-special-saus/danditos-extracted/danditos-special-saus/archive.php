<?php
/**
 * The template for displaying archive pages
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header">
    <div class="container">
        <?php
        the_archive_title( '<h1 class="page-title">', '</h1>' );
        the_archive_description( '<div class="archive-description" style="color: var(--color-muted); margin-top: var(--space-md);">', '</div>' );
        ?>
    </div>
</div>

<section class="section">
    <div class="container">
        <?php if ( have_posts() ) : ?>
        <div class="posts-grid">
            <?php
            while ( have_posts() ) :
                the_post();
            ?>
            <article id="post-<?php the_ID(); ?>" <?php post_class( 'post-card animate-on-scroll' ); ?>>
                <?php if ( has_post_thumbnail() ) : ?>
                <div class="post-card-image">
                    <a href="<?php the_permalink(); ?>">
                        <?php the_post_thumbnail( 'large', array( 'alt' => get_the_title() ) ); ?>
                    </a>
                </div>
                <?php endif; ?>
                <div class="post-card-body">
                    <h2 class="post-card-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h2>
                    <div class="post-card-meta">
                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                            <?php echo esc_html( get_the_date() ); ?>
                        </time>
                    </div>
                    <?php the_excerpt(); ?>
                </div>
            </article>
            <?php endwhile; ?>
        </div>

        <?php
        the_posts_pagination( array(
            'mid_size'  => 2,
            'prev_text' => __( '&larr; Previous', 'danditos-special-saus' ),
            'next_text' => __( 'Next &rarr;', 'danditos-special-saus' ),
        ) );
        ?>

        <?php else : ?>
        <div class="content-area text-center">
            <p><?php esc_html_e( 'No posts found.', 'danditos-special-saus' ); ?></p>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
