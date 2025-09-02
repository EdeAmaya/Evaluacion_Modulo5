// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../config/firebase';

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        loadUserInfo(user);
      } else {
        setUser(null);
        setUserInfo(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loadUserInfo = async (authUser) => {
    try {
      const { doc, getDoc } = await import('firebase/firestore');
      const { database } = await import('../config/firebase');
      
      const userDoc = await getDoc(doc(database, 'usuarios', authUser.uid));
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        setUserInfo({
          nombre: authUser.displayName || authUser.email,
          email: authUser.email,
        });
      }
    } catch (error) {
      setUserInfo({
        nombre: authUser.displayName || authUser.email,
        email: authUser.email,
      });
    }
  };

  const refreshUserInfo = async () => {
    if (user) {
      await loadUserInfo(user);
    }
  };

  const value = {
    user,
    userInfo,
    loading,
    refreshUserInfo,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};