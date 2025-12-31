"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Fonction pour traduire les erreurs Firebase
const getFirebaseErrorMessage = (error: any): string => {
  const errorCode = error?.code || '';

  switch (errorCode) {
    case 'auth/invalid-email':
      return 'Adresse email invalide.';
    case 'auth/user-disabled':
      return 'Ce compte a été désactivé.';
    case 'auth/user-not-found':
      return 'Aucun compte trouvé avec cet email. Veuillez vous inscrire.';
    case 'auth/wrong-password':
      return 'Mot de passe incorrect.';
    case 'auth/email-already-in-use':
      return 'Cet email est déjà utilisé.';
    case 'auth/weak-password':
      return 'Le mot de passe doit contenir au moins 6 caractères.';
    case 'auth/invalid-credential':
      return 'Email ou mot de passe incorrect.';
    case 'auth/too-many-requests':
      return 'Trop de tentatives. Veuillez réessayer plus tard.';
    case 'auth/network-request-failed':
      return 'Erreur de connexion. Vérifiez votre connexion internet.';
    default:
      console.error('Firebase auth error:', error);
      return 'Une erreur est survenue. Veuillez réessayer.';
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    }, (error) => {
      console.error('Auth state change error:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setError(null);
      setLoading(true);

      // Validation basique
      if (!email || !password) {
        throw new Error('Veuillez remplir tous les champs.');
      }

      await signInWithEmailAndPassword(auth, email, password);
      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      setError(null);
      setLoading(true);

      // Validation basique
      if (!email || !password || !displayName) {
        const errorMsg = 'Veuillez remplir tous les champs.';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }

      if (password.length < 6) {
        const errorMsg = 'Le mot de passe doit contenir au moins 6 caractères.';
        setError(errorMsg);
        setLoading(false);
        throw new Error(errorMsg);
      }

      const { user } = await createUserWithEmailAndPassword(auth, email, password);

      if (user) {
        await updateProfile(user, { displayName });
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);

      // Pour les erreurs Firebase, utiliser le traducteur
      if (err.code && err.code.startsWith('auth/')) {
        const errorMessage = getFirebaseErrorMessage(err);
        setError(errorMessage);
      } else if (!err.message.includes('Veuillez') && !err.message.includes('mot de passe')) {
        // Si ce n'est pas une de nos erreurs de validation
        setError('Une erreur est survenue lors de l\'inscription.');
      }

      throw err;
    }
  };

  const signOut = async () => {
    try {
      setError(null);
      await firebaseSignOut(auth);
    } catch (err: any) {
      const errorMessage = getFirebaseErrorMessage(err);
      setError(errorMessage);
      throw err;
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    clearError
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
