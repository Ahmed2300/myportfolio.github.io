// Function to handle image errors and replace with placeholders
function handleImageError(img, type = 'general') {
    // Default placeholder based on content type
    let placeholder;

    switch (type) {
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
    // Initialize Lenis for smooth scrolling
    const lenis = new Lenis({
        autoRaf: true,
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });
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


    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenuIcon = document.getElementById('mobileMenuIcon');
    const mobileMenuPanel = document.getElementById('mobileMenuPanel');

    if (mobileMenuBtn && mobileMenuPanel) {
        mobileMenuBtn.addEventListener('click', () => {
            const isHidden = mobileMenuPanel.classList.contains('hidden');
            if (isHidden) {
                // Open menu
                mobileMenuPanel.classList.remove('hidden');
                // Trigger animation in next frame
                requestAnimationFrame(() => {
                    mobileMenuPanel.classList.remove('opacity-0', '-translate-y-2');
                    mobileMenuPanel.classList.add('opacity-100', 'translate-y-0');
                });
                mobileMenuIcon.textContent = 'close';
            } else {
                // Close menu
                mobileMenuPanel.classList.remove('opacity-100', 'translate-y-0');
                mobileMenuPanel.classList.add('opacity-0', '-translate-y-2');
                // Wait for animation to finish before hiding
                setTimeout(() => {
                    mobileMenuPanel.classList.add('hidden');
                }, 300);
                mobileMenuIcon.textContent = 'menu';
            }
        });
    }

    // Smooth scrolling for all navigation links
    const navLinks = document.querySelectorAll('nav a, .mobile-nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            // Only hijacking hash links
            if (link.getAttribute('href').startsWith('#')) {
                event.preventDefault();
                const targetId = event.currentTarget.getAttribute('href').substring(1);
                const targetSection = document.getElementById(targetId);

                if (targetSection && lenis) {
                    lenis.scrollTo(targetSection, {
                        offset: -80, // Adjust for fixed header height
                    });
                } else if (targetSection) {
                    window.scrollTo({
                        top: targetSection.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }

                // Close mobile menu if open
                if (mobileMenuPanel && !mobileMenuPanel.classList.contains('hidden')) {
                    mobileMenuBtn.click();
                }
            }
        });
    });

    // --- Interactive Light Rope Theme Toggle Physics ---
    const htmlElement = document.documentElement;
    const bodyElement = document.body;

    // Check for saved theme preference or OS preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    // Helper to apply the actual DOM classes
    function applyTheme(isDark) {
        if (isDark) {
            htmlElement.classList.add('dark');
            bodyElement.classList.add('dark-theme');
        } else {
            htmlElement.classList.remove('dark');
            bodyElement.classList.remove('dark-theme');
        }
    }

    // Initialize initial state
    let isCurrentlyDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    applyTheme(isCurrentlyDark);

    class RopeToggle {
        constructor(containerSelector, cordSelector, handleSelector, iconSelector, glowSelector) {
            this.container = document.querySelector(containerSelector);
            if (!this.container) return; // Silent return if not in DOM

            this.cord = this.container.querySelector(cordSelector);
            this.handle = this.container.querySelector(handleSelector);
            this.icon = this.container.querySelector(iconSelector);
            this.glow = glowSelector ? document.querySelector(glowSelector) : null;

            this.isDragging = false;
            this.startY = 0;
            this.currentY = 0;
            this.maxPull = 50; // Maximum pixels the rope can be pulled down
            this.pullThreshold = 35; // Pixels required to trigger the toggle

            this.initThemeState();
            this.bindEvents();
        }

        initThemeState() {
            // Set initial icon
            if (this.icon) {
                this.icon.textContent = isCurrentlyDark ? 'light_mode' : 'dark_mode';
            }
        }

        bindEvents() {
            // Use pointer events for touch & mouse unification
            this.container.addEventListener('pointerdown', this.onDragStart.bind(this));
            window.addEventListener('pointermove', this.onDragMove.bind(this));
            window.addEventListener('pointerup', this.onDragEnd.bind(this));
            // Also allow simple clicks for accessibility/ease
            this.container.addEventListener('click', (e) => {
                if (this.currentY === 0) { // Only count as click if we didn't drag
                    this.triggerToggle();
                    this.snapBack();
                }
            });
        }

        onDragStart(e) {
            this.isDragging = true;
            this.startY = e.clientY;
            this.currentY = 0;

            // Remove snap animation during drag for 1:1 interaction mapping
            this.handle.classList.remove('rope-snap');
            this.cord.classList.remove('rope-snap');

            // Prevent default drag behaviors (e.g. text selection)
            e.preventDefault();
        }

        onDragMove(e) {
            if (!this.isDragging) return;

            const deltaY = e.clientY - this.startY;

            // Only allow pulling down (positive Y)
            if (deltaY > 0) {
                // Apply a friction curve so it gets harder to pull the further down you go
                this.currentY = Math.min(deltaY * 0.6, this.maxPull);

                this.updateDOMTransform();

                // If pulled past threshold, activate glow to indicate it will trigger
                if (this.currentY > this.pullThreshold && this.glow) {
                    this.glow.classList.add('rope-glow-active');
                } else if (this.glow) {
                    this.glow.classList.remove('rope-glow-active');
                }
            }
        }

        onDragEnd(e) {
            if (!this.isDragging) return;
            this.isDragging = false;

            if (this.currentY > this.pullThreshold) {
                this.triggerToggle();
            }

            this.snapBack();
        }

        updateDOMTransform() {
            // Move handle down
            this.handle.style.transform = `translateY(${this.currentY}px)`;
            // Stretch cord (using scaleY and origin-top)
            // Cord needs a base height. We'll set it dynamically based on the handle position.
            this.cord.style.height = `calc(50% + ${this.currentY}px)`;
        }

        snapBack() {
            // Add CSS transition class for spring effect
            this.handle.classList.add('rope-snap');
            this.cord.classList.add('rope-snap');

            // Reset transforms
            this.currentY = 0;
            this.handle.style.transform = `translateY(0px)`;
            this.cord.style.height = `50%`; // Reset to natural height

            if (this.glow) {
                this.glow.classList.remove('rope-glow-active');
            }
        }

        triggerToggle() {
            isCurrentlyDark = !isCurrentlyDark;
            applyTheme(isCurrentlyDark);
            localStorage.setItem('theme', isCurrentlyDark ? 'dark' : 'light');

            // Find all rope instances and update their icons
            document.querySelectorAll('.rope-icon, .rope-icon-mobile').forEach(icon => {
                icon.classList.add('rotate-180', 'scale-75');
                setTimeout(() => {
                    icon.textContent = isCurrentlyDark ? 'light_mode' : 'dark_mode';
                    icon.classList.remove('rotate-180', 'scale-75');
                }, 150);
            });
        }
    }

    // Initialize Desktop and Mobile Ropes
    new RopeToggle('.theme-rope-container', '.theme-cord', '.theme-handle', '.rope-icon', '.theme-glow');
    new RopeToggle('.theme-rope-container-mobile', '.theme-cord-mobile', '.theme-handle-mobile', '.rope-icon-mobile', null);
    // --- End Interactive Light Rope Logic ---

    // Active Link Highlighting on Scroll
    const sections = document.querySelectorAll('section[id]');

    function highlightNavigation() {
        const scrollY = window.scrollY;

        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            const sectionTop = current.offsetTop - 100;
            const sectionId = current.getAttribute('id');

            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll(`nav a[href*=${sectionId}]`).forEach(link => {
                    link.classList.add('text-brand-600', 'dark:text-brand-300');
                    link.classList.remove('text-slate-700', 'dark:text-slate-200');
                    // Add the active after border width class if it has the after element setup
                    if (link.classList.contains('after:w-0')) {
                        link.classList.remove('after:w-0');
                        link.classList.add('after:w-full');
                    }
                });
                document.querySelectorAll(`.mobile-nav-link[href*=${sectionId}]`).forEach(link => {
                    link.classList.add('text-brand-600', 'dark:text-brand-300', 'bg-slate-50', 'dark:bg-slate-800/50');
                    link.classList.remove('text-slate-700', 'dark:text-slate-200');
                });
            } else {
                document.querySelectorAll(`nav a[href*=${sectionId}]`).forEach(link => {
                    link.classList.remove('text-brand-600', 'dark:text-brand-300');
                    link.classList.add('text-slate-700', 'dark:text-slate-200');
                    if (link.classList.contains('after:w-full')) {
                        link.classList.remove('after:w-full');
                        link.classList.add('after:w-0');
                    }
                });
                document.querySelectorAll(`.mobile-nav-link[href*=${sectionId}]`).forEach(link => {
                    link.classList.remove('text-brand-600', 'dark:text-brand-300', 'bg-slate-50', 'dark:bg-slate-800/50');
                    link.classList.add('text-slate-700', 'dark:text-slate-200');
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNavigation);
    // Initial call to set correct state
    highlightNavigation();

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
            <div class="col-span-full py-16 text-center bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                <div class="max-w-md mx-auto">
                    <span class="material-icons text-6xl text-slate-300 dark:text-slate-600 mb-4">apps</span>
                    <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">No Projects Yet</h3>
                    <p class="text-slate-500 dark:text-slate-400 mb-8">Projects will appear here once they're added to your portfolio.</p>
                    <div class="flex flex-wrap justify-center gap-4">
                        <div class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span class="material-icons text-brand-500">smartphone</span>
                            Mobile Apps
                        </div>
                        <div class="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-lg shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300">
                            <span class="material-icons text-indigo-500">code</span>
                            Web Projects
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
                    technologiesHTML = app.technologies.map(tech => `<span class="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-xs font-semibold rounded-full border border-slate-200 dark:border-slate-700">${tech}</span>`).join('');
                }

                appElement.innerHTML = `
                    <div class="relative overflow-hidden group">
                        <img src="${app.imageUrl || 'images/default-project-thumbnail.png'}" 
                             alt="${app.title || 'Project Image'} Screenshot" 
                             onerror="handleImageError(this, 'project')"
                             class="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110">
                        <div class="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-sm">
                            <button class="btn-details bg-brand-500 hover:bg-brand-600 text-white px-6 py-2 rounded-full font-medium tracking-wide flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300" data-app-id="${app.id}">
                                <span class="material-icons text-sm">visibility</span>
                                View Details
                            </button>
                        </div>
                    </div>
                    <div class="p-6">
                        <h3 class="text-xl font-bold text-slate-900 dark:text-white mb-2">${app.title || 'Untitled Project'}</h3>
                        <p class="text-slate-600 dark:text-slate-400 text-sm mb-4 line-clamp-2">${app.description || 'No description available.'}</p>
                        ${technologiesHTML ? `<div class="flex flex-wrap gap-2 mt-auto">${technologiesHTML}</div>` : ''}
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
                        openProjectView(app.id);
                    });
                }
            });
        } else {
            appGrid.innerHTML = '<p>No applications to display yet.</p>';
        }
    }

    // SPA View Functions
    const mainContent = document.getElementById('main-content');
    const projectViewContainer = document.getElementById('project-view-container');

    // Helper function to check if an image URL exists (can be used for preloading)
    function checkImageExists(url, callback) {
        const img = new Image();
        img.onload = function () { callback(true); };
        img.onerror = function () { callback(false); };
        img.src = url;
    }

    function openProjectView(appId) {
        const appData = combinedAppsData.find(app => app.id === appId);
        if (!appData) {
            console.error("App data not found for ID:", appId);
            return;
        }

        // Header
        const heroImg = document.getElementById('pvHeroImage');
        if (heroImg) {
            heroImg.src = appData.imageUrl || 'images/default-project-thumbnail.png';
            heroImg.alt = appData.title || 'Project Hero';
        }

        document.getElementById('pvTitle').textContent = appData.title || 'Untitled';
        const platformText = document.getElementById('pvPlatformText');
        if (platformText) platformText.textContent = appData.platform || 'N/A';

        // Content
        document.getElementById('pvProblem').textContent = appData.problem || 'No problem statement provided.';
        document.getElementById('pvSolution').textContent = appData.solution || appData.description || 'No solution description provided.';

        // Features
        const featuresList = document.getElementById('pvFeatures');
        if (featuresList) {
            featuresList.innerHTML = '';
            if (Array.isArray(appData.features)) {
                appData.features.forEach(f => {
                    const li = document.createElement('li');
                    li.className = "flex items-start gap-3 text-slate-600 dark:text-slate-300";
                    li.innerHTML = `<span class="material-icons text-brand-500 text-base mt-0.5">check_circle</span> <span>${f}</span>`;
                    featuresList.appendChild(li);
                });
            } else {
                featuresList.innerHTML = '<li class="text-slate-500">No features listed.</li>';
            }
        }

        // Technologies
        const techDiv = document.getElementById('pvTech');
        if (techDiv) {
            techDiv.innerHTML = '';
            if (Array.isArray(appData.technologies)) {
                appData.technologies.forEach(tech => {
                    const div = document.createElement('div');
                    div.className = 'px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-xl border border-slate-200 dark:border-slate-700 flex items-center gap-2';

                    let icon = 'code';
                    if (tech.toLowerCase().includes('firebase')) icon = 'local_fire_department';
                    if (tech.toLowerCase().includes('flutter')) icon = 'flutter_dash';
                    if (tech.toLowerCase().includes('android')) icon = 'android';
                    if (tech.toLowerCase().includes('ios')) icon = 'apple';
                    if (tech.toLowerCase().includes('react')) icon = 'sync';

                    div.innerHTML = `<span class="material-icons text-[14px] text-brand-500">${icon}</span> ${tech}`;
                    techDiv.appendChild(div);
                });
            }
        }

        // Links Header
        const linksContainer = document.getElementById('pvLinksHeader');
        if (linksContainer) {
            linksContainer.innerHTML = '';
            const links = appData.links || {};

            const createLink = (url, icon, text, colorClass) => {
                if (!url) return '';
                return `
                    <a href="${url}" target="_blank" class="flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-white text-sm font-medium transition-colors border border-white/10 shadow-lg shadow-black/20 hover:-translate-y-0.5 transform">
                        <i class="${icon} ${colorClass}"></i> ${text}
                    </a>
                `;
            };

            linksContainer.innerHTML += createLink(links.github, 'fab fa-github', 'GitHub', 'text-white');
            linksContainer.innerHTML += createLink(links.playstore, 'fab fa-google-play', 'Play Store', 'text-green-400');
            linksContainer.innerHTML += createLink(links.appstore, 'fab fa-app-store-ios', 'App Store', 'text-blue-400');
            linksContainer.innerHTML += createLink(links.demo, 'fas fa-external-link-alt', 'Live Demo', 'text-brand-400');
        }

        // Masonry Image Gallery
        const gallery = document.getElementById('pvGallery');
        if (gallery) {
            gallery.innerHTML = '';
            if (Array.isArray(appData.detailImages) && appData.detailImages.length > 0) {
                appData.detailImages.forEach((imgSrc, index) => {
                    const imgContainer = document.createElement('div');
                    imgContainer.className = "relative rounded-3xl overflow-hidden shadow-sm break-inside-avoid mb-8 border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50";

                    const img = document.createElement('img');
                    img.src = imgSrc;
                    img.alt = `${appData.title} screenshot ${index + 1}`;
                    img.className = "w-full h-auto object-cover opacity-0 transition-opacity duration-700 hover:scale-[1.02] transform cursor-pointer";
                    img.style.minHeight = "200px";

                    img.onload = () => { img.style.opacity = '1'; };
                    img.onerror = function () { handleImageError(this, 'gallery'); };

                    imgContainer.appendChild(img);
                    gallery.appendChild(imgContainer);
                });
            } else {
                gallery.innerHTML = `
                    <div class="col-span-full py-16 text-center bg-slate-100 dark:bg-slate-800/30 rounded-3xl border border-dashed border-slate-300 dark:border-slate-700">
                        <span class="material-icons text-5xl text-slate-400 mb-4 opacity-50">image_not_supported</span>
                        <p class="text-slate-500 font-medium tracking-wide">No additional screenshots available.</p>
                    </div>
                `;
            }
        }

        // State change: Hide main content and show project view
        if (mainContent && projectViewContainer) {
            // Save scroll position
            document.body.dataset.scrollPos = window.scrollY;

            // Fade out main
            mainContent.style.opacity = '0';

            setTimeout(() => {
                mainContent.classList.add('hidden');
                projectViewContainer.classList.remove('hidden');

                // Scroll to top instantly
                window.scrollTo(0, 0);

                // Need a tiny delay for display:block to calculate correctly before fading in safely
                setTimeout(() => {
                    projectViewContainer.classList.add('opacity-100');
                }, 50);
            }, 300);
        }
    }

    // Expose close to window so inline onclick works
    window.closeProjectView = function () {
        if (mainContent && projectViewContainer) {
            // Hide project view immediate UI response
            projectViewContainer.classList.add('hidden');
            projectViewContainer.classList.remove('opacity-100');

            // Show main content
            mainContent.classList.remove('hidden');

            // Restore scroll position
            const savedPos = parseInt(document.body.dataset.scrollPos || '0', 10);
            window.scrollTo(0, savedPos);

            // Fade in main view
            setTimeout(() => {
                mainContent.style.opacity = '1';
                // Trigger Lenis resize calculation if Lenis is active to fix scroll bounds
                if (window.lenis) {
                    window.lenis.resize();
                }
            }, 50);
        }
    };

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

            img.onerror = function () {
                handleImageError(this, type);
            };
        }
    });

    // =================================================================
    // SPLINE-INSPIRED INTERACTIVE REDESIGN — JavaScript
    // =================================================================

    // --- 1. Scroll-Driven Reveal Animations (Intersection Observer) ---
    (function initScrollAnimations() {
        // Dynamically inject data-animate attributes to key elements
        const sectionHeaders = document.querySelectorAll(
            '#main-content section > div > .text-center, ' +
            '#main-content section > div > .grid'
        );
        sectionHeaders.forEach(el => {
            if (!el.hasAttribute('data-animate') && !el.hasAttribute('data-animate-children')) {
                // Grid containers get staggered children
                if (el.classList.contains('grid')) {
                    el.setAttribute('data-animate-children', '');
                } else {
                    el.setAttribute('data-animate', '');
                }
            }
        });

        // Also animate individual section headings, about panels etc.
        document.querySelectorAll(
            '#main-content .prose, ' +
            '#main-content section > div > div:not(.grid):not(.text-center):not(.absolute):not(.blob-animation-container)'
        ).forEach(el => {
            if (!el.closest('.grid') && !el.hasAttribute('data-animate') && !el.closest('[data-animate]') && !el.closest('[data-animate-children]')) {
                el.setAttribute('data-animate', '');
            }
        });

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target); // Animate only once
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        document.querySelectorAll('[data-animate], [data-animate-children]').forEach(el => {
            observer.observe(el);
        });
    })();

    // --- 2. 3D Tilt Cards (Mouse-Tracking) ---
    (function init3DTiltCards() {
        // Apply tilt-card class to all group cards in the sections
        const cards = document.querySelectorAll(
            '#platforms .group, ' +
            '#ai-tools .group, ' +
            '#languages .group, ' +
            '#about .bg-white\\/60, #about .dark\\:bg-slate-800\\/60'
        );

        cards.forEach(card => {
            card.classList.add('tilt-card', 'glow-border');
            // Create shine element
            const shine = document.createElement('div');
            shine.classList.add('tilt-shine');
            card.appendChild(shine);

            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -6; // Max 6 degrees
                const rotateY = ((x - centerX) / centerX) * 6;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
                card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
                card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = '';
                card.style.removeProperty('--mouse-x');
                card.style.removeProperty('--mouse-y');
            });
        });
    })();

    // --- 3. Hero Parallax (Mouse-Tracking) ---
    (function initHeroParallax() {
        const heroSection = document.getElementById('home');
        if (!heroSection) return;

        const profileWrap = heroSection.querySelector('.relative.w-72, .relative.w-96, .order-1');
        const floatingBadges = heroSection.querySelectorAll('.absolute.animate-bounce, .absolute.animate-\\[bounce_2s_infinite_1s\\], [class*="animate-bounce"], [class*="animate-[bounce"]');

        if (profileWrap) profileWrap.classList.add('parallax-layer');
        floatingBadges.forEach(b => b.classList.add('parallax-layer'));

        heroSection.addEventListener('mousemove', (e) => {
            const rect = heroSection.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;

            if (profileWrap) {
                profileWrap.style.transform = `translate(${x * -15}px, ${y * -15}px)`;
            }
            floatingBadges.forEach((badge, i) => {
                const intensity = (i + 1) * 8;
                badge.style.transform = `translate(${x * intensity}px, ${y * intensity}px)`;
            });
        });

        heroSection.addEventListener('mouseleave', () => {
            if (profileWrap) profileWrap.style.transform = '';
            floatingBadges.forEach(badge => { badge.style.transform = ''; });
        });
    })();

    // --- 4. Ambient Floating Particles ---
    (function initAmbientParticles() {
        const canvas = document.getElementById('ambient-particles');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animId;
        const PARTICLE_COUNT = 40;

        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }

        function createParticle() {
            return {
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                radius: Math.random() * 2 + 1,
                speedX: (Math.random() - 0.5) * 0.3,
                speedY: (Math.random() - 0.5) * 0.3,
                opacity: Math.random() * 0.4 + 0.1,
                phase: Math.random() * Math.PI * 2,
            };
        }

        function init() {
            resize();
            particles = [];
            for (let i = 0; i < PARTICLE_COUNT; i++) {
                particles.push(createParticle());
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const isDark = document.documentElement.classList.contains('dark');
            const color = isDark ? '122, 170, 206' : '53, 88, 114';

            particles.forEach(p => {
                p.x += p.speedX + Math.sin(p.phase) * 0.1;
                p.y += p.speedY + Math.cos(p.phase) * 0.1;
                p.phase += 0.005;

                // Wrap around edges
                if (p.x < -10) p.x = canvas.width + 10;
                if (p.x > canvas.width + 10) p.x = -10;
                if (p.y < -10) p.y = canvas.height + 10;
                if (p.y > canvas.height + 10) p.y = -10;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();
            });

            animId = requestAnimationFrame(draw);
        }

        init();
        draw();
        window.addEventListener('resize', () => {
            resize();
        });
    })();

    // --- 5. Spline Badge Removal ---
    (function removeSplineBadge() {
        // Wait for the Spline scene to load, then remove the badge
        const checkAndRemove = () => {
            const canvasContainer = document.getElementById('canvas3d');
            if (!canvasContainer) return;

            const parent = canvasContainer.parentElement;
            if (!parent) return;

            // The Spline runtime injects an <a> tag or <div> as a sibling of the canvas
            parent.querySelectorAll('a[href*="spline"], div[style*="position: absolute"]').forEach(el => {
                el.style.display = 'none';
                el.style.opacity = '0';
                el.style.pointerEvents = 'none';
            });
        };

        // Check periodically for the first 10 seconds after load
        let attempts = 0;
        const interval = setInterval(() => {
            checkAndRemove();
            attempts++;
            if (attempts > 20) clearInterval(interval);
        }, 500);
    })();

});

