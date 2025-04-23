import React, { useState, useEffect } from 'react';
import { Outlet, Routes, Route, NavLink, useNavigate, useLocation } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaUsers, FaShoppingCart, FaTachometerAlt, FaSignOutAlt, FaBars, FaTimes, 
         FaChartPie, FaBoxOpen, FaArrowLeft, FaSave, FaHome, FaUser, FaCog, 
         FaGem, FaShieldAlt, FaAngleRight, FaWrench, FaRocket } from 'react-icons/fa';
import AdminDashboard from './AdminDashboard';
import UserList from './UserList';
import OrderList from './OrderList';
import OrderDetail from './OrderDetail';
import ProductList from './ProductList';
import ProductDetail from './ProductDetail';
import authService from '../../services/authService';
import SimpleProductForm from './SimpleProductForm';

// Animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(255, 255, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 255, 255, 0); }
`;

const iconFloat = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-5px); }
  100% { transform: translateY(0px); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

// 3D dönüş animasyonunu daha basit bir keyframe ile değiştiriyorum
const subtleHover = keyframes`
  0% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
  100% { transform: translateY(0); }
`;

const glowingBorder = keyframes`
  0% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.2); }
  50% { box-shadow: 0 0 15px rgba(139, 92, 246, 0.8), 0 0 20px rgba(139, 92, 246, 0.4); }
  100% { box-shadow: 0 0 5px rgba(139, 92, 246, 0.5), 0 0 10px rgba(139, 92, 246, 0.2); }
`;

const gradientFlow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Renk Paleti
const colors = {
  dark: {
    darkest: '#0f172a',
    darker: '#1e293b',
    dark: '#334155',
    medium: '#475569',
    light: '#64748b',
    lighter: '#94a3b8',
    lightest: '#cbd5e1'
  },
  primary: {
    main: '#6366f1',
    dark: '#4f46e5',
    light: '#818cf8',
    gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
    glow: 'rgba(99, 102, 241, 0.5)'
  },
  blues: {
    light: '#60a5fa',
    medium: '#3b82f6',
    deep: '#2563eb',
    navy: '#1e40af',
    royal: '#1d4ed8',
    dark: '#1e3a8a'
  },
  purples: {
    light: '#c4b5fd',
    medium: '#8b5cf6',
    deep: '#7c3aed',
    dark: '#6d28d9'
  },
  success: {
    main: '#10b981',
    dark: '#059669',
    light: '#34d399',
    gradient: 'linear-gradient(135deg, #10b981, #059669)',
    glow: 'rgba(16, 185, 129, 0.5)'
  },
  warning: {
    main: '#f59e0b',
    dark: '#d97706',
    light: '#fbbf24',
    gradient: 'linear-gradient(135deg, #f59e0b, #d97706)',
    glow: 'rgba(245, 158, 11, 0.5)'
  },
  danger: {
    main: '#ef4444',
    dark: '#dc2626',
    light: '#f87171',
    gradient: 'linear-gradient(135deg, #ef4444, #dc2626)',
    glow: 'rgba(239, 68, 68, 0.5)'
  },
  purple: {
    main: '#8b5cf6',
    dark: '#7c3aed',
    light: '#a78bfa',
    gradient: 'linear-gradient(135deg, #8b5cf6, #7c3aed)',
    glow: 'rgba(139, 92, 246, 0.5)'
  },
  teal: {
    main: '#14b8a6',
    dark: '#0d9488',
    light: '#2dd4bf',
    gradient: 'linear-gradient(135deg, #14b8a6, #0d9488)',
    glow: 'rgba(20, 184, 166, 0.5)'
  }
};

// Sidebar arkaplan animasyonu için daha soft bir keyframe tanımlayalım
const softColorShift = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Stil tanımlarını önce tanımlayalım
const menuItemStyle = css`
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 100%;
    background: linear-gradient(90deg, ${colors.blues.medium}30, transparent);
    opacity: 0;
    transition: all 0.4s ease;
    z-index: -1;
  }
`;

const activeItemStyle = css`
  background: linear-gradient(90deg, ${colors.blues.medium}40, transparent);
  box-shadow: 
    inset 4px 0 0 ${colors.blues.medium},
    0 0 10px rgba(255, 0, 170, 0.2);
  color: white;
  font-weight: 500;
  
  &::before {
    opacity: 1;
    width: 100%;
  }
  
  svg {
    color: ${colors.blues.light};
    animation: ${iconFloat} 2s ease-in-out infinite;
    filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.6));
  }
`;

// Stil bileşenleri
const AdminContainer = styled.div`
  display: flex;
  min-height: 100vh;
  width: 100%;
  position: relative;
  background: #ffffff;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(59, 130, 246, 0.05) 0%, transparent 30%),
    radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.04) 0%, transparent 25%),
    radial-gradient(circle at 50% 60%, rgba(16, 185, 129, 0.03) 0%, transparent 35%);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
  overflow: hidden;
