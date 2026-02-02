/**
 * Arthentix - Artist Portal JavaScript
 * Multi-step form, AI analysis simulation, Certificate generation
 */

// ============================================
// FORM STATE MANAGEMENT
// ============================================
const formState = {
    currentStep: 1,
    totalSteps: 4,
    artworkData: {},
    uploadedImages: {
        main: null,
        detail: null,
        signature: null,
        texture: null,
        back: null
    },
    certificateId: null,
    blockchainHash: null
};

// ============================================
// STEP NAVIGATION
// ============================================
const progressSteps = document.querySelectorAll('.progress-steps .step');
const formSteps = document.querySelectorAll('.form-step');
const nextButtons = document.querySelectorAll('.next-step');
const prevButtons = document.querySelectorAll('.prev-step');

function updateProgress(step) {
    progressSteps.forEach((s, index) => {
        if (index + 1 < step) {
            s.classList.add('completed');
            s.classList.remove('active');
        } else if (index + 1 === step) {
            s.classList.add('active');
            s.classList.remove('completed');
        } else {
            s.classList.remove('active', 'completed');
        }
    });
}

function showStep(step) {
    formSteps.forEach(fs => {
        fs.classList.remove('active');
        if (parseInt(fs.dataset.step) === step) {
            fs.classList.add('active');
        }
    });
    updateProgress(step);
    formState.currentStep = step;

    // Trigger step-specific actions
    if (step === 3) {
        startAnalysis();
    } else if (step === 4) {
        generateCertificate();
    }

    // Scroll to top of form
    document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function validateStep(step) {
    if (step === 1) {
        const required = ['artworkTitle', 'artistName', 'artistEmail', 'artworkMedium', 'artworkYear'];
        let valid = true;

        required.forEach(field => {
            const input = document.getElementById(field);
            if (!input.value.trim()) {
                input.classList.add('error');
                valid = false;
            } else {
                input.classList.remove('error');
            }
        });

        if (!valid) {
            ArthentixUtils.showToast('Please fill in all required fields', 'error');
        }

        return valid;
    }

    if (step === 2) {
        if (!formState.uploadedImages.main) {
            ArthentixUtils.showToast('Please upload at least the main artwork image', 'error');
            return false;
        }
        return true;
    }

    return true;
}

nextButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        if (validateStep(formState.currentStep)) {
            // Collect form data on step 1
            if (formState.currentStep === 1) {
                collectFormData();
            }
            showStep(formState.currentStep + 1);
        }
    });
});

prevButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        showStep(formState.currentStep - 1);
    });
});

function collectFormData() {
    formState.artworkData = {
        title: document.getElementById('artworkTitle').value,
        artistName: document.getElementById('artistName').value,
        artistEmail: document.getElementById('artistEmail').value,
        medium: document.getElementById('artworkMedium').value,
        mediumLabel: document.getElementById('artworkMedium').options[document.getElementById('artworkMedium').selectedIndex].text,
        year: document.getElementById('artworkYear').value,
        dimensions: document.getElementById('artworkDimensions').value,
        estimatedValue: document.getElementById('estimatedValue').value,
        description: document.getElementById('artworkDescription').value,
        styles: Array.from(document.querySelectorAll('input[name="artStyle"]:checked')).map(cb => cb.value)
    };
}

// ============================================
// FILE UPLOAD HANDLING
// ============================================
const mainImageInput = document.getElementById('mainImage');
const mainPreview = document.getElementById('mainPreview');

// Main image upload
if (mainImageInput) {
    const mainUploadCard = mainImageInput.closest('.upload-card');

    mainUploadCard.addEventListener('click', () => {
        mainImageInput.click();
    });

    mainUploadCard.addEventListener('dragover', (e) => {
        e.preventDefault();
        mainUploadCard.classList.add('dragover');
    });

    mainUploadCard.addEventListener('dragleave', () => {
        mainUploadCard.classList.remove('dragover');
    });

    mainUploadCard.addEventListener('drop', (e) => {
        e.preventDefault();
        mainUploadCard.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0 && files[0].type.startsWith('image/')) {
            handleMainImageUpload(files[0]);
        }
    });

    mainImageInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleMainImageUpload(e.target.files[0]);
        }
    });
}

function handleMainImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        formState.uploadedImages.main = e.target.result;
        mainPreview.innerHTML = `
            <img src="${e.target.result}" alt="Artwork preview">
            <button type="button" class="remove-image" onclick="removeMainImage(event)">
                <i class="fas fa-times"></i>
            </button>
        `;
        mainPreview.style.display = 'block';
        mainImageInput.closest('.upload-card').classList.add('has-image');
        ArthentixUtils.showToast('Image uploaded successfully', 'success');
    };
    reader.readAsDataURL(file);
}

function removeMainImage(e) {
    e.stopPropagation();
    formState.uploadedImages.main = null;
    mainPreview.innerHTML = '';
    mainPreview.style.display = 'none';
    mainImageInput.value = '';
    mainImageInput.closest('.upload-card').classList.remove('has-image');
}

// Additional image uploads
document.querySelectorAll('.small-upload').forEach(card => {
    const input = card.querySelector('input[type="file"]');
    const preview = card.querySelector('.upload-preview');

    card.addEventListener('click', () => input.click());

    input.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (ev) => {
                const key = input.name.replace('Image', '');
                formState.uploadedImages[key] = ev.target.result;
                preview.innerHTML = `<img src="${ev.target.result}" alt="Preview">`;
                preview.style.display = 'block';
                card.classList.add('has-image');
            };
            reader.readAsDataURL(file);
        }
    });
});

