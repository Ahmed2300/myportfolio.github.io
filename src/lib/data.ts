import { Project } from "@/schemas/project.schema";

export const PROJECTS: Project[] = [
  {
    id: "flutter-ecom",
    title: "E-Commerce App (Flutter)",
    description: "A full-featured e-commerce application built with Flutter and Firebase. Features include user authentication, real-time product catalog, shopping cart, and secure checkout flow.",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80", // Premium unsplash placeholder
    category: "Flutter",
    tags: ["Flutter", "Dart", "Firebase", "Provider"],
    featured: true,
    links: {
      github: "https://github.com/Ahmed2300",
    }
  },
  {
    id: "android-chat",
    title: "Real-time Chat App",
    description: "Native Android application implementing real-time messaging using Firebase Realtime Database. Features push notifications, presence indicators, and media sharing.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80", // Premium unsplash placeholder
    category: "Android",
    tags: ["Kotlin", "Android SDK", "Firebase RTDB", "Coroutines"],
    featured: true,
    links: {
      github: "https://github.com/Ahmed2300",
    }
  },
  {
    id: "kodular-dashboard",
    title: "Business Dashboard (Kodular)",
    description: "A comprehensive business management dashboard built using Kodular. Integrates with Google Sheets API for real-time data sync and reporting.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80", // Premium unsplash placeholder
    category: "Cross-Platform",
    tags: ["Kodular", "Google Sheets API", "Low-Code"],
    featured: false,
    links: {
      demo: "https://portfolio.dev",
    }
  },
  {
    id: "mit-iot",
    title: "IoT Controller (MIT App Inventor)",
    description: "Smart home controller application interfacing with ESP32 microcontrollers via Bluetooth Low Energy (BLE).",
    image: "https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?auto=format&fit=crop&q=80", // Premium unsplash placeholder
    category: "Cross-Platform",
    tags: ["MIT App Inventor", "BLE", "IoT"],
    featured: false,
    links: { }
  }
];

export const SKILLS = [
  {
    category: "Core Technologies",
    items: [
      { name: "Flutter", icon: "SiFlutter", level: 95 },
      { name: "Android (Kotlin)", icon: "SiKotlin", level: 90 },
      { name: "Android (Java)", icon: "FaJava", level: 85 },
      { name: "Firebase", icon: "SiFirebase", level: 90 },
    ]
  },
  {
    category: "Low-Code / Builders",
    items: [
      { name: "Kodular", image: "https://upload.wikimedia.org/wikipedia/commons/6/6d/Kodular_Logo.png", level: 98 },
      { name: "MIT App Inventor", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxZeBgDacgroputXgCNkcCxPHaTTE1ybGE9g&s", level: 95 },
    ]
  }
];

/**
 * Simulates an async fetch of projects from a database.
 * Used to demonstrate Server Component data fetching and optimistic UI (Zero CLS loaders).
 */
export const getProjects = async (): Promise<Project[]> => {
  try {
    const res = await fetch('https://wechat-9694d-default-rtdb.firebaseio.com/apps.json', {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      console.error("Failed to fetch projects");
      return [];
    }
    
    const data = await res.json();
    const projects: Project[] = [];
    
    for (const key in data) {
      if (Object.prototype.hasOwnProperty.call(data, key)) {
        const item = data[key];
        
        // Map the firebase properties to our Project interface
        projects.push({
          id: key,
          title: item.title || "Untitled Project",
          description: item.description || "",
          detailedDescription: item.detailedDescription,
          imageUrl: item.imageUrl || "",
          technologies: item.technologies || [],
          platform: item.platform,
          features: item.features,
          problem: item.problem,
          solution: item.solution,
          lastUpdated: item.lastUpdated,
          featured: item.featured || false,
          detailImages: item.detailImages,
          links: {
            demo: item.demoUrl || (item.links && item.links.demo) || undefined,
            github: item.githubUrl || (item.links && item.links.github) || undefined,
            appStore: item.appstoreUrl || (item.links && item.links.appstore) || undefined,
            playStore: item.playstoreUrl || (item.links && item.links.playstore) || undefined
          }
        });
      }
    }
    
    // Sort projects by lastUpdated (newest first)
    return projects.sort((a, b) => {
      const timeA = a.lastUpdated || 0;
      const timeB = b.lastUpdated || 0;
      return timeB - timeA;
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
};

/**
 * Fetches a single project by its ID.
 */
export const getProjectById = async (id: string): Promise<Project | null> => {
  const projects = await getProjects();
  return projects.find((p) => p.id === id) || null;
};
