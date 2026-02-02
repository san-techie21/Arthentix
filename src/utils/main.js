/**
 * Arthentix - Main JavaScript
 * Buttery Smooth Interactions & Animations
 * Award-Winning UI Experience
 */

// ============================================
// THEME SYSTEM - LIGHT/DARK MODE
// ============================================
const ThemeManager = {
    init() {
        // Check for saved preference
        const savedTheme = localStorage.getItem('arthentix_theme');

        // Get page's default theme from body class
        const pageDefaultTheme = document.body.classList.contains('theme-light') ? 'light' :
                                 document.body.classList.contains('theme-dark') ? 'dark' : null;

        // System preference as fallback
        const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

        // Priority: saved > page default > system preference
        const initialTheme = savedTheme || pageDefaultTheme || (systemPrefersDark ? 'dark' : 'light');
        this.setTheme(initialTheme);

        // Create theme toggle button if it doesn't exist
        this.createToggleButton();

        // Listen for system theme changes (only if no saved preference)
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('arthentix_theme')) {
                this.setTheme(e.matches ? 'dark' : 'light');
            }
        });
    },

    setTheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        document.body.classList.remove('theme-light', 'theme-dark');
        document.body.classList.add(`theme-${theme}`);

        // Store theme preference
        localStorage.setItem('arthentix_theme', theme);
        this.updateToggleButton(theme);

        // Update background visibility based on theme
        const bgGradient = document.querySelector('.bg-gradient');
        const noiseOverlay = document.querySelector('.noise-overlay');
        const floatShapes = document.querySelectorAll('.float-shape');
        const bgSubtle = document.querySelector('.bg-subtle');

        if (theme === 'dark') {
            // Show dark backgrounds, hide light background
            if (bgGradient) bgGradient.style.opacity = '1';
            if (noiseOverlay) noiseOverlay.style.opacity = '0.5';
            floatShapes.forEach(shape => shape.style.opacity = '1');
            if (bgSubtle) bgSubtle.style.opacity = '0';

            // Update body background
            document.body.style.backgroundColor = '#0a0a0a';
            document.body.style.color = '#ffffff';
        } else {
            // Hide dark backgrounds, show light background
            if (bgGradient) bgGradient.style.opacity = '0';
            if (noiseOverlay) noiseOverlay.style.opacity = '0';
            floatShapes.forEach(shape => shape.style.opacity = '0');
            if (bgSubtle) bgSubtle.style.opacity = '1';

            // Update body background
            document.body.style.backgroundColor = '#FDFBF7';
            document.body.style.color = '#1A1A1A';
        }
    },

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        this.setTheme(newTheme);

        // Smooth transition effect
        document.body.style.transition = 'background-color 0.5s ease, color 0.5s ease';
        setTimeout(() => {
            document.body.style.transition = '';
        }, 500);
    },

    createToggleButton() {
        // Check if toggle already exists
        if (document.querySelector('.theme-toggle')) return;

        const toggle = document.createElement('button');
        toggle.className = 'theme-toggle';
        toggle.setAttribute('aria-label', 'Toggle theme');
        toggle.innerHTML = `
            <span class="theme-toggle-icon sun"><i class="fas fa-sun"></i></span>
            <span class="theme-toggle-icon moon"><i class="fas fa-moon"></i></span>
        `;

        toggle.addEventListener('click', () => this.toggleTheme());

        // Add styles for toggle button
        if (!document.querySelector('#theme-toggle-styles')) {
            const styles = document.createElement('style');
            styles.id = 'theme-toggle-styles';
            styles.textContent = `
                .theme-toggle {
                    position: fixed;
                    bottom: 30px;
                    left: 30px;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    border: none;
                    cursor: pointer;
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                    overflow: hidden;
                }

                .theme-light .theme-toggle {
                    background: var(--color-charcoal, #1A1A1A);
                    color: white;
                }

                .theme-dark .theme-toggle {
                    background: var(--color-gold, #D4AF37);
                    color: #000;
                }

                .theme-toggle:hover {
                    transform: scale(1.1) rotate(15deg);
                    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
                }

                .theme-toggle:active {
                    transform: scale(0.95);
                }

                .theme-toggle-icon {
                    position: absolute;
                    transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
                    font-size: 1.25rem;
                }

                .theme-light .theme-toggle-icon.sun {
                    opacity: 0;
                    transform: rotate(-90deg) scale(0);
                }

                .theme-light .theme-toggle-icon.moon {
                    opacity: 1;
                    transform: rotate(0) scale(1);
                }

                .theme-dark .theme-toggle-icon.sun {
                    opacity: 1;
                    transform: rotate(0) scale(1);
                }

                .theme-dark .theme-toggle-icon.moon {
                    opacity: 0;
                    transform: rotate(90deg) scale(0);
                }

                /* Theme transition styles */
                [data-theme="dark"] {
                    --bg-primary: #0a0a0a;
                    --bg-secondary: #111111;
                    --bg-card: rgba(255, 255, 255, 0.02);
                    --text-primary: #ffffff;
                    --text-secondary: rgba(255, 255, 255, 0.6);
                    --border-color: rgba(255, 255, 255, 0.06);
                }

                [data-theme="light"] {
                    --bg-primary: #FDFBF7;
                    --bg-secondary: #F8F5F0;
                    --bg-card: #ffffff;
                    --text-primary: #1A1A1A;
                    --text-secondary: #6B6B6B;
                    --border-color: rgba(0, 0, 0, 0.06);
                }

                @media (max-width: 768px) {
                    .theme-toggle {
                        bottom: 20px;
                        left: 20px;
                        width: 44px;
                        height: 44px;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(toggle);
    },

    updateToggleButton(theme) {
        const toggle = document.querySelector('.theme-toggle');
        if (toggle) {
            toggle.setAttribute('data-theme', theme);
        }
    }
};

// Initialize theme on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
});

// ============================================
// ENHANCED SCROLL ANIMATIONS
// ============================================
const SmoothScroller = {
    current: 0,
    target: 0,
    ease: 0.075,
    rafId: null,

    init() {
        // Only enable on desktop
        if (window.innerWidth > 1024 && !('ontouchstart' in window)) {
            this.setupSmoothScroll();
        }
    },

    setupSmoothScroll() {
        // Smooth scroll is opt-in via data attribute
        const smoothContainer = document.querySelector('[data-smooth-scroll]');
        if (!smoothContainer) return;

        this.update();
    },

    update() {
        this.target = window.scrollY;
        this.current += (this.target - this.current) * this.ease;

        // Only update if difference is significant
        if (Math.abs(this.target - this.current) > 0.5) {
            this.rafId = requestAnimationFrame(() => this.update());
        }
    }
};

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');

function handleScroll() {
    // Guard clause: exit early if navbar doesn't exist
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Only attach listener if navbar exists
if (navbar) {
    window.addEventListener('scroll', handleScroll, { passive: true });
}

// ============================================
// SCROLL REVEAL ANIMATIONS
// ============================================
function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal');

    reveals.forEach((element, index) => {
        const windowHeight = window.innerHeight;
        const elementTop = element.getBoundingClientRect().top;
        const revealPoint = 100;

        if (elementTop < windowHeight - revealPoint) {
            // Add staggered delay based on index within parent
            setTimeout(() => {
                element.classList.add('active');
            }, index * 100);
        }
    });
}

window.addEventListener('scroll', revealOnScroll, { passive: true });
window.addEventListener('load', revealOnScroll);

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
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

// ============================================
// MOBILE MENU TOGGLE
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
// Support both .nav-links and .nav-center class names for navigation
const navLinks = document.querySelector('.nav-links') || document.querySelector('.nav-center');

// Only initialize if both elements exist
if (mobileMenuBtn && navLinks) {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        const icon = mobileMenuBtn.querySelector('i');
        if (icon) {
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        }
    });
}

// ============================================
// CERTIFICATE CARD TILT EFFECT
// ============================================
const certificateCard = document.querySelector('.certificate-card');

if (certificateCard) {
    certificateCard.addEventListener('mousemove', (e) => {
        const rect = certificateCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        certificateCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    certificateCard.addEventListener('mouseleave', () => {
        certificateCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
}

// ============================================
// TYPING EFFECT FOR HERO TITLE
// ============================================
function typeWriter(element, text, speed = 50) {
    let i = 0;
    element.innerHTML = '';

    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================
// INTERSECTION OBSERVER FOR STATS COUNTER
// ============================================
function animateValue(element, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);

        let current = Math.floor(easeOutQuart * (end - start) + start);

        // Format number with commas
        if (end >= 1000) {
            current = current.toLocaleString();
        }

        // Add suffix
        const suffix = element.dataset.suffix || '';
        element.textContent = current + suffix;

        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach(stat => {
                const text = stat.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                const suffix = text.includes('+') ? '+' : (text.includes('%') ? '%' : '');
                stat.dataset.suffix = suffix;
                animateValue(stat, 0, number, 2000);
            });
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// ============================================
// BUTTON RIPPLE EFFECT
// ============================================
document.querySelectorAll('.btn, .pricing-btn').forEach(button => {
    button.addEventListener('click', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            pointer-events: none;
            width: 100px;
            height: 100px;
            left: ${x - 50}px;
            top: ${y - 50}px;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);

        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation to stylesheet
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ============================================
// PARALLAX EFFECT FOR FLOATING SHAPES
// ============================================
const floatingElements = document.querySelectorAll('.float-shape');

window.addEventListener('mousemove', (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    floatingElements.forEach((el, index) => {
        const speed = (index + 1) * 20;
        const x = mouseX * speed;
        const y = mouseY * speed;
        el.style.transform = `translate(${x}px, ${y}px)`;
    });
});

// ============================================
// PAGE LOAD ANIMATION
// ============================================
window.addEventListener('load', () => {
    document.body.classList.add('loaded');

    // Trigger hero animations
    setTimeout(() => {
        document.querySelectorAll('.hero-content > *').forEach((el, i) => {
            el.style.animationDelay = `${i * 0.1}s`;
        });
    }, 100);
});

// ============================================
// LAZY LOADING IMAGES
// ============================================
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            imageObserver.unobserve(img);
        }
    });
});

document.querySelectorAll('img[data-src]').forEach(img => {
    imageObserver.observe(img);
});

// ============================================
// FORM UTILITIES (for other pages)
// ============================================
window.ArthentixUtils = {
    // Generate unique ID
    generateCertificateId: function() {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
        return `ARTH-${year}-${random}`;
    },

    // Format date
    formatDate: function(date) {
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    },

    // Show toast notification
    showToast: function(message, type = 'success') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add toast styles if not exists
        if (!document.querySelector('#toast-styles')) {
            const toastStyles = document.createElement('style');
            toastStyles.id = 'toast-styles';
            toastStyles.textContent = `
                .toast {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    padding: 16px 24px;
                    background: rgba(10, 15, 28, 0.95);
                    backdrop-filter: blur(20px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 12px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    font-size: 0.95rem;
                    z-index: 10000;
                    animation: slideInRight 0.4s cubic-bezier(0.16, 1, 0.3, 1), fadeOut 0.4s ease 3s forwards;
                    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
                }
                .toast-success { border-left: 4px solid #10b981; }
                .toast-success i { color: #10b981; }
                .toast-error { border-left: 4px solid #ef4444; }
                .toast-error i { color: #ef4444; }
                .toast-info { border-left: 4px solid #3b82f6; }
                .toast-info i { color: #3b82f6; }
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                @keyframes fadeOut {
                    to { opacity: 0; transform: translateX(50px); }
                }
            `;
            document.head.appendChild(toastStyles);
        }

        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    },

    // Generate QR Code data URL (placeholder - in production use a library)
    generateQRCode: function(data) {
        // For POC, return a placeholder
        // In production, use qrcode.js or similar
        return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(data)}`;
    },

    // Hash function for similarity (simple placeholder)
    simpleHash: function(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return Math.abs(hash).toString(16).padStart(8, '0');
    },

    // Store data in localStorage
    saveToStorage: function(key, data) {
        try {
            localStorage.setItem(`arthentix_${key}`, JSON.stringify(data));
            return true;
        } catch (e) {
            console.error('Storage error:', e);
            return false;
        }
    },

    // Get data from localStorage
    getFromStorage: function(key) {
        try {
            const data = localStorage.getItem(`arthentix_${key}`);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error('Storage error:', e);
            return null;
        }
    },

    // Validate email
    isValidEmail: function(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    },

    // Validate phone (Indian format)
    isValidPhone: function(phone) {
        return /^[6-9]\d{9}$/.test(phone.replace(/\D/g, ''));
    }
};

// ============================================
// CONSOLE WELCOME MESSAGE
// ============================================
console.log(`
%c◆ Arthentix
%cIndia's First Blockchain Art Authentication Platform

🎨 Authenticate. Protect. Sell.

Visit: https://arthentix.com
`, 'color: #f0c674; font-size: 24px; font-weight: bold;', 'color: #a1a1aa; font-size: 12px;');

// ============================================
// ADVANCED REVEAL ANIMATIONS WITH STAGGER
// ============================================
const RevealAnimations = {
    init() {
        this.setupRevealObserver();
        this.setupStaggeredReveals();
        this.setupParallaxImages();
    },

    setupRevealObserver() {
        const revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        revealObserver.unobserve(entry.target);
                    }
                });
            },
            {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            }
        );

        document.querySelectorAll('.reveal').forEach((el) => {
            revealObserver.observe(el);
        });
    },

    setupStaggeredReveals() {
        const staggerContainers = document.querySelectorAll('.reveal-stagger');

        staggerContainers.forEach((container) => {
            const staggerObserver = new IntersectionObserver(
                (entries) => {
                    entries.forEach((entry) => {
                        if (entry.isIntersecting) {
                            const children = entry.target.children;
                            Array.from(children).forEach((child, index) => {
                                child.style.transitionDelay = `${index * 0.1}s`;
                                child.classList.add('revealed');
                            });
                            staggerObserver.unobserve(entry.target);
                        }
                    });
                },
                { threshold: 0.1 }
            );

            staggerObserver.observe(container);
        });

        // Add stagger styles
        if (!document.querySelector('#stagger-styles')) {
            const styles = document.createElement('style');
            styles.id = 'stagger-styles';
            styles.textContent = `
                .reveal-stagger > * {
                    opacity: 0;
                    transform: translateY(30px);
                    transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1),
                                transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .reveal-stagger > *.revealed {
                    opacity: 1;
                    transform: translateY(0);
                }
            `;
            document.head.appendChild(styles);
        }
    },

    setupParallaxImages() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        const handleParallax = () => {
            parallaxElements.forEach((el) => {
                const speed = parseFloat(el.dataset.parallax) || 0.5;
                const rect = el.getBoundingClientRect();
                const scrolled = window.scrollY;
                const offsetTop = el.offsetTop;
                const elementVisible = rect.top < window.innerHeight && rect.bottom > 0;

                if (elementVisible) {
                    const yPos = (scrolled - offsetTop) * speed;
                    el.style.transform = `translateY(${yPos}px)`;
                }
            });
        };

        window.addEventListener('scroll', handleParallax, { passive: true });
        handleParallax(); // Initial call
    }
};

// ============================================
// MAGNETIC BUTTON EFFECT
// ============================================
const MagneticButtons = {
    init() {
        const buttons = document.querySelectorAll('.btn-magnetic, .btn-primary');
        buttons.forEach((btn) => this.addMagneticEffect(btn));
    },

    addMagneticEffect(element) {
        if (window.innerWidth < 1024) return;

        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            element.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });

        element.addEventListener('mouseleave', () => {
            element.style.transform = 'translate(0, 0)';
            element.style.transition = 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            setTimeout(() => {
                element.style.transition = '';
            }, 300);
        });
    }
};

