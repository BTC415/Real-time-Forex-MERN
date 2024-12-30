import React, { createContext, useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAlert } from '../context/AlertContext';
import { logger } from '../services/logger';
import { api } from '../services/api';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [me, setMe] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const { showAlert } = useAlert();
  const navigate = useNavigate();

  const signIn = async (credentials) => {
    try {
      const { user, token } = await api.login(credentials);
      setMe(user);
      setToken(token);
      localStorage.setItem('token', token);
      return { user };
    } catch (error) {
      return { error };
    }
  };

  const signUp = async (credentials) => {
    try {
      const { me, token } = await api.register(credentials);
      return { me };
    } catch (error) {
      return { error };
    }
  };

  const signOut = () => {
    setMe(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  const updateUser = async (userData) => {
    try {
      const { user } = await api.updateUser(userData, token);
      logger.info('User updated successfully');
      showAlert('User updated successfully', 'success');
      setMe(user);
      return { user };
    } catch (error) {
      logger.error('Error updating user:', error);
      return { error };
    }
  };

  useEffect(() => {
    const validateToken = async () => {
      if (!token) return;

      try {
        const { user } = await api.validateToken(token);
        logger.info('Token validated successfully');
        showAlert('Session validated successfully', 'success');
        setMe(user);
        navigate('/');
      } catch (error) {
        logger.error('Token validation failed:', error);
        showAlert('Session expired. Please login again.', 'error');
        signOut();
        navigate('/login');
      }
    };

    validateToken();
  }, [token]);

  return (
    <AuthContext.Provider value={{
      me,
      token,
      setMe,
      signIn,
      signUp,
      signOut,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};