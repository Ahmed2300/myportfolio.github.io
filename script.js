// Function to handle image errors and replace with placeholders
function handleImageError(img, type = 'general') {
    // Default placeholder based on content type
    let placeholder;
    
    switch(type) {
        case 'project':
            placeholder = 'https://placehold.co/600x400/4759FB/ffffff?text=Project+Preview';
            break;
        case 'profile':
            placeholder = 'https://placehold.co/350x350/4759FB/ffffff?text=Profile+Photo';
            break;
        case 'gallery':
            placeholder = 'https://placehold.co/800x600/4759FB/ffffff?text=Gallery+Image';
            break;
        default:
            placeholder = 'https://placehold.co/600x400/4759FB/ffffff?text=Image+Not+Found';
    }
    
    img.src = placeholder;
    img.classList.add('placeholder-image');
}

// Data source flags - enable/disable as needed
const DATA_SOURCES = {
    useLocalData: false,    // Use hardcoded data in the script
    useFirebase: true,     // Use Firebase as a data source
    useGoogleSheets: false  // Use Google Sheets as a data source
};

// Combined apps data from all sources
let combinedAppsData = [];

// Function to map static project IDs to app IDs if needed
function mapProjectIdToAppId(projectId) {
    // You can customize this mapping if your project IDs don't match app IDs
    // For example: if projectId is 'project1', return 'app1'
    if (projectId.startsWith('project')) {
        const number = projectId.replace('project', '');
        return 'app' + number;
    }
    return projectId;
}

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Firebase
    if (typeof firebase !== 'undefined' && typeof firebaseConfig !== 'undefined') {
        try {
            firebase.initializeApp(firebaseConfig);
            console.log("Firebase initialized successfully");
        } catch (e) {
            console.error("Firebase initialization failed:", e);
            if (e.code === 'app/duplicate-app') {
                console.warn("Firebase app already initialized.");
            }
        }
    } else {
        console.error("Firebase or firebaseConfig is not defined. Make sure firebase-config.js is loaded before script.js and Firebase SDKs are included.");
        return; // Stop execution if Firebase cannot be initialized
    }

    // const db = firebase.database(); // Firebase DB connection commented out for app loading
    let db;
    if (typeof firebase !== 'undefined' && firebase.apps.length > 0) {
        db = firebase.database();
        console.log("Firebase DB connection established for contact form.");
    } else {
        console.warn("Firebase not fully initialized for contact form, or script.js loaded before firebase-config.js. Contact form might not work.");
    }


    // Smooth scrolling for navigation links
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetId = event.currentTarget.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                window.scrollTo({
                    top: targetSection.offsetTop - 70, // Adjust for fixed header height
                    behavior: 'smooth'
                });
            }
        });
    });

    // Contact Form Submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();
            const name = event.target.name.value;
            const email = event.target.email.value;
            const message = event.target.message.value;

            if (name && email && message) {
                if (db) { // Check if Firebase DB is available
                    // Save to Firebase Realtime Database
                    db.ref('contacts/' + Date.now()).set({
                        name: name,
                        email: email,
                        message: message,
                        timestamp: firebase.database.ServerValue.TIMESTAMP
                    })
                    .then(() => {
                        alert('Thank you for your message! It has been saved.');
                        contactForm.reset();
                    })
                    .catch((error) => {
                        console.error('Error saving message to Firebase: ', error);
                        alert('There was an error sending your message. Please try again.');
                    });
                } else {
                    console.warn("Firebase DB not available. Contact message not saved.");
                    alert('Thank you for your message! (Simulated submission - Firebase not connected for contacts)');
                    contactForm.reset();
                }
            } else {
                alert('Please fill in all fields.');
            }
        });
    }

    const localAppsData = [ // Moved localAppsData to a higher scope
        {
            id: "app1",
            title: "Awesome App One",
            description: "This is the first amazing app with cool features. Built with cutting-edge technology.",
            imageUrl: "https://placehold.co/300x200/007bff/ffffff?text=App+One",
            detailsUrl: "#app1-details",
            detailedDescription: "Awesome App One is a revolutionary application designed to streamline your daily tasks with an intuitive interface and powerful backend. It leverages AI to provide personalized experiences. Key features include A, B, and C.",
            platform: "iOS & Android (React Native)",
            detailImages: [
                "https://placehold.co/600x400/007bff/ffffff?text=App+One+Screen+1",
                "https://placehold.co/600x400/007bff/ffffff?text=App+One+Screen+2",
                "https://placehold.co/600x400/007bff/ffffff?text=App+One+Screen+3"
            ],
            problem: "Users struggled to manage daily tasks efficiently with existing solutions.",
            solution: "Developed an intuitive app that uses AI to suggest and organize tasks based on user habits.",
            features: [
                "AI-powered task suggestions",
                "Seamless cloud sync",
                "Customizable notifications"
            ],
            technologies: ["React Native", "Firebase", "AI/ML APIs"],
            links: {
                github: "https://github.com/yourprofile/awesome-app-one",
                playstore: "https://play.google.com/store/apps/details?id=awesomeappone",
                appstore: "https://apps.apple.com/app/id0000000001",
                demo: "https://yourportfolio.dev/awesome-app-one-demo"
            }
        },
        {
            id: "app2",
            title: "Productivity Pro",
            description: "Boost your productivity with this incredible application. Manages tasks and schedules.",
            imageUrl: "https://placehold.co/300x200/28a745/ffffff?text=App+Two",
            detailsUrl: "#app2-details",
            detailedDescription: "Productivity Pro helps you organize your life and work efficiently. It features a robust to-do list, calendar integration, and collaboration tools. Get more done with less effort.",
            platform: "Android (Kotlin)",
            detailImages: [
                "https://placehold.co/600x400/28a745/ffffff?text=App+Two+Screen+1",
                "https://placehold.co/600x400/28a745/ffffff?text=App+Two+Screen+2"
            ],
            problem: "Busy professionals needed a way to manage tasks and schedules in one place.",
            solution: "Created an all-in-one productivity app with calendar, task manager, and collaboration tools.",
            features: [
                "Advanced to-do list",
                "Calendar integration",
                "Team collaboration"
            ],
            technologies: ["Kotlin", "Firebase", "Material Design"],
            links: {
                github: "https://github.com/yourprofile/productivity-pro",
                playstore: "https://play.google.com/store/apps/details?id=productivitypro",
                appstore: "",
                demo: "https://yourportfolio.dev/productivity-pro-demo"
            }
        },
        {
            id: "app3",
            title: "Social Connect",
            description: "Connect with friends and family seamlessly. Share moments and stay in touch.",
            imageUrl: "https://placehold.co/300x200/ffc107/000000?text=App+Three",
            detailsUrl: "#app3-details",
            detailedDescription: "Social Connect is the ultimate platform for staying connected. Enjoy high-quality video calls, instant messaging, and fun filters. Share your life's moments with ease.",
            platform: "Cross-platform (Flutter)",
            detailImages: [
                "https://placehold.co/600x400/ffc107/000000?text=App+Three+Screen+1",
                "https://placehold.co/600x400/ffc107/000000?text=App+Three+Screen+2",
                "https://placehold.co/600x400/ffc107/000000?text=App+Three+Screen+3",
                "https://placehold.co/600x400/ffc107/000000?text=App+Three+Screen+4"
            ],
            problem: "People wanted a simple, secure way to connect and share with loved ones.",
            solution: "Built a cross-platform app for messaging, video calls, and sharing photos with privacy in mind.",
            features: [
                "HD video calls",
                "Instant messaging",
                "Photo sharing with privacy controls"
            ],
            technologies: ["Flutter", "Firebase", "WebRTC"],
            links: {
                github: "https://github.com/yourprofile/social-connect",
                playstore: "https://play.google.com/store/apps/details?id=socialconnect",
                appstore: "https://apps.apple.com/app/id0000000003",
                demo: "https://yourportfolio.dev/social-connect-demo"
            }
        },
        {
            id: "app4",
            title: "Fitness Tracker",
            description: "Track your fitness goals and stay healthy. Monitors workouts and progress.",
            imageUrl: "https://placehold.co/300x200/dc3545/ffffff?text=App+Four",
            detailsUrl: "#app4-details",
            detailedDescription: "Achieve your fitness goals with Fitness Tracker. It offers personalized workout plans, calorie tracking, and detailed performance analytics. Stay motivated and live healthier.",
            platform: "iOS (Swift)",
                detailedDescription: "Achieve your fitness goals with Fitness Tracker. It offers personalized workout plans, calorie tracking, and detailed performance analytics. Stay motivated and live healthier.",
                platform: "iOS (Swift)",
            detailImages: [
                "https://placehold.co/600x400/dc3545/ffffff?text=App+Four+Screen+1"
            ]
        }
    ];

    // Scroll Animations with Intersection Observer
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1 // Trigger when 10% of the element is visible
    };

    let appItemAnimationIndex = 0; // For staggering app item animations

    const observerCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.classList.contains('app-item')) {
                    // Apply stagger delay for app items
                    entry.target.style.transitionDelay = `${appItemAnimationIndex * 0.1}s`;
                    appItemAnimationIndex++; // Increment for the next app item in the same batch
                }
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    };

    const scrollObserver = new IntersectionObserver(observerCallback, observerOptions);

    // Load apps from local JavaScript data
    function loadApps() {
        const appGrid = document.querySelector('.app-grid');
        if (!appGrid) return;
        
        if (!combinedAppsData || combinedAppsData.length === 0) {
            // Create an attractive placeholder with frosted glass effect
            appGrid.innerHTML = `
            <div class="empty-projects-placeholder">
                <div class="placeholder-content">
                    <span class="material-icons placeholder-icon">apps</span>
                    <h3>No Projects Yet</h3>
                    <p>Projects will appear here once they're added to your portfolio.</p>
                    <div class="placeholder-suggestions">
                        <div class="suggestion-card">
                            <span class="material-icons">smartphone</span>
                            <span>Mobile Apps</span>
                        </div>
                        <div class="suggestion-card">
                            <span class="material-icons">code</span>
                            <span>Web Projects</span>
                        </div>
                        <div class="suggestion-card">
                            <span class="material-icons">extension</span>
                            <span>Extensions</span>
                        </div>
                    </div>
                </div>
            </div>`;
            return;
        }
        appItemAnimationIndex = 0; // Reset stagger index each time apps are loaded

        if (combinedAppsData && combinedAppsData.length > 0) {
            combinedAppsData.forEach((app) => {
                const appElement = document.createElement('div');
                appElement.classList.add('app-item'); // This class is for the main card container

                let technologiesHTML = '';
                if (app.technologies && Array.isArray(app.technologies) && app.technologies.length > 0) {
                    technologiesHTML = app.technologies.map(tech => `<span class="tech-badge">${tech}</span>`).join('');
                }

                appElement.innerHTML = `
                    <div class="project-thumbnail">
                        <img src="${app.imageUrl || 'images/default-project-thumbnail.png'}" alt="${app.title || 'Project Image'} Screenshot" onerror="handleImageError(this, 'project')">
                    </div>
                    <div class="project-content">
                        <h3>${app.title || 'Untitled Project'}</h3>
                        <p class="project-tagline">${app.description || 'No description available.'}</p>
                        ${technologiesHTML ? `<div class="tech-stack">${technologiesHTML}</div>` : ''}
                        <a href="#" class="btn-details" data-app-id="${app.id}">
                            <span class="material-icons" style="vertical-align: middle; font-size: 18px;">visibility</span> View Details
                        </a>
                    </div>
                `;
                
                appGrid.appendChild(appElement);
                // Ensure scrollObserver is defined and available in this scope, or pass it if necessary
                if (typeof scrollObserver !== 'undefined') {
                     scrollObserver.observe(appElement); // Observe each app item as it's added
                }

                // Add event listener to the new anchor button
                const detailButton = appElement.querySelector('.btn-details');
                if (detailButton) {
                    detailButton.addEventListener('click', (e) => {
                        e.preventDefault(); // Prevent default anchor behavior
                        openAppModal(app.id);
                    });
                }
            });
        } else {
            appGrid.innerHTML = '<p>No applications to display yet.</p>';
        }
    }

    // Modal functions
    const appModal = document.getElementById('projectDetailModal');
    
    // Helper function to check if an image URL exists (can be used for preloading)
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function() { callback(true); };
        img.onerror = function() { callback(false); };
        img.src = url;
    }
    const closeModalButton = document.querySelector('.modal .close-button');

    function openAppModal(appId) {
        const appData = combinedAppsData.find(app => app.id === appId);
        if (!appData) {
            console.error("App data not found for ID:", appId);
            return;
        }

        // Modal header
        document.getElementById('modalProjectName').textContent = appData.title;
        document.getElementById('modalProjectPlatform').innerHTML = `<span class="material-icons">devices</span> ${appData.platform}`;

        // Modal description (case study/overview)
        document.getElementById('modalAppDescription')?.textContent && (document.getElementById('modalAppDescription').textContent = appData.detailedDescription);

        // Problem
        document.getElementById('modalProjectProblem').textContent = appData.problem || '';
        // Solution
        document.getElementById('modalProjectSolution').textContent = appData.solution || '';
        // Features
        const featuresList = document.getElementById('modalProjectFeatures');
        featuresList.innerHTML = '';
        if (Array.isArray(appData.features)) {
            appData.features.forEach(f => {
                const li = document.createElement('li');
                li.textContent = f;
                featuresList.appendChild(li);
            });
        }
        // Technologies
        const techDiv = document.getElementById('modalProjectTech');
        techDiv.innerHTML = '';
        if (Array.isArray(appData.technologies)) {
            appData.technologies.forEach(tech => {
                const span = document.createElement('span');
                span.className = 'tech-badge';
                
                // Add appropriate icon based on technology name
                let icon = 'code'; // Default icon
                if (tech.toLowerCase().includes('firebase')) icon = 'local_fire_department';
                if (tech.toLowerCase().includes('flutter')) icon = 'flutter_dash';
                if (tech.toLowerCase().includes('android')) icon = 'android';
                if (tech.toLowerCase().includes('ios')) icon = 'apple';
                if (tech.toLowerCase().includes('react')) icon = 'sync';
                if (tech.toLowerCase().includes('angular')) icon = 'change_history';
                if (tech.toLowerCase().includes('vue')) icon = 'trip_origin';
                if (tech.toLowerCase().includes('node')) icon = 'share';
                if (tech.toLowerCase().includes('database')) icon = 'storage';
                if (tech.toLowerCase().includes('api')) icon = 'api';
                
                span.innerHTML = `<span class="material-icons tech-icon">${icon}</span> ${tech}`;
                techDiv.appendChild(span);
            });
        }
        // Links
        const links = appData.links || {};
        const github = document.getElementById('modalGithubLink');
        const playstore = document.getElementById('modalPlayStoreLink');
        const appstore = document.getElementById('modalAppStoreLink');
        const demo = document.getElementById('modalDemoLink');
        if (github) {
            github.href = links.github || '#';
            github.style.display = links.github ? '' : 'none';
        }
        if (playstore) {
            playstore.href = links.playstore || '#';
            playstore.style.display = links.playstore ? '' : 'none';
        }
        if (appstore) {
            appstore.href = links.appstore || '#';
            appstore.style.display = links.appstore ? '' : 'none';
        }
        if (demo) {
            demo.href = links.demo || '#';
            demo.style.display = links.demo ? '' : 'none';
        }
        // Images
        const imageGallery = document.getElementById('modalImageGallery');
        imageGallery.innerHTML = '';
        
        // Add carousel controls
        const carouselControls = document.querySelector('.carousel-controls');
        const carouselIndicators = document.querySelector('.carousel-indicators');
        carouselIndicators.innerHTML = '';
        
        if (Array.isArray(appData.detailImages) && appData.detailImages.length > 0) {
            appData.detailImages.forEach((imgSrc, index) => {
                // Create image element
                const imgElement = document.createElement('img');
                imgElement.src = imgSrc;
                imgElement.alt = `${appData.title} screenshot ${index+1}`;
                imgElement.dataset.index = index;
                imgElement.onerror = function() {
                    handleImageError(this, 'gallery');
                };
                
                // Add loading animation
                imgElement.style.opacity = '0';
                imgElement.onload = function() {
                    setTimeout(() => {
                        imgElement.style.transition = 'opacity 0.5s ease';
                        imgElement.style.opacity = '1';
                    }, index * 100); // Staggered fade-in
                };
                
                imageGallery.appendChild(imgElement);
                
                // Create carousel indicator
                const indicator = document.createElement('div');
                indicator.className = 'indicator' + (index === 0 ? ' active' : '');
                indicator.dataset.index = index;
                indicator.addEventListener('click', () => scrollToImage(index));
                carouselIndicators.appendChild(indicator);
            });
            
            // Show carousel controls if there are multiple images
            if (appData.detailImages.length > 1) {
                carouselControls.style.display = 'flex';
                
                // Setup carousel controls
                const prevButton = carouselControls.querySelector('.prev');
                const nextButton = carouselControls.querySelector('.next');
                
                prevButton.onclick = () => navigateCarousel('prev');
                nextButton.onclick = () => navigateCarousel('next');
            } else {
                carouselControls.style.display = 'none';
            }
        } else {
            // No images available
            const noImageElement = document.createElement('div');
            noImageElement.className = 'no-image-placeholder';
            noImageElement.innerHTML = '<span class="material-icons">image_not_supported</span><p>No screenshots available</p>';
            imageGallery.appendChild(noImageElement);
            carouselControls.style.display = 'none';
        }
        // Open modal (no scroll)
        if (appModal) {
            appModal.style.display = 'block';
            // Add a small delay before adding the is-open class to ensure the display:block takes effect first
            setTimeout(() => {
                appModal.classList.add('is-open');
            }, 10);
        }
    }

    function closeAppModal() {
        if (appModal) {
            appModal.classList.remove('is-open');
            // Wait for the opacity transition to complete before hiding the modal
            setTimeout(() => {
                appModal.style.display = 'none';
                
                // Reset carousel to first image
                const imageGallery = document.getElementById('modalImageGallery');
                if (imageGallery) {
                    imageGallery.scrollLeft = 0;
                }
                
                // Reset indicators
                const indicators = document.querySelectorAll('.carousel-indicators .indicator');
                indicators.forEach((indicator, index) => {
                    indicator.classList.toggle('active', index === 0);
                });
            }, 300); // Match this with your CSS transition duration
        }
    }

    if (closeModalButton) {
        closeModalButton.addEventListener('click', closeAppModal);
    }

    // Carousel navigation functions
    function scrollToImage(index) {
        const gallery = document.getElementById('modalImageGallery');
        const images = gallery.querySelectorAll('img');
        
        if (index >= 0 && index < images.length) {
            // Update active indicator
            const indicators = document.querySelectorAll('.carousel-indicators .indicator');
            indicators.forEach((ind, i) => {
                ind.classList.toggle('active', i === index);
            });
            
            // Smooth scroll to selected image
            const selectedImage = images[index];
            gallery.scrollLeft = selectedImage.offsetLeft;
        }
    }
    
    function navigateCarousel(direction) {
        const gallery = document.getElementById('modalImageGallery');
        const images = gallery.querySelectorAll('img');
        
        // Find current visible image index
        let currentIndex = 0;
        const scrollLeft = gallery.scrollLeft;
        const galleryWidth = gallery.clientWidth;
        
        for (let i = 0; i < images.length; i++) {
            const img = images[i];
            if (img.offsetLeft > scrollLeft - galleryWidth/2 && 
                img.offsetLeft < scrollLeft + galleryWidth/2) {
                currentIndex = i;
                break;
            }
        }
        
        // Calculate target index
        let targetIndex = direction === 'next' ? 
            currentIndex + 1 : currentIndex - 1;
        
        // Handle wrap-around
        if (targetIndex < 0) targetIndex = images.length - 1;
        if (targetIndex >= images.length) targetIndex = 0;
        
        // Scroll to target image
        scrollToImage(targetIndex);
    }
    
    // Close modal if user clicks outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === appModal) {
            closeAppModal();
        }
    });

    // Function to fetch data from all enabled sources and combine them
    async function loadDataFromAllSources() {
        let allAppsData = [];
        const dataPromises = [];
        
        // Load data from local source if enabled
        if (DATA_SOURCES.useLocalData) {
            allAppsData = [...localAppsData];
        }
        
        // Load data from Firebase if enabled
        if (DATA_SOURCES.useFirebase && typeof firebase !== 'undefined' && firebase.apps.length > 0) {
            const firebasePromise = new Promise((resolve, reject) => {
                try {
                    const db = firebase.database();
                    db.ref('apps').once('value')
                        .then(snapshot => {
                            const firebaseData = [];
                            snapshot.forEach(childSnapshot => {
                                firebaseData.push({
                                    id: childSnapshot.key,
                                    ...childSnapshot.val()
                                });
                            });
                            resolve(firebaseData);
                        })
                        .catch(error => {
                            console.warn("Error loading apps from Firebase:", error);
                            resolve([]);
                        });
                } catch (error) {
                    console.warn("Firebase operation failed:", error);
                    resolve([]);
                }
            });
            dataPromises.push(firebasePromise);
        }
        
        // Load data from Google Sheets if enabled
        if (DATA_SOURCES.useGoogleSheets && typeof fetchAppsFromSheets === 'function') {
            const sheetsPromise = new Promise((resolve) => {
                fetchAppsFromSheets()
                    .then(sheetsData => {
                        resolve(sheetsData);
                    })
                    .catch(error => {
                        console.warn("Error loading apps from Google Sheets:", error);
                        resolve([]);
                    });
            });
            dataPromises.push(sheetsPromise);
        }
        
        // Wait for all data sources to resolve
        if (dataPromises.length > 0) {
            try {
                const results = await Promise.all(dataPromises);
                results.forEach(dataArray => {
                    if (Array.isArray(dataArray) && dataArray.length > 0) {
                        allAppsData = [...allAppsData, ...dataArray];
                    }
                });
            } catch (error) {
                console.error("Error combining data from multiple sources:", error);
            }
        }
        
        // Deduplicate apps by ID (keeping the newest version if duplicates exist)
        const uniqueApps = {};
        allAppsData.forEach(app => {
            if (app.id) {
                uniqueApps[app.id] = app;
            }
        });
        
        combinedAppsData = Object.values(uniqueApps);
        return combinedAppsData;
    }
    
    // Initial call to load apps and set up their observers
    loadDataFromAllSources().then(() => {
        loadApps();
        initializeProjectDetailButtons(); // Initialize static project buttons
    });
    
    // Function to initialize event listeners for static project detail buttons
    function initializeProjectDetailButtons() {
        // Select all static project detail buttons
        const projectButtons = document.querySelectorAll('.project-item .btn-details');
        
        projectButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default anchor/submit behavior
                
                // Get the project ID from the data attribute
                const projectId = button.getAttribute('data-project');
                if (projectId) {
                    // Map project ID to app ID if needed
                    const appId = mapProjectIdToAppId(projectId);
                    openAppModal(appId);
                }
            });
        });
    }

    // Observe static sections
    const sectionsToAnimate = document.querySelectorAll('section');
    sectionsToAnimate.forEach(section => {
        scrollObserver.observe(section);
    });
    
    // Add error handling for all existing images in the document
    document.querySelectorAll('img').forEach(img => {
        if (!img.hasAttribute('onerror')) {
            // Determine image type based on classes or parent elements
            let type = 'general';
            
            if (img.closest('.project-card')) type = 'project';
            else if (img.classList.contains('profile-img')) type = 'profile';
            else if (img.closest('.image-gallery')) type = 'gallery';
            
            img.onerror = function() {
                handleImageError(this, type);
            };
        }
    });
});