`;

const Sidebar = styled.aside<{ $isOpen: boolean }>`
  width: 280px;
  background: linear-gradient(
    135deg, 
    ${colors.blues.navy} 0%, 
    ${colors.blues.royal} 25%, 
    ${colors.purples.deep} 50%, 
    ${colors.blues.dark} 75%,
    ${colors.blues.navy} 100%
  );
  background-size: 300% 300%;
  animation: ${softColorShift} 15s ease infinite;
  color: ${colors.dark.lightest};
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 50;
  position: relative;
  box-shadow: 0 0 20px rgba(241, 7, 206, 0.25);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      linear-gradient(135deg, rgba(255, 0, 238, 0.12) 0%, transparent 100%),
      linear-gradient(45deg, rgba(229, 11, 185, 0.1) 0%, transparent 100%),
      linear-gradient(235deg, rgba(6, 252, 223, 0.08) 0%, transparent 100%);
    z-index: -1;
    opacity: 0.8;
    pointer-events: none;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%23FFFFFF' stroke-width='0.25'%3E%3Cpath d='M50 50c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10zM10 10c0-5.523 4.477-10 10-10s10 4.477 10 10-4.477 10-10 10c0 5.523-4.477 10-10 10S0 25.523 0 20s4.477-10 10-10zm10 8c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8zm40 40c4.418 0 8-3.582 8-8s-3.582-8-8-8-8 3.582-8 8 3.582 8 8 8z' /%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    z-index: -1;
    opacity: 0.03;
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    position: fixed;
    left: ${props => props.$isOpen ? '0' : '-280px'};
    height: 100vh;
    box-shadow: ${props => props.$isOpen ? '0 0 40px rgba(24, 255, 232, 0.5)' : 'none'};
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 60;
  background: linear-gradient(135deg, #6366f1, #8b5cf6, #4f46e5);
  background-size: 200% 200%;
  animation: ${gradientFlow} 5s ease infinite;
  color: white;
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  cursor: pointer;
  box-shadow: 0 5px 15px rgba(139, 92, 246, 0.4), 0 0 0 5px rgba(139, 92, 246, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 8px 20px rgba(139, 92, 246, 0.6), 0 0 0 5px rgba(139, 92, 246, 0.15);
  }
  
  &:active {
    transform: translateY(0) scale(0.95);
  }
  
  svg {
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));
  }
  
  @media (max-width: 768px) {
    display: flex;
  }
`;

const Logo = styled.div`
  padding: 1.75rem 1.5rem;
  font-size: 1.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, ${colors.blues.medium}, ${colors.purples.medium}, ${colors.blues.deep});
    background-size: 200% 200%;
    animation: ${softColorShift} 5s ease infinite;
    opacity: 0.9;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.2), rgba(255,255,255,0));
    transform: skewX(-15deg);
    animation: shimmer 3s infinite;
    z-index: 1;
  }
  
  span {
    display: inline-block;
    margin-left: 10px;
    background: linear-gradient(
      to right, 
      #fff, 
      rgba(255, 255, 255, 0.8),
      #fff
    );
    background-size: 200% auto;
    animation: ${softColorShift} 3s ease-in-out infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
  }
  
  svg {
    font-size: 2rem;
    color: white;
    filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.4));
    animation: ${iconFloat} 3s ease-in-out infinite;
  }
`;

const Menu = styled.ul`
  list-style: none;
  padding: 0.75rem;
  margin: 0;
`;

const MenuItem = styled.div`
  ${menuItemStyle}
  display: flex;
  align-items: center;
  margin: 0.25rem 0.5rem;
  border-radius: 8px;
`;

const MenuLink = styled(NavLink)<{ $isActive?: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  width: 100%;
  color: ${colors.dark.lightest};
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  border-radius: 8px;
  ${menuItemStyle}
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
    
    svg {
      color: ${colors.blues.light};
      transform: scale(1.1);
    }
  }
  
  &.active {
    ${activeItemStyle}
  }
  
  svg {
    font-size: 1.2rem;
    margin-right: 0.75rem;
    transition: all 0.3s ease;
    color: ${colors.dark.lightest};
  }
`;

const MenuHeading = styled.div`
  padding: 1.25rem 1.5rem 0.5rem 1.5rem;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: ${colors.blues.light};
  font-weight: 600;
  margin-top: 0.5rem;
  text-shadow: 0 0 8px rgba(59, 130, 246, 0.3);
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem;
  width: 100%;
  background: transparent;
  border: none;
  color: ${colors.dark.lightest};
  font-size: 1rem;
  font-weight: 400;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
  ${menuItemStyle}
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: white;
    transform: translateX(5px);
    
    svg {
      color: ${colors.blues.light};
      transform: scale(1.1);
    }
  }
  
  svg {
    font-size: 1.2rem;
    margin-right: 0.75rem;
    transition: all 0.3s ease;
    color: ${colors.dark.lightest};
  }
`;

