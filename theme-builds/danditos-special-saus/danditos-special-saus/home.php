<?php
/**
 * The template for displaying the blog posts index
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header">
    <div class="container">
        <h1 class="page-title"><?php single_post_title( '', true ) ?: esc_html_e( 'Our Blog', 'danditos-special-saus' ); ?></h1>
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
                        <?php
                        $categories = get_the_category();
                        if ( ! empty( $categories ) ) :
                            echo ' &bull; ';
                            echo esc_html( $categories[0]->name );
                        endif;
                        ?>
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
