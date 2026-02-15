/* ==========================================================================
   MOUNT KAILASH SCHOOL — Course Page JavaScript
   - Sticky header with scroll effect
   - Mobile menu toggle
   - Smooth scroll navigation
   - FAQ accordion
   - Scroll-triggered fade-up animations
   - Active nav link highlight
   ========================================================================== */

(function () {
    'use strict';

    /* -----------------------------------------------------------------------
       DOM References
    ----------------------------------------------------------------------- */
    var header = document.getElementById('mkHeader');
    var menuBtn = document.getElementById('mkMenuBtn');
    var mobileNav = document.getElementById('mkMobileNav');
    var faqItems = document.querySelectorAll('.mk-faq-item__question');
    var fadeEls = document.querySelectorAll('.mk-fade-up');

    /* -----------------------------------------------------------------------
       1. Sticky Header — add class on scroll
    ----------------------------------------------------------------------- */
    function handleHeaderScroll() {
        if (window.scrollY > 40) {
            header.classList.add('mk-header--scrolled');
        } else {
            header.classList.remove('mk-header--scrolled');
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
            var headerOffset = 80;
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
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
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
       6. Active Nav Link Highlight on Scroll
    ----------------------------------------------------------------------- */
    var sections = document.querySelectorAll('section[id]');
    var navLinks = document.querySelectorAll('.mk-header__nav-link');

    function highlightNav() {
        var scrollPos = window.scrollY + 120;

        sections.forEach(function (section) {
            var top = section.offsetTop;
            var height = section.offsetHeight;
            var id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function (link) {
                    link.classList.remove('mk-header__nav-link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('mk-header__nav-link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });
})();
