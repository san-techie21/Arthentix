/**
 * Arthentix - Seller Portal JavaScript
 * Dashboard navigation, listings management, and modal interactions
 */

// ============================================
// SIDEBAR NAVIGATION
// ============================================
const sidebarNav = document.querySelectorAll('.sidebar-nav .nav-item');
const contentSections = document.querySelectorAll('.content-section');

sidebarNav.forEach(item => {
    item.addEventListener('click', (e) => {
        e.preventDefault();
        const targetSection = item.dataset.section;

        // Update active nav item
        sidebarNav.forEach(nav => nav.classList.remove('active'));
        item.classList.add('active');

        // Show target section
        contentSections.forEach(section => {
            section.classList.remove('active');
            if (section.id === targetSection) {
                section.classList.add('active');
            }
        });

        // Update URL hash
        history.pushState(null, '', `#${targetSection}`);

        // Close mobile sidebar if open
        const sidebar = document.getElementById('sellerSidebar');
        if (window.innerWidth <= 992) {
            sidebar.classList.remove('active');
        }
    });
});

// Handle initial hash
function handleInitialHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
        const targetNav = document.querySelector(`.nav-item[data-section="${hash}"]`);
        if (targetNav) {
            targetNav.click();
        }
    }
}

handleInitialHash();
window.addEventListener('hashchange', handleInitialHash);

// ============================================
// NEW LISTING MODAL
// ============================================
const newListingModal = document.getElementById('newListingModal');
const newListingBtns = [
    document.getElementById('newListingBtn'),
    document.getElementById('addListingBtn'),
    document.getElementById('addNewCard'),
    document.getElementById('quickNewListing')
];
const closeModalBtn = document.getElementById('closeModal');
const prevStepBtn = document.getElementById('prevStepBtn');
const nextStepBtn = document.getElementById('nextStepBtn');

let currentStep = 1;
const totalSteps = 4;

// Open modal
newListingBtns.forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            newListingModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            resetModal();
        });
    }
});

// Close modal
if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
}

newListingModal?.addEventListener('click', (e) => {
    if (e.target === newListingModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && newListingModal?.classList.contains('active')) {
        closeModal();
    }
});

function closeModal() {
    newListingModal.classList.remove('active');
    document.body.style.overflow = '';
}

function resetModal() {
    currentStep = 1;
    updateModalStep();
}

// Step Navigation
if (nextStepBtn) {
    nextStepBtn.addEventListener('click', () => {
        if (currentStep < totalSteps) {
            currentStep++;
            updateModalStep();

            // Start authentication on step 4
            if (currentStep === 4) {
                startAuthentication();
            }
        } else {
            // Submit listing
            submitListing();
        }
    });
}

if (prevStepBtn) {
    prevStepBtn.addEventListener('click', () => {
        if (currentStep > 1) {
            currentStep--;
            updateModalStep();
        }
    });
}

function updateModalStep() {
    // Update step indicators
    const steps = document.querySelectorAll('.listing-step');
    steps.forEach((step, index) => {
        const stepNum = index + 1;
        step.classList.remove('active', 'completed');
        if (stepNum === currentStep) {
            step.classList.add('active');
        } else if (stepNum < currentStep) {
            step.classList.add('completed');
        }
    });

    // Update form steps
    const formSteps = document.querySelectorAll('.listing-form-step');
    formSteps.forEach(formStep => {
        formStep.classList.remove('active');
        if (parseInt(formStep.dataset.step) === currentStep) {
            formStep.classList.add('active');
        }
    });

    // Update buttons
    if (prevStepBtn) {
        prevStepBtn.style.display = currentStep > 1 ? 'flex' : 'none';
    }

    if (nextStepBtn) {
        if (currentStep === totalSteps) {
            nextStepBtn.innerHTML = '<i class="fas fa-check"></i> Publish Listing';
        } else if (currentStep === 3) {
            nextStepBtn.innerHTML = 'Authenticate <i class="fas fa-arrow-right"></i>';
        } else {
            nextStepBtn.innerHTML = 'Continue <i class="fas fa-arrow-right"></i>';
        }
    }
}

