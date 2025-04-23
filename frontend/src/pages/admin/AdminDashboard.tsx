import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaUsers, FaShoppingCart, FaCheckCircle, FaSpinner, FaTruck, FaWindowClose, FaExclamationCircle, FaBox, FaChartLine, FaCog, FaSignOutAlt, FaUserShield, FaGem, FaLightbulb, FaRocket } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import adminService from '../../services/adminService';
import authService from '../../services/authService';
import { toast } from 'react-toastify';

// Çok renkli tema
const colors = {
  purple: {
    light: '#9333ea',
    main: '#7e22ce',
    dark: '#6b21a8',
    gradient: 'linear-gradient(135deg, #9333ea, #7e22ce)',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    glow: 'rgba(147, 51, 234, 0.5)'
  },
  orange: {
    light: '#fb923c',
    main: '#f97316',
    dark: '#ea580c',
    gradient: 'linear-gradient(135deg, #fb923c, #ea580c)',
    background: 'linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%)',
    glow: 'rgba(249, 115, 22, 0.5)'
  },
  teal: {
    light: '#2dd4bf',
    main: '#14b8a6',
    dark: '#0d9488',
    gradient: 'linear-gradient(135deg, #2dd4bf, #0d9488)',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    glow: 'rgba(20, 184, 166, 0.5)'
  },
  pink: {
    light: '#f472b6',
    main: '#ec4899',
    dark: '#db2777',
    gradient: 'linear-gradient(135deg, #f472b6, #db2777)',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    glow: 'rgba(236, 72, 153, 0.5)'
  }
};

// Zenginleştirilmiş animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(30px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  25% { transform: translateY(-10px) rotate(2deg); }
  50% { transform: translateY(0px) rotate(0deg); }
  75% { transform: translateY(-6px) rotate(-2deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
  50% { transform: scale(1.05); box-shadow: 0 20px 30px rgba(0, 0, 0, 0.2); }
  100% { transform: scale(1); box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideInLeft = keyframes`
  from { opacity: 0; transform: translateX(-70px) rotate(-5deg); }
  to { opacity: 1; transform: translateX(0) rotate(0deg); }
`;

const slideInRight = keyframes`
  from { opacity: 0; transform: translateX(70px) rotate(5deg); }
  to { opacity: 1; transform: translateX(0) rotate(0deg); }
`;

const glowPulse = keyframes`
  0% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
  50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.8); }
  100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.5); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0) scale(1); }
  40% { transform: translateY(-20px) scale(1.1); }
  60% { transform: translateY(-10px) scale(1.05); }
`;

const shake = keyframes`
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(8deg); }
  40% { transform: rotate(-8deg); }
  60% { transform: rotate(4deg); }
  80% { transform: rotate(-4deg); }
`;

const rainbow = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// Dashboard veri türleri
interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  revenue: number;
  recentOrders: RecentOrder[];
  orderStatusCounts: Record<string, number>;
}

interface RecentOrder {
  id: number;
  userId: number;
  orderDate: string;
  status: string;
  totalAmount: number;
}

// Ana konteyner stili
const DashboardContainer = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 2.5rem;
  animation: ${fadeIn} 0.8s ease-out;
  background: linear-gradient(135deg, #f8fafc 0%, #eef2f6 100%);
  min-height: 100vh;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, 
      ${colors.purple.main}, 
      ${colors.teal.main}, 
      ${colors.orange.main}, 
      ${colors.pink.main}
    );
    animation: ${rainbow} 8s linear infinite;
    background-size: 400% 400%;
    z-index: 10;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 5%;
    width: 90%;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.3), transparent);
  }
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  position: relative;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 150px;
    height: 3px;
    background: linear-gradient(90deg, ${colors.purple.main}, ${colors.pink.main});
    border-radius: 3px;
  }
`;

const PageTitle = styled.h1`
  font-size: 2.75rem;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  font-weight: 800;
  margin: 0;
  position: relative;
  letter-spacing: -0.5px;
  display: flex;
  align-items: center;
  animation: ${slideInLeft} 0.8s ease-out;
  
  &::before {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 40px;
    height: 4px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
    border-radius: 4px;
  }
`;

const HeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;
  animation: ${slideInRight} 0.8s ease-out;
`;

