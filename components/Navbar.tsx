'use client';

import React, { useState, useEffect } from 'react';
import { formatTimeShort, getUserLocation, getLiveWeather } from '@/lib/kore';
import { WeatherData } from '@/lib/types';

export default function Navbar() {
  const [localTime, setLocalTime] = useState('');
  const [city, setCity] = useState('York, PA');
  const [weather, setWeather] = useState<WeatherData>({
    temp: 74,
    unit: '°F',
    condition: 'Sunny',
    icon: '☀️',
  });
  const [activeSection, setActiveSection] = useState('hero-wrapper');

  useEffect(() => {
    setLocalTime(formatTimeShort(new Date()));
    const timeTimer = setInterval(() => {
      setLocalTime(formatTimeShort(new Date()));
    }, 1000);

    const unit = (localStorage.getItem('userTempUnit') as 'fahrenheit' | 'celsius') || 'fahrenheit';
    const initLocationAndWeather = async () => {
      try {
        const loc = await getUserLocation();
        setCity(loc.city || 'Local');
        const w = await getLiveWeather(loc.latitude, loc.longitude, unit);
        setWeather(w);
      } catch {
        // ignore
      }
    };
    initLocationAndWeather();

    // IntersectionObserver to highlight active nav link
    const sections = document.querySelectorAll('.content-section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.getAttribute('id') || '');
          }
        });
      },
      { root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );

    sections.forEach((sec) => observer.observe(sec));

    return () => {
      clearInterval(timeTimer);
      observer.disconnect();
    };
  }, []);

  const handleReturnToWallpaper = (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById('daily-widget');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header id="site-header" className="main-nav-header">
      <div className="nav-container">
        <div className="branding">
          <a href="#main-content" className="brand-link">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/profiles/rochekollie.jpeg" alt="Roche Kollie" className="brand-avatar" />
            <span className="brand-name">Roche Kollie</span>
          </a>
        </div>

        <nav className="main-menu" aria-label="Main Navigation">
          <ul className="nav-list">
            <li>
              <a href="#hero-wrapper" className={`nav-link ${activeSection === 'hero-wrapper' ? 'active' : ''}`}>
                Home
              </a>
            </li>
            <li>
              <a href="#skills-wrapper" className={`nav-link ${activeSection === 'skills-wrapper' ? 'active' : ''}`}>
                Skills
              </a>
            </li>
            <li>
              <a href="#projects-wrapper" className={`nav-link ${activeSection === 'projects-wrapper' ? 'active' : ''}`}>
                Projects
              </a>
            </li>
            <li>
              <a href="#about-wrapper" className={`nav-link ${activeSection === 'about-wrapper' ? 'active' : ''}`}>
                About
              </a>
            </li>
            <li>
              <a href="#contact-wrapper" className={`nav-link ${activeSection === 'contact-wrapper' ? 'active' : ''}`}>
                Contact
              </a>
            </li>
            <li>
              <a href="#contact-wrapper" className="nav-btn hire-me-btn">
                Hire Me
              </a>
            </li>
          </ul>
        </nav>

        <div className="header-actions">
          <div id="nav-live-widget" className="nav-live-pill" title="Live local weather & time">
            <span id="nav-weather-icon">{weather.icon}</span>
            <span id="nav-weather-temp">{weather.temp}&deg;</span>
            <span className="pill-dot">&bull;</span>
            <span id="nav-weather-city">{city}</span>
            <span className="pill-dot">&bull;</span>
            <span id="nav-local-time">{localTime || '--:--'}</span>
          </div>
          <button
            id="back-to-wallpaper-btn"
            className="wallpaper-return-btn"
            title="Return to wallpaper cover"
            onClick={handleReturnToWallpaper}
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
              <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
            </svg>
            <span>Wallpaper</span>
          </button>
        </div>
      </div>
    </header>
  );
}
