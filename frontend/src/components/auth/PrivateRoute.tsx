import React, { ReactNode, useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { token } = useAuth();
  // Token varsa kimlik doğrulanmış kabul ediyoruz
  // Backend'in /auth/me endpoint'i 500 hatası verdiğinde bile
  // kullanıcının kimliğini doğrulanmış kabul ediyoruz
  const isAuthenticated = !!token;
  
  if (!isAuthenticated) {
    // Eğer kimlik doğrulaması yapılmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }
  
  // Kimlik doğrulaması yapılmışsa, çocuk bileşenleri render et
  return <>{children}</>;
};

export default PrivateRoute; 