// ============================================
// CURSOR EFFECTS (Desktop Only)
// ============================================
const CustomCursor = {
    cursor: null,
    cursorDot: null,
    isHovering: false,

    init() {
        if (window.innerWidth < 1024 || 'ontouchstart' in window) return;

        this.createCursor();
        this.bindEvents();
    },

    createCursor() {
        // Only create if custom cursor is enabled via class
        if (!document.body.classList.contains('custom-cursor-enabled')) return;

        this.cursor = document.createElement('div');
        this.cursor.className = 'custom-cursor';
        this.cursorDot = document.createElement('div');
        this.cursorDot.className = 'custom-cursor-dot';

        document.body.appendChild(this.cursor);
        document.body.appendChild(this.cursorDot);

        // Add cursor styles
        const styles = document.createElement('style');
        styles.textContent = `
            .custom-cursor-enabled * {
                cursor: none !important;
            }
            .custom-cursor {
                position: fixed;
                width: 40px;
                height: 40px;
                border: 1px solid var(--color-gold, #D4AF37);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transition: transform 0.15s ease-out, opacity 0.3s ease;
                transform: translate(-50%, -50%);
                mix-blend-mode: difference;
            }
            .custom-cursor.hover {
                transform: translate(-50%, -50%) scale(1.5);
                border-color: white;
            }
            .custom-cursor-dot {
                position: fixed;
                width: 6px;
                height: 6px;
                background: var(--color-gold, #D4AF37);
                border-radius: 50%;
                pointer-events: none;
                z-index: 99999;
                transform: translate(-50%, -50%);
            }
        `;
        document.head.appendChild(styles);
    },

    bindEvents() {
        if (!this.cursor) return;

        document.addEventListener('mousemove', (e) => {
            this.cursor.style.left = e.clientX + 'px';
            this.cursor.style.top = e.clientY + 'px';
            this.cursorDot.style.left = e.clientX + 'px';
            this.cursorDot.style.top = e.clientY + 'px';
        });

        document.querySelectorAll('a, button, .artwork-card, .artist-card, .collection-card').forEach((el) => {
            el.addEventListener('mouseenter', () => {
                this.cursor.classList.add('hover');
            });
            el.addEventListener('mouseleave', () => {
                this.cursor.classList.remove('hover');
            });
        });
    }
};

