/**
 * Arthentix - Marketplace JavaScript
 * Art gallery, filtering, cart, and wishlist functionality
 */

// ============================================
// FILTER SIDEBAR
// ============================================
const filterToggle = document.getElementById('filterToggle');
const filterSidebar = document.getElementById('filterSidebar');
const closeSidebar = document.getElementById('closeSidebar');

if (filterToggle && filterSidebar) {
    filterToggle.addEventListener('click', () => {
        filterSidebar.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    closeSidebar.addEventListener('click', () => {
        filterSidebar.classList.remove('open');
        document.body.style.overflow = '';
    });

    // Close on outside click
    filterSidebar.addEventListener('click', (e) => {
        if (e.target === filterSidebar) {
            filterSidebar.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
}

// ============================================
// CATEGORY FILTERING
// ============================================
const categoryPills = document.querySelectorAll('.category-pill');
const artCards = document.querySelectorAll('.art-card');

categoryPills.forEach(pill => {
    pill.addEventListener('click', () => {
        // Update active state
        categoryPills.forEach(p => p.classList.remove('active'));
        pill.classList.add('active');

        const category = pill.dataset.category;

        // Filter cards
        artCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                card.classList.add('reveal', 'active');
            } else {
                card.style.display = 'none';
            }
        });

        // Update count
        updateResultsCount();
    });
});

function updateResultsCount() {
    const visibleCards = document.querySelectorAll('.art-card[style="display: block"], .art-card:not([style])');
    const countEl = document.querySelector('.results-count strong');
    if (countEl) {
        countEl.textContent = visibleCards.length;
    }
}

// ============================================
// VIEW TOGGLE
// ============================================
const viewBtns = document.querySelectorAll('.view-btn');
const artGrid = document.getElementById('artGrid');

viewBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        viewBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const view = btn.dataset.view;
        artGrid.className = view === 'list' ? 'art-grid list-view' : 'art-grid';
    });
});

// ============================================
// WISHLIST FUNCTIONALITY
// ============================================
const wishlistBtns = document.querySelectorAll('.action-btn.wishlist');

wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        btn.classList.toggle('active');
        const icon = btn.querySelector('i');

        if (btn.classList.contains('active')) {
            icon.className = 'fas fa-heart';
            ArthentixUtils.showToast('Added to wishlist', 'success');
        } else {
            icon.className = 'far fa-heart';
            ArthentixUtils.showToast('Removed from wishlist', 'info');
        }

        updateWishlistCount();
    });
});

function updateWishlistCount() {
    const activeWishlists = document.querySelectorAll('.action-btn.wishlist.active').length;
    const badge = document.querySelector('.nav-icon-btn[title="Wishlist"] .badge');
    if (badge) {
        badge.textContent = activeWishlists;
    }
}

// ============================================
// ADD TO CART
// ============================================
const addCartBtns = document.querySelectorAll('.add-cart');
let cartCount = 2; // Initial count

addCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        // Get artwork title
        const card = btn.closest('.art-card');
        const title = card.querySelector('.art-title').textContent;

        // Add animation
        btn.classList.add('added');
        setTimeout(() => btn.classList.remove('added'), 500);

        cartCount++;
        updateCartCount();

        ArthentixUtils.showToast(`"${title}" added to cart`, 'success');
    });
});

function updateCartCount() {
    const badge = document.querySelector('.nav-icon-btn[title="Cart"] .badge');
    if (badge) {
        badge.textContent = cartCount;
    }
}

// ============================================
// QUICK VIEW MODAL (Placeholder)
// ============================================
const quickViewBtns = document.querySelectorAll('.action-btn.quick-view');

quickViewBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        ArthentixUtils.showToast('Quick view coming soon!', 'info');
    });
});

// ============================================
// SORT FUNCTIONALITY
// ============================================
const sortSelect = document.querySelector('.sort-select');

if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        const value = sortSelect.value;
        ArthentixUtils.showToast(`Sorting by: ${sortSelect.options[sortSelect.selectedIndex].text}`, 'info');

        // In production, this would re-fetch or sort the data
        // For demo, just show feedback
    });
}

// ============================================
// LOAD MORE
// ============================================
const loadMoreBtn = document.querySelector('.load-more .btn');

if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', () => {
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        setTimeout(() => {
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All Artworks Loaded';
            loadMoreBtn.disabled = true;
            ArthentixUtils.showToast('All artworks loaded', 'info');
        }, 1500);
    });
}

// ============================================
// FILTER TAG REMOVE
// ============================================
const filterTags = document.querySelectorAll('.filter-tag button');

filterTags.forEach(btn => {
    btn.addEventListener('click', () => {
        const tag = btn.parentElement;
        tag.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => tag.remove(), 300);
    });
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    updateResultsCount();
});
