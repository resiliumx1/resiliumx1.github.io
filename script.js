// Hero Carousel Animation Script
document.addEventListener('DOMContentLoaded', () => {
    initializeAnimations();
    initializeParallax();
    initializeIdeasCarousel();
    initializeProcessingEffects();
});

// Initialize all animations
function initializeAnimations() {
    // Add entrance animations with stagger
    const heroContent = document.querySelector('.hero-content');
    const pipelineElements = document.querySelectorAll('.idea-bubble, .tech-icon, .phone');

    // Fade in hero content
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';

    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 100);

    // Stagger animation for pipeline elements
    pipelineElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transition = 'opacity 0.5s ease';

        setTimeout(() => {
            el.style.opacity = '1';
        }, 500 + (index * 100));
    });
}

// Parallax effect on mouse move
function initializeParallax() {
    const hero = document.querySelector('.hero');
    const pipelineContainer = document.querySelector('.pipeline-container');

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Subtle parallax for the pipeline
        pipelineContainer.style.transform = `
            translateX(${x * 10}px)
            translateY(${y * 10}px)
        `;

        // Move particles based on mouse
        document.querySelectorAll('.particle').forEach((particle, index) => {
            const speed = (index + 1) * 0.5;
            particle.style.transform = `
                translateX(${x * 20 * speed}px)
                translateY(${y * 20 * speed}px)
            `;
        });
    });

    hero.addEventListener('mouseleave', () => {
        pipelineContainer.style.transform = '';
        document.querySelectorAll('.particle').forEach(particle => {
            particle.style.transform = '';
        });
    });
}

// Continuous ideas carousel - spawning new ideas
function initializeIdeasCarousel() {
    const ideaTypes = [
        { text: 'AI App', size: 'normal' },
        { text: 'SaaS', size: 'small' },
        { text: 'MVP', size: 'tiny' },
        { text: 'E-Commerce', size: 'normal' },
        { text: 'FinTech', size: 'small' },
        { text: 'HealthTech', size: 'tiny' },
        { text: 'EdTech', size: 'normal' },
        { text: 'IoT App', size: 'small' }
    ];

    const ideasInput = document.querySelector('.ideas-input');
    let ideaIndex = 0;

    // Function to create a floating idea
    function createFloatingIdea() {
        const idea = ideaTypes[ideaIndex % ideaTypes.length];
        ideaIndex++;

        const ideaBubble = document.createElement('div');
        ideaBubble.className = 'idea-bubble floating-idea';
        ideaBubble.innerHTML = `
            <div class="user-icon ${idea.size === 'normal' ? '' : idea.size}">
                <svg viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="8" r="4"/>
                    <path d="M12 14c-6 0-8 3-8 6v2h16v-2c0-3-2-6-8-6z"/>
                </svg>
            </div>
            <div class="thought-cloud ${idea.size === 'normal' ? '' : idea.size}">
                <span>${idea.text}</span>
            </div>
        `;

        // Random vertical position
        const topPosition = 20 + Math.random() * 180;
        ideaBubble.style.top = `${topPosition}px`;
        ideaBubble.style.left = '-100px';
        ideaBubble.style.opacity = '0';
        ideaBubble.style.position = 'absolute';

        ideasInput.appendChild(ideaBubble);

        // Animate in
        requestAnimationFrame(() => {
            ideaBubble.style.transition = 'all 3s ease-in-out';
            ideaBubble.style.left = `${20 + Math.random() * 60}px`;
            ideaBubble.style.opacity = '1';
        });

        // Remove after animation
        setTimeout(() => {
            ideaBubble.style.opacity = '0';
            ideaBubble.style.transform = 'translateX(100px)';

            setTimeout(() => {
                ideaBubble.remove();
            }, 1000);
        }, 4000);
    }

    // Spawn new ideas periodically
    setInterval(createFloatingIdea, 2500);
}

// Processing box effects
function initializeProcessingEffects() {
    const processingBox = document.querySelector('.processing-box');
    const glow = document.querySelector('.processing-glow');

    // Add random spark effects
    function createSpark() {
        const spark = document.createElement('div');
        spark.className = 'spark';
        spark.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #6366f1;
            border-radius: 50%;
            pointer-events: none;
            left: ${50 + (Math.random() - 0.5) * 100}%;
            top: ${50 + (Math.random() - 0.5) * 100}%;
            opacity: 1;
            transition: all 0.8s ease-out;
            box-shadow: 0 0 10px #6366f1, 0 0 20px #6366f1;
        `;

        processingBox.appendChild(spark);

        requestAnimationFrame(() => {
            spark.style.transform = `
                translate(${(Math.random() - 0.5) * 100}px, ${(Math.random() - 0.5) * 100}px)
                scale(0)
            `;
            spark.style.opacity = '0';
        });

        setTimeout(() => spark.remove(), 800);
    }

    // Create sparks periodically
    setInterval(createSpark, 300);

    // Pulse effect on processing
    let pulseIntensity = 1;
    setInterval(() => {
        pulseIntensity = 0.8 + Math.random() * 0.4;
        glow.style.opacity = pulseIntensity * 0.5;
    }, 500);
}

// Add dynamic phone content updates
function initializePhoneCarousel() {
    const phones = document.querySelectorAll('.phone');
    const appTypes = [
        { headerClass: '', cardClass: 'green', stats: 'TLT 10,234' },
        { headerClass: 'dark', cardClass: 'blue', stats: '$5,421' },
        { headerClass: 'orange', cardClass: 'yellow', stats: '1.2K Users' }
    ];

    // Rotate phone content periodically
    let contentIndex = 0;
    setInterval(() => {
        contentIndex = (contentIndex + 1) % appTypes.length;

        phones.forEach((phone, index) => {
            const type = appTypes[(contentIndex + index) % appTypes.length];
            const header = phone.querySelector('.app-header');
            const stats = phone.querySelector('.app-stats');

            if (header) {
                header.className = `app-header ${type.headerClass}`;
            }
            if (stats) {
                stats.textContent = type.stats;
            }
        });
    }, 5000);
}

// Intersection Observer for scroll animations
function initializeScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.hero-content, .pipeline-container').forEach(el => {
        observer.observe(el);
    });
}

// Button hover effects
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        this.style.setProperty('--x', `${x}px`);
        this.style.setProperty('--y', `${y}px`);
    });
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Performance optimization - pause animations when not visible
document.addEventListener('visibilitychange', () => {
    const hero = document.querySelector('.hero');
    if (document.hidden) {
        hero.style.animationPlayState = 'paused';
    } else {
        hero.style.animationPlayState = 'running';
    }
});

// Export for potential module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeAnimations,
        initializeParallax,
        initializeIdeasCarousel,
        initializeProcessingEffects
    };
}
