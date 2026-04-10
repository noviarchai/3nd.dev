<?php
/**
 * Template Name: Contact
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

<section class="section">
    <div class="container">
        <div class="contact-grid">
            <div class="contact-form animate-on-scroll">
                <form action="#" method="post">
                    <div class="form-group">
                        <label for="name"><?php esc_html_e( 'Your Name', 'danditos-special-saus' ); ?></label>
                        <input type="text" id="name" name="name" required placeholder="<?php esc_attr_e( 'Full name', 'danditos-special-saus' ); ?>">
                    </div>
                    <div class="form-group">
                        <label for="email"><?php esc_html_e( 'Email Address', 'danditos-special-saus' ); ?></label>
                        <input type="email" id="email" name="email" required placeholder="<?php esc_attr_e( 'you@example.com', 'danditos-special-saus' ); ?>">
                    </div>
                    <div class="form-group">
                        <label for="subject"><?php esc_html_e( 'Subject', 'danditos-special-saus' ); ?></label>
                        <select id="subject" name="subject">
                            <option value=""><?php esc_html_e( 'Select a topic', 'danditos-special-saus' ); ?></option>
                            <option value="order"><?php esc_html_e( 'Order Question', 'danditos-special-saus' ); ?></option>
                            <option value="wholesale"><?php esc_html_e( 'Wholesale Inquiry', 'danditos-special-saus' ); ?></option>
                            <option value="feedback"><?php esc_html_e( 'Product Feedback', 'danditos-special-saus' ); ?></option>
                            <option value="press"><?php esc_html_e( 'Press & Media', 'danditos-special-saus' ); ?></option>
                            <option value="other"><?php esc_html_e( 'Something Else', 'danditos-special-saus' ); ?></option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="message"><?php esc_html_e( 'Message', 'danditos-special-saus' ); ?></label>
                        <textarea id="message" name="message" required placeholder="<?php esc_attr_e( 'Tell us what\'s on your mind...', 'danditos-special-saus' ); ?>"></textarea>
                    </div>
                    <button type="submit" class="btn btn-primary">
                        <?php esc_html_e( 'Send Message', 'danditos-special-saus' ); ?>
                    </button>
                </form>
            </div>

            <div class="contact-info animate-on-scroll">
                <h3><?php esc_html_e( 'GET IN TOUCH', 'danditos-special-saus' ); ?></h3>
                <p><?php esc_html_e( 'Have a question about our sauces? Want to carry Dandito\'s at your shop? Just want to say hi? We\'d love to hear from you.', 'danditos-special-saus' ); ?></p>

                <div style="margin-top: var(--space-2xl);">
                    <p>
                        <strong><?php esc_html_e( 'Email', 'danditos-special-saus' ); ?></strong><br>
                        <a href="mailto:hello@danditos.com">hello@danditos.com</a>
                    </p>
                    <p>
                        <strong><?php esc_html_e( 'Location', 'danditos-special-saus' ); ?></strong><br>
                        <?php esc_html_e( 'Calgary, Alberta, Canada', 'danditos-special-saus' ); ?>
                    </p>
                    <p>
                        <strong><?php esc_html_e( 'Social', 'danditos-special-saus' ); ?></strong><br>
                        <a href="https://instagram.com/danditos">Instagram</a> &bull; <a href="https://facebook.com/danditos">Facebook</a>
                    </p>
                </div>

                <div style="margin-top: var(--space-2xl); padding: var(--space-xl); background: var(--color-charcoal); border-radius: var(--radius-lg);">
                    <h4 style="margin-bottom: var(--space-md);"><?php esc_html_e( 'WHOLESALE?', 'danditos-special-saus' ); ?></h4>
                    <p style="color: var(--color-muted); font-size: 0.9375rem; margin-bottom: var(--space-md);">
                        <?php esc_html_e( 'Want to carry Dandito\'s in your store or restaurant? We\'d love to talk.', 'danditos-special-saus' ); ?>
                    </p>
                    <a href="mailto:wholesale@danditos.com" style="color: var(--color-fire-red); font-weight: 600;">
                        <?php esc_html_e( 'wholesale@danditos.com', 'danditos-special-saus' ); ?>
                    </a>
                </div>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?>
