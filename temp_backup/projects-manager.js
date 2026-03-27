/**
 * Projects Manager JS
 * Handles projects listing, editing, and deletion functionality
 */

// ImgBB API Configuration (same as in admin.js)
const IMGBB_API_KEY = "0b36ad9d43f92d97d54f06f906459aa7";
const IMGBB_API_URL = "https://api.imgbb.com/1/upload";

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const projectsList = document.getElementById('projects-list');
    const searchInput = document.getElementById('search-projects');
    const clearSearchBtn = document.getElementById('clear-search');
    const filterSelect = document.getElementById('filter-projects');
    const refreshBtn = document.getElementById('refresh-projects');
    
    // Form Elements
    const editFormContainer = document.getElementById('edit-project-form-container');
    const editForm = document.getElementById('edit-project-form');
    const closeEditFormBtn = document.getElementById('close-edit-form');
    const cancelEditBtn = document.getElementById('cancel-edit');
    
    // Delete Modal Elements
    const deleteModal = document.getElementById('delete-modal');
    const deleteProjectTitle = document.getElementById('delete-project-title');
    const deleteProjectDescription = document.getElementById('delete-project-description');
    const cancelDeleteBtn = document.getElementById('cancel-delete');
    const confirmDeleteBtn = document.getElementById('confirm-delete');
    const closeModalBtn = document.querySelector('#delete-modal .close-button');
    
    // File Input Elements
    const fileInputs = document.querySelectorAll('input[type="file"]');
    const uploadButtons = document.querySelectorAll('.upload-btn');
    
    // Storage for all projects and the current project being edited
    let allProjects = [];
    let currentProjectId = null;
    
    // Initialize Firebase connection
    let db;
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        db = firebase.database();
        console.log("Firebase DB connection established for project manager.");
    } else {
        console.error("Firebase not initialized for project manager.");
        showStatusMessage('error', 'Firebase connection failed. Please check your internet connection and try again.');
        return;
    }
    
    // Initialize event listeners
    initEventListeners();
    
    // Load projects from Firebase
    loadProjects();
    
    /**
     * Initialize all event listeners
     */
    function initEventListeners() {
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', filterProjects);
        }
        
        if (clearSearchBtn) {
            clearSearchBtn.addEventListener('click', () => {
                searchInput.value = '';
                filterProjects();
            });
        }
        
        // Filter functionality
        if (filterSelect) {
            filterSelect.addEventListener('change', filterProjects);
        }
        
        // Refresh button
        if (refreshBtn) {
            refreshBtn.addEventListener('click', loadProjects);
        }
        
        // Edit form
        if (closeEditFormBtn) {
            closeEditFormBtn.addEventListener('click', hideEditForm);
        }
        
        if (cancelEditBtn) {
            cancelEditBtn.addEventListener('click', hideEditForm);
        }
        
        if (editForm) {
            editForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Delete modal
        if (cancelDeleteBtn) {
            cancelDeleteBtn.addEventListener('click', hideDeleteModal);
        }
        
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', hideDeleteModal);
        }
        
        if (confirmDeleteBtn) {
            confirmDeleteBtn.addEventListener('click', deleteProject);
        }
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === deleteModal) {
                hideDeleteModal();
            }
        });
        
        // File upload handlers
        uploadButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetId = btn.getAttribute('data-target');
                const fileInput = document.getElementById(targetId);
                if (fileInput) {
                    fileInput.click();
                }
            });
        });
        
        fileInputs.forEach(input => {
            input.addEventListener('change', handleFileSelection);
        });
    }
    
    /**
     * Load projects from Firebase
     */
    function loadProjects() {
        showLoading(true);
        
        // Reference to apps in Firebase
        const appsRef = db.ref('apps');
        
        appsRef.once('value')
            .then(snapshot => {
                projectsList.innerHTML = ''; // Clear the current list
                allProjects = [];
                
                if (snapshot.exists()) {
                    // Iterate through each project
                    snapshot.forEach(childSnapshot => {
                        const project = childSnapshot.val();
                        project.id = childSnapshot.key; // Add Firebase key as id
                        allProjects.push(project);
                    });
                    
                    // Sort projects
                    sortProjects(filterSelect.value);
                    
                    // Render projects
                    renderProjects(allProjects);
                    
                    showLoading(false);
                    showStatusMessage('success', `Loaded ${allProjects.length} projects successfully!`);
                } else {
                    projectsList.innerHTML = `
                        <div class="no-projects">
                            <span class="material-icons">sentiment_dissatisfied</span>
                            <p>No projects found. Add some projects first!</p>
                            <a href="admin.html" class="btn-primary">
                                <span class="material-icons">add_circle</span> Add Project
                            </a>
                        </div>
                    `;
                    showLoading(false);
                }
            })
            .catch(error => {
                console.error("Error loading projects:", error);
                projectsList.innerHTML = `
                    <div class="error-message">
                        <span class="material-icons">error</span>
                        <p>Error loading projects: ${error.message}</p>
                        <button class="btn-secondary" onclick="loadProjects()">
                            <span class="material-icons">refresh</span> Try Again
                        </button>
                    </div>
                `;
                showLoading(false);
                showStatusMessage('error', `Failed to load projects: ${error.message}`);
            });
    }
    
    /**
     * Render projects to the list
     */
    function renderProjects(projects) {
        if (!projectsList) return;
        
        projectsList.innerHTML = '';
        
        if (projects.length === 0) {
            projectsList.innerHTML = `
                <div class="no-results">
                    <span class="material-icons">search_off</span>
                    <p>No projects match your search criteria.</p>
                    <button class="btn-secondary" id="clear-filters">
                        <span class="material-icons">clear</span> Clear Filters
                    </button>
                </div>
            `;
            
            const clearFiltersBtn = document.getElementById('clear-filters');
            if (clearFiltersBtn) {
                clearFiltersBtn.addEventListener('click', () => {
                    searchInput.value = '';
                    filterSelect.value = 'all';
                    filterProjects();
                });
            }
            
            return;
        }
        
        projects.forEach(project => {
            const projectCard = document.createElement('div');
            projectCard.className = 'project-card';
            projectCard.dataset.id = project.id;
            
            // Create technologies HTML
            let technologiesHTML = '';
            if (project.technologies && Array.isArray(project.technologies)) {
                technologiesHTML = project.technologies
                    .map(tech => `<span class="tech-badge">${tech}</span>`)
                    .join('');
            }
            
            projectCard.innerHTML = `
                <div class="project-thumbnail">
                    <img src="${project.imageUrl || 'images/default-project-thumbnail.png'}" 
                         alt="${project.title || 'Untitled Project'}" 
                         onerror="this.src='images/default-project-thumbnail.png'">
                </div>
                <div class="project-content">
                    <h3>${project.title || 'Untitled Project'}</h3>
                    <p>${project.description || 'No description provided.'}</p>
                    
                    <div class="tech-stack">
                        ${technologiesHTML}
                    </div>
                    
                    <div class="project-actions">
                        <button class="btn-edit" data-id="${project.id}">
                            <span class="material-icons">edit</span> Edit
                        </button>
                        <button class="btn-delete" data-id="${project.id}">
                            <span class="material-icons">delete</span> Delete
                        </button>
                    </div>
                </div>
            `;
            
            projectsList.appendChild(projectCard);
            
            // Add event listeners to buttons
            const editBtn = projectCard.querySelector('.btn-edit');
            const deleteBtn = projectCard.querySelector('.btn-delete');
            
            if (editBtn) {
                editBtn.addEventListener('click', () => {
                    showEditForm(project.id);
                });
            }
            
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => {
                    showDeleteModal(project);
                });
            }
        });
    }
    
    /**
     * Filter projects based on search input and selected filter
     */
    function filterProjects() {
        const searchTerm = searchInput.value.toLowerCase();
        const filterValue = filterSelect.value;
        
        // First sort all projects
        sortProjects(filterValue);
        
        // Then filter them
        const filteredProjects = allProjects.filter(project => {
            return (
                (project.title && project.title.toLowerCase().includes(searchTerm)) ||
                (project.description && project.description.toLowerCase().includes(searchTerm)) ||
                (project.detailedDescription && project.detailedDescription.toLowerCase().includes(searchTerm)) ||
                (project.technologies && project.technologies.some(tech => tech.toLowerCase().includes(searchTerm)))
            );
        });
        
        renderProjects(filteredProjects);
    }
    
    /**
     * Sort projects based on selected filter
     */
    function sortProjects(filterValue) {
        switch (filterValue) {
            case 'recent':
                // Sort by timestamp if available, or ID as fallback
                allProjects.sort((a, b) => {
                    const timestampA = a.timestamp || 0;
                    const timestampB = b.timestamp || 0;
                    return timestampB - timestampA;
                });
                break;
            case 'alphabetical':
                // Sort alphabetically by title
                allProjects.sort((a, b) => {
                    const titleA = (a.title || '').toLowerCase();
                    const titleB = (b.title || '').toLowerCase();
                    return titleA.localeCompare(titleB);
                });
                break;
            default:
                // Default sorting (by ID)
                allProjects.sort((a, b) => {
                    return (a.id || '').localeCompare(b.id || '');
                });
                break;
        }
    }
    
    /**
     * Show edit form for a project
     */
    function showEditForm(projectId) {
        currentProjectId = projectId;
        showLoading(true);
        
        // Fetch the project data from Firebase
        db.ref(`apps/${projectId}`).once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const project = snapshot.val();
                    
                    // Populate the form fields
                    document.getElementById('edit-app-id').value = projectId;
                    document.getElementById('edit-title').value = project.title || '';
                    document.getElementById('edit-description').value = project.description || '';
                    document.getElementById('edit-detailed-description').value = project.detailedDescription || '';
                    document.getElementById('edit-platform').value = project.platform || '';
                    document.getElementById('edit-problem').value = project.problem || '';
                    document.getElementById('edit-solution').value = project.solution || '';
                    
                    // Features (join array with newlines)
                    if (project.features && Array.isArray(project.features)) {
                        document.getElementById('edit-features').value = project.features.join('\n');
                    } else {
                        document.getElementById('edit-features').value = '';
                    }
                    
                    // Technologies (join array with newlines)
                    if (project.technologies && Array.isArray(project.technologies)) {
                        document.getElementById('edit-technologies').value = project.technologies.join('\n');
                    } else {
                        document.getElementById('edit-technologies').value = '';
                    }
                    
                    // Main image
                    document.getElementById('edit-main-image').value = project.imageUrl || '';
                    const mainImagePreview = document.getElementById('edit-main-image-preview');
                    if (mainImagePreview) {
                        mainImagePreview.src = project.imageUrl || 'images/default-project-thumbnail.png';
                        mainImagePreview.onerror = () => {
                            mainImagePreview.src = 'images/default-project-thumbnail.png';
                        };
                    }
                    
                    // Detail images
                    const detailImagesContainer = document.getElementById('edit-detail-images-container');
                    if (detailImagesContainer) {
                        detailImagesContainer.innerHTML = '';
                        
                        if (project.detailImages && Array.isArray(project.detailImages) && project.detailImages.length > 0) {
                            project.detailImages.forEach((imageUrl, index) => {
                                const imageContainer = document.createElement('div');
                                imageContainer.className = 'detail-image-item';
                                imageContainer.dataset.index = index;
                                
                                imageContainer.innerHTML = `
                                    <img src="${imageUrl}" alt="Detail image ${index + 1}" onerror="this.src='images/default-project-thumbnail.png'">
                                    <div class="detail-image-actions">
                                        <input type="url" class="detail-image-url" value="${imageUrl}" placeholder="Image URL">
                                        <button type="button" class="btn-icon btn-remove-image" title="Remove Image">
                                            <span class="material-icons">delete</span>
                                        </button>
                                    </div>
                                `;
                                
                                detailImagesContainer.appendChild(imageContainer);
                                
                                // Add event listener to remove button
                                const removeBtn = imageContainer.querySelector('.btn-remove-image');
                                if (removeBtn) {
                                    removeBtn.addEventListener('click', function() {
                                        imageContainer.remove();
                                    });
                                }
                            });
                        } else {
                            detailImagesContainer.innerHTML = '<p class="no-images">No detail images available</p>';
                        }
                    }
                    
                    // Links
                    document.getElementById('edit-github').value = project.githubUrl || '';
                    document.getElementById('edit-playstore').value = project.playstoreUrl || '';
                    document.getElementById('edit-appstore').value = project.appstoreUrl || '';
                    document.getElementById('edit-demo').value = project.demoUrl || '';
                    
                    // Show the form
                    editFormContainer.classList.remove('hidden');
                    showLoading(false);
                } else {
                    showStatusMessage('error', 'Project not found!');
                    showLoading(false);
                }
            })
            .catch(error => {
                console.error("Error fetching project:", error);
                showStatusMessage('error', `Failed to load project: ${error.message}`);
                showLoading(false);
            });
    }
    
    /**
     * Hide edit form
     */
    function hideEditForm() {
        editFormContainer.classList.add('hidden');
        currentProjectId = null;
        editForm.reset();
    }
    
    /**
     * Show delete confirmation modal
     */
    function showDeleteModal(project) {
        currentProjectId = project.id;
        deleteProjectTitle.textContent = project.title || 'Untitled Project';
        deleteProjectDescription.textContent = project.description || 'No description provided.';
        deleteModal.style.display = 'block';
    }
    
    /**
     * Hide delete confirmation modal
     */
    function hideDeleteModal() {
        deleteModal.style.display = 'none';
        currentProjectId = null;
    }
    
    /**
     * Handle file selection for uploads
     */
    function handleFileSelection(e) {
        const fileInput = e.target;
        const fileNameDisplay = fileInput.nextElementSibling.nextElementSibling;
        
        if (fileInput.files.length > 0) {
            fileNameDisplay.textContent = fileInput.files[0].name;
            
            // If this is the main image file input
            if (fileInput.id === 'edit-main-image-file') {
                uploadImageToImgBB(fileInput.files[0])
                    .then(imageUrl => {
                        // Update the image URL field and preview
                        document.getElementById('edit-main-image').value = imageUrl;
                        document.getElementById('edit-main-image-preview').src = imageUrl;
                        showStatusMessage('success', 'Main image uploaded successfully!');
                    })
                    .catch(error => {
                        console.error("Error uploading image:", error);
                        showStatusMessage('error', `Failed to upload image: ${error.message}`);
                    });
            }
            
            // If this is the detail images file input
            if (fileInput.id === 'edit-detail-images-file') {
                uploadImageToImgBB(fileInput.files[0])
                    .then(imageUrl => {
                        // Create a new detail image item
                        const detailImagesContainer = document.getElementById('edit-detail-images-container');
                        const noImagesMessage = detailImagesContainer.querySelector('.no-images');
                        
                        if (noImagesMessage) {
                            noImagesMessage.remove();
                        }
                        
                        const imageIndex = detailImagesContainer.children.length;
                        const imageContainer = document.createElement('div');
                        imageContainer.className = 'detail-image-item';
                        imageContainer.dataset.index = imageIndex;
                        
                        imageContainer.innerHTML = `
                            <img src="${imageUrl}" alt="Detail image ${imageIndex + 1}" onerror="this.src='images/default-project-thumbnail.png'">
                            <div class="detail-image-actions">
                                <input type="url" class="detail-image-url" value="${imageUrl}" placeholder="Image URL">
                                <button type="button" class="btn-icon btn-remove-image" title="Remove Image">
                                    <span class="material-icons">delete</span>
                                </button>
                            </div>
                        `;
                        
                        detailImagesContainer.appendChild(imageContainer);
                        
                        // Add event listener to remove button
                        const removeBtn = imageContainer.querySelector('.btn-remove-image');
                        if (removeBtn) {
                            removeBtn.addEventListener('click', function() {
                                imageContainer.remove();
                            });
                        }
                        
                        // Reset file input
                        fileInput.value = '';
                        fileNameDisplay.textContent = 'No file chosen';
                        
                        showStatusMessage('success', 'Detail image uploaded successfully!');
                    })
                    .catch(error => {
                        console.error("Error uploading image:", error);
                        showStatusMessage('error', `Failed to upload image: ${error.message}`);
                    });
            }
        } else {
            fileNameDisplay.textContent = 'No file chosen';
        }
    }
    
    /**
     * Upload image to ImgBB
     */
    function uploadImageToImgBB(file) {
        return new Promise((resolve, reject) => {
            showLoading(true);
            
            const formData = new FormData();
            formData.append('image', file);
            
            fetch(`${IMGBB_API_URL}?key=${IMGBB_API_KEY}`, {
                method: 'POST',
                body: formData
            })
                .then(response => response.json())
                .then(result => {
                    showLoading(false);
                    if (result.success) {
                        resolve(result.data.url);
                    } else {
                        reject(new Error(result.error.message || 'Upload failed'));
                    }
                })
                .catch(error => {
                    showLoading(false);
                    reject(error);
                });
        });
    }
    
    /**
     * Handle edit form submission
     */
    function handleFormSubmit(e) {
        e.preventDefault();
        
        if (!currentProjectId) {
            showStatusMessage('error', 'No project selected for editing!');
            return;
        }
        
        showLoading(true);
        
        // Gather form data
        const updatedProject = {
            id: currentProjectId,
            title: document.getElementById('edit-title').value,
            description: document.getElementById('edit-description').value,
            detailedDescription: document.getElementById('edit-detailed-description').value,
            platform: document.getElementById('edit-platform').value,
            problem: document.getElementById('edit-problem').value,
            solution: document.getElementById('edit-solution').value,
            imageUrl: document.getElementById('edit-main-image').value,
            githubUrl: document.getElementById('edit-github').value || null,
            playstoreUrl: document.getElementById('edit-playstore').value || null,
            appstoreUrl: document.getElementById('edit-appstore').value || null,
            demoUrl: document.getElementById('edit-demo').value || null,
            lastUpdated: Date.now()
        };
        
        // Features (convert newline-separated text to array)
        const featuresText = document.getElementById('edit-features').value;
        updatedProject.features = featuresText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        // Technologies (convert newline-separated text to array)
        const technologiesText = document.getElementById('edit-technologies').value;
        updatedProject.technologies = technologiesText
            .split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
        
        // Detail images (collect URLs from inputs)
        const detailImagesContainer = document.getElementById('edit-detail-images-container');
        const detailImageItems = detailImagesContainer.querySelectorAll('.detail-image-item');
        updatedProject.detailImages = Array.from(detailImageItems)
            .map(item => item.querySelector('.detail-image-url').value)
            .filter(url => url.trim().length > 0);
        
        // Update in Firebase
        db.ref(`apps/${currentProjectId}`).update(updatedProject)
            .then(() => {
                hideEditForm();
                showLoading(false);
                showStatusMessage('success', 'Project updated successfully!');
                
                // Reload projects to reflect changes
                loadProjects();
            })
            .catch(error => {
                console.error("Error updating project:", error);
                showLoading(false);
                showStatusMessage('error', `Failed to update project: ${error.message}`);
            });
    }
    
    /**
     * Delete the current project
     */
    function deleteProject() {
        if (!currentProjectId) {
            showStatusMessage('error', 'No project selected for deletion!');
            hideDeleteModal();
            return;
        }
        
        showLoading(true);
        
        // Delete from Firebase
        db.ref(`apps/${currentProjectId}`).remove()
            .then(() => {
                hideDeleteModal();
                showLoading(false);
                showStatusMessage('success', 'Project deleted successfully!');
                
                // Reload projects to reflect changes
                loadProjects();
            })
            .catch(error => {
                console.error("Error deleting project:", error);
                hideDeleteModal();
                showLoading(false);
                showStatusMessage('error', `Failed to delete project: ${error.message}`);
            });
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
        
        // Insert at the top of the main container
        const container = document.querySelector('.admin-container');
        if (container) {
            container.insertBefore(statusMessage, container.firstChild);
            
            // Auto-remove after 5 seconds for success messages
            if (type === 'success') {
                setTimeout(() => {
                    statusMessage.remove();
                }, 5000);
            }
        }
    }
    
    /**
     * Show or hide loading indicator
     */
    function showLoading(show) {
        // Remove any existing loading indicators
        const existingIndicators = document.querySelectorAll('.loading:not(.loading-container)');
        existingIndicators.forEach(indicator => indicator.remove());
        
        if (show) {
            // Create loading indicator
            const loadingIndicator = document.createElement('div');
            loadingIndicator.className = 'loading active';
            loadingIndicator.innerHTML = `
                <div class="loading-spinner"></div>
                <span>Processing...</span>
            `;
            
            // Insert at the top of the main container
            const container = document.querySelector('.admin-container');
            if (container) {
                container.insertBefore(loadingIndicator, container.firstChild);
            }
        }
    }
});