// ============================================
// IMAGE LOADING EFFECT
// ============================================
const ImageLoader = {
    init() {
        const images = document.querySelectorAll('img:not([data-no-effect])');

        images.forEach((img) => {
            if (img.complete) {
                img.classList.add('loaded');
            } else {
                img.classList.add('loading');
                img.addEventListener('load', () => {
                    img.classList.remove('loading');
                    img.classList.add('loaded');
                });
            }
        });

        // Add image loading styles
        if (!document.querySelector('#image-loader-styles')) {
            const styles = document.createElement('style');
            styles.id = 'image-loader-styles';
            styles.textContent = `
                img.loading {
                    opacity: 0;
                    filter: blur(10px);
                    transform: scale(1.05);
                }
                img.loaded {
                    opacity: 1;
                    filter: blur(0);
                    transform: scale(1);
                    transition: opacity 0.6s ease, filter 0.6s ease, transform 0.6s ease;
                }
            `;
            document.head.appendChild(styles);
        }
    }
};

// ============================================
// SCROLL PROGRESS BAR
// ============================================
const ScrollProgress = {
    init() {
        // Create progress bar
        const progress = document.createElement('div');
        progress.className = 'scroll-progress';
        document.body.appendChild(progress);

        // Add styles
        if (!document.querySelector('#scroll-progress-styles')) {
            const styles = document.createElement('style');
            styles.id = 'scroll-progress-styles';
            styles.textContent = `
                .scroll-progress {
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 3px;
                    background: linear-gradient(90deg, var(--color-gold, #D4AF37), var(--color-gold-light, #E5C767));
                    z-index: 10000;
                    transform-origin: left;
                    transform: scaleX(0);
                    transition: transform 0.1s ease-out;
                }
            `;
            document.head.appendChild(styles);
        }

        // Update on scroll
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = scrollTop / docHeight;
            progress.style.transform = `scaleX(${scrollPercent})`;
        }, { passive: true });
    }
};

// ============================================
// INITIALIZE ALL ENHANCEMENTS
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    RevealAnimations.init();
    MagneticButtons.init();
    CustomCursor.init();
    ImageLoader.init();
    ScrollProgress.init();
    SmoothScroller.init();
});

// ============================================
// EXPORT FOR OTHER SCRIPTS
// ============================================
window.ArthentixEnhancements = {
    ThemeManager,
    RevealAnimations,
    MagneticButtons,
    ImageLoader
};