// ============================================
// AUTHENTICATION SIMULATION
// ============================================
function startAuthentication() {
    const authSteps = document.querySelectorAll('.auth-step');
    const authResult = document.getElementById('authResult');
    let stepIndex = 0;

    // Hide result initially
    if (authResult) authResult.style.display = 'none';

    // Reset all steps
    authSteps.forEach(step => {
        step.classList.remove('active', 'completed');
    });

    function processStep() {
        if (stepIndex < authSteps.length) {
            const step = authSteps[stepIndex];
            step.classList.add('active');

            setTimeout(() => {
                step.classList.remove('active');
                step.classList.add('completed');
                stepIndex++;
                processStep();
            }, 1500);
        } else {
            // Show result
            if (authResult) {
                authResult.style.display = 'block';
                authResult.querySelector('strong').textContent = generateCertificateId();
            }
        }
    }

    // Start processing
    setTimeout(processStep, 500);
}

function generateCertificateId() {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 99999).toString().padStart(5, '0');
    return `ARTH-${year}-${random}`;
}

function submitListing() {
    // Show success message
    if (typeof ArthentixUtils !== 'undefined') {
        ArthentixUtils.showToast('Artwork listed successfully!', 'success');
    }
    closeModal();

    // In production, would submit to backend here
    console.log('Listing submitted');
}

// ============================================
// FILTER TABS
// ============================================
const filterTabs = document.querySelectorAll('.filter-tab');

filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const parent = tab.closest('.header-actions') || tab.closest('.filter-tabs');
        parent.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        const filter = tab.dataset.filter;
        filterListings(filter);
    });
});

function filterListings(filter) {
    const listings = document.querySelectorAll('.listing-card:not(.add-new)');

    listings.forEach(listing => {
        const status = listing.querySelector('.listing-status');
        const statusText = status?.textContent.toLowerCase() || '';

        listing.style.display = 'block';
        listing.style.opacity = '0';
        listing.style.transform = 'translateY(10px)';

        setTimeout(() => {
            if (filter === 'all') {
                listing.style.opacity = '1';
                listing.style.transform = 'translateY(0)';
            } else if (filter === 'active' && statusText === 'active') {
                listing.style.opacity = '1';
                listing.style.transform = 'translateY(0)';
            } else if (filter === 'rented' && statusText === 'on rent') {
                listing.style.opacity = '1';
                listing.style.transform = 'translateY(0)';
            } else if (filter === 'sold' && statusText === 'sold') {
                listing.style.opacity = '1';
                listing.style.transform = 'translateY(0)';
            } else if (filter !== 'all') {
                listing.style.display = 'none';
            }
        }, 100);
    });
}

// ============================================
// CHART TOGGLE
// ============================================
const chartToggle = document.querySelector('.chart-toggle');
if (chartToggle) {
    chartToggle.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', () => {
            chartToggle.querySelectorAll('button').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // In production, would update chart data here
            animateChartBars();
        });
    });
}

function animateChartBars() {
    const bars = document.querySelectorAll('.chart-bar');
    bars.forEach(bar => {
        const currentHeight = bar.style.height;
        bar.style.height = '0';
        setTimeout(() => {
            bar.style.height = currentHeight;
        }, 50);
    });
}

// ============================================
// PRICING CALCULATOR
// ============================================
const salePrice = document.getElementById('salePrice');
const rentPrice = document.getElementById('rentPrice');

if (salePrice) {
    salePrice.addEventListener('input', () => {
        const price = parseFloat(salePrice.value) || 0;
        const fee = price * 0.08;
        const net = price - fee;

        const card = salePrice.closest('.pricing-card');
        const breakdown = card.querySelector('.price-breakdown');
        if (breakdown) {
            breakdown.querySelector('.breakdown-row:first-child span:last-child').textContent = `-₹${formatNumber(fee)}`;
            breakdown.querySelector('.breakdown-row.final span:last-child').textContent = `₹${formatNumber(net)}`;
        }
    });
}

if (rentPrice) {
    rentPrice.addEventListener('input', () => {
        const price = parseFloat(rentPrice.value) || 0;
        const fee = price * 0.12;
        const net = price - fee;

        const card = rentPrice.closest('.pricing-card');
        const breakdown = card.querySelector('.price-breakdown');
        if (breakdown) {
            breakdown.querySelector('.breakdown-row:first-child span:last-child').textContent = `-₹${formatNumber(fee)}`;
            breakdown.querySelector('.breakdown-row.final span:last-child').textContent = `₹${formatNumber(net)}`;
        }
    });
}

