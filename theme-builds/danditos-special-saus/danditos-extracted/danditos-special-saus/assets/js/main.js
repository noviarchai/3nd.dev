/**
 * Main JavaScript file for Dandito's Special Saus
 *
 * @package Danditos_Special_Saus
 */

(function() {
    'use strict';

    // ==========================================================================
    // Header scroll behavior
    // ==========================================================================
    var header = document.querySelector('.site-header');
    var lastScrollY = 0;
    var scrollThreshold = 100;

    function handleScroll() {
        var scrollY = window.scrollY;

        if (scrollY > scrollThreshold) {
            header.classList.add('scrolled');
            header.classList.remove('transparent');
        } else {
            header.classList.remove('scrolled');
            if (header.dataset.transparent === 'true') {
                header.classList.add('transparent');
            }
        }

        lastScrollY = scrollY;
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // ==========================================================================
    // Mobile menu
    // ==========================================================================
    var mobileToggle = document.querySelector('.mobile-menu-toggle');
    var mobileMenu = document.getElementById('mobile-menu');
    var mobileClose = document.querySelector('.mobile-menu-close');

    if (mobileToggle && mobileMenu) {
        mobileToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
            mobileMenu.setAttribute('aria-hidden', 'false');
            mobileToggle.setAttribute('aria-expanded', 'true');
            document.body.style.overflow = 'hidden';
        });

        if (mobileClose) {
            mobileClose.addEventListener('click', closeMobileMenu);
        }

        // Close on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
                closeMobileMenu();
            }
        });

        function closeMobileMenu() {
            mobileMenu.classList.remove('active');
            mobileMenu.setAttribute('aria-hidden', 'true');
            mobileToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }

        // Close when clicking a link in the menu
        var mobileLinks = mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(function(link) {
            link.addEventListener('click', closeMobileMenu);
        });
    }

    // ==========================================================================
    // Scroll animations (Intersection Observer)
    // ==========================================================================
    var animatedElements = document.querySelectorAll('.animate-on-scroll');

    if ('IntersectionObserver' in window) {
        var observerOptions = {
            root: null,
            rootMargin: '0px 0px -50px 0px',
            threshold: 0.1
        };

        var observer = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        animatedElements.forEach(function(el) {
            observer.observe(el);
        });
    } else {
        // Fallback: show all elements immediately
        animatedElements.forEach(function(el) {
            el.classList.add('visible');
        });
    }

    // ==========================================================================
    // Product filter pills
    // ==========================================================================
    var filterPills = document.querySelectorAll('.filter-pill');

    filterPills.forEach(function(pill) {
        pill.addEventListener('click', function() {
            var filter = this.dataset.filter;

            // Update active state
            filterPills.forEach(function(p) {
                p.classList.remove('active');
            });
            this.classList.add('active');

            // Filter products
            var products = document.querySelectorAll('.product-card[data-heat]');
            products.forEach(function(product) {
                if (filter === 'all' || product.dataset.heat === filter) {
                    product.style.display = '';
                    product.style.opacity = '0';
                    setTimeout(function() {
                        product.style.opacity = '1';
                    }, 50);
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // ==========================================================================
    // Mini cart toggle
    // ==========================================================================
    var cartLink = document.querySelector('.cart-link');
    var miniCart = document.getElementById('danditos-mini-cart');
    var miniCartOverlay = document.getElementById('mini-cart-overlay');
    var miniCartClose = document.querySelector('.mini-cart-close');

    function openMiniCart() {
        if (miniCart) {
            miniCart.classList.add('open');
        }
        if (miniCartOverlay) {
            miniCartOverlay.classList.add('open');
        }
        document.body.style.overflow = 'hidden';
    }

    function closeMiniCart() {
        if (miniCart) {
            miniCart.classList.remove('open');
        }
        if (miniCartOverlay) {
            miniCartOverlay.classList.remove('open');
        }
        document.body.style.overflow = '';
    }

    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            // Only prevent default if it's the cart icon, not a link
            e.preventDefault();
            openMiniCart();
        });
    }

    if (miniCartOverlay) {
        miniCartOverlay.addEventListener('click', closeMiniCart);
    }

    if (miniCartClose) {
        miniCartClose.addEventListener('click', closeMiniCart);
    }

    // Close mini cart on escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && miniCart && miniCart.classList.contains('open')) {
            closeMiniCart();
        }
    });

    // ==========================================================================
    // Add to cart AJAX feedback
    // ==========================================================================
    var addToCartButtons = document.querySelectorAll('.add_to_cart_button, .single_add_to_cart_button, .product-card .add-to-cart-btn');

    addToCartButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            var originalText = button.textContent;
            button.textContent = 'Adding...';
            button.disabled = true;

            // Re-enable after a delay (WooCommerce will handle actual AJAX)
            setTimeout(function() {
                button.textContent = 'Added!';
                button.style.background = '#27ae60';

                setTimeout(function() {
                    button.textContent = originalText;
                    button.style.background = '';
                    button.disabled = false;

                    // Open mini cart on success
                    openMiniCart();
                }, 1500);
            }, 800);
        });
    });

    // ==========================================================================
    // Quantity input +/- buttons
    // ==========================================================================
    var quantityBtns = document.querySelectorAll('.qty-btn');

    quantityBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var container = this.closest('.quantity');
            var input = container.querySelector('input.qty');
            var currentVal = parseFloat(input.value);
            var min = parseFloat(input.min) || 0;
            var max = parseFloat(input.max) || Infinity;
            var step = parseFloat(input.step) || 1;

            if (this.classList.contains('qty-plus')) {
                if (currentVal < max) {
                    input.value = currentVal + step;
                }
            } else if (this.classList.contains('qty-minus')) {
                if (currentVal > min) {
                    input.value = currentVal - step;
                }
            }

            // Trigger change event for WooCommerce
            input.dispatchEvent(new Event('change', { bubbles: true }));
        });
    });

    // ==========================================================================
    // Newsletter form
    // ==========================================================================
    var newsletterForms = document.querySelectorAll('.newsletter-form, .footer-newsletter-form');

    newsletterForms.forEach(function(form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();

            var input = form.querySelector('input[type="email"]');
            var button = form.querySelector('button[type="submit"]');
            var originalText = button.textContent;

            button.textContent = 'Joining...';
            button.disabled = true;

            // Simulate form submission
            setTimeout(function() {
                var email = input.value;

                // Replace form with success message
                var parent = form.parentNode;
                var successMsg = document.createElement('p');
                successMsg.style.color = '#27ae60';
                successMsg.style.fontWeight = '700';
                successMsg.style.fontSize = '1rem';
                successMsg.innerHTML = "You're in! 🌶️ Check your inbox for a welcome heat wave.";

                parent.replaceChild(successMsg, form);
            }, 1000);
        });
    });

    // ==========================================================================
    // Contact form
    // ==========================================================================
    var contactForm = document.querySelector('.contact-form form');

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            var button = contactForm.querySelector('button[type="submit"]');
            var originalText = button.textContent;

            button.textContent = 'Sending...';
            button.disabled = true;

            // Simulate submission
            setTimeout(function() {
                button.textContent = 'Message Sent!';

                // Replace form with thank you message
                var formContainer = contactForm;
                var thankYou = document.createElement('div');
                thankYou.style.padding = 'var(--space-2xl)';
                thankYou.style.textAlign = 'center';
                thankYou.innerHTML = '<h3 style="font-family: var(--font-display); font-size: 2rem; margin-bottom: var(--space-md);">Message Received!</h3><p style="color: var(--color-muted);">We\'ll get back to you soon. In the meantime, keep eating hot sauce.</p>';

                formContainer.parentNode.replaceChild(thankYou, formContainer);
            }, 1500);
        });
    }

    // ==========================================================================
    // Smooth scroll for anchor links
    // ==========================================================================
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#' || targetId.length <= 1) return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================================================
    // Search toggle (placeholder for header search)
    // ==========================================================================
    var searchToggle = document.querySelector('.search-toggle');

    if (searchToggle) {
        searchToggle.addEventListener('click', function() {
            // Simple: scroll to main search or focus a search input if one exists
            var searchInput = document.querySelector('input[type="search"], .search-field input');
            if (searchInput) {
                searchInput.focus();
            } else {
                // Redirect to home with search param
                window.location.href = window.danditosData ? window.danditosData.homeUrl + '?s=' : '/';
            }
        });
    }

    // ==========================================================================
    // Product gallery touch/swipe support
    // ==========================================================================
    var galleryImages = document.querySelectorAll('.woocommerce-product-gallery__image img');

    if (galleryImages.length > 1 && 'ontouchstart' in window) {
        var startX = 0;
        var startY = 0;

        galleryImages.forEach(function(img) {
            img.addEventListener('touchstart', function(e) {
                startX = e.touches[0].clientX;
                startY = e.touches[0].clientY;
            }, { passive: true });

            img.addEventListener('touchend', function(e) {
                var endX = e.changedTouches[0].clientX;
                var endY = e.changedTouches[0].clientY;
                var diffX = endX - startX;
                var diffY = endY - startY;

                // Only handle horizontal swipes
                if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                    // Swipe direction handled by WooCommerce gallery
                }
            }, { passive: true });
        });
    }

    // ==========================================================================
    // WooCommerce cart fragments (update mini cart without reload)
    // ==========================================================================
    jQuery(document.body).on('added_to_cart', function() {
        openMiniCart();
    });

    jQuery(document.body).on('removed_from_cart', function() {
        // Optionally close or update mini cart
    });

})();
