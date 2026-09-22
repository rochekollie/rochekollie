import React from 'react';

export default function AboutSection() {
  return (
    <section id="about-wrapper" className="content-section">
      <div id="about" style={{ position: 'relative', top: '-70px', visibility: 'hidden' }} />
      <div className="section-container about-content">
        <div className="about-text">
          <h2 className="section-title">About Me</h2>
          <p className="lead-text">
            Hello! I&apos;m Roche, a developer committed to empowering people and enriching lives through high quality software.
          </p>
          <p>
            With expertise spanning frontend engineering, responsive design, and scalable backend services, I take pride in crafting software that feels effortless, looks beautiful, and performs reliably under the hood.
          </p>
          <p>
            When I&apos;m not writing code, I enjoy exploring new web design trends, photography, and finding inspiration in daily life.
          </p>
        </div>
        <div className="about-highlights">
          <div className="highlight-item">
            <span className="highlight-number">100%</span>
            <span className="highlight-label">Commitment to Quality</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">Modern</span>
            <span className="highlight-label">Next.js &amp; TypeScript Stack</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-number">Global</span>
            <span className="highlight-label">Design &amp; UX Perspective</span>
          </div>
        </div>
      </div>
    </section>
  );
}
