/**
 * Arthentix - Award-Winning Effects JavaScript
 * Handles custom cursor, scroll animations, magnetic buttons, and micro-interactions
 * Inspired by Awwwards SOTD winners and GSAP-style animations
 */

(function() {
    'use strict';

    // ============================================
    // CUSTOM CURSOR
    // ============================================

    class CustomCursor {
        constructor() {
            this.cursor = null;
            this.cursorDot = null;
            this.cursorRing = null;
            this.mouseX = 0;
            this.mouseY = 0;
            this.cursorX = 0;
            this.cursorY = 0;
            this.ringX = 0;
            this.ringY = 0;
            this.isHovering = false;
            this.isTextHover = false;

            // Check if touch device
            if (this.isTouchDevice()) return;

            this.init();
        }

        isTouchDevice() {
            return ('ontouchstart' in window) ||
                   (navigator.maxTouchPoints > 0) ||
                   (navigator.msMaxTouchPoints > 0);
        }

        init() {
            // Create cursor elements
            this.cursor = document.createElement('div');
            this.cursor.className = 'custom-cursor';

            this.cursorDot = document.createElement('div');
            this.cursorDot.className = 'cursor-dot';

            this.cursorRing = document.createElement('div');
            this.cursorRing.className = 'cursor-ring';

            this.cursor.appendChild(this.cursorDot);
            this.cursor.appendChild(this.cursorRing);
            document.body.appendChild(this.cursor);

            // Hide default cursor
            document.body.style.cursor = 'none';

            // Event listeners
            document.addEventListener('mousemove', this.onMouseMove.bind(this));
            document.addEventListener('mousedown', this.onMouseDown.bind(this));
            document.addEventListener('mouseup', this.onMouseUp.bind(this));

            // Hover listeners
            this.addHoverListeners();

            // Animation loop
            this.animate();
        }

        onMouseMove(e) {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        }

        onMouseDown() {
            this.cursor.classList.add('cursor-active');
        }

        onMouseUp() {
            this.cursor.classList.remove('cursor-active');
        }

        addHoverListeners() {
            // Interactive elements
            const interactiveElements = document.querySelectorAll(
                'a, button, .btn, .artwork-card, .artist-card, .category-card, [data-cursor="pointer"]'
            );

            interactiveElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('cursor-hover');
                    el.style.cursor = 'none';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('cursor-hover');
                });
            });

            // Text elements for expand effect
            const textElements = document.querySelectorAll(
                'h1, h2, h3, .hero-text, [data-cursor="text"]'
            );

            textElements.forEach(el => {
                el.addEventListener('mouseenter', () => {
                    this.cursor.classList.add('cursor-text');
                    el.style.cursor = 'none';
                });
                el.addEventListener('mouseleave', () => {
                    this.cursor.classList.remove('cursor-text');
                });
            });
        }

        animate() {
            // Smooth cursor following with easing
            const ease = 0.15;
            const ringEase = 0.08;

            this.cursorX += (this.mouseX - this.cursorX) * ease;
            this.cursorY += (this.mouseY - this.cursorY) * ease;

            this.ringX += (this.mouseX - this.ringX) * ringEase;
            this.ringY += (this.mouseY - this.ringY) * ringEase;

            this.cursorDot.style.transform = `translate(${this.cursorX}px, ${this.cursorY}px) translate(-50%, -50%)`;
            this.cursorRing.style.transform = `translate(${this.ringX}px, ${this.ringY}px) translate(-50%, -50%)`;

            requestAnimationFrame(this.animate.bind(this));
        }
    }

    // ============================================
    // SCROLL REVEAL ANIMATIONS
    // ============================================

    class ScrollReveal {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            // Select all elements with scroll reveal classes
            this.elements = document.querySelectorAll(
                '.scroll-reveal, .scroll-reveal-left, .scroll-reveal-right, .scroll-reveal-scale, .reveal'
            );

            // Create IntersectionObserver
            const options = {
                root: null,
                rootMargin: '0px 0px -100px 0px',
                threshold: 0.1
            };

            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);

            this.elements.forEach(el => {
                this.observer.observe(el);
            });
        }

        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view', 'active');
                    // Optionally unobserve after animation
                    // this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ============================================
    // MAGNETIC BUTTONS
    // ============================================

    class MagneticButton {
        constructor(element) {
            this.element = element;
            this.boundingRect = null;
            this.centerX = 0;
            this.centerY = 0;
            this.strength = 0.3;

            this.init();
        }

        init() {
            this.element.addEventListener('mouseenter', this.onEnter.bind(this));
            this.element.addEventListener('mousemove', this.onMove.bind(this));
            this.element.addEventListener('mouseleave', this.onLeave.bind(this));
        }

        onEnter() {
            this.boundingRect = this.element.getBoundingClientRect();
            this.centerX = this.boundingRect.left + this.boundingRect.width / 2;
            this.centerY = this.boundingRect.top + this.boundingRect.height / 2;
        }

        onMove(e) {
            const distX = e.clientX - this.centerX;
            const distY = e.clientY - this.centerY;

            this.element.style.transform = `translate(${distX * this.strength}px, ${distY * this.strength}px)`;

            const textElement = this.element.querySelector('.btn-text');
            if (textElement) {
                textElement.style.transform = `translate(${distX * this.strength * 0.5}px, ${distY * this.strength * 0.5}px)`;
            }
        }

        onLeave() {
            this.element.style.transform = 'translate(0, 0)';

            const textElement = this.element.querySelector('.btn-text');
            if (textElement) {
                textElement.style.transform = 'translate(0, 0)';
            }
        }
    }

    // ============================================
    // TEXT SPLIT ANIMATION
    // ============================================

    class TextSplit {
        constructor(element) {
            this.element = element;
            this.originalText = element.textContent;
            this.init();
        }

        init() {
            const words = this.originalText.split(' ');
            this.element.innerHTML = '';

            words.forEach((word, wordIndex) => {
                const wordSpan = document.createElement('span');
                wordSpan.className = 'word';

                word.split('').forEach((char, charIndex) => {
                    const charSpan = document.createElement('span');
                    charSpan.className = 'char';
                    charSpan.textContent = char;
                    charSpan.style.transitionDelay = `${(wordIndex * 0.1) + (charIndex * 0.02)}s`;
                    wordSpan.appendChild(charSpan);
                });

                this.element.appendChild(wordSpan);

                // Add space between words
                if (wordIndex < words.length - 1) {
                    const space = document.createTextNode(' ');
                    this.element.appendChild(space);
                }
            });
        }
    }

    // ============================================
    // SCROLL PROGRESS BAR
    // ============================================

    class ScrollProgress {
        constructor() {
            this.progressBar = null;
            this.init();
        }

        init() {
            // Create progress bar
            this.progressBar = document.createElement('div');
            this.progressBar.className = 'scroll-progress-bar';
            document.body.appendChild(this.progressBar);

            // Update on scroll
            window.addEventListener('scroll', this.updateProgress.bind(this), { passive: true });
        }

        updateProgress() {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;

            this.progressBar.style.width = `${progress}%`;
        }
    }

    // ============================================
    // SMOOTH PARALLAX
    // ============================================

    class SmoothParallax {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            this.elements = document.querySelectorAll('[data-parallax]');

            if (this.elements.length === 0) return;

            window.addEventListener('scroll', this.handleScroll.bind(this), { passive: true });
        }

        handleScroll() {
            const scrollTop = window.scrollY;

            this.elements.forEach(el => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const inView = rect.top < window.innerHeight && rect.bottom > 0;

                if (inView) {
                    const yPos = -(scrollTop - el.offsetTop) * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        }
    }

    // ============================================
    // IMAGE REVEAL ON SCROLL
    // ============================================

    class ImageReveal {
        constructor() {
            this.elements = [];
            this.init();
        }

        init() {
            this.elements = document.querySelectorAll('.image-reveal');

            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.3
            };

            this.observer = new IntersectionObserver(this.handleIntersect.bind(this), options);

            this.elements.forEach(el => {
                this.observer.observe(el);
            });
        }

        handleIntersect(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    this.observer.unobserve(entry.target);
                }
            });
        }
    }

    // ============================================
    // RIPPLE EFFECT
    // ============================================

    class RippleEffect {
        constructor() {
            this.init();
        }

        init() {
            const buttons = document.querySelectorAll('.ripple-effect, .btn');

            buttons.forEach(button => {
                button.addEventListener('click', this.createRipple.bind(this));
            });
        }

        createRipple(e) {
            const button = e.currentTarget;
            const rect = button.getBoundingClientRect();

            const ripple = document.createElement('span');
            ripple.className = 'ripple';

            const size = Math.max(rect.width, rect.height);
            ripple.style.width = ripple.style.height = `${size}px`;

            ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
            ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

            button.appendChild(ripple);

            ripple.addEventListener('animationend', () => {
                ripple.remove();
            });
        }
    }

    // ============================================
    // COUNTER ANIMATION
    // ============================================

    class CounterAnimation {
        constructor() {
            this.init();
        }

        init() {
            const counters = document.querySelectorAll('[data-count]');

            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 0.5
            };

            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.animateCounter(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, options);

            counters.forEach(counter => {
                observer.observe(counter);
            });
        }

        animateCounter(element) {
            const target = parseInt(element.dataset.count);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    element.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    element.textContent = target.toLocaleString();
                }
            };

            updateCounter();
        }
    }

    // ============================================
    // NAVBAR SCROLL BEHAVIOR
    // ============================================

    class NavbarScroll {
        constructor() {
            this.navbar = document.querySelector('.navbar');
            this.lastScrollY = 0;
            this.ticking = false;

            if (!this.navbar) return;

            this.init();
        }

        init() {
            window.addEventListener('scroll', this.onScroll.bind(this), { passive: true });
        }

        onScroll() {
            if (!this.ticking) {
                requestAnimationFrame(this.update.bind(this));
                this.ticking = true;
            }
        }

        update() {
            const scrollY = window.scrollY;

            // Add glass effect when scrolled
            if (scrollY > 50) {
                this.navbar.classList.add('glass-nav', 'scrolled');
            } else {
                this.navbar.classList.remove('glass-nav', 'scrolled');
            }

            // Hide/show on scroll direction
            if (scrollY > this.lastScrollY && scrollY > 200) {
                this.navbar.classList.add('nav-hidden');
            } else {
                this.navbar.classList.remove('nav-hidden');
            }

            this.lastScrollY = scrollY;
            this.ticking = false;
        }
    }

    // ============================================
    // PAGE TRANSITIONS
    // ============================================

    class PageTransitions {
        constructor() {
            this.overlay = null;
            this.init();
        }

        init() {
            // Create transition overlay
            this.overlay = document.createElement('div');
            this.overlay.className = 'page-transition-overlay';

            for (let i = 0; i < 4; i++) {
                const panel = document.createElement('div');
                panel.className = 'transition-panel';
                this.overlay.appendChild(panel);
            }

            document.body.appendChild(this.overlay);

            // Add transition to internal links
            const links = document.querySelectorAll('a[href]:not([href^="#"]):not([href^="mailto"]):not([href^="tel"]):not([target="_blank"])');

            links.forEach(link => {
                // Only add to internal links
                if (link.hostname === window.location.hostname) {
                    link.addEventListener('click', this.handleLinkClick.bind(this));
                }
            });

            // Animate in on page load
            window.addEventListener('load', () => {
                this.overlay.classList.add('leaving');
                setTimeout(() => {
                    this.overlay.classList.remove('leaving');
                }, 800);
            });
        }

        handleLinkClick(e) {
            const link = e.currentTarget;
            const href = link.getAttribute('href');

            // Skip if modifier key pressed
            if (e.metaKey || e.ctrlKey || e.shiftKey) return;

            e.preventDefault();

            this.overlay.classList.add('entering');

            setTimeout(() => {
                window.location.href = href;
            }, 600);
        }
    }

    // ============================================
    // TILT EFFECT FOR CARDS
    // ============================================

    class TiltEffect {
        constructor(element) {
            this.element = element;
            this.boundingRect = null;
            this.tiltStrength = 10;

            this.init();
        }

        init() {
            this.element.addEventListener('mouseenter', this.onEnter.bind(this));
            this.element.addEventListener('mousemove', this.onMove.bind(this));
            this.element.addEventListener('mouseleave', this.onLeave.bind(this));
        }

        onEnter() {
            this.boundingRect = this.element.getBoundingClientRect();
            this.element.style.transition = 'transform 0.1s ease-out';
        }

        onMove(e) {
            const x = e.clientX - this.boundingRect.left;
            const y = e.clientY - this.boundingRect.top;

            const centerX = this.boundingRect.width / 2;
            const centerY = this.boundingRect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -this.tiltStrength;
            const rotateY = ((x - centerX) / centerX) * this.tiltStrength;

            this.element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        }

        onLeave() {
            this.element.style.transition = 'transform 0.4s ease-out';
            this.element.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        }
    }

    // ============================================
    // INITIALIZE ALL EFFECTS
    // ============================================

    function init() {
        // Custom cursor (desktop only)
        if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
            new CustomCursor();
        }

        // Scroll reveal animations
        new ScrollReveal();

        // Scroll progress bar
        new ScrollProgress();

        // Navbar scroll behavior
        new NavbarScroll();

        // Image reveal
        new ImageReveal();

        // Ripple effects
        new RippleEffect();

        // Counter animations
        new CounterAnimation();

        // Parallax effects
        new SmoothParallax();

        // Page transitions
        new PageTransitions();

        // Magnetic buttons
        document.querySelectorAll('.btn-magnetic').forEach(btn => {
            new MagneticButton(btn);
        });

        // Tilt effects for cards
        document.querySelectorAll('[data-tilt], .artwork-card, .artist-card').forEach(card => {
            new TiltEffect(card);
        });

        // Text split animations
        document.querySelectorAll('.text-reveal-stagger').forEach(el => {
            new TextSplit(el);
        });

        // Add aurora background
        if (!document.querySelector('.aurora-bg')) {
            const auroraBg = document.createElement('div');
            auroraBg.className = 'aurora-bg';
            document.body.insertBefore(auroraBg, document.body.firstChild);
        }

        // Add floating shapes
        if (!document.querySelector('.floating-shapes')) {
            const floatingShapes = document.createElement('div');
            floatingShapes.className = 'floating-shapes';
            floatingShapes.innerHTML = `
                <div class="floating-shape shape-gold"></div>
                <div class="floating-shape shape-purple"></div>
                <div class="floating-shape shape-coral"></div>
            `;
            document.body.insertBefore(floatingShapes, document.body.firstChild);
        }
    }

    // Run on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export for use in other scripts
    window.AwwwardsEffects = {
        CustomCursor,
        ScrollReveal,
        MagneticButton,
        TextSplit,
        ScrollProgress,
        SmoothParallax,
        ImageReveal,
        RippleEffect,
        CounterAnimation,
        NavbarScroll,
        PageTransitions,
        TiltEffect
    };

})();
