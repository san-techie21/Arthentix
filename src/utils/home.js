/**
 * Arthentix - Homepage JavaScript
 * Search, filtering, wishlist, and gallery interactions
 */

// ============================================
// SEARCH OVERLAY
// ============================================
const searchTrigger = document.querySelector('.search-trigger');
const searchOverlay = document.getElementById('searchOverlay');
const searchClose = document.getElementById('searchClose');
const globalSearch = document.getElementById('globalSearch');

if (searchTrigger && searchOverlay) {
    searchTrigger.addEventListener('click', () => {
        searchOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
        setTimeout(() => globalSearch?.focus(), 300);
    });

    searchClose?.addEventListener('click', closeSearch);

    searchOverlay.addEventListener('click', (e) => {
        if (e.target === searchOverlay) {
            closeSearch();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
            closeSearch();
        }
        // Cmd/Ctrl + K to open search
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            searchOverlay.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => globalSearch?.focus(), 300);
        }
    });
}

function closeSearch() {
    searchOverlay.classList.remove('active');
    document.body.style.overflow = '';
    if (globalSearch) globalSearch.value = '';
}

// Search suggestions
const suggestionTags = document.querySelectorAll('.suggestion-tag');
suggestionTags.forEach(tag => {
    tag.addEventListener('click', () => {
        if (globalSearch) {
            globalSearch.value = tag.textContent;
            globalSearch.focus();
        }
    });
});

// ============================================
// FILTER PILLS
// ============================================
const filterPills = document.querySelectorAll('.filter-pill');
const artworkCards = document.querySelectorAll('.artwork-card');

filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
        // Update active state
        filterPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const filter = pill.dataset.filter;

        // Filter animation
        artworkCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';

            setTimeout(() => {
                // In production, this would filter based on data attributes
                // For demo, show all cards with staggered animation
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 50);
        });

        // Show toast feedback
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

// Update wishlist badges on load
updateWishlistBadge();

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        const card = btn.closest('.artwork-card');
        const artworkId = card.querySelector('.artwork-link')?.href?.split('id=')[1] || Date.now().toString();
        const title = card.querySelector('.artwork-title')?.textContent || 'Artwork';

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
        updateWishlistBadge();

        // Add heart animation
        createHeartAnimation(btn);
    });
});

function updateWishlistBadge() {
    const badge = document.querySelector('.nav-icon-btn[title="Wishlist"] .badge');
    if (badge) {
        badge.textContent = wishlistItems.length;
    }
}

function createHeartAnimation(btn) {
    if (!btn.classList.contains('active')) return;

    const heart = document.createElement('span');
    heart.innerHTML = '<i class="fas fa-heart"></i>';
    heart.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #E53935;
        font-size: 1.5rem;
        pointer-events: none;
        animation: heartPop 0.6s ease forwards;
    `;
    btn.style.position = 'relative';
    btn.appendChild(heart);

    setTimeout(() => heart.remove(), 600);
}

// Add heart animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes heartPop {
        0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
        50% { transform: translate(-50%, -50%) scale(1.8); opacity: 0.8; }
        100% { transform: translate(-50%, -50%) scale(2.2); opacity: 0; }
    }
`;
document.head.appendChild(style);

// ============================================
// HERO GALLERY INTERACTION
// ============================================
const heroArtworks = document.querySelectorAll('.hero-artwork');

heroArtworks.forEach(artwork => {
    artwork.addEventListener('click', () => {
        // In production, this would navigate to artwork detail
        const title = artwork.querySelector('.artwork-info h3')?.textContent;
        if (title && typeof ArthentixUtils !== 'undefined') {
            ArthentixUtils.showToast(`Opening ${title}...`, 'info');
        }
    });
});

// ============================================
// CATEGORY SCROLL
// ============================================
const categoryScroll = document.querySelector('.category-scroll');

if (categoryScroll) {
    let isDown = false;
    let startX;
    let scrollLeft;

    categoryScroll.addEventListener('mousedown', (e) => {
        isDown = true;
        categoryScroll.style.cursor = 'grabbing';
        startX = e.pageX - categoryScroll.offsetLeft;
        scrollLeft = categoryScroll.scrollLeft;
    });

    categoryScroll.addEventListener('mouseleave', () => {
        isDown = false;
        categoryScroll.style.cursor = 'grab';
    });

    categoryScroll.addEventListener('mouseup', () => {
        isDown = false;
        categoryScroll.style.cursor = 'grab';
    });

    categoryScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - categoryScroll.offsetLeft;
        const walk = (x - startX) * 2;
        categoryScroll.scrollLeft = scrollLeft - walk;
    });
}

