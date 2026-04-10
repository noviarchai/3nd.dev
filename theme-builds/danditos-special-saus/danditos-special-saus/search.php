<?php
/**
 * The template for displaying search results
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header">
    <div class="container">
        <h1 class="page-title">
            <?php
            printf(
                /* translators: %s: search query */
                esc_html__( 'Search Results for: %s', 'danditos-special-saus' ),
                '<span>' . get_search_query() . '</span>'
            );
            ?>
        </h1>
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
            <p style="font-size: 1.25rem; color: var(--color-muted);">
                <?php
                printf(
                    /* translators: %s: search query */
                    esc_html__( 'No results found for "%s". Try a different search term.', 'danditos-special-saus' ),
                    esc_html( get_search_query() )
                );
                ?>
            </p>
            <p style="color: var(--color-muted); margin-top: var(--space-md);">
                <?php esc_html_e( 'Suggestions:', 'danditos-special-saus' ); ?>
                <?php esc_html_e( 'Try searching for "hot", "garlic", "mild", or "medium"', 'danditos-special-saus' ); ?>
            </p>
            <div style="margin-top: var(--space-xl);">
                <a href="<?php echo esc_url( get_permalink( wc_get_page_id( 'shop' ) ) ); ?>" class="btn btn-primary">
                    <?php esc_html_e( 'Browse All Products', 'danditos-special-saus' ); ?>
                </a>
            </div>
        </div>
        <?php endif; ?>
    </div>
</section>

<?php get_footer(); ?>
