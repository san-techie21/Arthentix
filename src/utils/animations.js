/**
 * Arthentix Premium Animations
 * GSAP ScrollSmoother + Custom Interactions
 * Award-winning smooth scroll experience
 */

(function() {
    'use strict';

    // ============================================
    // CONFIGURATION
    // ============================================

    const CONFIG = {
        smoothScroll: {
            enabled: true,
            smooth: 1.2,
            effects: true,
            smoothTouch: 0.1
        },
        parallax: {
            enabled: true,
            defaultSpeed: 0.5
        },
        reveal: {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        },
        magneticButtons: {
            enabled: true,
            strength: 0.3
        }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // ============================================
    // GSAP INITIALIZATION (CDN-based)
    // ============================================

    function initGSAP() {
        // Check if GSAP is available (loaded via CDN)
        if (typeof gsap === 'undefined') {
            console.log('GSAP not loaded - using CSS fallbacks');
            return false;
        }

        // Register plugins if available
        if (typeof ScrollTrigger !== 'undefined') {
            gsap.registerPlugin(ScrollTrigger);
        }

        if (typeof ScrollSmoother !== 'undefined' && CONFIG.smoothScroll.enabled && !prefersReducedMotion) {
            gsap.registerPlugin(ScrollSmoother);

            // Create smooth scroller if wrapper exists
            const wrapper = document.getElementById('smooth-wrapper');
            const content = document.getElementById('smooth-content');

            if (wrapper && content) {
                ScrollSmoother.create({
                    wrapper: wrapper,
                    content: content,
                    smooth: CONFIG.smoothScroll.smooth,
                    effects: CONFIG.smoothScroll.effects,
                    smoothTouch: CONFIG.smoothScroll.smoothTouch
                });
            }
        }

        return true;
    }

    // ============================================
    // INTERSECTION OBSERVER REVEAL
    // ============================================

    function initRevealAnimations() {
        if (prefersReducedMotion) {
            // Show all elements immediately if reduced motion is preferred
            document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => {
                el.classList.add('active');
            });
            return;
        }

        const observerOptions = {
            threshold: CONFIG.reveal.threshold,
            rootMargin: CONFIG.reveal.rootMargin
        };

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    // Optionally unobserve after revealing
                    // revealObserver.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all reveal elements
        document.querySelectorAll('.reveal, .reveal-stagger, .img-reveal').forEach(el => {
            revealObserver.observe(el);
        });
    }

    // ============================================
    // MAGNETIC BUTTON EFFECT
    // ============================================

    function initMagneticButtons() {
        if (prefersReducedMotion || !CONFIG.magneticButtons.enabled) return;

        const magneticElements = document.querySelectorAll('.btn-magnetic, .magnetic');

        magneticElements.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;

                btn.style.transform = `translate(${x * CONFIG.magneticButtons.strength}px, ${y * CONFIG.magneticButtons.strength}px)`;
            });

            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }

    // ============================================
    // 3D TILT EFFECT FOR CARDS
    // ============================================

    function initTiltEffect() {
        if (prefersReducedMotion) return;

        const tiltElements = document.querySelectorAll('.tilt-card, .art-card[data-tilt]');

        tiltElements.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
            });
        });
    }

    // ============================================
    // PARALLAX SCROLLING (CSS-based fallback)
    // ============================================

    function initParallax() {
        if (prefersReducedMotion || !CONFIG.parallax.enabled) return;

        const parallaxElements = document.querySelectorAll('[data-parallax]');

        if (parallaxElements.length === 0) return;

        let ticking = false;

        function updateParallax() {
            const scrollY = window.pageYOffset;

            parallaxElements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || CONFIG.parallax.defaultSpeed;
                const yPos = -(scrollY * speed);
                el.style.transform = `translate3d(0, ${yPos}px, 0)`;
            });

            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // STAGGERED GRID ANIMATION
    // ============================================

    function initStaggeredGrid() {
        if (prefersReducedMotion) return;

        const grids = document.querySelectorAll('.art-grid, .gallery-grid, .stagger-grid');

        grids.forEach(grid => {
            const items = grid.children;
            Array.from(items).forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
            });
        });
    }

    // ============================================
    // ADD TO CART ANIMATION
    // ============================================

    function initAddToCartAnimation() {
        document.addEventListener('click', (e) => {
            const addToCartBtn = e.target.closest('.add-to-cart, [data-add-cart]');
            if (!addToCartBtn) return;

            // Create particle burst effect
            if (!prefersReducedMotion) {
                createParticleBurst(e.clientX, e.clientY);
            }

            // Add success state
            addToCartBtn.classList.add('added');
            setTimeout(() => {
                addToCartBtn.classList.remove('added');
            }, 2000);
        });
    }

    function createParticleBurst(x, y) {
        const colors = ['#D4AF37', '#C9A962', '#f0c674', '#ffffff'];
        const particleCount = 12;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'cart-particle';
            particle.style.cssText = `
                position: fixed;
                left: ${x}px;
                top: ${y}px;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
            `;

            document.body.appendChild(particle);

            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            const endX = x + Math.cos(angle) * velocity;
            const endY = y + Math.sin(angle) * velocity;

            particle.animate([
                {
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - x}px, ${endY - y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 600,
                easing: 'cubic-bezier(0.16, 1, 0.3, 1)'
            }).onfinish = () => particle.remove();
        }
    }

    // ============================================
    // SMOOTH SCROLL TO ANCHORS
    // ============================================

    function initSmoothScrollAnchors() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function(e) {
                const targetId = this.getAttribute('href');
                if (targetId === '#') return;

                const target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();

                    const offset = 80; // Account for fixed header
                    const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: prefersReducedMotion ? 'auto' : 'smooth'
                    });
                }
            });
        });
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================

    function initCounterAnimation() {
        const counters = document.querySelectorAll('[data-counter]');

        if (counters.length === 0) return;

        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });

        counters.forEach(counter => counterObserver.observe(counter));
    }

    function animateCounter(element) {
        const target = parseInt(element.dataset.counter, 10);
        const duration = parseInt(element.dataset.duration, 10) || 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Easing function (ease-out-expo)
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeProgress);

            element.textContent = current.toLocaleString();

            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target.toLocaleString();
            }
        }

        if (prefersReducedMotion) {
            element.textContent = target.toLocaleString();
        } else {
            requestAnimationFrame(updateCounter);
        }
    }

    // ============================================
    // IMAGE LAZY LOADING WITH FADE
    // ============================================

    function initLazyImages() {
        const lazyImages = document.querySelectorAll('img[data-src], img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            }, { rootMargin: '50px' });

            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }

    // ============================================
    // NAVBAR SCROLL EFFECTS
    // ============================================

    function initNavbarEffects() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;

        let lastScroll = 0;
        let ticking = false;

        function updateNavbar() {
            const currentScroll = window.pageYOffset;

            // Add/remove scrolled class
            if (currentScroll > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }

            // Hide/show on scroll direction
            if (currentScroll > lastScroll && currentScroll > 200) {
                navbar.classList.add('nav-hidden');
            } else {
                navbar.classList.remove('nav-hidden');
            }

            lastScroll = currentScroll;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(updateNavbar);
                ticking = true;
            }
        }, { passive: true });
    }

    // ============================================
    // THEME TRANSITION
    // ============================================

    function initThemeTransition() {
        const themeToggle = document.querySelector('.theme-toggle, [data-theme-toggle]');
        if (!themeToggle) return;

        themeToggle.addEventListener('click', () => {
            // Add transition class for smooth theme change
            document.body.classList.add('theme-transitioning');

            // Remove after transition completes
            setTimeout(() => {
                document.body.classList.remove('theme-transitioning');
            }, 300);
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    function init() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initAll);
        } else {
            initAll();
        }
    }

    function initAll() {
        // Core animations
        initGSAP();
        initRevealAnimations();
        initSmoothScrollAnchors();
        initNavbarEffects();

        // Interactive effects
        initMagneticButtons();
        initTiltEffect();
        initParallax();
        initStaggeredGrid();

        // Utility animations
        initAddToCartAnimation();
        initCounterAnimation();
        initLazyImages();
        initThemeTransition();

        console.log('Arthentix animations initialized');
    }

    // Export for external use
    window.ArthentixAnimations = {
        init,
        initRevealAnimations,
        initMagneticButtons,
        initTiltEffect,
        createParticleBurst,
        CONFIG
    };

    // Auto-initialize
    init();

})();
