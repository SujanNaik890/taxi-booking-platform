import React from 'react';
import { Navigate } from 'react-router-dom';
import { authAPI } from '../services/api';

export const AdminGuard = ({ children }) => {
  const isAuth = authAPI.isAuthenticated();
  const isAdmin = authAPI.isAdmin();
  
  if (!isAuth || !isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export const PassengerGuard = ({ children }) => {
  const isAuth = authAPI.isAuthenticated();
  
  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminGuard;
