/**
 * Theme Toggle Functionality
 * Implements dark/light theme switching with localStorage persistence
 */

document.addEventListener('DOMContentLoaded', function() {
    // Create theme toggle button
    const themeToggle = document.createElement('div');
    themeToggle.className = 'theme-toggle';
    themeToggle.innerHTML = '<span class="material-icons">dark_mode</span>';
    document.body.appendChild(themeToggle);
    
    // Check for saved theme preference or use preference from OS
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // If theme was saved, apply it
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<span class="material-icons">light_mode</span>';
    }
    
    // Toggle theme when button is clicked
    themeToggle.addEventListener('click', function() {
        document.body.classList.toggle('dark-theme');
        
        // Update localStorage
        if (document.body.classList.contains('dark-theme')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<span class="material-icons">light_mode</span>';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<span class="material-icons">dark_mode</span>';
        }
    });
    
    // Enhance existing project cards
    enhanceProjectCards();
});



/**
 * Enhances project cards with modern UI elements
 */
function enhanceProjectCards() {
    // Enhance both project cards and app cards
    const appItems = document.querySelectorAll('.app-item');
    const platformCategories = ['Android', 'iOS', 'Web App', 'Cross-Platform']; // Common platforms for variety
    
    appItems.forEach((item, index) => {
        // Add animation delay based on index for staggered appearance
        item.style.setProperty('--item-index', index);
        
        // Add category badge
        const categoryIndex = index % platformCategories.length;
        const category = document.createElement('div');
        category.className = 'app-category';
        category.textContent = platformCategories[categoryIndex];
        item.appendChild(category);
        
        // Add modern hover effect to the thumbnail
        const thumbnail = item.querySelector('.app-thumbnail');
        if (thumbnail) {
            // Add subtle overlay gradient
            const overlay = document.createElement('div');
            overlay.className = 'thumbnail-overlay';
            thumbnail.appendChild(overlay);
            
            // Add view project button that appears on hover
            const viewBtn = document.createElement('div');
            viewBtn.className = 'thumbnail-view-btn';
            viewBtn.innerHTML = '<span class="material-icons">visibility</span>';
            thumbnail.appendChild(viewBtn);
            
            // Make the entire thumbnail clickable
            thumbnail.addEventListener('click', function() {
                const detailsBtn = item.querySelector('.btn-details');
                if (detailsBtn) {
                    detailsBtn.click();
                }
            });
        }
        
        // Enhance the app content section
        const content = item.querySelector('.app-content');
        if (content) {
            const tagline = content.querySelector('p');
            if (tagline) {
                tagline.className = 'app-tagline';
            }
        }
    });
    
    // Also handle project items if they exist
    const projectItems = document.querySelectorAll('.project-item');
    projectItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
        
        const thumbnail = item.querySelector('.project-thumbnail');
        if (thumbnail) {
            const overlay = document.createElement('div');
            overlay.className = 'thumbnail-overlay';
            thumbnail.appendChild(overlay);
            
            const viewBtn = document.createElement('div');
            viewBtn.className = 'thumbnail-view-btn';
            viewBtn.innerHTML = '<span class="material-icons">visibility</span>';
            thumbnail.appendChild(viewBtn);
            
            thumbnail.addEventListener('click', function() {
                const detailsBtn = item.querySelector('.btn-details');
                if (detailsBtn) {
                    detailsBtn.click();
                }
            });
        }
    });
}
