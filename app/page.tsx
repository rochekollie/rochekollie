import MomentumCover from '@/components/MomentumCover';
import Navbar from '@/components/Navbar';
import HeroBanner from '@/components/HeroBanner';
import SkillsSection from '@/components/SkillsSection';
import ProjectsSection from '@/components/ProjectsSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      {/* SECTION 1: MOMENTUM WALLPAPER COVER PAGE (100VH SNAP) */}
      <MomentumCover />

      {/* SECTION 2: MAIN APP MENU AND CONTENT (SNAP SECTION) */}
      <div id="main-content" className="content-screen" role="region" aria-label="Main Application and Portfolio">
        <Navbar />
        <HeroBanner />
        <SkillsSection />
        <ProjectsSection />
        <AboutSection />
        <ContactSection />
        <Footer />
      </div>
    </>
  );
}
