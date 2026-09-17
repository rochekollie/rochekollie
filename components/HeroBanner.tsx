'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getUserLocation } from '@/lib/kore';

export default function HeroBanner() {
  const [locationStr, setLocationStr] = useState('York, PA • Remote');

  useEffect(() => {
    const fetchLoc = async () => {
      try {
        const loc = await getUserLocation();
        setLocationStr(`${loc.city}, ${loc.region || 'Remote'}`);
      } catch {
        // ignore
      }
    };
    fetchLoc();
  }, []);

  return (
    <section id="hero-wrapper" className="content-section hero-banner-section">
      <div className="banner-ambient-glow glow-top-right" aria-hidden="true" />
      <div className="banner-ambient-glow glow-bottom-left" aria-hidden="true" />
      <div className="banner-grid-overlay" aria-hidden="true" />

      <div className="banner-container">
        {/* LEFT COLUMN: Headline, Mission, Action Buttons & Metrics */}
        <div className="banner-main-col">
          <div className="hero-badge">
            <span className="badge-pulse-dot" />
            <span>Full-Stack Web Developer &bull; Available for hire</span>
          </div>

          <h1 className="hero-title">
            Building digital experiences that{' '}
            <span className="gradient-text">empower people</span>{' '}
            and enrich lives.
          </h1>

          <p className="hero-subtitle">
            Architecting modern, scalable web applications with intuitive UX design, robust backend systems, and high-performance frontend engineering.
          </p>

          <div className="hero-buttons">
            <a href="#contact-wrapper" className="btn btn-primary">
              <span>Let&apos;s build together</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </a>
            <Link href="/projects" className="btn btn-secondary">
              <span>Explore all projects</span>
            </Link>
          </div>

          <div className="banner-metrics-strip">
            <div className="metric-item">
              <span className="metric-value">5+</span>
              <span className="metric-label">Years of Craft</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">100%</span>
              <span className="metric-label">Quality &amp; Delivery</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">Full-Stack</span>
              <span className="metric-label">Frontend to Cloud API</span>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Standout Developer Profile & Tech Stack Showcase */}
        <div className="banner-card-col">
          <div className="interactive-dev-card">
            <div className="card-glow-border" />
            <div className="dev-card-header">
              <div className="dev-card-avatar-wrapper">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/assets/images/profiles/rochekollie.jpeg" alt="Roche Kollie profile" className="dev-card-avatar" />
                <span className="avatar-status-dot" title="Online & Available" />
              </div>
              <div className="dev-card-info">
                <h3 className="dev-name">Roche Kollie</h3>
                <p className="dev-role">Software &amp; Web Engineer</p>
                <span className="dev-location" id="dev-card-location">
                  📍 {locationStr}
                </span>
              </div>
            </div>

            <div className="dev-card-terminal">
              <div className="terminal-bar">
                <span className="term-dot red" />
                <span className="term-dot yellow" />
                <span className="term-dot green" />
                <span className="term-title">stack.config.ts</span>
              </div>
              <div className="terminal-code">
                <p>
                  <span className="c-keyword">const</span> <span className="c-var">stack</span> = &#123;
                </p>
                <p className="indent-1">
                  <span className="c-prop">framework</span>: <span className="c-str">&apos;Next.js &amp; React&apos;</span>,
                </p>
                <p className="indent-1">
                  <span className="c-prop">language</span>: <span className="c-str">&apos;TypeScript&apos;</span>,
                </p>
                <p className="indent-1">
                  <span className="c-prop">backend</span>: [<span className="c-str">&apos;Node.js&apos;</span>, <span className="c-str">&apos;Express&apos;</span>, <span className="c-str">&apos;Python&apos;</span>],
                </p>
                <p className="indent-1">
                  <span className="c-prop">design</span>: [<span className="c-str">&apos;UI/UX&apos;</span>, <span className="c-str">&apos;Design Systems&apos;</span>],
                </p>
                <p className="indent-1">
                  <span className="c-prop">focus</span>: <span className="c-highlight">&apos;Scalability &amp; Delight&apos;</span>
                </p>
                <p>&#125;;</p>
              </div>
            </div>

            <div className="dev-card-tags">
              <span className="dev-tag">⚡ Next.js 15 &amp; React</span>
              <span className="dev-tag">🎯 Strict TypeScript</span>
              <span className="dev-tag">🔒 Scalable APIs</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
