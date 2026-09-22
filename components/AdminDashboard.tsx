'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/lib/authContext';
import { checkIsAdmin } from '@/lib/admin';
import { PROJECTS } from '@/lib/projects';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  message: string;
  createdAt?: Timestamp | { seconds: number; nanoseconds: number };
  read?: boolean;
  userId?: string | null;
}

interface AppUser {
  uid: string;
  displayName?: string;
  email?: string;
  photoURL?: string;
  lastLoginAt?: Timestamp | { seconds: number; nanoseconds: number };
  role?: string;
}

type MessageFilter = 'all' | 'unread' | 'read';
type ActiveTab = 'messages' | 'users' | 'overview';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const isAdmin = checkIsAdmin(user);

  const [activeTab, setActiveTab] = useState<ActiveTab>('messages');
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [usersList, setUsersList] = useState<AppUser[]>([]);
  const [loadingData, setLoadingData] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [messageFilter, setMessageFilter] = useState<MessageFilter>('all');
  const [feedback, setFeedback] = useState('');

  // Fetch Firestore Data
  const fetchData = async () => {
    setLoadingData(true);
    setFeedback('');

    try {
      // 1. Fetch Contact Inquiries
      let messagesData: ContactMessage[] = [];
      try {
        const contactsQuery = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const contactsSnap = await getDocs(contactsQuery);
        contactsSnap.forEach((d) => {
          messagesData.push({ id: d.id, ...d.data() } as ContactMessage);
        });
      } catch {
        // Fallback without orderBy in case composite index is not set
        const contactsSnap = await getDocs(collection(db, 'contacts'));
        contactsSnap.forEach((d) => {
          messagesData.push({ id: d.id, ...d.data() } as ContactMessage);
        });
        messagesData.sort((a, b) => {
          const timeA = (a.createdAt as { seconds?: number })?.seconds || 0;
          const timeB = (b.createdAt as { seconds?: number })?.seconds || 0;
          return timeB - timeA;
        });
      }
      setMessages(messagesData);

      // 2. Fetch Users
      const usersSnap = await getDocs(collection(db, 'users'));
      const usersData: AppUser[] = [];
      usersSnap.forEach((d) => {
        usersData.push({ uid: d.id, ...d.data() } as AppUser);
      });
      setUsersList(usersData);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  // Toggle Read / Unread
  const handleToggleRead = async (messageId: string, currentStatus: boolean) => {
    try {
      const msgRef = doc(db, 'contacts', messageId);
      await updateDoc(msgRef, { read: !currentStatus });

      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, read: !currentStatus } : m))
      );
      setFeedback(`Message marked as ${!currentStatus ? 'read' : 'unread'}.`);
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Error updating read status:', err);
    }
  };

  // Delete Contact Message
  const handleDeleteMessage = async (messageId: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this message?')) return;

    try {
      await deleteDoc(doc(db, 'contacts', messageId));
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
      setFeedback('Message deleted permanently.');
      setTimeout(() => setFeedback(''), 3000);
    } catch (err) {
      console.error('Error deleting message:', err);
    }
  };

  // Filtered messages
  const filteredMessages = useMemo(() => {
    return messages.filter((m) => {
      const matchesFilter =
        messageFilter === 'all'
          ? true
          : messageFilter === 'unread'
          ? !m.read
          : m.read;

      const q = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !q ||
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [messages, messageFilter, searchQuery]);

  const unreadCount = useMemo(() => messages.filter((m) => !m.read).length, [messages]);

  // Format timestamps
  const formatTimestamp = (ts?: Timestamp | { seconds: number; nanoseconds: number }) => {
    if (!ts) return 'Just now';
    if ('toDate' in ts && typeof ts.toDate === 'function') {
      return ts.toDate().toLocaleString();
    }
    if ('seconds' in ts) {
      return new Date(ts.seconds * 1000).toLocaleString();
    }
    return 'Recently';
  };

  // State: Loading Auth
  if (loading) {
    return (
      <div className="section-container admin-container text-center" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>Verifying admin authorization...</p>
      </div>
    );
  }

  // State: Unauthorized
  if (!user || !isAdmin) {
    return (
      <div className="section-container admin-container">
        <div className="profile-card guest-card text-center">
          <div className="guest-icon">🛡️</div>
          <h2 className="profile-title">Admin Access Restricted</h2>
          <p className="profile-desc">
            {!user
              ? 'Please sign in with an authorized administrator account to access the dashboard.'
              : `Logged in as ${user.email}, but this account does not have administrative permissions.`}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginTop: '1.5rem' }}>
            <Link href="/" className="btn btn-primary">
              <span>Return Home</span>
            </Link>
            <Link href="/profile" className="btn btn-secondary">
              <span>My Profile</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page-wrapper">
      <div className="banner-ambient-glow glow-top-right" aria-hidden="true" />
      <div className="banner-ambient-glow glow-bottom-left" aria-hidden="true" />

      <div className="section-container admin-content-container">
        {/* HEADER */}
        <header className="admin-header">
          <div>
            <div className="hero-badge">
              <span className="badge-pulse-dot" />
              <span>Admin Console &bull; {user.email}</span>
            </div>
            <h1 className="section-title admin-main-title">
              Portfolio &amp; <span className="gradient-text">Inquiries Dashboard</span>
            </h1>
            <p className="section-desc admin-main-desc">
              Manage client communications, monitor registered community members, and track portfolio activity.
            </p>
          </div>

          <div className="admin-header-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={fetchData}
              disabled={loadingData}
              title="Reload Firestore data"
            >
              <span>{loadingData ? 'Refreshing...' : '🔄 Refresh Data'}</span>
            </button>
            <Link href="/profile" className="btn btn-secondary">
              <span>Profile Settings</span>
            </Link>
          </div>
        </header>

        {/* METRICS ROW */}
        <div className="admin-metrics-grid">
          <div className="admin-stat-card">
            <div className="stat-card-icon">📬</div>
            <div className="stat-card-data">
              <div className="stat-card-val">{messages.length}</div>
              <div className="stat-card-label">Total Inquiries</div>
            </div>
            {unreadCount > 0 && (
              <span className="stat-card-badge">{unreadCount} Unread</span>
            )}
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon">👥</div>
            <div className="stat-card-data">
              <div className="stat-card-val">{usersList.length}</div>
              <div className="stat-card-label">Registered Users</div>
            </div>
            <span className="stat-card-badge">Live DB</span>
          </div>

          <div className="admin-stat-card">
            <div className="stat-card-icon">🚀</div>
            <div className="stat-card-data">
              <div className="stat-card-val">{PROJECTS.length}</div>
              <div className="stat-card-label">Shipped Projects</div>
            </div>
            <Link href="/#projects-wrapper" className="stat-card-link">
              View Projects &rarr;
            </Link>
          </div>
        </div>

        {/* TABS NAVIGATION */}
        <div className="admin-tabs-nav">
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'messages' ? 'active' : ''}`}
            onClick={() => setActiveTab('messages')}
          >
            <span>Client Messages</span>
            <span className="tab-pill-count">{messages.length}</span>
            {unreadCount > 0 && <span className="tab-unread-dot" title={`${unreadCount} unread`} />}
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => setActiveTab('users')}
          >
            <span>Registered Users</span>
            <span className="tab-pill-count">{usersList.length}</span>
          </button>
          <button
            type="button"
            className={`admin-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <span>Quick Controls</span>
          </button>
        </div>

        {feedback && <div className="auth-feedback-badge" style={{ marginBottom: '1.5rem' }}>{feedback}</div>}

        {/* TAB 1: CLIENT MESSAGES */}
        {activeTab === 'messages' && (
          <section className="admin-section">
            {/* SEARCH & FILTERS BAR */}
            <div className="admin-filter-bar">
              <div className="admin-search-box">
                <svg xmlns="http://www.w3.org/2000/svg" height="18" viewBox="0 0 24 24" width="18" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                <input
                  type="text"
                  placeholder="Search inquiries by name, email, or message content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="admin-search-input"
                />
                {searchQuery && (
                  <button type="button" className="search-clear-btn" onClick={() => setSearchQuery('')}>
                    &times;
                  </button>
                )}
              </div>

              <div className="admin-subfilter-tabs">
                <button
                  type="button"
                  className={`subfilter-btn ${messageFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setMessageFilter('all')}
                >
                  All ({messages.length})
                </button>
                <button
                  type="button"
                  className={`subfilter-btn ${messageFilter === 'unread' ? 'active' : ''}`}
                  onClick={() => setMessageFilter('unread')}
                >
                  Unread ({unreadCount})
                </button>
                <button
                  type="button"
                  className={`subfilter-btn ${messageFilter === 'read' ? 'active' : ''}`}
                  onClick={() => setMessageFilter('read')}
                >
                  Read ({messages.length - unreadCount})
                </button>
              </div>
            </div>

            {/* MESSAGES LIST */}
            {filteredMessages.length > 0 ? (
              <div className="messages-stream">
                {filteredMessages.map((msg) => {
                  const isUnread = !msg.read;
                  return (
                    <article
                      key={msg.id}
                      className={`admin-message-card ${isUnread ? 'unread' : 'read'}`}
                    >
                      <div className="message-card-header">
                        <div className="message-sender-info">
                          <div className="sender-avatar">
                            {msg.name ? msg.name[0].toUpperCase() : 'C'}
                          </div>
                          <div>
                            <div className="sender-name-row">
                              <h2 className="sender-name">{msg.name}</h2>
                              {isUnread && <span className="unread-badge">New Inquirer</span>}
                            </div>
                            <a href={`mailto:${msg.email}`} className="sender-email">
                              {msg.email}
                            </a>
                          </div>
                        </div>

                        <div className="message-meta-actions">
                          <span className="message-time">{formatTimestamp(msg.createdAt)}</span>
                          <button
                            type="button"
                            className="btn-status-toggle"
                            onClick={() => handleToggleRead(msg.id, !!msg.read)}
                            title={isUnread ? 'Mark as Read' : 'Mark as Unread'}
                          >
                            {isUnread ? 'Mark Read' : 'Mark Unread'}
                          </button>
                          <button
                            type="button"
                            className="btn-delete-msg"
                            onClick={() => handleDeleteMessage(msg.id)}
                            title="Delete this message"
                          >
                            Delete
                          </button>
                        </div>
                      </div>

                      <div className="message-card-body">
                        <p className="message-text">{msg.message}</p>
                      </div>

                      <div className="message-card-footer">
                        <a
                          href={`mailto:${msg.email}?subject=Re: Your Inquiry on Roche Kollie's Portfolio&body=Hi ${encodeURIComponent(msg.name)},\n\nThank you for reaching out via my portfolio!\n\n`}
                          className="btn-reply-mail"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" height="15" viewBox="0 0 24 24" width="15" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="9 17 4 12 9 7" />
                            <path d="M20 18v-2a4 4 0 0 0-4-4H4" />
                          </svg>
                          <span>Reply to {msg.name.split(' ')[0]}</span>
                        </a>

                        {msg.userId && (
                          <span className="user-id-chip font-mono">
                            User UID: {msg.userId.slice(0, 8)}...
                          </span>
                        )}
                      </div>
                    </article>
                  );
                })}
              </div>
            ) : (
              <div className="admin-empty-state">
                <div className="empty-icon">📭</div>
                <h3>No inquiries found</h3>
                <p>
                  {searchQuery
                    ? `No messages matched "${searchQuery}".`
                    : messageFilter === 'unread'
                    ? 'All messages have been read!'
                    : 'No messages have been submitted through the contact form yet.'}
                </p>
                {searchQuery && (
                  <button type="button" className="btn btn-secondary" onClick={() => setSearchQuery('')}>
                    Clear Search
                  </button>
                )}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: REGISTERED USERS */}
        {activeTab === 'users' && (
          <section className="admin-section">
            <h2 className="admin-section-title">Community &amp; Authenticated Users ({usersList.length})</h2>
            <p className="admin-section-subtitle">
              Users who have signed in with Google, GitHub, or Email/Password on Roche&apos;s Developer Hub.
            </p>

            {usersList.length > 0 ? (
              <div className="admin-users-table-wrapper">
                <table className="admin-users-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Last Active</th>
                      <th>UID</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map((u) => (
                      <tr key={u.uid}>
                        <td>
                          <div className="table-user-cell">
                            {u.photoURL ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={u.photoURL} alt={u.displayName || 'User'} className="table-user-avatar" />
                            ) : (
                              <div className="table-user-initial">
                                {(u.displayName || u.email || 'U')[0].toUpperCase()}
                              </div>
                            )}
                            <span className="table-user-name">{u.displayName || 'Unnamed User'}</span>
                          </div>
                        </td>
                        <td>
                          <a href={`mailto:${u.email}`} className="table-email-link">
                            {u.email || 'N/A'}
                          </a>
                        </td>
                        <td>
                          <span className={`role-badge ${u.role === 'admin' || checkIsAdmin(null, u.role) ? 'admin' : 'member'}`}>
                            {u.role || (checkIsAdmin({ email: u.email } as any) ? 'admin' : 'member')}
                          </span>
                        </td>
                        <td className="table-date">{formatTimestamp(u.lastLoginAt)}</td>
                        <td className="font-mono text-muted">{u.uid.slice(0, 10)}...</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="admin-empty-state">
                <div className="empty-icon">👥</div>
                <h3>No registered users found yet</h3>
                <p>As visitors sign up or log in, their profiles will automatically sync to Firestore here.</p>
              </div>
            )}
          </section>
        )}

        {/* TAB 3: QUICK CONTROLS */}
        {activeTab === 'overview' && (
          <section className="admin-section">
            <h2 className="admin-section-title">Portfolio Quick Controls</h2>
            <div className="admin-quick-links-grid">
              <Link href="/" className="admin-quick-card">
                <h3>🏠 Home Landing Page</h3>
                <p>Preview the full interactive Momentum wallpaper and portfolio sections.</p>
                <span className="card-arrow">&rarr;</span>
              </Link>

              <Link href="/#projects-wrapper" className="admin-quick-card">
                <h3>🚀 Featured Projects ({PROJECTS.length})</h3>
                <p>Explore active web applications and developer tools.</p>
                <span className="card-arrow">&rarr;</span>
              </Link>

              <Link href="/profile" className="admin-quick-card">
                <h3>⚙️ Profile &amp; Settings</h3>
                <p>Update your personal avatar, bio, and temperature widget preferences.</p>
                <span className="card-arrow">&rarr;</span>
              </Link>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
