import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import useAuth from '../hooks/useAuth';
import cartService from '../services/cartService';

const NavbarContainer = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #2a6af7 0%, #1e4fc2 100%);
  color: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;
`;

const Logo = styled(Link)`
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
`;

const NavMenu = styled.div<{ isOpen: boolean }>`
  display: flex;
  align-items: center;
  
  @media (max-width: 768px) {
    position: fixed;
    flex-direction: column;
    align-items: flex-start;
    top: 0;
    right: 0;
    height: 100vh;
    width: 250px;
    padding-top: 60px;
    padding-left: 2rem;
    background: linear-gradient(135deg, #2a6af7 0%, #1e4fc2 100%);
    transition: transform 0.3s ease-in-out;
    transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
    z-index: 999;
  }
`;

const NavLink = styled(Link)`
  margin-left: 1.5rem;
  color: white;
  text-decoration: none;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const NavButton = styled.button`
  margin-left: 1.5rem;
  background: transparent;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  transition: all 0.3s ease;
  
  &:hover {
    opacity: 0.8;
  }
  
  @media (max-width: 768px) {
    margin: 1rem 0;
  }
`;

const MenuIcon = styled.div`
  display: none;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1000;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const CartBadge = styled.span`
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  margin-left: 0.3rem;
`;

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  
  // Sepetteki ürün sayısını güncelle
  useEffect(() => {
    const updateCartCount = () => {
      const count = cartService.getCartItemCount();
      setCartItemCount(count);
    };
    
    // İlk yükleme
    updateCartCount();
    
    // LocalStorage değişikliklerini dinle
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'user_cart') {
        updateCartCount();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Düzenli olarak sepet sayısını güncelle (5 saniyede bir)
    const intervalId = setInterval(updateCartCount, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, []);
  
  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsOpen(false);
  };
  
  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };
  
  return (
    <NavbarContainer>
      <Logo to="/">E-Ticaret</Logo>
      
      <MenuIcon onClick={toggleMenu}>
        {isOpen ? <FiX /> : <FiMenu />}
      </MenuIcon>
      
      <NavMenu isOpen={isOpen}>
        <NavLink to="/" onClick={() => setIsOpen(false)}>
          Ürünler
        </NavLink>
        
        {token ? (
          <>
            <NavLink to="/profile" onClick={() => setIsOpen(false)}>
              <FiUser style={{ marginRight: '0.5rem' }} /> Profil
            </NavLink>
            
            {user && user.isAdmin && (
              <NavLink to="/admin/orders" onClick={() => setIsOpen(false)}>
                Admin Panel
              </NavLink>
            )}
            
            <NavButton onClick={handleLogout}>
              <FiLogOut style={{ marginRight: '0.5rem' }} /> Çıkış
            </NavButton>
          </>
        ) : (
          <>
            <NavLink to="/login" onClick={() => setIsOpen(false)}>
              Giriş
            </NavLink>
            <NavLink to="/register" onClick={() => setIsOpen(false)}>
              Kayıt Ol
            </NavLink>
          </>
        )}
        
        <NavLink to="/cart" onClick={() => setIsOpen(false)}>
          <FiShoppingCart style={{ marginRight: '0.5rem' }} /> 
          Sepet
          {cartItemCount > 0 && <CartBadge>{cartItemCount}</CartBadge>}
        </NavLink>
      </NavMenu>
    </NavbarContainer>
  );
};

export default Navbar; 