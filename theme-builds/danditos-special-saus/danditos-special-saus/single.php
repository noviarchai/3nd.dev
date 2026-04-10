<?php
/**
 * The template for displaying single posts
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<?php while ( have_posts() ) : the_post(); ?>

<article id="post-<?php the_ID(); ?>" <?php post_class(); ?>>
    <?php if ( has_post_thumbnail() ) : ?>
    <div class="entry-thumbnail">
        <?php the_post_thumbnail( 'danditos-hero', array( 'alt' => get_the_title() ) ); ?>
    </div>
    <?php endif; ?>

    <div class="content-area">
        <header class="entry-header">
            <h1 class="entry-title"><?php the_title(); ?></h1>
            <div class="entry-meta">
                <span>
                    <?php
                    printf(
                        /* translators: %s: post author */
                        esc_html__( 'By %s', 'danditos-special-saus' ),
                        '<span class="author vcard">' . esc_html( get_the_author() ) . '</span>'
                    );
                    ?>
                </span>
                <span>
                    <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                        <?php echo esc_html( get_the_date() ); ?>
                    </time>
                </span>
                <?php
                $categories = get_the_category();
                if ( ! empty( $categories ) ) :
                ?>
                <span>
                    <?php
                    printf(
                        /* translators: %s: category name */
                        esc_html__( 'In %s', 'danditos-special-saus' ),
                        '<a href="' . esc_url( get_category_link( $categories[0]->term_id ) ) . '">' . esc_html( $categories[0]->name ) . '</a>'
                    );
                    ?>
                </span>
                <?php endif; ?>
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

        <?php
        $tags = get_the_tags();
        if ( ! empty( $tags ) ) :
        ?>
        <div class="entry-tags" style="margin-top: var(--space-xl);">
            <strong><?php esc_html_e( 'Tagged:', 'danditos-special-saus' ); ?></strong>
            <?php
            $tag_links = array();
            foreach ( $tags as $tag ) {
                $tag_links[] = '<a href="' . esc_url( get_tag_link( $tag->term_id ) ) . '">' . esc_html( $tag->name ) . '</a>';
            }
            echo implode( ', ', $tag_links );
            ?>
        </div>
        <?php endif; ?>
    </div>
</article>

<?php
// Author bio
if ( get_the_author_meta( 'description' ) ) :
?>
<div class="section" style="background: var(--color-charcoal);">
    <div class="container">
        <div style="display: flex; align-items: center; gap: var(--space-lg);">
            <?php echo get_avatar( get_the_author_meta( 'ID' ), 80, '', '', array( 'class' => 'avatar' ) ); ?>
            <div>
                <strong style="display: block; margin-bottom: var(--space-xs);">
                    <?php printf( esc_html__( 'About %s', 'danditos-special-saus' ), get_the_author() ); ?>
                </strong>
                <p style="color: var(--color-muted); margin: 0;"><?php the_author_meta( 'description' ); ?></p>
            </div>
        </div>
    </div>
</div>
<?php endif; ?>

<?php
// Related posts
$related = new WP_Query( array(
    'post__not_in' => array( get_the_ID() ),
    'posts_per_page' => 3,
    'category__in'   => wp_get_post_categories( get_the_ID() ),
) );

if ( $related->have_posts() ) :
?>
<section class="section">
    <div class="container">
        <h2 class="section-title"><?php esc_html_e( 'Related Posts', 'danditos-special-saus' ); ?></h2>
        <div class="posts-grid">
            <?php
            while ( $related->have_posts() ) :
                $related->the_post();
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
                    <h3 class="post-card-title">
                        <a href="<?php the_permalink(); ?>"><?php the_title(); ?></a>
                    </h3>
                    <div class="post-card-meta">
                        <time datetime="<?php echo esc_attr( get_the_date( 'c' ) ); ?>">
                            <?php echo esc_html( get_the_date() ); ?>
                        </time>
                    </div>
                </div>
            </article>
            <?php endwhile; ?>
        </div>
    </div>
</section>
<?php endif; ?>
<?php wp_reset_postdata(); ?>

<?php
// Comments
if ( comments_open() || get_comments_number() ) :
    comments_template();
endif;
?>

<?php endwhile; ?>

<?php get_footer(); ?>
