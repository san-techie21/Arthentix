/**
 * Arthentix - Verification Page JavaScript
 * Certificate lookup and verification display
 */

// ============================================
// DEMO DATA
// ============================================
const demoArtworks = {
    'ARTH-2026-00001': {
        id: 'ARTH-2026-00001',
        title: 'Sunset Over the Himalayas',
        artistName: 'Priya Sharma',
        artistEmail: 'priya.sharma@email.com',
        medium: 'Oil Painting',
        year: '2024',
        dimensions: '36 x 48 inches',
        description: 'A breathtaking view of the Himalayan mountain range during golden hour, capturing the interplay of warm sunlight on snow-capped peaks.',
        mainImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        hash: '0x7a3f8c2e9d1b4a6f5c8e2d9a1b4c7e3f8a2d5b9c1e4f7a3d6c9b2e5f8a1d4c7b0e3',
        registeredAt: '2026-01-15T10:30:00Z',
        verifyCount: 24
    },
    'ARTH-2026-00002': {
        id: 'ARTH-2026-00002',
        title: 'Dancing Peacock',
        artistName: 'Rajesh Kulkarni',
        artistEmail: 'rajesh.k@email.com',
        medium: 'Watercolor',
        year: '2025',
        dimensions: '24 x 30 inches',
        description: 'A vibrant depiction of India\'s national bird in full display, showcasing the intricate patterns and iridescent colors of peacock feathers.',
        mainImage: 'https://images.unsplash.com/photo-1524012104-47bc3ce8f8b2?w=800',
        hash: '0x9b2c5e8f1a4d7c3b6e9f2a5d8c1b4e7f3a6d9c2b5e8f1a4d7c3b6e9f2a5d8c1b4e',
        registeredAt: '2026-01-20T14:45:00Z',
        verifyCount: 18
    },
    'ARTH-2026-00003': {
        id: 'ARTH-2026-00003',
        title: 'Abstract Mumbai',
        artistName: 'Ananya Mehta',
        artistEmail: 'ananya.m@email.com',
        medium: 'Mixed Media',
        year: '2025',
        dimensions: '40 x 40 inches',
        description: 'An abstract interpretation of Mumbai\'s urban landscape, blending traditional Indian motifs with modern geometric patterns.',
        mainImage: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
        hash: '0x1d4e7f2a5c8b3e6f9a2d5c8b1e4f7a3d6c9b2e5f8a1d4c7b0e3f6a9d2c5b8e1f4a',
        registeredAt: '2026-01-25T09:15:00Z',
        verifyCount: 31
    }
};

// ============================================
// DOM ELEMENTS
// ============================================
const certificateInput = document.getElementById('certificateInput');
const verifyBtn = document.getElementById('verifyBtn');
const verifyResult = document.getElementById('verifyResult');
const verifyLoading = document.getElementById('verifyLoading');
const verifySuccess = document.getElementById('verifySuccess');
const verifyNotFound = document.getElementById('verifyNotFound');
const demoLinks = document.querySelectorAll('.demo-link');
const tryAgainBtn = document.getElementById('tryAgain');

// ============================================
// VERIFICATION LOGIC
// ============================================
function verifyCertificate(certId) {
    // Show loading state
    verifyResult.style.display = 'block';
    verifyLoading.style.display = 'flex';
    verifySuccess.style.display = 'none';
    verifyNotFound.style.display = 'none';

    // Scroll to result
    verifyResult.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Normalize certificate ID
    const normalizedId = certId.trim().toUpperCase();

    // Simulate API call
    setTimeout(() => {
        verifyLoading.style.display = 'none';

        // Check demo data first
        let artwork = demoArtworks[normalizedId];

        // Check localStorage for user-registered artworks
        if (!artwork) {
            const savedArtworks = ArthentixUtils.getFromStorage('artworks') || [];
            artwork = savedArtworks.find(a => a.id === normalizedId);
        }

        if (artwork) {
            displaySuccess(artwork);
        } else {
            displayNotFound();
        }
    }, 2000);
}

function displaySuccess(artwork) {
    verifySuccess.style.display = 'block';

    // Populate data
    document.getElementById('verifiedArtworkImage').src = artwork.mainImage;
    document.getElementById('verifiedTitle').textContent = artwork.title;
    document.getElementById('verifiedCertId').textContent = artwork.id;
    document.getElementById('verifiedArtist').textContent = artwork.artistName;
    document.getElementById('verifiedMedium').textContent = artwork.medium || artwork.mediumLabel;
    document.getElementById('verifiedYear').textContent = artwork.year;
    document.getElementById('verifiedHash').textContent = artwork.hash;
    document.getElementById('verifyCount').textContent = artwork.verifyCount || Math.floor(Math.random() * 50) + 1;

    // Format date
    const date = new Date(artwork.registeredAt);
    document.getElementById('verifiedDate').textContent = ArthentixUtils.formatDate(date);

    // Increment verify count
    artwork.verifyCount = (artwork.verifyCount || 0) + 1;

    ArthentixUtils.showToast('Certificate verified successfully!', 'success');
}

function displayNotFound() {
    verifyNotFound.style.display = 'block';
    ArthentixUtils.showToast('Certificate not found', 'error');
}

// ============================================
// EVENT LISTENERS
// ============================================
verifyBtn.addEventListener('click', () => {
    const certId = certificateInput.value.trim();
    if (certId) {
        verifyCertificate(certId);
    } else {
        ArthentixUtils.showToast('Please enter a certificate ID', 'error');
        certificateInput.focus();
    }
});

certificateInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        verifyBtn.click();
    }
});

// Demo links
demoLinks.forEach(link => {
    link.addEventListener('click', () => {
        const id = link.dataset.id;
        certificateInput.value = id;
        verifyCertificate(id);
    });
});

// Try again button
tryAgainBtn?.addEventListener('click', () => {
    verifyResult.style.display = 'none';
    certificateInput.value = '';
    certificateInput.focus();
});

// Copy hash
document.querySelector('.copy-hash')?.addEventListener('click', () => {
    const hash = document.getElementById('verifiedHash').textContent;
    navigator.clipboard.writeText(hash).then(() => {
        ArthentixUtils.showToast('Hash copied to clipboard!', 'success');
    });
});

// Download report
document.getElementById('downloadReport')?.addEventListener('click', () => {
    ArthentixUtils.showToast('Generating verification report...', 'info');
    setTimeout(() => {
        ArthentixUtils.showToast('Report downloaded!', 'success');
    }, 1500);
});

// Contact artist
document.getElementById('contactArtist')?.addEventListener('click', () => {
    ArthentixUtils.showToast('Contact request sent to artist', 'success');
});

// Report fraud
document.getElementById('reportFraud')?.addEventListener('click', () => {
    ArthentixUtils.showToast('Thank you for reporting. We will investigate.', 'info');
});

// Scan QR (placeholder)
document.getElementById('scanQrBtn')?.addEventListener('click', () => {
    ArthentixUtils.showToast('QR Scanner coming soon!', 'info');
});

// ============================================
// CHECK URL FOR CERTIFICATE ID
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Check if certificate ID is in URL
    const urlParams = new URLSearchParams(window.location.search);
    const certId = urlParams.get('id');

    if (certId) {
        certificateInput.value = certId;
        verifyCertificate(certId);
    }

    // Also check hash
    if (window.location.hash) {
        const hashId = window.location.hash.substring(1);
        if (hashId.startsWith('ARTH-')) {
            certificateInput.value = hashId;
            verifyCertificate(hashId);
        }
    }
});
