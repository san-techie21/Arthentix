/**
 * Arthentix - Similarity Check JavaScript
 * Image upload, AI analysis simulation, results display
 */

// ============================================
// DEMO DATA - Sample artworks for matching
// ============================================
const registeredArtworks = [
    {
        id: 'ARTH-2026-00001',
        title: 'Sunset Over the Himalayas',
        artist: 'Priya Sharma',
        image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
        registeredDate: 'January 15, 2026',
        keywords: ['mountain', 'sunset', 'himalaya', 'landscape', 'nature', 'orange', 'sky']
    },
    {
        id: 'ARTH-2026-00002',
        title: 'Dancing Peacock',
        artist: 'Rajesh Kulkarni',
        image: 'https://images.unsplash.com/photo-1524012104-47bc3ce8f8b2?w=800',
        registeredDate: 'January 20, 2026',
        keywords: ['peacock', 'bird', 'blue', 'feathers', 'wildlife', 'colorful']
    },
    {
        id: 'ARTH-2026-00003',
        title: 'Abstract Mumbai',
        artist: 'Ananya Mehta',
        image: 'https://images.unsplash.com/photo-1549490349-8643362247b5?w=800',
        registeredDate: 'January 25, 2026',
        keywords: ['abstract', 'city', 'urban', 'colorful', 'modern', 'geometric']
    }
];

// ============================================
// DOM ELEMENTS
// ============================================
const uploadZone = document.getElementById('uploadZone');
const uploadContent = document.getElementById('uploadContent');
const previewState = document.getElementById('previewState');
const similarityInput = document.getElementById('similarityInput');
const previewImage = document.getElementById('previewImage');
const fileName = document.getElementById('fileName');
const removePreview = document.getElementById('removePreview');
const startAnalysis = document.getElementById('startAnalysis');
const analysisSection = document.getElementById('analysisSection');
const analyzingImage = document.getElementById('analyzingImage');
const resultsSection = document.getElementById('resultsSection');
const noMatchResult = document.getElementById('noMatchResult');
const matchFoundResult = document.getElementById('matchFoundResult');

let uploadedImageData = null;

// ============================================
// FILE UPLOAD HANDLING
// ============================================
uploadZone.addEventListener('click', (e) => {
    if (!previewState.style.display || previewState.style.display === 'none') {
        similarityInput.click();
    }
});

uploadZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadZone.classList.add('dragover');
});

uploadZone.addEventListener('dragleave', () => {
    uploadZone.classList.remove('dragover');
});

uploadZone.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadZone.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
        handleFileUpload(files[0]);
    }
});

similarityInput.addEventListener('change', (e) => {
    if (e.target.files.length > 0) {
        handleFileUpload(e.target.files[0]);
    }
});

function handleFileUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        uploadedImageData = e.target.result;
        previewImage.src = uploadedImageData;
        fileName.textContent = file.name;

        // Show preview state
        uploadContent.style.display = 'none';
        previewState.style.display = 'flex';
        uploadZone.classList.add('has-preview');

        ArthentixUtils.showToast('Image uploaded! Click "Start Analysis" to check for similarities.', 'success');
    };
    reader.readAsDataURL(file);
}

removePreview.addEventListener('click', (e) => {
    e.stopPropagation();
    resetUpload();
});

function resetUpload() {
    uploadedImageData = null;
    previewImage.src = '';
    similarityInput.value = '';
    uploadContent.style.display = 'flex';
    previewState.style.display = 'none';
    uploadZone.classList.remove('has-preview');
    analysisSection.style.display = 'none';
    resultsSection.style.display = 'none';
}

// ============================================
// ANALYSIS SIMULATION
// ============================================
startAnalysis.addEventListener('click', () => {
    if (!uploadedImageData) {
        ArthentixUtils.showToast('Please upload an image first', 'error');
        return;
    }

    // Hide upload, show analysis
    uploadZone.style.display = 'none';
    analysisSection.style.display = 'block';
    analyzingImage.src = uploadedImageData;

    // Reset stages
    const stages = document.querySelectorAll('.stage');
    stages.forEach(s => {
        s.classList.remove('active', 'completed');
        s.querySelector('.progress-bar').style.width = '0%';
    });

    // Scroll to analysis
    analysisSection.scrollIntoView({ behavior: 'smooth', block: 'center' });

    // Run analysis animation
    runAnalysis();
});

function runAnalysis() {
    const stages = document.querySelectorAll('.stage');
    const stageDurations = [1500, 2000, 1500];
    let currentStage = 0;

    function activateStage(index) {
        if (index >= stages.length) {
            // Analysis complete
            setTimeout(showResults, 500);
            return;
        }

        const stage = stages[index];
        stage.classList.add('active');

        const progressBar = stage.querySelector('.progress-bar');
        progressBar.style.transition = `width ${stageDurations[index]}ms ease-out`;
        progressBar.style.width = '100%';

        setTimeout(() => {
            stage.classList.remove('active');
            stage.classList.add('completed');
            activateStage(index + 1);
        }, stageDurations[index]);
    }

    activateStage(0);
}

// ============================================
// RESULTS DISPLAY
// ============================================
function showResults() {
    analysisSection.style.display = 'none';
    resultsSection.style.display = 'block';
    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Simulate match detection (50% chance of match for demo)
    const hasMatch = Math.random() > 0.5;

    if (hasMatch) {
        showMatchResult();
    } else {
        showNoMatchResult();
    }
}

function showNoMatchResult() {
    noMatchResult.style.display = 'block';
    matchFoundResult.style.display = 'none';

    // Animate score circle
    setTimeout(() => {
        const scoreFill = noMatchResult.querySelector('.score-fill');
        scoreFill.style.strokeDashoffset = '0';
    }, 100);

    ArthentixUtils.showToast('Analysis complete! No similar artworks found.', 'success');
}

function showMatchResult() {
    noMatchResult.style.display = 'none';
    matchFoundResult.style.display = 'block';

    // Pick a random artwork to match with
    const matchedArtwork = registeredArtworks[Math.floor(Math.random() * registeredArtworks.length)];
    const similarityScore = Math.floor(Math.random() * 25) + 75; // 75-99%

    // Set comparison images
    document.getElementById('comparisonUpload').src = uploadedImageData;
    document.getElementById('comparisonMatch').src = matchedArtwork.image;
    document.getElementById('similarityPercent').textContent = similarityScore + '%';

    // Set match details
    document.getElementById('matchTitle').textContent = matchedArtwork.title;
    document.getElementById('matchArtist').textContent = matchedArtwork.artist;
    document.getElementById('matchCertId').textContent = matchedArtwork.id;
    document.getElementById('matchDate').textContent = matchedArtwork.registeredDate;

    ArthentixUtils.showToast('Analysis complete! Similar artwork detected.', 'warning');
}

// ============================================
// NEW SEARCH BUTTONS
// ============================================
document.getElementById('newSearchNoMatch')?.addEventListener('click', resetAll);
document.getElementById('newSearchMatch')?.addEventListener('click', resetAll);

function resetAll() {
    resetUpload();
    uploadZone.style.display = 'block';
    analysisSection.style.display = 'none';
    resultsSection.style.display = 'none';

    // Scroll to top
    document.querySelector('.similarity-upload-container').scrollIntoView({ behavior: 'smooth' });
}

// ============================================
// REPORT DISPUTE
// ============================================
document.getElementById('reportDispute')?.addEventListener('click', () => {
    ArthentixUtils.showToast('Dispute form will be available soon. Contact support@arthentix.com', 'info');
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    // Hide preview state initially
    if (previewState) {
        previewState.style.display = 'none';
    }
});
