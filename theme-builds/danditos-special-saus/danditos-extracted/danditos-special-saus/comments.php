<?php
/**
 * The template for displaying comments
 *
 * This is the template that displays the area of the page that contains both the current comments
 * and the comment form.
 *
 * @package Danditos_Special_Saus
 */

/*
 * If the current post is protected by a password and
 * the visitor has not yet entered the password we will
 * return early without loading the comments.
 */
if ( post_password_required() ) {
    return;
}
?>

<div id="comments" class="comments-area">

<?php if ( have_comments() ) : ?>
    <h2 class="comments-title">
        <?php
        $comments_number = get_comments_number();
        if ( $comments_number === 1 ) {
            echo esc_html( $comments_number ) . ' ' . esc_html__( 'Comment', 'danditos-special-saus' );
        } else {
            echo esc_html( $comments_number ) . ' ' . esc_html__( 'Comments', 'danditos-special-saus' );
        }
        ?>
    </h2>

    <?php the_comments_navigation(); ?>

    <ol class="comment-list">
        <?php
        wp_list_comments( array(
            'style'       => 'ol',
            'short_ping'  => true,
            'avatar_size' => 60,
            'callback'    => function( $comment, $args, $depth ) {
        ?>
        <li <?php comment_class(); ?> id="comment-<?php comment_ID(); ?>">
            <article id="div-comment-<?php comment_ID(); ?>" class="comment">
                <div class="comment-author">
                    <?php echo get_avatar( $comment, 60, '', '', array( 'class' => 'avatar' ) ); ?>
                    <div>
                        <span class="fn"><?php comment_author(); ?></span>
                        <div class="comment-metadata">
                            <a href="<?php echo esc_url( get_comment_link( $comment->comment_ID ) ); ?>">
                                <time datetime="<?php comment_time( 'c' ); ?>">
                                    <?php comment_date(); ?> at <?php comment_time(); ?>
                                </time>
                            </a>
                        </div>
                    </div>
                </div>

                <?php if ( '0' === $comment->comment_approved ) : ?>
                <p class="comment-awaiting-moderation"><?php esc_html_e( 'Your comment is awaiting moderation.', 'danditos-special-saus' ); ?></p>
                <?php endif; ?>

                <div class="comment-content">
                    <?php comment_text(); ?>
                </div>

                <div class="reply">
                    <?php
                    comment_reply_link( array_merge( $args, array(
                        'depth'     => $depth,
                        'max_depth' => $args['max_depth'],
                    ) ) );
                    ?>
                </div>
            </article>
        </li>
        <?php
            },
        ) );
        ?>
    </ol>

    <?php the_comments_navigation(); ?>

<?php endif; // have_comments() ?>

<?php if ( ! comments_open() && get_comments_number() && post_type_supports( get_post_type(), 'comments' ) ) : ?>
    <p class="no-comments"><?php esc_html_e( 'Comments are closed.', 'danditos-special-saus' ); ?></p>
<?php endif; ?>

<?php
comment_form( array(
    'title_reply' => '<h2 class="comment-reply-title">' . esc_html__( 'Leave a Reply', 'danditos-special-saus' ) . '</h2>',
    'label_submit' => esc_html__( 'Post Comment', 'danditos-special-saus' ),
    'class_submit' => 'submit btn btn-primary',
    'comment_field' => '<div class="form-group"><label for="comment">' . esc_html__( 'Comment', 'danditos-special-saus' ) . '</label><textarea id="comment" name="comment" class="form-control" rows="5" required></textarea></div>',
    'fields' => array(
        'author' => '<div class="form-group"><label for="author">' . esc_html__( 'Name', 'danditos-special-saus' ) . '</label><input id="author" name="author" type="text" class="form-control" required></div>',
        'email' => '<div class="form-group"><label for="email">' . esc_html__( 'Email', 'danditos-special-saus' ) . '</label><input id="email" name="email" type="email" class="form-control" required></div>',
    ),
) );
?>

</div><!-- #comments -->
