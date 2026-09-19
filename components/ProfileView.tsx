'use client';

import React, { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { updateProfile } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '@/lib/authContext';
import { db } from '@/lib/firebase';
import { uploadFile } from '@/lib/storage';
import { checkIsAdmin } from '@/lib/admin';

export default function ProfileView() {
  const { user, loading, signOutUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [tempUnit, setTempUnit] = useState<'fahrenheit' | 'celsius'>('fahrenheit');
  const [role, setRole] = useState<string>('member');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');

  const isAdmin = checkIsAdmin(user, role);

  // Load user details from Firestore
  useEffect(() => {
    if (!user) return;

    setDisplayName(user.displayName || '');

    const savedUnit = (localStorage.getItem('userTempUnit') as 'fahrenheit' | 'celsius') || 'fahrenheit';
    setTempUnit(savedUnit);

    const loadUserProfile = async () => {
      try {
        const userDocRef = doc(db, 'users', user.uid);
        const snapshot = await getDoc(userDocRef);
        if (snapshot.exists()) {
          const data = snapshot.data();
          if (data.bio) setBio(data.bio);
          if (data.role) setRole(data.role);
          if (data.tempUnit) {
            setTempUnit(data.tempUnit);
            localStorage.setItem('userTempUnit', data.tempUnit);
          }
        }
      } catch (err) {
        console.warn('Could not fetch user profile from Firestore:', err);
      }
    };

    loadUserProfile();
  }, [user]);

  // Handle Avatar file selection & upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    if (!file.type.startsWith('image/')) {
      setError('Please select an image file (PNG, JPG, WebP, etc.)');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Avatar image must be smaller than 5MB.');
      return;
    }

    setError('');
    setFeedback('');
    setIsUploadingAvatar(true);

    try {
      const ext = file.name.split('.').pop() || 'jpg';
      const path = `avatars/${user.uid}/avatar_${Date.now()}.${ext}`;
      const { downloadUrl } = await uploadFile(path, file, { contentType: file.type });

      // Update Firebase Auth profile
      await updateProfile(user, { photoURL: downloadUrl });

      // Update Firestore document
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          photoURL: downloadUrl,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setFeedback('Avatar updated successfully!');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: unknown) {
      console.error('Error uploading avatar:', err);
      setError('Failed to upload avatar. Please verify your connection or storage rules.');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Handle saving form changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSaving(true);
    setError('');
    setFeedback('');

    try {
      if (displayName !== user.displayName) {
        await updateProfile(user, { displayName });
      }

      // Persist preferences
      localStorage.setItem('userTempUnit', tempUnit);

      // Save to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(
        userDocRef,
        {
          displayName,
          bio,
          tempUnit,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );

      setFeedback('Profile settings saved successfully!');
      setTimeout(() => setFeedback(''), 4000);
    } catch (err: unknown) {
      console.error('Error saving profile:', err);
      setError('Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // State: Loading
  if (loading) {
    return (
      <div className="section-container profile-container text-center" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Loading user profile...</p>
      </div>
    );
  }

  // State: Guest (Not Signed In)
  if (!user) {
    return (
      <div className="section-container profile-container">
        <div className="profile-card guest-card text-center">
          <div className="guest-icon">🔒</div>
          <h2 className="profile-title">Account Required</h2>
          <p className="profile-desc">
            You need to be signed in to view and customize your developer hub profile.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link href="/#auth" className="btn btn-primary">
              <span>Sign In / Create Account</span>
            </Link>
            <Link href="/" className="btn btn-secondary">
              <span>Return Home</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Provider badge label
  const providerId = user.providerData[0]?.providerId || 'password';
  const providerLabel =
    providerId === 'google.com'
      ? 'Google Account'
      : providerId === 'github.com'
      ? 'GitHub Account'
      : 'Email & Password';

  return (
    <div className="profile-page-wrapper">
      <div className="banner-ambient-glow glow-top-right" aria-hidden="true" />
      <div className="banner-ambient-glow glow-bottom-left" aria-hidden="true" />

      <div className="section-container profile-content-container">
        {/* HEADER */}
        <header className="profile-header text-center">
          <div className="hero-badge">
            <span className="badge-pulse-dot" />
            <span>Developer Hub &bull; User Profile</span>
          </div>
          <h1 className="section-title">
            Account <span className="gradient-text">Settings &amp; Profile</span>
          </h1>
          <p className="section-desc">
            Manage your personal profile information, ambient widget preferences, and account security.
          </p>
        </header>

        {/* PROFILE CARD */}
        <div className="profile-main-grid">
          {/* LEFT: USER SUMMARY CARD */}
          <aside className="profile-sidebar-card">
            <div className="avatar-wrapper">
              {user.photoURL ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.photoURL} alt={displayName || 'User'} className="profile-big-avatar" />
              ) : (
                <div className="profile-big-initial">
                  {(displayName || user.email || 'U')[0].toUpperCase()}
                </div>
              )}

              {/* Upload Overlay */}
              <button
                type="button"
                className="avatar-upload-overlay"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                title="Upload new avatar image"
              >
                {isUploadingAvatar ? (
                  <span>Uploading...</span>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" height="20" viewBox="0 0 24 24" width="20" fill="currentColor">
                      <path d="M4 4h3l2-2h6l2 2h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 3a5 5 0 1 0 0 10 5 5 0 0 0 0-10zm0 2a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
                    </svg>
                    <span>Change Photo</span>
                  </>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarChange}
              />
            </div>

            <h2 className="sidebar-user-name">{displayName || 'Anonymous Developer'}</h2>
            <p className="sidebar-user-email">{user.email}</p>

            <div className="profile-badges-strip">
              <span className="profile-provider-pill">{providerLabel}</span>
              {isAdmin && <span className="profile-admin-pill">★ Administrator</span>}
            </div>

            {isAdmin && (
              <Link href="/admin" className="btn btn-primary admin-dashboard-link">
                <span>Access Admin Console &rarr;</span>
              </Link>
            )}

            <hr className="profile-divider" />

            <div className="profile-meta-details">
              <div className="meta-row">
                <span className="meta-label">User ID:</span>
                <span className="meta-val font-mono">{user.uid.slice(0, 12)}...</span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Joined:</span>
                <span className="meta-val">
                  {user.metadata.creationTime
                    ? new Date(user.metadata.creationTime).toLocaleDateString()
                    : 'Recently'}
                </span>
              </div>
              <div className="meta-row">
                <span className="meta-label">Last Active:</span>
                <span className="meta-val">
                  {user.metadata.lastSignInTime
                    ? new Date(user.metadata.lastSignInTime).toLocaleDateString()
                    : 'Today'}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="btn btn-secondary profile-signout-btn"
              onClick={() => signOutUser()}
            >
              Sign Out
            </button>
          </aside>

          {/* RIGHT: EDIT FORM */}
          <main className="profile-details-card">
            <h2 className="profile-card-title">Edit Details &amp; Preferences</h2>

            {feedback && <div className="auth-feedback-badge">{feedback}</div>}
            {error && (
              <div className="auth-feedback-badge" style={{ borderColor: '#ff6b6b', color: '#ff6b6b', background: 'rgba(255, 107, 107, 0.1)' }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSaveProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="profile-name" className="form-label">
                  Display Name
                </label>
                <input
                  id="profile-name"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Your full name or alias"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-email" className="form-label">
                  Email Address <span style={{ color: 'var(--text-muted)' }}>(read-only)</span>
                </label>
                <input
                  id="profile-email"
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="form-input disabled"
                />
              </div>

              <div className="form-group">
                <label htmlFor="profile-bio" className="form-label">
                  Bio / Headline
                </label>
                <textarea
                  id="profile-bio"
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="e.g. Frontend Enthusiast & Web Accessibility Advocate"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Ambient Weather Unit Preference</label>
                <div className="unit-toggle-group">
                  <button
                    type="button"
                    className={`unit-toggle-btn ${tempUnit === 'fahrenheit' ? 'active' : ''}`}
                    onClick={() => setTempUnit('fahrenheit')}
                  >
                    Fahrenheit (&deg;F)
                  </button>
                  <button
                    type="button"
                    className={`unit-toggle-btn ${tempUnit === 'celsius' ? 'active' : ''}`}
                    onClick={() => setTempUnit('celsius')}
                  >
                    Celsius (&deg;C)
                  </button>
                </div>
                <span className="form-hint">
                  Customizes the temperature shown on the Momentum cover widget and top navbar.
                </span>
              </div>

              <div className="form-actions-row">
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
                </button>
                <Link href="/" className="btn btn-secondary">
                  <span>Return to Home</span>
                </Link>
              </div>
            </form>
          </main>
        </div>
      </div>
    </div>
  );
}