// ============================================
// AI ANALYSIS SIMULATION
// ============================================
function startAnalysis() {
    const analysisItems = document.querySelectorAll('.analysis-item');
    const analysisResult = document.getElementById('analysisResult');
    const analysisActions = document.getElementById('analysisActions');
    const analysisImage = document.getElementById('analysisImage');

    // Set the image being analyzed
    if (formState.uploadedImages.main) {
        analysisImage.src = formState.uploadedImages.main;
    }

    // Hide result initially
    analysisResult.style.display = 'none';
    analysisActions.style.display = 'none';

    // Reset all items
    analysisItems.forEach(item => {
        item.classList.remove('completed', 'active');
    });

    // Simulate analysis steps
    const delays = [0, 1500, 3000, 4500];
    const durations = [1200, 1200, 1200, 1200];

    analysisItems.forEach((item, index) => {
        setTimeout(() => {
            item.classList.add('active');

            setTimeout(() => {
                item.classList.remove('active');
                item.classList.add('completed');

                // Show result after last step
                if (index === analysisItems.length - 1) {
                    setTimeout(() => {
                        analysisResult.style.display = 'block';
                        analysisActions.style.display = 'flex';

                        // Generate certificate ID and hash
                        formState.certificateId = ArthentixUtils.generateCertificateId();
                        formState.blockchainHash = '0x' + ArthentixUtils.simpleHash(
                            formState.artworkData.title +
                            formState.artworkData.artistName +
                            Date.now()
                        ) + ArthentixUtils.simpleHash(Math.random().toString()).substring(0, 24);

                        ArthentixUtils.showToast('Artwork authenticated successfully!', 'success');
                    }, 500);
                }
            }, durations[index]);
        }, delays[index]);
    });
}

// ============================================
// CERTIFICATE GENERATION
// ============================================
function generateCertificate() {
    const certId = document.getElementById('certId');
    const certTitle = document.getElementById('certTitle');
    const certArtist = document.getElementById('certArtist');
    const certMedium = document.getElementById('certMedium');
    const certYear = document.getElementById('certYear');
    const certDate = document.getElementById('certDate');
    const certHash = document.getElementById('certHash');
    const certQR = document.getElementById('certQR');
    const certArtworkImage = document.getElementById('certArtworkImage');

    // Populate certificate
    certId.textContent = formState.certificateId;
    certTitle.textContent = formState.artworkData.title;
    certArtist.textContent = formState.artworkData.artistName;
    certMedium.textContent = formState.artworkData.mediumLabel;
    certYear.textContent = formState.artworkData.year;
    certDate.textContent = ArthentixUtils.formatDate(new Date());
    certHash.textContent = formState.blockchainHash;

    // Set artwork image
    if (formState.uploadedImages.main) {
        certArtworkImage.src = formState.uploadedImages.main;
    }

    // Generate QR code
    const verifyUrl = `https://arthentix.com/verify/${formState.certificateId}`;
    certQR.src = ArthentixUtils.generateQRCode(verifyUrl);

    // Save to local storage for demo
    const savedArtworks = ArthentixUtils.getFromStorage('artworks') || [];
    savedArtworks.push({
        id: formState.certificateId,
        hash: formState.blockchainHash,
        ...formState.artworkData,
        mainImage: formState.uploadedImages.main,
        registeredAt: new Date().toISOString()
    });
    ArthentixUtils.saveToStorage('artworks', savedArtworks);
}

// ============================================
// CERTIFICATE DOWNLOAD
// ============================================
document.getElementById('downloadCert')?.addEventListener('click', () => {
    // In production, this would generate a real PDF
    // For POC, we'll create a simple image download
    ArthentixUtils.showToast('Generating PDF certificate...', 'info');

    setTimeout(() => {
        // Simulate PDF generation
        const certElement = document.querySelector('.certificate-document');

        // For demo, show success
        ArthentixUtils.showToast('Certificate downloaded!', 'success');

        // In production: use html2canvas + jsPDF
        // html2canvas(certElement).then(canvas => {
        //     const pdf = new jsPDF();
        //     pdf.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0);
        //     pdf.save(`Arthentix_Certificate_${formState.certificateId}.pdf`);
        // });
    }, 1500);
});

// ============================================
// SHARE FUNCTIONALITY
// ============================================
document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const verifyUrl = `https://arthentix.com/verify/${formState.certificateId}`;
        const title = btn.getAttribute('title');

        if (title === 'Copy Link') {
            navigator.clipboard.writeText(verifyUrl).then(() => {
                ArthentixUtils.showToast('Link copied to clipboard!', 'success');
            });
        } else if (title === 'WhatsApp') {
            const text = encodeURIComponent(`Check out my authenticated artwork on Arthentix!\n\n${formState.artworkData.title} by ${formState.artworkData.artistName}\n\nVerify: ${verifyUrl}`);
            window.open(`https://wa.me/?text=${text}`, '_blank');
        } else if (title === 'Email') {
            const subject = encodeURIComponent(`Arthentix Certificate: ${formState.artworkData.title}`);
            const body = encodeURIComponent(`I've registered my artwork "${formState.artworkData.title}" on Arthentix.\n\nCertificate ID: ${formState.certificateId}\nVerify authenticity: ${verifyUrl}`);
            window.location.href = `mailto:?subject=${subject}&body=${body}`;
        }
    });
});

// ============================================
// FORM INPUT ANIMATIONS
// ============================================
document.querySelectorAll('.form-group input, .form-group select, .form-group textarea').forEach(input => {
    input.addEventListener('focus', () => {
        input.parentElement.classList.add('focused');
    });

    input.addEventListener('blur', () => {
        input.parentElement.classList.remove('focused');
        if (input.value) {
            input.parentElement.classList.add('has-value');
        } else {
            input.parentElement.classList.remove('has-value');
        }
    });
});

// ============================================
// INITIALIZE
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    showStep(1);
});