function formatNumber(num) {
    return num.toLocaleString('en-IN', { maximumFractionDigits: 0 });
}

// ============================================
// MOBILE SIDEBAR TOGGLE
// ============================================
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const sidebar = document.getElementById('sellerSidebar');

if (mobileMenuBtn && sidebar) {
    mobileMenuBtn.addEventListener('click', () => {
        sidebar.classList.toggle('active');
    });

    // Close sidebar when clicking outside
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 992 &&
            sidebar.classList.contains('active') &&
            !sidebar.contains(e.target) &&
            !mobileMenuBtn.contains(e.target)) {
            sidebar.classList.remove('active');
        }
    });
}

// ============================================
// PERIOD SELECT
// ============================================
const periodSelect = document.querySelector('.period-select');

if (periodSelect) {
    periodSelect.addEventListener('change', (e) => {
        const days = parseInt(e.target.value);
        // In production, would fetch new data based on period
        console.log(`Fetching data for last ${days} days`);

        // Animate stat changes
        const statValues = document.querySelectorAll('.stat-value');
        statValues.forEach(stat => {
            stat.style.opacity = '0.5';
            setTimeout(() => {
                stat.style.opacity = '1';
            }, 300);
        });
    });
}

// ============================================
// DRAG & DROP UPLOAD
// ============================================
const uploadDropzone = document.getElementById('mainImageDropzone');

if (uploadDropzone) {
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        uploadDropzone.addEventListener(eventName, (e) => {
            e.preventDefault();
            e.stopPropagation();
        });
    });

    ['dragenter', 'dragover'].forEach(eventName => {
        uploadDropzone.addEventListener(eventName, () => {
            uploadDropzone.style.borderColor = 'var(--color-gold)';
            uploadDropzone.style.background = 'rgba(201, 169, 98, 0.05)';
        });
    });

    ['dragleave', 'drop'].forEach(eventName => {
        uploadDropzone.addEventListener(eventName, () => {
            uploadDropzone.style.borderColor = '';
            uploadDropzone.style.background = '';
        });
    });

    uploadDropzone.addEventListener('drop', (e) => {
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileUpload(files[0]);
        }
    });

    uploadDropzone.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.onchange = (e) => {
            if (e.target.files.length > 0) {
                handleFileUpload(e.target.files[0]);
            }
        };
        input.click();
    });
}

function handleFileUpload(file) {
    if (!file.type.startsWith('image/')) {
        if (typeof ArthentixUtils !== 'undefined') {
            ArthentixUtils.showToast('Please upload an image file', 'error');
        }
        return;
    }

    // Preview the image
    const reader = new FileReader();
    reader.onload = (e) => {
        if (uploadDropzone) {
            uploadDropzone.innerHTML = `
                <img src="${e.target.result}" alt="Preview" style="max-width: 100%; max-height: 200px; border-radius: 8px;">
                <p style="margin-top: 1rem; color: #666;">${file.name}</p>
                <button class="btn btn-outline btn-sm" style="margin-top: 0.5rem;" onclick="resetUpload()">Change Image</button>
            `;
        }
    };
    reader.readAsDataURL(file);
}

function resetUpload() {
    if (uploadDropzone) {
        uploadDropzone.innerHTML = `
            <i class="fas fa-cloud-upload-alt"></i>
            <h4>Drop your main image here</h4>
            <p>or click to browse</p>
            <span class="upload-specs">PNG, JPG up to 50MB</span>
        `;
    }
}

// ============================================
// VIEW ALL LINKS
// ============================================
document.querySelectorAll('.view-all').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        const section = href.replace('#', '');
        const targetNav = document.querySelector(`.nav-item[data-section="${section}"]`);
        if (targetNav) {
            targetNav.click();
        }
    });
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log('Arthentix Seller Portal Initialized');

    // Add loaded class to body
    document.body.classList.add('loaded');

    // Initialize tooltips or any other components
    updateModalStep();
});