const AdminBadge = styled.div`
  display: flex;
  align-items: center;
  background: linear-gradient(90deg, #4f46e5, #7c3aed);
  color: white;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-weight: 600;
  gap: 0.5rem;
  box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(99, 102, 241, 0.4);
    
    &::before {
      opacity: 1;
      animation: ${shimmer} 2s infinite;
    }
  }
  
  svg {
    animation: ${shake} 5s infinite ease-in-out;
    position: relative;
    z-index: 2;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: white;
  border: none;
  border-radius: 12px;
  padding: 0.75rem 1.25rem;
  color: #64748b;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #f87171, #ef4444);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
    color: white;
    
    &::before {
      opacity: 1;
    }
    
    svg {
      transform: translateX(3px) rotate(360deg);
    }
  }
  
  svg {
    transition: all 0.5s ease;
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-bottom: 3.5rem;
`;

// İstatistik kartlarının stil özelliklerini belirleyen fonksiyon 
const getStatCardColor = (index: number) => {
  const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
  const colorKey = colorKeys[index % colorKeys.length];
  return colors[colorKey];
};

const StatCard = styled.div<{ index: number }>`
  background: white;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  transition: all 0.4s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  animation-fill-mode: both;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => `linear-gradient(135deg, ${getStatCardColor(props.index).background})`};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02) rotate(1deg);
    box-shadow: 0 20px 30px ${props => getStatCardColor(props.index).glow};
    
    &::before {
      opacity: 1;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 6px;
    height: 100%;
    background: ${props => getStatCardColor(props.index).gradient};
  }
`;

const IconWrapper = styled.div<{ index: number }>`
  width: 70px;
  height: 70px;
  border-radius: 20px;
  background: ${props => getStatCardColor(props.index).background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: ${props => getStatCardColor(props.index).main};
  position: relative;
  animation: ${floatAnimation} 5s infinite ease-in-out;
  box-shadow: 0 10px 20px ${props => `${getStatCardColor(props.index).glow}`};
  transition: all 0.3s ease;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: ${props => `linear-gradient(135deg, ${getStatCardColor(props.index).background})`};
    z-index: -1;
    filter: blur(10px);
  }
  
  ${StatCard}:hover & {
    transform: scale(1.1) rotate(-5deg);
    box-shadow: 0 15px 30px ${props => `${getStatCardColor(props.index).glow}`};
  }
`;

const StatValue = styled.div<{ index: number }>`
  font-size: 3rem;
  font-weight: 800;
  margin: 0.75rem 0;
  color: #1e293b;
  background: ${props => getStatCardColor(props.index).gradient};
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  letter-spacing: -1px;
  transition: all 0.3s ease;
  
  ${StatCard}:hover & {
    transform: scale(1.1);
    letter-spacing: 1px;
  }
`;

const StatLabel = styled.div<{ index: number }>`
  font-size: 1.125rem;
  color: #64748b;
  font-weight: 500;
  position: relative;
  padding-bottom: 0.75rem;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${props => getStatCardColor(props.index).gradient};
    border-radius: 3px;
    transition: width 0.3s ease;
  }
  
  ${StatCard}:hover &::after {
    width: 100%;
  }
`;

const LinksContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
`;

// Yönetim bağlantıları kartlarının stil özelliklerini belirleyen fonksiyon
const getLinkCardColor = (index: number) => {
  const colorKeys = Object.keys(colors) as Array<keyof typeof colors>;
  const colorKey = colorKeys[index % colorKeys.length];
  return colors[colorKey];
};

const LinkCard = styled(Link)<{ index: number }>`
  background: white;
  border-radius: 20px;
  padding: 2rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #1e293b;
  transition: all 0.5s ease;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  z-index: 1;
  animation: ${fadeIn} 0.6s ease-out;
  animation-fill-mode: both;
  
  &:nth-child(1) { animation-delay: 0.5s; }
  &:nth-child(2) { animation-delay: 0.6s; }
  &:nth-child(3) { animation-delay: 0.7s; }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: ${props => getLinkCardColor(props.index).gradient};
    opacity: 0;
    transition: opacity 0.4s ease;
    z-index: -1;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    transform: scale(0.5);
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-10px) scale(1.02) rotate(1deg);
    box-shadow: 0 20px 30px ${props => `${getLinkCardColor(props.index).glow}`};
    color: white;
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 1;
      animation: ${shimmer} 2s infinite;
    }
  }
`;

const LinkIcon = styled.div<{ index: number }>`
  width: 80px;
  height: 80px;
  border-radius: 20px;
  background: ${props => getLinkCardColor(props.index).background};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1.5rem;
  font-size: 2.5rem;
  color: ${props => getLinkCardColor(props.index).main};
  box-shadow: 0 10px 20px ${props => `${getLinkCardColor(props.index).glow}`};
  transition: all 0.5s ease;
  position: relative;
  transform-style: preserve-3d;
  
  &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 20px;
    background: ${props => `linear-gradient(135deg, ${getLinkCardColor(props.index).light}33, ${getLinkCardColor(props.index).dark}33)`};
    z-index: -1;
    filter: blur(8px);
  }
  
  ${LinkCard}:hover & {
    background: white;
    color: ${props => getLinkCardColor(props.index).main};
    transform: rotate3d(0, 1, 0, 180deg);
    animation: ${bounce} 1s ease-in-out;
  }