const SidebarFooter = styled.div`
  padding: 1.25rem 1.5rem;
  font-size: 0.75rem;
  color: ${colors.dark.light};
  text-align: center;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  margin-top: auto;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: -1px;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${colors.primary.light}40, transparent);
  }
`;

const SidebarProfile = styled.div`
  display: flex;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -1px;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, ${colors.primary.light}40, transparent);
  }
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    
    .profile-icon {
      box-shadow: 0 0 0 5px ${colors.primary.glow}, 0 5px 15px rgba(99, 102, 241, 0.5);
      transform: translateY(-3px) scale(1.05);
    }
  }
`;

const ProfileIcon = styled.div`
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-right: 0.75rem;
  font-size: 1.25rem;
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.1), 0 3px 10px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    border-radius: 50%;
    border: 2px solid transparent;
    background: linear-gradient(135deg, #6366f1, #8b5cf6) border-box;
    mask: linear-gradient(#fff 0 0) padding-box, 
          linear-gradient(#fff 0 0);
    mask-composite: exclude;
    opacity: 0.6;
  }
`;

const ProfileInfo = styled.div`
  flex: 1;
`;

const ProfileName = styled.div`
  font-weight: 600;
  color: white;
  font-size: 0.95rem;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
`;

const ProfileRole = styled.div`
  font-size: 0.8rem;
  color: ${colors.primary.light};
  margin-top: 0.25rem;
  opacity: 0.9;
`;

const MainContent = styled.main`
  flex: 1;
  padding: 2rem;
  overflow-x: hidden;
  background-color: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  margin: 1rem;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.03);
`;

const PageContainer = styled.div`
  padding: 2rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1rem;
  cursor: pointer;
  margin-right: 1rem;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const SubmitButton = styled.button`
  background: #3b82f6;
  border: none;
  color: white;
  font-size: 1rem;
  padding: 0.75rem 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: #2563eb;
  }
`;

const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
`;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);
  
  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Mobil görünümde sayfa değiştiğinde sidebar'ı kapat
  useEffect(() => {
    if (window.innerWidth <= 768) {
      setIsSidebarOpen(false);
    }
  }, [location.pathname]);
  
  // Ekran boyutu değiştiğinde sidebar durumunu güncelle
  useEffect(() => {
    const handleResize = () => {
      setIsSidebarOpen(window.innerWidth > 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  return (
    <AdminContainer>
      <MobileMenuButton onClick={toggleSidebar}>
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </MobileMenuButton>
      
      <Sidebar $isOpen={isSidebarOpen}>
        <Logo>
          <FaGem />
          <span>Admin Panel</span>
        </Logo>
        
        <SidebarProfile>
          <ProfileIcon className="profile-icon">
            <FaUser />
          </ProfileIcon>
          <ProfileInfo>
            <ProfileName>Yönetici</ProfileName>
            <ProfileRole>Sistem Yöneticisi</ProfileRole>
          </ProfileInfo>
        </SidebarProfile>
        
        <Menu>
          <MenuHeading>Genel</MenuHeading>
          <MenuItem>
            <MenuLink 
              to="/admin/dashboard" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaChartPie /> Dashboard
            </MenuLink>
          </MenuItem>
          
          <MenuHeading>İçerik Yönetimi</MenuHeading>
          <MenuItem>
            <MenuLink 
              to="/admin/users" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaUsers /> Kullanıcılar
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink 
              to="/admin/products" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaBoxOpen /> Ürünler
            </MenuLink>
          </MenuItem>
          <MenuItem>
            <MenuLink 
              to="/admin/orders" 
              className={({ isActive }) => isActive ? 'active' : ''}
              onClick={() => setIsSidebarOpen(false)}
            >
              <FaShoppingCart /> Siparişler
            </MenuLink>
          </MenuItem>
          
          <MenuHeading>Hesap</MenuHeading>
          <MenuItem>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Çıkış Yap
            </LogoutButton>
          </MenuItem>
        </Menu>
        
        <SidebarFooter>
          © {new Date().getFullYear()} E-Ticaret Platform
        </SidebarFooter>
      </Sidebar>
      
      <MainContent>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<UserList />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="products" element={<ProductList />} />
          <Route path="products/new" element={
            <PageContainer>
              <PageHeader>
                <div>
                  <BackButton onClick={() => navigate('/admin/products')}>
                    <FaArrowLeft /> Ürünlere Dön
                  </BackButton>
                  <Title>
                    Yeni Ürün Ekle
                  </Title>
                </div>
              </PageHeader>
              <SimpleProductForm />
            </PageContainer>
          } />
          <Route path="products/:id" element={<ProductDetail />} />
        </Routes>
      </MainContent>
    </AdminContainer>
  );
};

export default AdminLayout; 