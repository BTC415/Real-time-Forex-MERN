import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { me } = useAuth();

  return me ? children : <Navigate to="/login" />;
}