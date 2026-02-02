/**
 * Arthentix - Art Rental Page JavaScript
 * Filter interactions, wishlist, and smooth scrolling
 */

// ============================================
// FILTER PILLS
// ============================================
const filterPills = document.querySelectorAll('.filter-pill');
const rentalCards = document.querySelectorAll('.rental-card');

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        // Update active state
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;

        // Animate cards
        rentalCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                // In production, filter based on data attributes
                // For demo, show all with staggered animation
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Show toast
        if (typeof ArthentixUtils !== 'undefined') {
            const filterName = pill.textContent;
            ArthentixUtils.showToast(`Showing: ${filterName}`, 'info');
        }
    });
});

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================
const wishlistBtns = document.querySelectorAll('.action-btn.wishlist');
let wishlistItems = JSON.parse(localStorage.getItem('arthentix_wishlist') || '[]');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest('.rental-card');
        const title = card.querySelector('.rental-title')?.textContent || 'Artwork';
        const artworkId = title.replace(/\s+/g, '-').toLowerCase();

        btn.classList.toggle('active');
        const icon = btn.querySelector('i');

        if (btn.classList.contains('active')) {
            icon.className = 'fas fa-heart';
            if (!wishlistItems.includes(artworkId)) {
                wishlistItems.push(artworkId);
            }
            if (typeof ArthentixUtils !== 'undefined') {
                ArthentixUtils.showToast(`${title} added to wishlist`, 'success');
            }
        } else {
            icon.className = 'far fa-heart';
            wishlistItems = wishlistItems.filter(id => id !== artworkId);
            if (typeof ArthentixUtils !== 'undefined') {
                ArthentixUtils.showToast(`${title} removed from wishlist`, 'info');
            }
        }

        localStorage.setItem('arthentix_wishlist', JSON.stringify(wishlistItems));
    });
});

// ============================================
// QUICK VIEW
// ============================================
const quickViewBtns = document.querySelectorAll('.action-btn.quick-view');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (typeof ArthentixUtils !== 'undefined') {
            ArthentixUtils.showToast('Quick view coming soon!', 'info');
        }
    });
});

// ============================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === '#') return;

        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
            const navHeight = 80;
            const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ============================================
// SCROLL ANIMATIONS
// ============================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.benefit-card, .step-card, .rental-card, .tier-card, .faq-item');

    elements.forEach(el => {
        const rect = el.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight - 100;

        if (isVisible && !el.classList.contains('animated')) {
            el.classList.add('animated');
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }
    });
};

// Set initial state for animated elements
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.benefit-card, .step-card, .rental-card, .tier-card, .faq-item');
    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });

    // Trigger initial animation
    setTimeout(animateOnScroll, 100);
});

window.addEventListener('scroll', animateOnScroll);

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
    if (window.pageYOffset > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ============================================
// INITIALIZE
// ============================================
console.log('Arthentix Rental Page Initialized');
