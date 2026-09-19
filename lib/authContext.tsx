'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  AuthError,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, googleProvider, githubProvider } from './firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name?: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  signInWithGithub: () => Promise<void>;
  signOutUser: () => Promise<void>;
  formatAuthError: (error: unknown) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Flag to avoid repeated failed connection attempts if Firestore database has not been created yet
let firestoreDatabaseAvailable: boolean | null = null;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Non-blocking sync to Firestore with a strict 2.5-second timeout
  const syncUserToFirestore = async (firebaseUser: User) => {
    if (firestoreDatabaseAvailable === false) {
      return;
    }

    try {
      const userRef = doc(db, 'users', firebaseUser.uid);
      const writePromise = setDoc(
        userRef,
        {
          uid: firebaseUser.uid,
          email: firebaseUser.email || '',
          displayName: firebaseUser.displayName || '',
          photoURL: firebaseUser.photoURL || '',
          lastLoginAt: serverTimestamp(),
        },
        { merge: true }
      );

      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Firestore operation timed out. Database might not be provisioned.')), 2500)
      );

      await Promise.race([writePromise, timeoutPromise]);
      firestoreDatabaseAvailable = true;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      if (errMsg.includes('Database') || errMsg.includes('not found') || errMsg.includes('timed out')) {
        firestoreDatabaseAvailable = false;
        console.warn(
          'ℹ️ Firestore database "(default)" has not been created in Firebase Console yet. User is authenticated, but Firestore profile sync was skipped. Go to Firebase Console -> Firestore Database -> Create database to enable it.'
        );
      } else {
        console.warn('Could not sync user to Firestore:', err);
      }
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      // Set user and finish loading immediately so auth never hangs
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
        // Sync in background without blocking
        syncUserToFirestore(currentUser).catch(() => {});
      }
    });

    return () => unsubscribe();
  }, []);

  const signInWithEmail = async (email: string, pass: string) => {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    setUser(res.user);
    syncUserToFirestore(res.user).catch(() => {});
  };

  const signUpWithEmail = async (email: string, pass: string, name?: string) => {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (name && auth.currentUser) {
      await updateProfile(auth.currentUser, { displayName: name });
    }
    setUser(res.user);
    syncUserToFirestore(res.user).catch(() => {});
  };

  const signInWithGoogle = async () => {
    const res = await signInWithPopup(auth, googleProvider);
    setUser(res.user);
    syncUserToFirestore(res.user).catch(() => {});
  };

  const signInWithGithub = async () => {
    const res = await signInWithPopup(auth, githubProvider);
    setUser(res.user);
    syncUserToFirestore(res.user).catch(() => {});
  };

  const signOutUser = async () => {
    await signOut(auth);
    setUser(null);
  };

  const formatAuthError = (err: unknown): string => {
    if (!err || typeof err !== 'object') return 'An unknown error occurred.';
    const error = err as AuthError;
    switch (error.code) {
      case 'auth/invalid-email':
        return 'Invalid email address format.';
      case 'auth/user-disabled':
        return 'This account has been disabled.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists.';
      case 'auth/weak-password':
        return 'Password must be at least 6 characters long.';
      case 'auth/popup-closed-by-user':
        return 'Sign-in popup was closed before completing.';
      case 'auth/cancelled-popup-request':
        return 'Authentication popup was cancelled.';
      case 'auth/account-exists-with-different-credential':
        return 'An account already exists with the same email using a different provider.';
      case 'auth/unauthorized-domain':
        return 'This domain is not authorized in Firebase Console (Authentication > Settings > Authorized domains).';
      default:
        return error.message || 'Authentication failed. Please try again.';
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithEmail,
        signUpWithEmail,
        signInWithGoogle,
        signInWithGithub,
        signOutUser,
        formatAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
