<?php
/**
 * Template tags for Dandito's Special Saus
 *
 * @package Danditos_Special_Saus
 */

/**
 * Print HTML for a post date.
 */
function danditos_posted_on() {
    $time_string = '<time class="entry-date published updated" datetime="%1$s">%2$s</time>';
    if ( get_the_time( 'U' ) !== get_the_modified_time( 'U' ) ) {
        $time_string = '<time class="entry-date published" datetime="%1$s">%2$s</time><time class="updated" datetime="%3$s">%4$s</time>';
    }

    $time_string = sprintf(
        $time_string,
        esc_attr( get_the_date( 'c' ) ),
        esc_html( get_the_date() ),
        esc_attr( get_the_modified_date( 'c' ) ),
        esc_html( get_the_modified_date() )
    );

    echo '<span class="posted-on">' . $time_string . '</span>';
}

/**
 * Print HTML for post author.
 */
function danditos_posted_by() {
    $byline = sprintf(
        /* translators: %s: post author */
        esc_html__( 'by %s', 'danditos-special-saus' ),
        '<span class="author vcard"><a class="url fn n" href="' . esc_url( get_author_posts_url( get_the_author_meta( 'ID' ) ) ) . '">' . esc_html( get_the_author() ) . '</a></span>'
    );

    echo '<span class="byline"> ' . $byline . '</span>';
}

/**
 * Get category list with custom separator.
 */
function danditos_get_categories( $separator = ', ', $post_id = null ) {
    $categories = get_the_category( $post_id );

    if ( ! $categories ) {
        return false;
    }

    $category_names = array();
    foreach ( $categories as $category ) {
        $category_names[] = '<a href="' . esc_url( get_category_link( $category->term_id ) ) . '">' . esc_html( $category->name ) . '</a>';
    }

    return implode( $separator, $category_names );
}

/**
 * Get reading time estimate.
 */
function danditos_reading_time( $post_id = null ) {
    $post_id = $post_id ? $post_id : get_the_ID();
    $content = get_post_field( 'post_content', $post_id );
    $word_count = str_word_count( wp_strip_all_tags( $content ) );
    $reading_time = ceil( $word_count / 200 ); // 200 words per minute

    if ( $reading_time === 1 ) {
        return sprintf( esc_html__( '%d min read', 'danditos-special-saus' ), $reading_time );
    }

    return sprintf( esc_html__( '%d min read', 'danditos-special-saus' ), $reading_time );
}

/**
 * Display reading time.
 */
function danditos_display_reading_time( $post_id = null ) {
    echo '<span class="reading-time">' . danditos_reading_time( $post_id ) . '</span>';
}
