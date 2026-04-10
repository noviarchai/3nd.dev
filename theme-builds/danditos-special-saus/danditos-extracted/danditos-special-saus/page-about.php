<?php
/**
 * Template Name: About / Our Story
 *
 * @package Danditos_Special_Saus
 */

get_header();
?>

<div class="page-header">
    <div class="container">
        <h1 class="page-title"><?php the_title(); ?></h1>
    </div>
</div>

<?php while ( have_posts() ) : the_post(); ?>

<section class="story-teaser" style="padding-top: 0;">
    <div class="container">
        <div class="story-grid">
            <div class="story-image animate-on-scroll">
                <img src="https://images.unsplash.com/photo-1565895405138-6c3a1555da6a?w=800&q=80" alt="<?php esc_attr_e( 'Hot sauce craft', 'danditos-special-saus' ); ?>" loading="lazy">
            </div>
            <div class="story-content animate-on-scroll">
                <h2 class="section-title"><?php esc_html_e( 'THE BEGINNING', 'danditos-special-saus' ); ?></h2>
                <p><?php esc_html_e( 'It started in a kitchen — not a factory, not a lab. A real kitchen, in a real home, in a real Calgary neighbourhood. The kind of kitchen where recipes aren\'t written down at first — they\'re felt, tasted, adjusted, felt again.', 'danditos-special-saus' ); ?></p>
                <p><?php esc_html_e( 'Dandito\'s Special Saus was never meant to be a business. It was a obsession. The perfect balance of heat and flavor. The right amount of garlic. The pepper that doesn\'t just burn — it enhances.', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
    </div>
</section>

<section class="craft-process" style="background: var(--color-charcoal);">
    <div class="container">
        <h2 class="section-title animate-on-scroll"><?php esc_html_e( 'THE CRAFT', 'danditos-special-saus' ); ?></h2>
        <div class="process-steps">
            <div class="process-step animate-on-scroll">
                <div class="step-number">1</div>
                <div class="step-icon"><?php echo danditos_get_svg( 'flame' ); ?></div>
                <h3 class="step-title"><?php esc_html_e( 'SOURCING', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'We work directly with Alberta farmers to source peppers at peak ripeness. No imports, no compromises.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="process-step animate-on-scroll">
                <div class="step-number">2</div>
                <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2v6"/><path d="M8 8l4 4 4-4"/><path d="M4 22h16"/><path d="M6 22v-4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v4"/></svg>
                </div>
                <h3 class="step-title"><?php esc_html_e( 'CRAFTING', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'Small batches only. Every bottle numbered. We cook with patience — the way sauce should be made.', 'danditos-special-saus' ); ?></p>
            </div>
            <div class="process-step animate-on-scroll">
                <div class="step-number">3</div>
                <div class="step-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M10 2h4"/><path d="M12 2v4"/><path d="M8 6h8l1 4H7L8 6z"/><path d="M7 10v10a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V10"/></svg>
                </div>
                <h3 class="step-title"><?php esc_html_e( 'BOTTLED', 'danditos-special-saus' ); ?></h3>
                <p class="step-text"><?php esc_html_e( 'Hand-bottled, hand-labeled, hand-packed. Each bottle gets the same care we\'d give our own kitchen table.', 'danditos-special-saus' ); ?></p>
            </div>
        </div>
    </div>
</section>

<section class="testimonial-section">
    <div class="testimonial-quote animate-on-scroll">
        <div class="quote-marks">"</div>
        <p class="quote-text"><?php esc_html_e( 'This isn\'t sauce made by people trying to sell you sauce. This is sauce made by people who genuinely love making sauce. You can taste the difference.', 'danditos-special-saus' ); ?></p>
        <p class="quote-attribution"><?php esc_html_e( '— Jenn K., Edmonton', 'danditos-special-saus' ); ?></p>
    </div>
</section>

<section class="section">
    <div class="content-area">
        <div class="entry-content">
            <?php the_content(); ?>
        </div>
    </div>
</section>

<?php endwhile; ?>

<?php get_footer(); ?>
