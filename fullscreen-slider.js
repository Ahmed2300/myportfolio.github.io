/**
 * Fullscreen Image Slider Functionality
 * This script adds functionality to display app screenshots in a fullscreen slider
 */

// Initialize the fullscreen slider when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const fullScreenSlider = document.getElementById('fullScreenSlider');
    const sliderContent = document.querySelector('.slider-content');
    const sliderClose = document.querySelector('.slider-close');
    const sliderIndicators = document.querySelector('.slider-indicators');
    const sliderCounter = document.querySelector('.slider-counter');
    const prevButton = document.querySelector('.slider-controls .prev');
    const nextButton = document.querySelector('.slider-controls .next');
    
    let currentIndex = 0;
    let images = [];
    
    // Add click event to all images in the app modal gallery
    function initializeImageGallery() {
        // Find all images in the modal gallery
        const modalGallery = document.getElementById('modalImageGallery');
        if (modalGallery) {
            const galleryImages = modalGallery.querySelectorAll('img');
            galleryImages.forEach((img, index) => {
                img.addEventListener('click', function() {
                    openFullscreenSlider(galleryImages, index);
                });
            });
        }
    }
    
    // Open the fullscreen slider with the specified images and starting index
    function openFullscreenSlider(imageElements, startIndex = 0) {
        // Clear previous content
        sliderContent.innerHTML = '';
        sliderIndicators.innerHTML = '';
        
        // Convert NodeList to Array and store image sources
        images = Array.from(imageElements).map(img => img.src);
        currentIndex = startIndex;
        
        // Add a loading indicator
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'slider-loading';
        sliderContent.appendChild(loadingIndicator);
        
        // Create a swipe overlay for touch interactions
        const swipeOverlay = document.createElement('div');
        swipeOverlay.className = 'swipe-overlay';
        sliderContent.appendChild(swipeOverlay);
        
        // Add all images to the slider
        images.forEach((src, index) => {
            // Create image element
            const img = document.createElement('img');
            img.src = src;
            img.alt = `Screenshot ${index + 1}`;
            img.className = index === currentIndex ? 'active' : '';
            sliderContent.appendChild(img);
            
            // Create indicator
            const indicator = document.createElement('div');
            indicator.className = 'slider-indicator' + (index === currentIndex ? ' active' : '');
            indicator.dataset.index = index;
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
            sliderIndicators.appendChild(indicator);
        });
        
        // Update counter
        updateCounter();
        
        // Remove loading indicator when all images are loaded
        Promise.all(Array.from(sliderContent.querySelectorAll('img'))
            .filter(img => !img.complete)
            .map(img => new Promise(resolve => {
                img.onload = img.onerror = resolve;
            })))
            .then(() => {
                loadingIndicator.remove();
            });
        
        // Show the slider
        fullScreenSlider.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Initialize touch events for swiping
        initializeTouchEvents(swipeOverlay);
    }
    
    // Close the fullscreen slider
    function closeFullscreenSlider() {
        fullScreenSlider.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Navigate to a specific slide
    function goToSlide(index) {
        // Update current index
        currentIndex = index;
        
        // Update images
        const allImages = sliderContent.querySelectorAll('img');
        allImages.forEach((img, i) => {
            img.className = i === currentIndex ? 'active' : '';
        });
        
        // Update indicators
        const allIndicators = sliderIndicators.querySelectorAll('.slider-indicator');
        allIndicators.forEach((indicator, i) => {
            indicator.className = 'slider-indicator' + (i === currentIndex ? ' active' : '');
        });
        
        // Update counter
        updateCounter();
    }
    
    // Go to the next slide
    function nextSlide() {
        if (currentIndex < images.length - 1) {
            goToSlide(currentIndex + 1);
        } else {
            // Wrap around to the first slide
            goToSlide(0);
        }
    }
    
    // Go to the previous slide
    function prevSlide() {
        if (currentIndex > 0) {
            goToSlide(currentIndex - 1);
        } else {
            // Wrap around to the last slide
            goToSlide(images.length - 1);
        }
    }
    
    // Update the slide counter
    function updateCounter() {
        sliderCounter.textContent = `${currentIndex + 1} / ${images.length}`;
    }
    
    // Initialize touch events for swiping
    function initializeTouchEvents(element) {
        let startX, startY, distX, distY;
        let threshold = 100; // Minimum distance to be considered a swipe
        
        element.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        }, { passive: true });
        
        element.addEventListener('touchmove', function(e) {
            if (!startX || !startY) return;
            
            distX = e.touches[0].clientX - startX;
            distY = e.touches[0].clientY - startY;
            
            // If horizontal swipe is greater than vertical, prevent scrolling
            if (Math.abs(distX) > Math.abs(distY)) {
                e.preventDefault();
            }
        }, { passive: false });
        
        element.addEventListener('touchend', function(e) {
            if (!distX) return;
            
            if (Math.abs(distX) > threshold) {
                if (distX > 0) {
                    // Swipe right, go to previous
                    prevSlide();
                } else {
                    // Swipe left, go to next
                    nextSlide();
                }
            }
            
            // Reset values
            startX = startY = distX = distY = null;
        }, { passive: true });
    }
    
    // Keyboard navigation
    function handleKeyboardNavigation(e) {
        if (!fullScreenSlider.classList.contains('active')) return;
        
        switch (e.key) {
            case 'ArrowLeft':
                prevSlide();
                break;
            case 'ArrowRight':
                nextSlide();
                break;
            case 'Escape':
                closeFullscreenSlider();
                break;
        }
    }
    
    // Event listeners
    sliderClose.addEventListener('click', closeFullscreenSlider);
    prevButton.addEventListener('click', prevSlide);
    nextButton.addEventListener('click', nextSlide);
    document.addEventListener('keydown', handleKeyboardNavigation);
    
    // Close if click outside the content
    fullScreenSlider.addEventListener('click', function(e) {
        if (e.target === fullScreenSlider) {
            closeFullscreenSlider();
        }
    });
    
    // Initialize gallery click events on DOM load and when the modal is opened
    initializeImageGallery();
    
    // Re-initialize when app modal content changes
    // This ensures newly loaded images have click events attached
    const appModal = document.getElementById('projectDetailModal');
    if (appModal) {
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.target.id === 'modalImageGallery') {
                    initializeImageGallery();
                }
            });
        });
        
        observer.observe(document.getElementById('modalImageGallery'), { 
            childList: true 
        });
    }
});
