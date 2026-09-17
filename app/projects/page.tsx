import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import ProjectsExplorer from '@/components/ProjectsExplorer';
import type {Metadata} from 'next';

export const metadata: Metadata = {
  title: 'Projects | Roche Kollie - Fullstack Web Developer',
  description: 'Explore full-stack web applications, educational platforms, ambient UI systems, and developer tooling engineered by Roche Kollie.',
  keywords: [
    'Roche Kollie Projects',
    'Full-Stack Developer Portfolio',
    'Next.js 16 Projects',
    'React 19',
    'TypeScript',
    'Web Applications',
    'EdTech Platforms',
    'Software Engineer',
  ],
};

export default function ProjectsPage() {
  return (
    <div
      id="main-content"
      className="content-screen projects-page-screen"
      role="region"
      aria-label="Projects and Engineering Catalog"
    >
      <Navbar />
      <main>
        <ProjectsExplorer />
      </main>
      <Footer />
    </div>
  );
}
