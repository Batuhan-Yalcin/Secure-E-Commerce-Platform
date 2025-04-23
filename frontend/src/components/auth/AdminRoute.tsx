import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import authService from '../../services/authService';

interface AdminRouteProps {
  children: ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  const { token } = useAuth();
  const isAuthenticated = !!token;
  
  // authService.isAdmin() fonksiyonunu kullan - bu fonksiyon tüm olası admin kontrollerini yapıyor
  const isAdmin = authService.isAdmin();
  
  if (!isAuthenticated) {
    // Eğer kimlik doğrulaması yapılmamışsa, login sayfasına yönlendir
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin) {
    // Eğer admin değilse, ana sayfaya yönlendir
    console.log('Yetki hatası: Kullanıcı admin değil');
    return <Navigate to="/" replace />;
  }
  
  // Admin ise içeriği göster
  return <>{children}</>;
};

export default AdminRoute; 