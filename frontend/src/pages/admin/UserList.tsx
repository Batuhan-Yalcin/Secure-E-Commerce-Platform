import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaUsers, FaSearch, FaEye, FaTrash, FaTimes, FaExclamationCircle, FaSpinner, FaSortAmountDown, FaSortAmountUp, FaUserShield, FaFilter, FaUserEdit, FaUserCog } from 'react-icons/fa';
import axios from 'axios';
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
  },
  indigo: {
    light: '#818cf8',
    main: '#6366f1',
    dark: '#4f46e5',
    gradient: 'linear-gradient(135deg, #818cf8, #4f46e5)',
    background: 'linear-gradient(135deg, #eef2ff 0%, #e0e7ff 100%)',
    glow: 'rgba(79, 70, 229, 0.5)'
  }
};

// Zenginleştirilmiş animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(99, 102, 241, 0); }
  100% { box-shadow: 0 0 0 0 rgba(99, 102, 241, 0); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideLeft = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const slideRight = keyframes`
  from { opacity: 0; transform: translateX(20px); }
  to { opacity: 1; transform: translateX(0); }
`;

const shimmerEffect = css`
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.5) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite;
`;

// API URL
const API_URL = 'http://localhost:8080/api';

// Kullanıcı veri türü
interface User {
  id: number;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  roles: string[];
}

// Stil bileşenleri
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  animation: ${fadeIn} 0.6s ease-out;
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
    height: 6px;
    background: linear-gradient(90deg, 
      ${colors.purple.main}, 
      ${colors.indigo.main}, 
      ${colors.teal.main}
    );
    background-size: 400% 400%;
    animation: ${shimmer} 8s linear infinite;
    z-index: 10;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 3px;
    background: linear-gradient(90deg, ${colors.indigo.main}, ${colors.purple.main});
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: ${slideLeft} 0.6s ease-out;
  position: relative;
  
  svg {
    font-size: 1.75rem;
    color: ${colors.indigo.main};
    animation: ${floatAnimation} 4s infinite ease-in-out;
    filter: drop-shadow(0 4px 6px rgba(99, 102, 241, 0.2));
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: linear-gradient(90deg, #6366f1, #8b5cf6, #d946ef);
    border-radius: 3px;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
  animation: ${slideRight} 0.6s ease-out;
`;

const SearchInput = styled.input`
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  
  &:focus {
    outline: none;
    border-color: ${colors.indigo.main};
    box-shadow: 0 0 0 3px ${colors.indigo.glow};
    transform: translateY(-2px);
  }
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.indigo.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: 10;
  transition: all 0.3s ease;
  
  ${SearchInput}:focus + & {
    color: ${colors.indigo.dark};
    transform: translateY(-50%) scale(1.1);
  }
`;

const UsersContainer = styled.div`
  background: white;
  border-radius: 16px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: 0.1s;
  transform-style: preserve-3d;
  perspective: 1000px;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at top left,
      rgba(99, 102, 241, 0.08), 
      transparent 60%
    );
    pointer-events: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  overflow: hidden;
`;

const TableHead = styled.thead`
  background: linear-gradient(to right, ${colors.indigo.background}, #f8fafc);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      ${colors.indigo.light}80, 
      ${colors.purple.light}80
    );
  }
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;
  position: relative;
  transform-style: preserve-3d;
  
  &:not(:last-child) {
    border-bottom: 1px solid #e2e8f0;
  }
  
  &:hover {
    background-color: #f8fafc;
    transform: scale(1.01) translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    z-index: 10;
    
    & > td {
      color: ${colors.indigo.dark};
    }
  }
`;

const TableHeader = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.indigo.dark};
  font-size: 0.925rem;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  &:hover {
    color: ${colors.indigo.main};
    
    &::after {
      width: 80%;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 1.25rem;
    bottom: 10px;
    height: 2px;
    width: 0;
    background: ${colors.indigo.gradient};
    transition: width 0.3s ease;
  }
`;

const SortIcon = styled.span`
  margin-left: 0.5rem;
  display: inline-flex;
  align-items: center;
  color: ${colors.indigo.main};
  transition: all 0.3s ease;
  
  svg {
    filter: drop-shadow(0 2px 3px rgba(99, 102, 241, 0.2));
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.25rem;
  color: #1e293b;
  font-size: 0.925rem;
  transition: all 0.3s ease;
  border-bottom: 1px solid #f1f5f9;
  position: relative;
  vertical-align: middle;
`;

const RoleBadge = styled.span<{ $role: string }>`
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  
  ${props => {
    if (props.$role === 'ROLE_ADMIN') {
      return `
        background: ${colors.purple.background};
        color: ${colors.purple.dark};
        border: 1px solid ${colors.purple.light}50;
      `;
    } else if (props.$role === 'ROLE_MODERATOR') {
      return `
        background: ${colors.teal.background};
        color: ${colors.teal.dark};
        border: 1px solid ${colors.teal.light}50;
      `;
    } else {
      return `
        background: ${colors.indigo.background};
        color: ${colors.indigo.dark};
        border: 1px solid ${colors.indigo.light}50;
      `;
    }
  }}
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

const ActionButton = styled.button`
  background: white;
  border: none;
  padding: 0.5rem;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    transform: translateY(-3px);
    
    &::before {
      opacity: 1;
    }
    
    svg {
      transform: scale(1.2);
    }
  }
  
  &.view {
    color: ${colors.indigo.main};
    border: 1px solid ${colors.indigo.light}30;
    
    &::before {
      background: ${colors.indigo.background};
    }
    
    &:hover {
      color: ${colors.indigo.dark};
      box-shadow: 0 5px 10px ${colors.indigo.glow};
    }
  }
  
  &.delete {
    color: ${colors.pink.main};
    border: 1px solid ${colors.pink.light}30;
    
    &::before {
      background: ${colors.pink.background};
    }
    
    &:hover {
      color: ${colors.pink.dark};
      box-shadow: 0 5px 10px ${colors.pink.glow};
    }
  }
  
  svg {
    font-size: 1.1rem;
    transition: all 0.3s ease;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e2e8f0;
  gap: 0.75rem;
  background: linear-gradient(to bottom, transparent, ${colors.indigo.background}40);
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.875rem;
  border-radius: 10px;
  border: 1px solid ${props => props.$active ? colors.indigo.main : '#e2e8f0'};
  background-color: ${props => props.$active ? colors.indigo.main : 'white'};
  color: ${props => props.$active ? 'white' : '#1e293b'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? `0 4px 12px ${colors.indigo.glow}` : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.indigo.main};
    color: ${props => props.$active ? 'white' : colors.indigo.main};
    box-shadow: 0 6px 15px ${colors.indigo.glow}80;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #e2e8f0;
    color: #9ca3af;
    box-shadow: none;
    transform: none;
    
    &:hover {
      border-color: #e2e8f0;
      color: #9ca3af;
      box-shadow: none;
    }
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
`;

const ModalContent = styled.div`
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  width: 100%;
  padding: 1.5rem;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #64748b;
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    color: #334155;
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ConfirmMessage = styled.p`
  color: #4b5563;
  margin: 0;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button<{ variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  ${({ variant }) => {
    switch (variant) {
      case 'primary':
        return `
          background-color: #3b82f6;
          border: 1px solid #3b82f6;
          color: white;
          
          &:hover {
            background-color: #2563eb;
            border-color: #2563eb;
          }
        `;
      case 'danger':
        return `
          background-color: #ef4444;
          border: 1px solid #ef4444;
          color: white;
          
          &:hover {
            background-color: #dc2626;
            border-color: #dc2626;
          }
        `;
      default:
        return `
          background-color: white;
          border: 1px solid #e2e8f0;
          color: #4b5563;
          
          &:hover {
            border-color: #d1d5db;
            color: #1e293b;
          }
        `;
    }
  }}
`;

const UserDetail = styled.div`
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 0.5rem 1.5rem;
`;

const DetailLabel = styled.div`
  font-weight: 600;
  color: #64748b;
`;

const DetailValue = styled.div`
  color: #1e293b;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: 1.25rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const NoDataContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: #6b7280;
  font-size: 1rem;
`;

const ITEMS_PER_PAGE = 10;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state'leri
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  
  // Sıralama state'leri
  const [sortField, setSortField] = useState<string>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Kullanıcıları getir
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/users`);
        setUsers(response.data);
        setFilteredUsers(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        setError(null);
      } catch (err: any) {
        console.error('Kullanıcılar alınırken hata:', err);
        setError(err.response?.data?.message || 'Kullanıcılar alınamadı');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, []);
  
  // Arama terimi değiştiğinde filtreleme yap
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredUsers(users);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = users.filter(user => 
        user.username.toLowerCase().includes(lowercasedSearch) ||
        user.email.toLowerCase().includes(lowercasedSearch) ||
        (user.firstName && user.firstName.toLowerCase().includes(lowercasedSearch)) ||
        (user.lastName && user.lastName.toLowerCase().includes(lowercasedSearch))
      );
      setFilteredUsers(filtered);
    }
    
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredUsers.length / ITEMS_PER_PAGE));
  }, [searchTerm, users]);
  
  // Sıralama fonksiyonu
  const sortUsers = (field: string) => {
    if (sortField === field) {
      // Aynı alan için yönü değiştir
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // Yeni alan için sıralama yönünü asc olarak ayarla
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Sıralanmış ve sayfalanmış kullanıcılar
  const sortedAndPaginatedUsers = React.useMemo(() => {
    // Sıralama
    const sorted = [...filteredUsers].sort((a, b) => {
      const aValue = a[sortField as keyof User];
      const bValue = b[sortField as keyof User];
      
      if (sortField === 'firstName' || sortField === 'lastName') {
        const aStr = String(aValue || '').toLowerCase();
        const bStr = String(bValue || '').toLowerCase();
        
        return sortDirection === 'asc'
          ? aStr.localeCompare(bStr)
          : bStr.localeCompare(aStr);
      }
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc'
          ? aValue.toLowerCase().localeCompare(bValue.toLowerCase())
          : bValue.toLowerCase().localeCompare(aValue.toLowerCase());
      }
      
      // Sayısal değerler için
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      
      return 0;
    });
    
    // Sayfalama
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sorted.slice(startIndex, endIndex);
  }, [filteredUsers, sortField, sortDirection, currentPage]);
  
  // Kullanıcı detayı göster
  const handleViewUser = (user: User) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };
  
  // Kullanıcı silme onay penceresi
  const handleDeleteClick = (user: User) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  
  // Kullanıcı silme işlemi
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setLoading(true);
      // Backend entegrasyonu yapılacak - şu anda mevcut olmadığı için simüle ediyoruz
      // await axios.delete(`${API_URL}/admin/users/${selectedUser.id}`);
      
      // Kullanıcıyı state'den kaldır
      const updatedUsers = users.filter(user => user.id !== selectedUser.id);
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);
      setTotalPages(Math.ceil(updatedUsers.length / ITEMS_PER_PAGE));
      
      toast.success(`${selectedUser.username} kullanıcısı silindi`);
      setDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (err: any) {
      console.error('Kullanıcı silinirken hata:', err);
      toast.error(err.response?.data?.message || 'Kullanıcı silinemedi');
    } finally {
      setLoading(false);
    }
  };
  
  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Sıralama ikonunu göster
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return (
      <SortIcon>
        {sortDirection === 'asc' ? <FaSortAmountUp /> : <FaSortAmountDown />}
      </SortIcon>
    );
  };
  
  // Yükleme durumu
  if (loading && users.length === 0) {
    return (
      <LoadingContainer>
        <FaSpinner /> Yükleniyor...
      </LoadingContainer>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <ErrorContainer>
        <FaExclamationCircle /> {error}
      </ErrorContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>
          <FaUsers /> Kullanıcılar
        </Title>
        <SearchContainer>
          <SearchIcon>
            <FaSearch />
          </SearchIcon>
          <SearchInput
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
      </PageHeader>
      
      <UsersContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader onClick={() => sortUsers('id')}>
                ID {renderSortIcon('id')}
              </TableHeader>
              <TableHeader onClick={() => sortUsers('username')}>
                Kullanıcı Adı {renderSortIcon('username')}
              </TableHeader>
              <TableHeader onClick={() => sortUsers('email')}>
                E-posta {renderSortIcon('email')}
              </TableHeader>
              <TableHeader onClick={() => sortUsers('firstName')}>
                Ad {renderSortIcon('firstName')}
              </TableHeader>
              <TableHeader onClick={() => sortUsers('lastName')}>
                Soyad {renderSortIcon('lastName')}
              </TableHeader>
              <TableHeader>Rol</TableHeader>
              <TableHeader>İşlemler</TableHeader>
            </TableRow>
          </TableHead>
          <tbody>
            {sortedAndPaginatedUsers.length > 0 ? (
              sortedAndPaginatedUsers.map(user => (
                <TableRow key={user.id}>
                  <TableCell>{user.id}</TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.firstName || '-'}</TableCell>
                  <TableCell>{user.lastName || '-'}</TableCell>
                  <TableCell>
                    {user.roles?.map(role => (
                      <RoleBadge key={role} $role={role}>
                        {role.replace('ROLE_', '')}
                      </RoleBadge>
                    ))}
                  </TableCell>
                  <TableCell>
                    <ActionButtonsContainer>
                      <ActionButton 
                        className="view"
                        onClick={() => handleViewUser(user)}
                        title="Görüntüle"
                      >
                        <FaEye />
                      </ActionButton>
                      <ActionButton 
                        className="delete"
                        onClick={() => handleDeleteClick(user)}
                        title="Sil"
                      >
                        <FaTrash />
                      </ActionButton>
                    </ActionButtonsContainer>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7}>
                  <NoDataContainer>
                    Kullanıcı bulunamadı
                  </NoDataContainer>
                </TableCell>
              </TableRow>
            )}
          </tbody>
        </Table>
        
        {totalPages > 1 && (
          <Pagination>
            <PageButton 
              onClick={() => handlePageChange(1)}
              disabled={currentPage === 1}
            >
              İlk
            </PageButton>
            <PageButton 
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Önceki
            </PageButton>
            
            {/* Sayfa numaraları */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // Başlangıç sayfası
              let startPage = Math.max(1, currentPage - 2);
              // Eğer son sayfalara yakınsa, görüntülenen sayfa aralığını ayarla
              if (currentPage + 2 > totalPages) {
                startPage = Math.max(1, totalPages - 4);
              }
              const pageNumber = startPage + i;
              
              if (pageNumber <= totalPages) {
                return (
                  <PageButton 
                    key={pageNumber}
                    $active={pageNumber === currentPage}
                    onClick={() => handlePageChange(pageNumber)}
                  >
                    {pageNumber}
                  </PageButton>
                );
              }
              return null;
            })}
            
            <PageButton 
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Sonraki
            </PageButton>
            <PageButton 
              onClick={() => handlePageChange(totalPages)}
              disabled={currentPage === totalPages}
            >
              Son
            </PageButton>
          </Pagination>
        )}
      </UsersContainer>
      
      {/* Kullanıcı Detay Modal */}
      {viewModalOpen && selectedUser && (
        <ModalBackdrop onClick={() => setViewModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Kullanıcı Detayları</ModalTitle>
              <CloseButton onClick={() => setViewModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <UserDetail>
                <DetailLabel>ID:</DetailLabel>
                <DetailValue>{selectedUser.id}</DetailValue>
                
                <DetailLabel>Kullanıcı Adı:</DetailLabel>
                <DetailValue>{selectedUser.username}</DetailValue>
                
                <DetailLabel>E-posta:</DetailLabel>
                <DetailValue>{selectedUser.email}</DetailValue>
                
                <DetailLabel>Ad:</DetailLabel>
                <DetailValue>{selectedUser.firstName || '-'}</DetailValue>
                
                <DetailLabel>Soyad:</DetailLabel>
                <DetailValue>{selectedUser.lastName || '-'}</DetailValue>
                
                <DetailLabel>Roller:</DetailLabel>
                <DetailValue>
                  {selectedUser.roles?.map(role => (
                    <RoleBadge key={role} $role={role} style={{ marginRight: '0.5rem' }}>
                      {role.replace('ROLE_', '')}
                    </RoleBadge>
                  ))}
                </DetailValue>
              </UserDetail>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setViewModalOpen(false)}>
                Kapat
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalBackdrop>
      )}
      
      {/* Kullanıcı Silme Modal */}
      {deleteModalOpen && selectedUser && (
        <ModalBackdrop onClick={() => setDeleteModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>Kullanıcı Sil</ModalTitle>
              <CloseButton onClick={() => setDeleteModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ConfirmMessage>
                <strong>{selectedUser.username}</strong> kullanıcısını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </ConfirmMessage>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setDeleteModalOpen(false)}>
                İptal
              </Button>
              <Button 
                variant="danger" 
                onClick={handleDeleteUser}
              >
                Sil
              </Button>
            </ModalFooter>
          </ModalContent>
        </ModalBackdrop>
      )}
    </PageContainer>
  );
};

export default UserList; 