`;

const LinkText = styled.div`
  flex: 1;
  transition: all 0.3s ease;
  
  h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.5rem;
    font-weight: 700;
    transition: all 0.3s ease;
    position: relative;
    display: inline-block;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -6px;
      left: 0;
      width: 0;
      height: 3px;
      background: white;
      transition: width 0.3s ease;
      border-radius: 3px;
    }
  }
  
  p {
    margin: 0;
    font-size: 1rem;
    opacity: 0.7;
    transition: all 0.3s ease;
  }
  
  ${LinkCard}:hover & h3::after {
    width: 100%;
  }
  
  ${LinkCard}:hover & p {
    opacity: 0.9;
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  font-size: 1.2rem;
  color: #6366f1;
  
  svg {
    font-size: 3rem;
    animation: ${rotate} 1.5s linear infinite;
    margin-bottom: 1rem;
  }
`;

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalProducts: 0,
    revenue: 0,
    recentOrders: [],
    orderStatusCounts: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const dashboardStats = await adminService.getDashboardStats();
        setStats(dashboardStats);
      } catch (error) {
        toast.error('İstatistikler yüklenirken bir hata oluştu');
        console.error('Dashboard stats error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  const handleLogout = () => {
    authService.logout();
    window.location.href = '/login';
  };

  if (loading) {
    return (
      <LoadingSpinner>
        <FaSpinner />
        <div>İstatistikler Yükleniyor...</div>
      </LoadingSpinner>
    );
  }

  return (
    <DashboardContainer>
      <Header>
        <PageTitle>
          <FaUserShield style={{ marginRight: '1rem', fontSize: '2.25rem' }} /> 
          Yönetici Paneli
        </PageTitle>
        <HeaderRight>
          <AdminBadge>
            <FaUserShield /> Yönetici
          </AdminBadge>
          <LogoutButton onClick={handleLogout}>
            <FaSignOutAlt /> Çıkış Yap
          </LogoutButton>
        </HeaderRight>
      </Header>
      
      <StatsContainer>
        <StatCard index={0}>
          <IconWrapper index={0}>
            <FaUsers />
          </IconWrapper>
          <StatValue index={0}>{stats.totalUsers}</StatValue>
          <StatLabel index={0}>Toplam Kullanıcı</StatLabel>
        </StatCard>
        
        <StatCard index={1}>
          <IconWrapper index={1}>
            <FaShoppingCart />
          </IconWrapper>
          <StatValue index={1}>{stats.totalOrders}</StatValue>
          <StatLabel index={1}>Toplam Sipariş</StatLabel>
        </StatCard>
        
        <StatCard index={2}>
          <IconWrapper index={2}>
            <FaBox />
          </IconWrapper>
          <StatValue index={2}>{stats.totalProducts}</StatValue>
          <StatLabel index={2}>Toplam Ürün</StatLabel>
        </StatCard>
        
        <StatCard index={3}>
          <IconWrapper index={3}>
            <FaChartLine />
          </IconWrapper>
          <StatValue index={3}>{stats.revenue.toLocaleString()} ₺</StatValue>
          <StatLabel index={3}>Toplam Gelir</StatLabel>
        </StatCard>
      </StatsContainer>
      
      <LinksContainer>
        <LinkCard to="/admin/users" index={0}>
          <LinkIcon index={0}>
            <FaUsers />
          </LinkIcon>
          <LinkText>
            <h3>Kullanıcı Yönetimi</h3>
            <p>Kullanıcıları görüntüle, düzenle ve yönet</p>
          </LinkText>
        </LinkCard>
        
        <LinkCard to="/admin/orders" index={1}>
          <LinkIcon index={1}>
            <FaShoppingCart />
          </LinkIcon>
          <LinkText>
            <h3>Sipariş Yönetimi</h3>
            <p>Siparişleri görüntüle ve durumlarını güncelle</p>
          </LinkText>
        </LinkCard>
        
        <LinkCard to="/admin/products" index={2}>
          <LinkIcon index={2}>
            <FaBox />
          </LinkIcon>
          <LinkText>
            <h3>Ürün Yönetimi</h3>
            <p>Ürünleri ekle, düzenle ve yönet</p>
          </LinkText>
        </LinkCard>
      </LinksContainer>
    </DashboardContainer>
  );
};

export default AdminDashboard; 