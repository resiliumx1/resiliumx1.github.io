/* ==========================================================================
   NEW HORIZON DIGITAL — JavaScript
   - Smooth scroll navigation
   - Sticky header with scroll effect
   - Mobile menu toggle
   - FAQ accordion
   - Scroll-triggered fade-up animations
   - Contact form basic handling
   ========================================================================== */

(function () {
    'use strict';

    /* -----------------------------------------------------------------------
       DOM References
    ----------------------------------------------------------------------- */
    var header = document.getElementById('header');
    var menuBtn = document.getElementById('menuBtn');
    var mobileNav = document.getElementById('mobileNav');
    var faqItems = document.querySelectorAll('.faq-item__question');
    var fadeEls = document.querySelectorAll('.fade-up');
    var contactForm = document.getElementById('contactForm');

    /* -----------------------------------------------------------------------
       1. Sticky Header — add class on scroll
    ----------------------------------------------------------------------- */
    function handleHeaderScroll() {
        if (window.scrollY > 40) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* -----------------------------------------------------------------------
       2. Mobile Menu Toggle
    ----------------------------------------------------------------------- */
    function toggleMobileNav() {
        var isOpen = mobileNav.classList.toggle('active');
        menuBtn.classList.toggle('active');
        menuBtn.setAttribute('aria-expanded', isOpen);
        mobileNav.setAttribute('aria-hidden', !isOpen);
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMobileNav);

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            if (mobileNav.classList.contains('active')) {
                toggleMobileNav();
            }
        });
    });

    /* -----------------------------------------------------------------------
       3. Smooth Scroll for all internal anchor links
    ----------------------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();
            var headerOffset = 72;
            var elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
            var offsetPosition = elementPosition - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    /* -----------------------------------------------------------------------
       4. FAQ Accordion
    ----------------------------------------------------------------------- */
    faqItems.forEach(function (btn) {
        btn.addEventListener('click', function () {
            var answer = this.nextElementSibling;
            var isOpen = this.getAttribute('aria-expanded') === 'true';

            // Close all others
            faqItems.forEach(function (otherBtn) {
                if (otherBtn !== btn) {
                    otherBtn.setAttribute('aria-expanded', 'false');
                    otherBtn.nextElementSibling.classList.remove('open');
                    otherBtn.nextElementSibling.setAttribute('aria-hidden', 'true');
                }
            });

            // Toggle current
            this.setAttribute('aria-expanded', !isOpen);
            answer.setAttribute('aria-hidden', isOpen);
            if (isOpen) {
                answer.classList.remove('open');
            } else {
                answer.classList.add('open');
            }
        });
    });

    /* -----------------------------------------------------------------------
       5. Scroll-Triggered Fade-Up Animations (IntersectionObserver)
    ----------------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
        var fadeObserver = new IntersectionObserver(
            function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        fadeObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: '0px 0px -40px 0px'
            }
        );

        fadeEls.forEach(function (el) {
            fadeObserver.observe(el);
        });
    } else {
        // Fallback: show everything immediately
        fadeEls.forEach(function (el) {
            el.classList.add('visible');
        });
    }

    /* -----------------------------------------------------------------------
       6. Contact Form Handling
    ----------------------------------------------------------------------- */
    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            var formData = new FormData(contactForm);
            var submitBtn = contactForm.querySelector('button[type="submit"]');
            var originalText = submitBtn.textContent;

            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            // Using Formspree or similar service
            fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    Accept: 'application/json'
                }
            })
                .then(function (response) {
                    if (response.ok) {
                        contactForm.innerHTML =
                            '<div style="text-align:center;padding:40px 0;">' +
                            '<h3 style="color:#fff;margin-bottom:12px;">Thank You!</h3>' +
                            '<p style="color:rgba(255,255,255,0.7);">We\'ve received your request. ' +
                            'We\'ll review your business and get back to you within 24 hours with your free marketing audit.</p>' +
                            '</div>';
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(function () {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                    alert(
                        'Something went wrong. Please try again, or contact us directly via WhatsApp.'
                    );
                });
        });
    }

    /* -----------------------------------------------------------------------
       7. Active Nav Link Highlight on Scroll
    ----------------------------------------------------------------------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.header__nav-link');

    function highlightNav() {
        var scrollPos = window.scrollY + 100;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('header__nav-link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('header__nav-link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
})();
