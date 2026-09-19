'use client';

import {formatTimeShort, getLiveWeather, getUserLocation} from '@/lib/kore';
import {WeatherData} from '@/lib/types';
import {useAuth} from '@/lib/authContext';
import {checkIsAdmin} from '@/lib/admin';
import Link from 'next/link';
import {usePathname, useRouter} from 'next/navigation';
import React, {useCallback, useEffect, useState} from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const isProjectsPage = pathname === '/projects';
  const isProfilePage = pathname === '/profile';
  const isAdminPage = pathname === '/admin';
  const isSubPage = isProjectsPage || isProfilePage || isAdminPage;

  const {
    user,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signInWithGithub,
    signOutUser,
    formatAuthError,
  } = useAuth();

  const isAdmin = checkIsAdmin(user);

  const [ localTime, setLocalTime ] = useState('');
  const [ city, setCity ] = useState('York, PA');
  const [ weather, setWeather ] = useState<WeatherData>({
    temp: 74,
    unit: '°F',
    condition: 'Sunny',
    icon: '☀️',
  });
  const [ activeSection, setActiveSection ] = useState('hero-wrapper');

  // Modal states
  const [ authModalOpen, setAuthModalOpen ] = useState(false);
  const [ authTab, setAuthTab ] = useState<'signin' | 'signup'>('signin');
  const [ authEmail, setAuthEmail ] = useState('');
  const [ authPassword, setAuthPassword ] = useState('');
  const [ authName, setAuthName ] = useState('');
  const [ authFeedback, setAuthFeedback ] = useState('');
  const [ isSubmittingAuth, setIsSubmittingAuth ] = useState(false);

  const [ blogModalOpen, setBlogModalOpen ] = useState(false);
  const [ blogEmail, setBlogEmail ] = useState('');
  const [ blogFeedback, setBlogFeedback ] = useState('');

  const closeModals = useCallback(() => {
    setAuthModalOpen(false);
    setBlogModalOpen(false);
    setAuthFeedback('');
    setBlogFeedback('');
  }, []);

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
      {root: null, rootMargin: '-20% 0px -70% 0px', threshold: 0}
    );

    sections.forEach((sec) => observer.observe(sec));

    // Handle Escape key to close modals
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModals();
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      clearInterval(timeTimer);
      observer.disconnect();
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ closeModals ]);

  const handleReturnToWallpaper = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isSubPage) {
      router.push('/');
      return;
    }
    const el = document.getElementById('daily-widget');
    if (el) {
      el.scrollIntoView({behavior: 'smooth'});
    } else {
      router.push('/');
    }
  };

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthFeedback('');
    setIsSubmittingAuth(true);
    try {
      if (authTab === 'signin') {
        await signInWithEmail(authEmail, authPassword);
        setAuthFeedback('Welcome back! Successfully signed in.');
      } else {
        await signUpWithEmail(authEmail, authPassword, authName);
        setAuthFeedback('Account created! Welcome to Roche’s Developer Hub.');
      }
      setTimeout(() => {
        closeModals();
        setAuthPassword('');
        setAuthName('');
      }, 1200);
    } catch (err) {
      setAuthFeedback(formatAuthError(err));
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGoogleAuth = async () => {
    setAuthFeedback('');
    setIsSubmittingAuth(true);
    try {
      await signInWithGoogle();
      setAuthFeedback('Google authentication confirmed!');
      setTimeout(closeModals, 1000);
    } catch (err) {
      setAuthFeedback(formatAuthError(err));
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleGithubAuth = async () => {
    setAuthFeedback('');
    setIsSubmittingAuth(true);
    try {
      await signInWithGithub();
      setAuthFeedback('GitHub authentication confirmed!');
      setTimeout(closeModals, 1000);
    } catch (err) {
      setAuthFeedback(formatAuthError(err));
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleBlogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setBlogFeedback('Subscribed! You’ll get early access to upcoming articles.');
    setTimeout(() => {
      closeModals();
    }, 1600);
  };

  return (
    <>
      <header id="site-header" className="main-nav-header">
        <div className="nav-container">
          <div className="branding">
            <Link href="/" className="brand-link" title="Roche Kollie - Home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/images/profiles/rochekollie.jpeg" alt="Roche Kollie" className="brand-avatar" />
              <span className="brand-name">Roche Kollie</span>
            </Link>
          </div>

          <nav className="main-menu" aria-label="Main Navigation">
            <ul className="nav-list">
              <li>
                <Link
                  href="/projects"
                  className={`nav-link ${ isProjectsPage || activeSection === 'projects-wrapper' ? 'active' : '' }`}
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href={isSubPage ? '/#case-studies' : '#case-studies'}
                  className={`nav-link ${ !isSubPage && activeSection === 'case-studies' ? 'active' : '' }`}
                >
                  Case Studies
                </Link>
              </li>
              <li>
                <a
                  href="#blog"
                  onClick={(e) => {
                    e.preventDefault();
                    setBlogModalOpen(true);
                  }}
                  className={`nav-link ${ blogModalOpen ? 'active' : '' }`}
                >
                  Blog
                </a>
              </li>
              <li>
                <Link
                  href={isSubPage ? '/#contact-wrapper' : '#contact-wrapper'}
                  className={`nav-link ${ !isSubPage && activeSection === 'contact-wrapper' ? 'active' : '' }`}
                >
                  Contact Me
                </Link>
              </li>
              <li>
                <Link
                  href={isSubPage ? '/#contact-wrapper' : '#contact-wrapper'}
                  className="nav-btn hire-me-btn"
                >
                  Hire Me
                </Link>
              </li>
              {user ? (
                <li className="nav-user-item">
                  <Link
                    href="/profile"
                    className={`nav-user-pill ${isProfilePage ? 'active' : ''}`}
                    title="View & Edit Profile"
                  >
                    {user.photoURL ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.photoURL} alt={user.displayName || 'User'} className="nav-user-avatar" />
                    ) : (
                      <span className="nav-user-avatar-initial">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    )}
                    <span className="nav-user-display-name">
                      {user.displayName || user.email?.split('@')[0]}
                    </span>
                  </Link>

                  {isAdmin && (
                    <Link
                      href="/admin"
                      className={`nav-admin-link ${isAdminPage ? 'active' : ''}`}
                      title="Open Admin Dashboard"
                    >
                      <span>Admin</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    className="nav-logout-btn"
                    onClick={() => signOutUser()}
                    title="Sign out of account"
                  >
                    Sign Out
                  </button>
                </li>
              ) : (
                <li>
                  <a
                    href="#auth"
                    onClick={(e) => {
                      e.preventDefault();
                      setAuthModalOpen(true);
                    }}
                    className="nav-btn signup-login-btn"
                  >
                    Signup/Login
                  </a>
                </li>
              )}
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
              title={isSubPage ? 'Return to Home' : 'Return to wallpaper cover'}
              onClick={handleReturnToWallpaper}
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="currentColor">
                <path d="M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z" />
              </svg>
              <span>{isSubPage ? 'Home' : 'Wallpaper'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* AUTH MODAL (SIGNUP / LOGIN) */}
      {authModalOpen && (
        <div className="nav-modal-backdrop" onClick={closeModals}>
          <div
            className="nav-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="nav-modal-close"
              onClick={closeModals}
              aria-label="Close dialog"
            >
              &times;
            </button>

            <div className="nav-modal-header">
              <h2 id="auth-modal-title" className="nav-modal-title">
                {authTab === 'signin' ? 'Sign In to Hub' : 'Create an Account'}
              </h2>
              <p className="nav-modal-desc">
                Access developer tools, interactive demos, and exclusive case study breakdowns.
              </p>
            </div>

            <div className="auth-tabs">
              <button
                type="button"
                className={`auth-tab-btn ${ authTab === 'signin' ? 'active' : '' }`}
                onClick={() => {
                  setAuthTab('signin');
                  setAuthFeedback('');
                }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth-tab-btn ${ authTab === 'signup' ? 'active' : '' }`}
                onClick={() => {
                  setAuthTab('signup');
                  setAuthFeedback('');
                }}
              >
                Sign Up
              </button>
            </div>

            {authFeedback && (
              <div className="auth-feedback-badge" role="status">
                {authFeedback}
              </div>
            )}

            <form className="auth-form" onSubmit={handleAuthSubmit}>
              {authTab === 'signup' && (
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="auth-name">
                    Full Name
                  </label>
                  <input
                    id="auth-name"
                    type="text"
                    required
                    placeholder="e.g. Alex Rivera"
                    value={authName}
                    onChange={(e) => setAuthName(e.target.value)}
                    className="auth-input"
                  />
                </div>
              )}

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="auth-email">
                  Email Address
                </label>
                <input
                  id="auth-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="auth-input"
                />
              </div>

              <div className="auth-input-group">
                <label className="auth-input-label" htmlFor="auth-password">
                  Password
                </label>
                <input
                  id="auth-password"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="auth-input"
                />
              </div>

              <button type="submit" className="auth-submit-btn" disabled={isSubmittingAuth}>
                {isSubmittingAuth ? 'Processing...' : authTab === 'signin' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="auth-divider">or continue with</div>

            <div className="oauth-buttons">
              <button
                type="button"
                className="oauth-btn"
                disabled={isSubmittingAuth}
                onClick={handleGithubAuth}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </button>
              <button
                type="button"
                className="oauth-btn"
                disabled={isSubmittingAuth}
                onClick={handleGoogleAuth}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.344-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                </svg>
                Google
              </button>
            </div>
          </div>
        </div>
      )}

      {/* BLOG PREVIEW MODAL */}
      {blogModalOpen && (
        <div className="nav-modal-backdrop" onClick={closeModals}>
          <div
            className="nav-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="blog-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="nav-modal-close"
              onClick={closeModals}
              aria-label="Close dialog"
            >
              &times;
            </button>

            <div className="nav-modal-header">
              <h2 id="blog-modal-title" className="nav-modal-title">
                ✍️ Engineering Blog
              </h2>
              <p className="nav-modal-desc">
                In-depth articles and practical guides on full-stack web engineering, UI systems, and modern architecture.
              </p>
            </div>

            <ul className="blog-topics-list">
              <li className="blog-topic-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Building Ambient UI with Next.js 16 & React 19</span>
              </li>
              <li className="blog-topic-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>CSS Scroll-Snap Architectures & Core Web Vitals</span>
              </li>
              <li className="blog-topic-item">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>Scalable TypeScript Microservices & REST Design</span>
              </li>
            </ul>

            {blogFeedback ? (
              <div className="auth-feedback-badge" role="status">
                {blogFeedback}
              </div>
            ) : (
              <form className="auth-form" onSubmit={handleBlogSubmit}>
                <div className="auth-input-group">
                  <label className="auth-input-label" htmlFor="blog-subscribe-email">
                    Be the first to read new articles
                  </label>
                  <input
                    id="blog-subscribe-email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    value={blogEmail}
                    onChange={(e) => setBlogEmail(e.target.value)}
                    className="auth-input"
                  />
                </div>
                <button type="submit" className="auth-submit-btn">
                  Notify Me on Launch
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
