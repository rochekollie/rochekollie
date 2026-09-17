export interface Project {
  id: string;
  title: string;
  badge: string;
  category: 'web' | 'edtech' | 'tools' | 'ambient';
  categoryLabel: string;
  desc: string;
  longDesc?: string;
  tags: string[];
  link: string;
  github?: string;
  caseStudyLink: string;
  featured: boolean;
  year: string;
  metric?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'epael',
    title: 'Epael.com',
    badge: 'Web Application',
    category: 'web',
    categoryLabel: 'Web Applications',
    desc: 'A modern, high-performance web platform engineered for streamlined digital workflows, fast load times, and an intuitive user-centric interface.',
    longDesc: 'Architected with Next.js and strict TypeScript to deliver sub-second page loads, responsive navigation, and robust client-side state management for professional workflows.',
    tags: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS', 'Vercel'],
    link: 'https://epael.com',
    caseStudyLink: '/#contact-wrapper',
    featured: true,
    year: '2025',
    metric: '99.9% Uptime',
  },
  {
    id: 'cleverhigh',
    title: 'CleverHigh.org',
    badge: 'EdTech Hub',
    category: 'edtech',
    categoryLabel: 'EdTech & Learning',
    desc: 'An innovative education platform delivering structured learning pathways, interactive digital resources, and empowering tools for students and educators.',
    longDesc: 'Built with scalable full-stack technologies to support multi-tier curriculums, interactive assessments, real-time feedback, and accessible educational resources.',
    tags: ['React', 'Node.js', 'TypeScript', 'RESTful API', 'PostgreSQL'],
    link: 'https://cleverhigh.org',
    caseStudyLink: '/#contact-wrapper',
    featured: true,
    year: '2024',
    metric: '10k+ Students',
  },
  {
    id: 'whizzkid',
    title: 'Whizzkid.org',
    badge: 'Interactive Learning',
    category: 'edtech',
    categoryLabel: 'EdTech & Learning',
    desc: 'An engaging, accessible educational web application crafted for young learners with gamified modules, cheerful responsive animations, and strict accessibility standards.',
    longDesc: 'Designed from the ground up focusing on WCAG 2.1 AA accessibility, dynamic soundscapes, responsive vector graphics, and delightful micro-interactions that make learning fun.',
    tags: ['TypeScript', 'React', 'CSS Grid', 'Web Audio API', 'a11y'],
    link: 'https://whizzkid.org',
    caseStudyLink: '/#contact-wrapper',
    featured: true,
    year: '2024',
    metric: '100% a11y Score',
  },
  {
    id: 'momentum-hub',
    title: 'Momentum Dev Hub',
    badge: 'Ambient Experience',
    category: 'ambient',
    categoryLabel: 'Ambient & Dashboards',
    desc: 'An ambient daily wallpaper and productivity dashboard featuring dynamic 12-hour background cycles, inspirational curated quotes, and live weather geolocation.',
    longDesc: 'Features custom local-storage caching algorithms, smooth scroll-snap viewport transitions, and an integrated developer dashboard with live clock and weather widgets.',
    tags: ['Next.js App Router', 'React 19', 'Geolocation API', 'CSS Snap', 'Open-Meteo'],
    link: 'https://rochekollie.com',
    github: 'https://github.com/rochekollie/rochekollie',
    caseStudyLink: '/#contact-wrapper',
    featured: false,
    year: '2025',
    metric: 'Sub-30ms TTFB',
  },
  {
    id: 'kore-ambient-engine',
    title: 'Kore Ambient Engine',
    badge: 'Core Utility Library',
    category: 'tools',
    categoryLabel: 'Developer Tools',
    desc: 'A lightweight TypeScript library for ambient time-based cycles, quote scheduling, and privacy-respecting client geolocation caching.',
    longDesc: 'Pure TypeScript utilities engineered with zero heavy dependencies, tested for high reliability, and optimized for client-side state hydration in modern Jamstack architectures.',
    tags: ['TypeScript', 'Micro-Library', 'Zero-Dependency', 'Jest'],
    link: 'https://rochekollie.com',
    github: 'https://github.com/rochekollie/rochekollie',
    caseStudyLink: '/#contact-wrapper',
    featured: false,
    year: '2025',
    metric: '< 4KB Bundle',
  },
  {
    id: 'codepulse-api',
    title: 'CodePulse API Monitor',
    badge: 'Cloud Infrastructure',
    category: 'tools',
    categoryLabel: 'Developer Tools',
    desc: 'Real-time telemetry and API health dashboard for monitoring uptime, request latency, and automated alerting across distributed microservices.',
    longDesc: 'Constructed to track REST endpoint availability, parse response payloads, and generate automated diagnostic summaries with customizable latency thresholds.',
    tags: ['Node.js', 'Express', 'WebSockets', 'Chart.js', 'Docker'],
    link: 'https://rochekollie.com#contact-wrapper',
    caseStudyLink: '/#contact-wrapper',
    featured: false,
    year: '2024',
    metric: 'Real-Time Sync',
  },
];