// ============================================
// REVEAL ANIMATIONS
// ============================================
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('active');
            }, index * 100);
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ============================================
// NAVBAR SCROLL EFFECT
// ============================================
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
});

// Add scrolled styles
const navScrollStyle = document.createElement('style');
navScrollStyle.textContent = `
    .navbar-marketplace.scrolled {
        background: rgba(253, 251, 247, 0.98);
        box-shadow: 0 1px 10px rgba(0, 0, 0, 0.05);
    }
`;
document.head.appendChild(navScrollStyle);

// ============================================
// QUICK VIEW (Placeholder)
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

// ============================================
// MOBILE MENU
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navCenter = document.querySelector('.nav-center');

if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        // Create mobile menu overlay if it doesn't exist
        let mobileMenu = document.querySelector('.mobile-menu-overlay');

        if (!mobileMenu) {
            mobileMenu = document.createElement('div');
            mobileMenu.className = 'mobile-menu-overlay';
            mobileMenu.innerHTML = `
                <div class="mobile-menu-content">
                    <button class="mobile-menu-close">
                        <i class="fas fa-times"></i>
                    </button>
                    <nav class="mobile-nav">
                        <a href="index.html">Explore</a>
                        <a href="collections.html">Collections</a>
                        <a href="artists.html">Artists</a>
                        <a href="rental.html">Rent Art</a>
                        <a href="for-business.html">For Business</a>
                        <a href="verify.html">Verify Art</a>
                    </nav>
                    <div class="mobile-actions">
                        <a href="login.html" class="btn btn-outline">Sign In</a>
                        <a href="seller-portal.html" class="btn btn-primary">Sell Art</a>
                    </div>
                </div>
            `;
            document.body.appendChild(mobileMenu);

            // Add mobile menu styles
            const mobileStyle = document.createElement('style');
            mobileStyle.textContent = `
                .mobile-menu-overlay {
                    position: fixed;
                    inset: 0;
                    background: rgba(253, 251, 247, 0.98);
                    z-index: 3000;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.3s ease;
                }
                .mobile-menu-overlay.active {
                    opacity: 1;
                    visibility: visible;
                }
                .mobile-menu-content {
                    text-align: center;
                    padding: 2rem;
                }
                .mobile-menu-close {
                    position: absolute;
                    top: 1.5rem;
                    right: 1.5rem;
                    width: 48px;
                    height: 48px;
                    border: none;
                    background: transparent;
                    font-size: 1.5rem;
                    cursor: pointer;
                }
                .mobile-nav {
                    display: flex;
                    flex-direction: column;
                    gap: 1.5rem;
                    margin-bottom: 2rem;
                }
                .mobile-nav a {
                    font-family: 'Cormorant Garamond', serif;
                    font-size: 1.75rem;
                    font-weight: 500;
                    color: #1A1A1A;
                    text-decoration: none;
                }
                .mobile-actions {
                    display: flex;
                    flex-direction: column;
                    gap: 1rem;
                }
                .mobile-actions .btn {
                    width: 100%;
                }
            `;
            document.head.appendChild(mobileStyle);

            // Close button functionality
            mobileMenu.querySelector('.mobile-menu-close').addEventListener('click', () => {
                mobileMenu.classList.remove('active');
                document.body.style.overflow = '';
            });
        }

        mobileMenu.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
}

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Arthentix Homepage Initialized');

    // Add loaded class to body for animations
    document.body.classList.add('loaded');
});
