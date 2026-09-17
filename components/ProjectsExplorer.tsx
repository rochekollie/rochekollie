'use client';

import React, { useMemo, useState } from 'react';
import Link from 'next/link';
import { PROJECTS, Project } from '@/lib/projects';

type CategoryFilter = 'all' | 'web' | 'edtech' | 'tools' | 'ambient';

export default function ProjectsExplorer() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: 'All Projects' },
    { key: 'web', label: 'Web Applications' },
    { key: 'edtech', label: 'EdTech & Learning' },
    { key: 'tools', label: 'Developer Tools' },
    { key: 'ambient', label: 'Ambient UI' },
  ];

  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((proj: Project) => {
      const matchesCategory =
        selectedCategory === 'all' || proj.category === selectedCategory;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        proj.title.toLowerCase().includes(q) ||
        proj.desc.toLowerCase().includes(q) ||
        (proj.longDesc && proj.longDesc.toLowerCase().includes(q)) ||
        proj.badge.toLowerCase().includes(q) ||
        proj.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const handleReset = () => {
    setSelectedCategory('all');
    setSearchQuery('');
  };

  return (
    <div className="projects-page-wrapper">
      {/* AMBIENT BACKGROUND GLOWS */}
      <div className="banner-ambient-glow glow-top-right" aria-hidden="true" />
      <div className="banner-ambient-glow glow-bottom-left" aria-hidden="true" />
      <div className="banner-grid-overlay" aria-hidden="true" />

      <div className="section-container projects-content-container">
        {/* HEADER SECTION */}
        <header className="projects-header text-center">
          <div className="hero-badge">
            <span className="badge-pulse-dot" />
            <span>Portfolio &bull; Engineering Catalog</span>
          </div>
          <h1 className="section-title projects-main-title">
            Featured Work &amp; <span className="gradient-text">Production Projects</span>
          </h1>
          <p className="section-desc projects-main-desc">
            A comprehensive collection of web applications, accessible educational hubs, high-performance UI systems, and developer tools built with modern full-stack architectures.
          </p>

          {/* QUICK METRICS STRIP */}
          <div className="projects-metrics-strip">
            <div className="metric-item">
              <span className="metric-value">{PROJECTS.length}</span>
              <span className="metric-label">Featured Projects</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">100%</span>
              <span className="metric-label">Strict TypeScript</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">Next.js 16</span>
              <span className="metric-label">React 19 &bull; App Router</span>
            </div>
            <div className="metric-divider" />
            <div className="metric-item">
              <span className="metric-value">a11y</span>
              <span className="metric-label">Accessible Design</span>
            </div>
          </div>
        </header>

        {/* CONTROLS: SEARCH & CATEGORY FILTER */}
        <section className="projects-controls-container" aria-label="Projects filters and search">
          {/* SEARCH BOX */}
          <div className="projects-search-wrapper">
            <div className="projects-search-input-box">
              <svg
                className="search-icon"
                xmlns="http://www.w3.org/2000/svg"
                height="18"
                viewBox="0 0 24 24"
                width="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, technology (e.g. Next.js, React), or keyword..."
                className="projects-search-input"
                aria-label="Search projects"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="search-clear-btn"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  &times;
                </button>
              )}
            </div>
          </div>

          {/* CATEGORY TABS */}
          <div className="projects-filter-tabs" role="tablist" aria-label="Category filters">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.key;
              const count =
                cat.key === 'all'
                  ? PROJECTS.length
                  : PROJECTS.filter((p) => p.category === cat.key).length;

              return (
                <button
                  key={cat.key}
                  role="tab"
                  aria-selected={isActive}
                  className={`project-tab-btn ${isActive ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat.key)}
                >
                  <span>{cat.label}</span>
                  <span className="tab-count-badge">{count}</span>
                </button>
              );
            })}
          </div>

          {/* ACTIVE FILTER SUMMARY */}
          <div className="projects-results-count">
            <span>
              Showing <strong>{filteredProjects.length}</strong> of {PROJECTS.length} projects
            </span>
            {(selectedCategory !== 'all' || searchQuery) && (
              <button type="button" className="reset-filter-link" onClick={handleReset}>
                Reset filters
              </button>
            )}
          </div>
        </section>

        {/* PROJECTS CARDS GRID */}
        {filteredProjects.length > 0 ? (
          <div className="projects-grid projects-grid-full">
            {filteredProjects.map((proj) => (
              <article key={proj.id} className="project-card project-card-extended">
                <div className="card-top-meta">
                  <span className="project-badge">{proj.badge}</span>
                  <div className="card-right-badges">
                    {proj.metric && (
                      <span className="project-metric-pill">{proj.metric}</span>
                    )}
                    <span className="project-year-pill">{proj.year}</span>
                  </div>
                </div>

                <h2 className="project-title">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-title-link"
                  >
                    <span>{proj.title}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="17"
                      viewBox="0 0 24 24"
                      width="17"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>
                </h2>

                <p className="project-desc">{proj.desc}</p>
                {proj.longDesc && (
                  <p className="project-long-desc">{proj.longDesc}</p>
                )}

                {/* TECH STACK TAGS */}
                <div className="tag-group project-tags">
                  {proj.tags.map((tag) => (
                    <span key={tag} className="tag project-tag-pill">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="project-actions">
                  <a
                    href={proj.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-project btn-project-primary"
                  >
                    <span>View Project</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      viewBox="0 0 24 24"
                      width="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </a>

                  <Link
                    href={proj.caseStudyLink}
                    className="btn-project btn-project-secondary"
                  >
                    <span>Case Study</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="15"
                      viewBox="0 0 24 24"
                      width="15"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                    </svg>
                  </Link>

                  {proj.github && (
                    <a
                      href={proj.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-project btn-project-github"
                      title="View Source on GitHub"
                      aria-label={`${proj.title} GitHub repository`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span>Code</span>
                    </a>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* EMPTY STATE */
          <div className="projects-empty-state">
            <div className="empty-state-icon">🔍</div>
            <h3>No projects found</h3>
            <p>
              We couldn&apos;t find any projects matching &ldquo;{searchQuery}&rdquo; in this category.
            </p>
            <button type="button" className="btn btn-secondary" onClick={handleReset}>
              Reset search &amp; filters
            </button>
          </div>
        )}

        {/* BOTTOM CALL TO ACTION BANNER */}
        <section className="projects-cta-banner">
          <div className="cta-banner-content">
            <span className="hero-badge" style={{ marginBottom: '1rem' }}>
              <span className="badge-pulse-dot" />
              <span>Available for Hire &bull; Worldwide &bull; Remote</span>
            </span>
            <h2 className="cta-banner-title">
              Have an idea or need a <span className="gradient-text">Full-Stack Engineer</span>?
            </h2>
            <p className="cta-banner-desc">
              Whether you need scalable cloud architecture, snappy Next.js &amp; React engineering, or design system execution, let&apos;s collaborate to build something remarkable.
            </p>
            <div className="cta-banner-actions">
              <Link href="/#contact-wrapper" className="btn btn-primary">
                <span>Start a conversation</span>
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link href="/" className="btn btn-secondary">
                <span>Back to Home</span>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
