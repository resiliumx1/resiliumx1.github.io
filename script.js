/**
 * SELECT START GAMING - Main JavaScript
 * Antigua's Premier Gaming & Electronics Hub
 */

document.addEventListener('DOMContentLoaded', () => {
    initializeHeader();
    initializeMobileMenu();
    initializeCurrencyToggle();
    initializeCart();
    initializeScrollAnimations();
    initializeNewsletterForm();
    initializeFilters();
    initializeWishlist();
});

/**
 * Header scroll effects
 */
function initializeHeader() {
    const header = document.getElementById('header');
    if (!header) return;

    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        const currentScrollY = window.scrollY;

        // Add scrolled class when scrolled down
        if (currentScrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScrollY = currentScrollY;
    });
}

/**
 * Mobile menu toggle
 */
function initializeMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navLinks = document.getElementById('navLinks');

    if (!menuToggle || !navLinks) return;

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        menuToggle.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const links = navLinks.querySelectorAll('.nav-link');
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
            navLinks.classList.remove('open');
            menuToggle.classList.remove('active');
        }
    });
}

/**
 * Currency toggle (USD/XCD)
 * Exchange rate: 1 USD = 2.70 XCD
 */
const EXCHANGE_RATE = 2.70;
let currentCurrency = 'usd';

function initializeCurrencyToggle() {
    const currencyBtns = document.querySelectorAll('.currency-btn');

    currencyBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const currency = btn.dataset.currency;
            if (currency === currentCurrency) return;

            // Update active state
            currencyBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Update current currency
            currentCurrency = currency;

            // Update all prices on the page
            updatePrices();
        });
    });
}

function updatePrices() {
    const priceElements = document.querySelectorAll('.price-current[data-usd]');

    priceElements.forEach(el => {
        const usdPrice = parseFloat(el.dataset.usd);
        const xcdPrice = parseFloat(el.dataset.xcd) || Math.round(usdPrice * EXCHANGE_RATE);

        if (currentCurrency === 'usd') {
            el.textContent = `$${formatNumber(usdPrice)}`;
        } else {
            el.textContent = `EC$${formatNumber(xcdPrice)}`;
        }
    });

    // Update dual price labels
    const dualPrices = document.querySelectorAll('.price-dual');
    dualPrices.forEach(el => {
        const parent = el.closest('.product-pricing');
        if (!parent) return;

        const mainPrice = parent.querySelector('.price-current[data-usd]');
        if (!mainPrice) return;

        const usdPrice = parseFloat(mainPrice.dataset.usd);
        const xcdPrice = parseFloat(mainPrice.dataset.xcd) || Math.round(usdPrice * EXCHANGE_RATE);

        if (currentCurrency === 'usd') {
            el.textContent = `XCD $${formatNumber(xcdPrice)}`;
        } else {
            el.textContent = `USD $${formatNumber(usdPrice)}`;
        }
    });
}

function formatNumber(num) {
    return num.toLocaleString('en-US');
}

/**
 * Shopping Cart
 */
let cart = [];

function initializeCart() {
    // Load cart from localStorage
    const savedCart = localStorage.getItem('ssg_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }

    // Add to cart buttons
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const productCard = btn.closest('.product-card');
            addToCart(productCard);
        });
    });

    // Cart button
    const cartBtn = document.getElementById('cartBtn');
    if (cartBtn) {
        cartBtn.addEventListener('click', () => {
            showCartNotification();
        });
    }
}

function addToCart(productCard) {
    const title = productCard.querySelector('.product-title').textContent;
    const brand = productCard.querySelector('.product-brand').textContent;
    const priceEl = productCard.querySelector('.price-current');
    const price = parseFloat(priceEl.dataset.usd);

    const product = {
        id: generateId(),
        title,
        brand,
        price,
        quantity: 1
    };

    // Check if product already in cart
    const existingIndex = cart.findIndex(item => item.title === title);
    if (existingIndex > -1) {
        cart[existingIndex].quantity++;
    } else {
        cart.push(product);
    }

    // Save to localStorage
    localStorage.setItem('ssg_cart', JSON.stringify(cart));

    // Update cart count
    updateCartCount();

    // Show feedback
    showAddToCartFeedback(productCard);
}

function updateCartCount() {
    const cartCounts = document.querySelectorAll('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    cartCounts.forEach(el => {
        el.textContent = totalItems;
    });
}

function showAddToCartFeedback(productCard) {
    const btn = productCard.querySelector('.add-to-cart-btn');
    const originalText = btn.textContent;

    btn.textContent = 'Added!';
    btn.style.background = 'var(--primary)';

    setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
    }, 1500);
}

function showCartNotification() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    if (totalItems === 0) {
        alert('Your cart is empty!');
    } else {
        alert(`Cart: ${totalItems} item(s)\nTotal: $${formatNumber(totalPrice)} USD\n\n(Full checkout coming soon!)`);
    }
}

function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

/**
 * Scroll animations using Intersection Observer
 */
