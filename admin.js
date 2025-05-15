/**
 * Admin Panel JS
 * Handles app form submission, image uploads, and app data management
 */

// ImgBB API Configuration
const IMGBB_API_KEY = "0b36ad9d43f92d97d54f06f906459aa7";
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

// DOM Elements
document.addEventListener('DOMContentLoaded', () => {
    // Form elements
    const appForm = document.getElementById('add-app-form');
    const previewBtn = document.getElementById('preview-app');
    const saveToSheetsBtn = document.getElementById('save-to-sheets');
    const saveToFirebaseBtn = document.getElementById('save-to-firebase');
    const submitBtn = document.getElementById('submit-app');
    const closePreviewBtn = document.getElementById('close-preview');
    const previewContainer = document.getElementById('app-preview');
    const previewCard = document.querySelector('.app-preview-card');
    
    // File upload elements
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    
    // Initialize Firebase
    let db;
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        db = firebase.database();
        console.log("Firebase DB connection established for admin panel.");
    } else {
        console.warn("Firebase not fully initialized for admin panel.");
        showStatusMessage('warning', 'Firebase connection not established. Some features may not work.');
    }
    
    // Initialize event listeners
    initEventListeners();
    
    /**
     * Set up all event listeners for the admin panel
     */
    function initEventListeners() {
        // File upload handling
        uploadButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const fileInput = document.getElementById(targetId);
                fileInput.click();
            });
        });
        
        fileInputs.forEach(input => {
            input.addEventListener('change', handleFileSelection);
        });
        
        // Form actions
        if (previewBtn) previewBtn.addEventListener('click', previewApp);
        if (saveToSheetsBtn) saveToSheetsBtn.addEventListener('click', saveToGoogleSheets);
        if (saveToFirebaseBtn) saveToFirebaseBtn.addEventListener('click', saveToFirebase);
        if (appForm) appForm.addEventListener('submit', handleFormSubmission);
        if (closePreviewBtn) closePreviewBtn.addEventListener('click', () => {
            previewContainer.classList.add('hidden');
        });
    }
    
    /**
     * Handle file selection for uploads
     */
    function handleFileSelection(e) {
        const fileInput = e.target;
        const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling;
        const previewContainer = document.getElementById(`${fileInput.id}-preview`);
        
        if (fileInput.files.length > 0) {
            // Update file name display
            if (fileInput.multiple) {
                fileNameDisplay.textContent = `${fileInput.files.length} files selected`;
            } else {
                fileNameDisplay.textContent = fileInput.files[0].name;
            }
            
            // Clear previous previews
            previewContainer.innerHTML = '';
            
            // Create previews
            if (fileInput.multiple) {
                // Multiple file preview
                Array.from(fileInput.files).forEach(file => {
                    createImagePreview(file, previewContainer);
                });
            } else {
                // Single file preview
                createImagePreview(fileInput.files[0], previewContainer);
            }
        } else {
            fileNameDisplay.textContent = 'No file chosen';
            previewContainer.innerHTML = '';
        }
    }
    
    /**
     * Create image preview from file
     */
    function createImagePreview(file, container) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const previewDiv = document.createElement('div');
            previewDiv.className = 'image-preview';
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Preview';
            
            previewDiv.appendChild(img);
            container.appendChild(previewDiv);
        }
        
        reader.readAsDataURL(file);
    }
    
    /**
     * Upload a single image to ImgBB
     */
    function uploadImageToImgBB(file) {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('image', file);
            
            fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                if (data.success) {
                    resolve(data.data);
                } else {
                    reject(new Error('Upload failed'));
                }
            })
            .catch(error => {
                console.error('Error uploading image:', error);
                reject(error);
            });
        });
    }
    
    /**
     * Upload all images for the app
     */
    async function uploadAllImages() {
        const mainImageFile = document.getElementById('main-image').files[0];
        const detailImageFiles = document.getElementById('detail-images').files;
        const uploadResults = {
            mainImage: null,
            detailImages: []
        };
        
        try {
            // Show loading indicator
            showLoading(true);
            
            // Upload main image
            if (mainImageFile) {
                const mainImageResult = await uploadImageToImgBB(mainImageFile);
                uploadResults.mainImage = mainImageResult.url;
                document.getElementById('main-image-url').value = mainImageResult.url;
            }
            
            // Upload detail images
            if (detailImageFiles.length > 0) {
                const detailImagesUrls = [];
                
                for (let i = 0; i < detailImageFiles.length; i++) {
                    const result = await uploadImageToImgBB(detailImageFiles[i]);
                    detailImagesUrls.push(result.url);
                }
                
                uploadResults.detailImages = detailImagesUrls;
                
                // Store URLs in hidden field
                const detailImagesUrlsContainer = document.getElementById('detail-images-urls');
                detailImagesUrlsContainer.innerHTML = '';
                
                detailImagesUrls.forEach((url, index) => {
                    const input = document.createElement('input');
                    input.type = 'hidden';
                    input.name = `detail-image-url-${index}`;
                    input.value = url;
                    detailImagesUrlsContainer.appendChild(input);
                });
            }
            
            showStatusMessage('success', 'All images uploaded successfully!');
            return uploadResults;
            
        } catch (error) {
            showStatusMessage('error', `Error uploading images: ${error.message}`);
            throw error;
        } finally {
            showLoading(false);
        }
    }
    
    /**
     * Gather all form data into a structured app object
     */
    function gatherFormData() {
        // Get form values
        const appId = document.getElementById('app-id').value;
        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const detailedDescription = document.getElementById('detailed-description').value;
        const platform = document.getElementById('platform').value;
        const problem = document.getElementById('problem').value;
        const solution = document.getElementById('solution').value;
        
        // Get features as array
        const featuresText = document.getElementById('features').value;
        const features = featuresText.split('\n')
            .map(feature => feature.trim())
            .filter(feature => feature.length > 0);
        
        // Get technologies as array
        const technologiesText = document.getElementById('technologies').value;
        const technologies = technologiesText.split('\n')
            .map(tech => tech.trim())
            .filter(tech => tech.length > 0);
        
        // Get image URLs
        const mainImageUrl = document.getElementById('main-image-url').value;
        
        // Get detail image URLs
        const detailImagesUrls = [];
        const detailImagesContainer = document.getElementById('detail-images-urls');
        const detailImageInputs = detailImagesContainer.querySelectorAll('input');
        
        detailImageInputs.forEach(input => {
            detailImagesUrls.push(input.value);
        });
        
        // Get links
        const github = document.getElementById('github').value;
        const playstore = document.getElementById('playstore').value;
        const appstore = document.getElementById('appstore').value;
        const demo = document.getElementById('demo').value;
        
        // Construct the app object
        const appData = {
            id: appId,
            title: title,
            description: description,
            imageUrl: mainImageUrl,
            detailsUrl: `#${appId}-details`,
            detailedDescription: detailedDescription,
            platform: platform,
            detailImages: detailImagesUrls,
            problem: problem,
            solution: solution,
            features: features,
            technologies: technologies,
            links: {
                github: github,
                playstore: playstore,
                appstore: appstore,
                demo: demo
            }
        };
        
        return appData;
    }
    
    /**
     * Save app data to Google Sheets
     */
    async function saveToGoogleSheets() {
        try {
            // Gather form data
            const appData = gatherFormData();
            
            // Show loading indicator
            showLoading(true);
            
            // Check if the Google Sheets API is available
            if (typeof writeAppToSheets !== 'function') {
                showStatusMessage('error', 'Google Sheets API is not available');
                return;
            }
            
            // Write to Google Sheets
            const result = await writeAppToSheets(appData);
            
            showStatusMessage('success', 'App data saved to Google Sheets!');
            console.log('Sheets result:', result);
            
        } catch (error) {
            showStatusMessage('error', `Error saving to Google Sheets: ${error.message}`);
            console.error('Error saving to Google Sheets:', error);
        } finally {
            showLoading(false);
        }
    }
    
    /**
     * Save app data to Firebase
     */
    async function saveToFirebase() {
        try {
            // Gather form data
            const appData = gatherFormData();
            
            // Show loading indicator
            showLoading(true);
            
            // Check if Firebase is available
            if (!db) {
                showStatusMessage('error', 'Firebase is not available');
                return;
            }
            
            // Write to Firebase
            await db.ref(`apps/${appData.id}`).set(appData);
            
            showStatusMessage('success', 'App data saved to Firebase!');
            
        } catch (error) {
            showStatusMessage('error', `Error saving to Firebase: ${error.message}`);
            console.error('Error saving to Firebase:', error);
        } finally {
            showLoading(false);
        }
    }
    
    /**
     * Preview the app card
     */
    function previewApp() {
        try {
            // Gather form data
            const appData = gatherFormData();
            
            // Create preview card
            previewCard.innerHTML = `
                <div class="app-item is-visible">
                    <img src="${appData.imageUrl || 'https://placehold.co/300x200/6366F1/ffffff?text=App+Preview'}" 
                         alt="${appData.title}" onerror="this.src='https://placehold.co/300x200/6366F1/ffffff?text=Image+Error'">
                    <h3>${appData.title}</h3>
                    <p>${appData.description}</p>
                    <button class="btn-details">
                        <span class="material-icons" style="vertical-align: middle; font-size: 18px;">visibility</span> View Details
                    </button>
                </div>
                
                <div class="app-detail-preview">
                    <h4>App Features:</h4>
                    <ul>
                        ${appData.features.map(feature => `<li>${feature}</li>`).join('')}
                    </ul>
                    
                    <h4>Technologies:</h4>
                    <div class="tech-stack">
                        ${appData.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('')}
                    </div>
                </div>
            `;
            
            // Show preview
            previewContainer.classList.remove('hidden');
            
        } catch (error) {
            showStatusMessage('error', `Error creating preview: ${error.message}`);
            console.error('Error creating preview:', error);
        }
    }
    
    /**
     * Handle form submission
     */
    async function handleFormSubmission(e) {
        e.preventDefault();
        
        try {
            // 1. Upload all images
            await uploadAllImages();
            
            // 2. Save to Firebase
            await saveToFirebase();
            
            // 3. Save to Google Sheets
            await saveToGoogleSheets();
            
            // 4. Show success message
            showStatusMessage('success', 'App added successfully and will appear in your portfolio!');
            
            // 5. Reset the form
            setTimeout(() => {
                appForm.reset();
                document.getElementById('main-image-preview').innerHTML = '';
                document.getElementById('detail-images-preview').innerHTML = '';
                document.getElementById('detail-images-urls').innerHTML = '';
                document.querySelectorAll('.file-name').forEach(el => {
                    el.textContent = 'No file chosen';
                });
            }, 2000);
            
        } catch (error) {
            showStatusMessage('error', `Error adding app: ${error.message}`);
            console.error('Error adding app:', error);
        }
    }
    
    /**
     * Show a status message
     */
    function showStatusMessage(type, message) {
        // Remove any existing status messages
        const existingMessages = document.querySelectorAll('.status-message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new status message
        const statusMessage = document.createElement('div');
        statusMessage.className = `status-message status-${type}`;
        
        // Add appropriate icon
        let icon = 'info';
        if (type === 'success') icon = 'check_circle';
        if (type === 'error') icon = 'error';
        if (type === 'warning') icon = 'warning';
        
        statusMessage.innerHTML = `
            <span class="material-icons">${icon}</span>
            <span>${message}</span>
        `;
        
        // Insert after form
        appForm.parentNode.insertBefore(statusMessage, appForm.nextSibling);
        
        // Auto-remove after 5 seconds for success messages
        if (type === 'success') {
            setTimeout(() => {
                statusMessage.remove();
            }, 5000);
        }
    }
    
    /**
     * Show or hide loading indicator
     */
    function showLoading(show) {
        // Remove any existing loading indicators
        const existingIndicators = document.querySelectorAll('.loading');
        existingIndicators.forEach(indicator => indicator.remove());
        
        if (show) {
            // Create loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading active';
            loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Processing...</span>
            `;
            
            // Insert after form
            appForm.parentNode.insertBefore(loadingIndicator, appForm.nextSibling);
        }
    }
});
