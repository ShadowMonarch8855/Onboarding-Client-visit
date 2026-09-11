import React, { createContext, useState, useEffect } from 'react';
import { getMe, login as apiLogin, logout as apiLogout } from '../api/auth.api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await getMe();
        // response = { success: true, data: { id, name, email, role } }
        setUser(response.data || response);
      } catch (error) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const login = async (email, password) => {
    const response = await apiLogin(email, password);
    // response = { success: true, data: { token, user: { id, name, email, role } } }
    if (response.data?.token) {
      localStorage.setItem('token', response.data.token);
    }
    const userData = response.data?.user || response.user || response.data;
    setUser(userData);
    return response;
  };

  const logout = async () => {
    try {
      await apiLogout();
    } catch (e) {
      // ignore logout errors
    }
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAdmin = user?.role === 'admin';
  const isTeamMember = user?.role === 'team_member' || user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isAuthenticated = !!user;

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated,
    isAdmin,
    isTeamMember,
    isClient
  };

  // Show loading spinner while checking auth, but always render on public routes
  if (loading) {
    return (
      <AuthContext.Provider value={value}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
          <p>Loading...</p>
        </div>
      </AuthContext.Provider>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