function initializeScrollAnimations() {
    const animatedElements = document.querySelectorAll('.stagger-children, .card, .section-header');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fadeInUp');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
}

/**
 * Newsletter form
 */
function initializeNewsletterForm() {
    const form = document.getElementById('newsletterForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = form.querySelector('input[type="email"]').value;

        // Simulate form submission
        const btn = form.querySelector('button');
        const originalText = btn.textContent;

        btn.textContent = 'Subscribing...';
        btn.disabled = true;

        setTimeout(() => {
            btn.textContent = 'Subscribed!';
            form.querySelector('input').value = '';

            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 2000);
        }, 1000);
    });
}

/**
 * Product filters (Shop page)
 */
function initializeFilters() {
    const filterCheckboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    const mobileFilterToggle = document.getElementById('mobileFilterToggle');
    const filtersSidebar = document.getElementById('filtersSidebar');

    // Filter change handler
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });

    // Price range inputs
    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');

    if (minPrice && maxPrice) {
        minPrice.addEventListener('change', applyFilters);
        maxPrice.addEventListener('change', applyFilters);
    }

    // Mobile filter toggle
    if (mobileFilterToggle && filtersSidebar) {
        mobileFilterToggle.addEventListener('click', () => {
            filtersSidebar.classList.toggle('open');
        });
    }

    // Sort select
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortProducts);
    }

    // URL params for category filtering
    const urlParams = new URLSearchParams(window.location.search);
    const category = urlParams.get('category');
    if (category) {
        const checkbox = document.querySelector(`input[value="${category}"]`);
        if (checkbox) {
            checkbox.checked = true;
            applyFilters();
        }
    }
}

function applyFilters() {
    const products = document.querySelectorAll('.product-card');
    const activeFilters = getActiveFilters();

    let visibleCount = 0;

    products.forEach(product => {
        const category = product.dataset.category;
        const brand = product.dataset.brand;
        const price = parseFloat(product.dataset.price);

        let show = true;

        // Category filter
        if (activeFilters.categories.length > 0) {
            show = activeFilters.categories.includes(category);
        }

        // Brand filter
        if (show && activeFilters.brands.length > 0) {
            show = activeFilters.brands.includes(brand);
        }

        // Price filter
        if (show && activeFilters.minPrice) {
            show = price >= activeFilters.minPrice;
        }
        if (show && activeFilters.maxPrice) {
            show = price <= activeFilters.maxPrice;
        }

        // Show/hide product
        product.style.display = show ? '' : 'none';
        if (show) visibleCount++;
    });

    // Update results count
    const resultsCount = document.querySelector('.results-count strong');
    if (resultsCount) {
        resultsCount.textContent = visibleCount;
    }
}

function getActiveFilters() {
    const categories = [];
    const brands = [];

    document.querySelectorAll('input[data-filter="category"]:checked').forEach(cb => {
        categories.push(cb.value);
    });

    document.querySelectorAll('input[data-filter="brand"]:checked').forEach(cb => {
        brands.push(cb.value);
    });

    const minPrice = parseFloat(document.getElementById('minPrice')?.value) || 0;
    const maxPrice = parseFloat(document.getElementById('maxPrice')?.value) || Infinity;

    return { categories, brands, minPrice, maxPrice };
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect');
    const productsGrid = document.getElementById('productsGrid');
    if (!sortSelect || !productsGrid) return;

    const sortValue = sortSelect.value;
    const products = Array.from(productsGrid.querySelectorAll('.product-card'));

    products.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);

        switch (sortValue) {
            case 'price-low':
                return priceA - priceB;
            case 'price-high':
                return priceB - priceA;
            default:
                return 0;
        }
    });

    // Re-append sorted products
    products.forEach(product => {
        productsGrid.appendChild(product);
    });
}

function clearFilters() {
    const checkboxes = document.querySelectorAll('.filter-option input[type="checkbox"]');
    checkboxes.forEach(cb => {
        if (cb.dataset.filter !== 'availability') {
            cb.checked = false;
        }
    });

    const minPrice = document.getElementById('minPrice');
    const maxPrice = document.getElementById('maxPrice');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';

    applyFilters();
}

/**
 * Wishlist functionality
 */
function initializeWishlist() {
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');

    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            btn.classList.toggle('active');

            if (btn.classList.contains('active')) {
                btn.innerHTML = '&#10084;'; // Filled heart
            } else {
                btn.innerHTML = '&#9829;'; // Empty heart
            }
        });
    });
}

/**
 * Smooth scroll for anchor links
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/**
 * Active navigation link based on current page
 */
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}
setActiveNavLink();

/**
 * Performance: Pause animations when tab is hidden
 */
document.addEventListener('visibilitychange', () => {
    const particles = document.querySelector('.particles');
    if (particles) {
        if (document.hidden) {
            particles.style.animationPlayState = 'paused';
        } else {
            particles.style.animationPlayState = 'running';
        }
    }
});

// Make clearFilters available globally for the button onclick
window.clearFilters = clearFilters;
