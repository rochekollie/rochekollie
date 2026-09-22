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
  caseStudyLink?: string;
  featured: boolean;
  year: string;
  metric?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'binary-playground',
    title: 'Binary Playground',
    badge: 'Web Application',
    category: 'web',
    categoryLabel: 'Web Applications',
    desc: 'An interactive, modern web application for practicing, mastering, and playing with Binary (Base-2), Hexadecimal (Base-16), Octal (Base-8), and Color Studio (RGB / HEX / HSL) conversions.',
    longDesc: 'An interactive, modern web application for practicing, mastering, and playing with Binary (Base-2), Hexadecimal (Base-16), Octal (Base-8), and Color Studio (RGB / HEX / HSL) conversions.',
    tags: ['Web App', 'TypeScript', 'Color Studio', 'Number Systems', 'Interactive'],
    link: 'https://binary-playground.netlify.app/',
    featured: true,
    year: '2025',
    metric: 'Live Application',
  },
  {
    id: 'darksome',
    title: 'Darksome',
    badge: 'VS Code Theme',
    category: 'tools',
    categoryLabel: 'Developer Tools',
    desc: 'Darksome is an intentional, distraction-free VS Code dark theme built for developers who care deeply about visual hierarchy and typographic clarity.',
    longDesc: 'Darksome is an intentional, distraction-free VS Code dark theme built for developers who care deeply about visual hierarchy and typographic clarity.',
    tags: ['VS Code Extension', 'Theme', 'Developer Tools', 'Visual Design', 'Typography'],
    link: 'https://marketplace.visualstudio.com/items?itemName=rochekollie.darksome',
    featured: true,
    year: '2025',
    metric: 'VS Code Marketplace',
  },
];
