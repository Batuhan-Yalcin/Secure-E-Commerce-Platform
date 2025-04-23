import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaLock, FaEye, FaEyeSlash, FaKey, FaExclamationCircle, FaUserEdit, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '../components/common/Button';
import authService from '../services/authService';
import { User, ProfileUpdateRequest, PasswordChangeRequest } from '../types';

// Renk paleti ekleyelim
const colors = {
  oranges: {
    light: '#FFB800',
    medium: '#FF6600',
    dark: '#E05400'
  },
  teals: {
    light: '#00FFCC',
    medium: '#00CCAA',
    dark: '#00AA88'
  },
  blues: {
    light: '#00E0FF',
    medium: '#00AAFF',
    dark: '#0088CC'
  },
  purples: {
    light: '#B088FF', 
    medium: '#8866FF',
    dark: '#6644DD'
  },
  whites: {
    regular: '#FFFFFF'
  },
  grays: {
    medium: '#9CA3AF'
  }
};


const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const shine = keyframes`
  0% { background-position: -100% 0; }
  100% { background-position: 200% 0; }
`;

const rotate3D = keyframes`
  0% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
  25% { transform: perspective(1000px) rotateX(1deg) rotateY(3deg); }
  50% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
  75% { transform: perspective(1000px) rotateX(-1deg) rotateY(-3deg); }
  100% { transform: perspective(1000px) rotateX(0deg) rotateY(0deg); }
`;

const floatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const enhancedFloating = keyframes`
  0% { transform: translateY(0) rotate(0deg) scale(1); filter: hue-rotate(0deg); }
  33% { transform: translateY(-20px) rotate(5deg) scale(1.05); filter: hue-rotate(30deg); }
  66% { transform: translateY(10px) rotate(-3deg) scale(0.95); filter: hue-rotate(-30deg); }
  100% { transform: translateY(0) rotate(0deg) scale(1); filter: hue-rotate(0deg); }
`;

const pulsingGlow = keyframes`
  0% { box-shadow: 0 0 5px rgba(255, 102, 0, 0.5), 0 0 10px rgba(255, 184, 0, 0.3); }
  50% { box-shadow: 0 0 15px rgba(255, 102, 0, 0.8), 0 0 20px rgba(255, 184, 0, 0.5); }
  100% { box-shadow: 0 0 5px rgba(255, 102, 0, 0.5), 0 0 10px rgba(255, 184, 0, 0.3); }
`;

const enhancedGradient = keyframes`
  0% { background-position: 0% 50%; filter: hue-rotate(0deg); }
  25% { background-position: 50% 25%; filter: hue-rotate(15deg); }
  50% { background-position: 100% 50%; filter: hue-rotate(0deg); }
  75% { background-position: 50% 75%; filter: hue-rotate(-15deg); }
  100% { background-position: 0% 50%; filter: hue-rotate(0deg); }
`;

const inputFocus = keyframes`
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-2px) scale(1.01); }
  100% { transform: translateY(0) scale(1); }
`;

const titleShine = keyframes`
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
`;

const buttonGlow = keyframes`
  0% { box-shadow: 0 0 5px ${colors.oranges.medium}50, 0 0 10px ${colors.oranges.medium}30; }
  50% { box-shadow: 0 0 15px ${colors.oranges.medium}70, 0 0 20px ${colors.oranges.medium}40; }
  100% { box-shadow: 0 0 5px ${colors.oranges.medium}50, 0 0 10px ${colors.oranges.medium}30; }
`;

const buttonShine = keyframes`
  0% { transform: translateX(-100%) rotate(45deg); }
  100% { transform: translateX(100%) rotate(45deg); }
`;

// Stil Bileşenleri
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  width: 100%;
  position: relative;
  overflow-x: hidden;
  padding: 2rem;
  background: linear-gradient(
    45deg, 
    ${colors.oranges.medium}, 
    ${colors.teals.medium},
    ${colors.blues.medium},
    ${colors.oranges.medium}
  );
  background-size: 400% 400%;
  animation: ${enhancedGradient} 15s ease infinite;
  box-sizing: border-box;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(255, 184, 0, 0.3) 0%, transparent 25%),
      radial-gradient(circle at 80% 20%, rgba(0, 230, 202, 0.2) 0%, transparent 30%),
      radial-gradient(circle at 10% 80%, rgba(0, 220, 255, 0.2) 0%, transparent 35%),
      radial-gradient(circle at 90% 70%, rgba(255, 102, 0, 0.2) 0%, transparent 20%);
    z-index: -1;
  }
`;

const Shape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  z-index: -1;
  animation: ${enhancedFloating} 8s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 200px;
    height: 200px;
    top: 15%;
    left: 10%;
    background: radial-gradient(circle at center, rgba(255, 184, 0, 0.15), rgba(255, 102, 0, 0.05));
    animation-duration: 12s;
  }
  
  &:nth-child(2) {
    width: 250px;
    height: 250px;
    bottom: 15%;
    right: 10%;
    background: radial-gradient(circle at center, rgba(0, 230, 202, 0.15), rgba(0, 170, 255, 0.05));
    animation-duration: 15s;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    width: 150px;
    height: 150px;
    bottom: 30%;
    left: 15%;
    background: radial-gradient(circle at center, rgba(176, 136, 255, 0.15), rgba(102, 68, 221, 0.05));
    animation-duration: 10s;
    animation-delay: 2s;
  }
  
  &:nth-child(4) {
    width: 180px;
    height: 180px;
    top: 40%;
    right: 15%;
    background: radial-gradient(circle at center, rgba(255, 102, 102, 0.15), rgba(255, 51, 0, 0.05));
    animation-duration: 14s;
    animation-delay: 3s;
  }
`;

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 900px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  z-index: 1;
  position: relative;
  margin: 0 auto;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(
      90deg, 
      ${colors.oranges.medium}, 
      ${colors.teals.medium}, 
      ${colors.blues.medium}, 
      ${colors.purples.medium},
      ${colors.oranges.medium}
    );
    background-size: 300% 100%;
    animation: ${shine} 5s linear infinite;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
  
  @media (max-width: 768px) {
    padding: 2rem 1.5rem;
    max-width: 95%;
    margin: 0 1rem;
  }
`;

const FormTitle = styled.h1`
  text-align: center;
  color: #1E293B;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  position: relative;
  display: inline-block;
  width: 100%;
  
  &::before {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg, 
      ${colors.oranges.medium}, 
      ${colors.teals.medium}, 
      ${colors.blues.medium},
      ${colors.oranges.medium}
    );
    background-size: 200% 100%;
    animation: ${titleShine} 5s linear infinite;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    z-index: 1;
  }
  
  @media (max-width: 768px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 2px solid #E5E7EB;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(
      to right,
      ${colors.oranges.medium},
      ${colors.teals.medium}, 
      ${colors.blues.medium},
      ${colors.oranges.medium}
    );
    background-size: 300% 100%;
    animation: ${gradientAnimation} 5s ease infinite;
    z-index: 1;
  }
`;

const TabButton = styled.button<{ $active: boolean }>`
  padding: 0.85rem 1.75rem;
  background: ${props => props.$active ? 
    `linear-gradient(135deg, ${colors.oranges.light}20, ${colors.teals.light}20)` : 
    'transparent'
  };
  color: ${props => props.$active ? colors.oranges.dark : '#64748B'};
  border: none;
  cursor: pointer;
  font-weight: 600;
  border-bottom: 2px solid ${props => props.$active ? colors.oranges.medium : 'transparent'};
  margin-bottom: -2px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  z-index: 2;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  
  &:hover {
    color: ${colors.oranges.medium};
    transform: translateY(-2px) translateZ(10px);
    
    svg {
      transform: rotate(10deg) scale(1.2);
    }
    
    &::after {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(90deg, ${colors.oranges.medium}, ${colors.teals.light});
    opacity: 0;
    transform: translateY(10px);
    transition: all 0.3s ease;
  }
  
  svg {
    transition: all 0.3s ease;
    ${props => props.$active && `
      color: ${colors.oranges.medium};
      filter: drop-shadow(0 0 3px ${colors.oranges.medium}80);
    `}
  }
  
  ${props => props.$active && `
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, ${colors.oranges.light}30, ${colors.teals.light}30);
      z-index: -1;
      opacity: 0.7;
    }
  `}
`;

const FormColumns = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #4B5563;
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
`;

const Input = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: 15px 50px 15px 20px;
  background: ${colors.whites.regular};
  border: 1px solid ${props => props.$hasError ? '#EF4444' : 'rgba(0, 0, 0, 0.1)'};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: text;
  position: relative;
  z-index: 1;
  
  &:focus {
    outline: none;
    border-color: ${props => props.$hasError ? '#EF4444' : colors.oranges.medium};
    box-shadow: ${props => props.$hasError ? 
      '0 0 0 3px rgba(239, 68, 68, 0.2)' : 
      '0 0 0 3px rgba(241, 136, 5, 0.2)'
    };
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  right: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: ${colors.grays.medium};
  font-size: 1.5rem;
  transition: all 0.3s ease;
  pointer-events: none;
  z-index: 2;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    ${InputIcon} {
      transform: translateY(-50%) scale(1.2);
      color: ${colors.oranges.dark};
    }
  }
`;

const PasswordIcon = styled.div`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4B5563;
  font-size: 1rem;
  cursor: pointer;
  
  &:hover {
    color: ${colors.oranges.medium};
  }
`;

const ErrorMessage = styled.div`
  color: #EF4444;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const SuccessMessage = styled.div`
  color: #10B981;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
`;

const ActionButton = styled(Button)`
  width: 100%;
  padding: 0.9rem;
  margin-top: 1.5rem;
  font-weight: 600;
  background: linear-gradient(
    135deg, 
    ${colors.oranges.medium}, 
    ${colors.oranges.dark}
  );
  border-radius: 12px;
  position: relative;
  overflow: hidden;
  transform-style: preserve-3d;
  transition: all 0.3s ease;
  animation: ${buttonGlow} 2s infinite;
  
  &:hover {
    animation: none;
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 8px 20px rgba(255, 102, 0, 0.3);
    
    &::after {
      animation: ${buttonShine} 0.8s ease;
    }
  }
  
  &:active {
    transform: translateY(0) scale(0.98);
    box-shadow: 0 2px 10px rgba(255, 102, 0, 0.2);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: linear-gradient(
      45deg,
      transparent,
      rgba(255, 255, 255, 0.4),
      transparent
    );
    transform: translateX(-100%) rotate(45deg);
  }
  
  svg {
    margin-right: 0.75rem;
    position: relative;
    z-index: 2;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.2) rotate(10deg);
  }
  
  span {
    position: relative;
    z-index: 2;
  }
`;

// Tab türleri
type TabType = 'profile' | 'password';

const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  
  // Profil bilgileri state'leri
  const [profileData, setProfileData] = useState<ProfileUpdateRequest>({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: ''
  });
  
  const [profileErrors, setProfileErrors] = useState<Partial<ProfileUpdateRequest>>({});
  
  // Şifre değiştirme state'leri
  const [passwordData, setPasswordData] = useState<PasswordChangeRequest>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [passwordErrors, setPasswordErrors] = useState<Partial<PasswordChangeRequest>>({});
  const [showCurrentPassword, setShowCurrentPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  
  // Profil bilgilerini yükle
  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await authService.getUserProfile();
        setProfileData({
          firstName: profile.firstName || '',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || '',
          address: profile.address || ''
        });
      } catch (error: any) {
        console.error('Profil bilgileri yüklenemedi:', error);
        
        // 401 Unauthorized hatası olmadığı sürece sadece hata mesajı göster
        // 401 hatasını api.ts interceptor'ı işleyecek
        if (error.response && error.response.status !== 401) {
          toast.error('Profil bilgileri yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
        }
      } finally {
        setIsLoading(false);
      }
    };
    
    // Kullanıcının oturum durumunu kontrol et
    // Token varsa profil bilgilerini yüklemeyi dene
    const checkAuthAndLoadProfile = () => {
      if (authService.isAuthenticated()) {
        loadUserProfile();
      } else {
        navigate('/login');
      }
    };
    
    checkAuthAndLoadProfile();
  }, [navigate]);
  
  // Profil bilgileri değişikliği
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field when user types
    if (profileErrors[name as keyof typeof profileErrors]) {
      setProfileErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Şifre bilgileri değişikliği
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Anlık doğrulama
    if (passwordErrors[name as keyof typeof passwordErrors]) {
      validatePasswordField(name, value);
    }
  };
  
  // Profil alanı doğrulama
  const validateProfileField = (name: string, value: string): string => {
    switch (name) {
      case 'firstName':
        if (!value.trim()) return 'Ad boş olamaz';
        if (value.length > 50) return 'Ad 50 karakterden uzun olamaz';
        return '';
      
      case 'lastName':
        if (!value.trim()) return 'Soyad boş olamaz';
        if (value.length > 50) return 'Soyad 50 karakterden uzun olamaz';
        return '';
      
      case 'email':
        if (!value.trim()) return 'E-posta boş olamaz';
        if (!/\S+@\S+\.\S+/.test(value)) return 'Geçerli bir e-posta giriniz';
        return '';
      
      case 'phoneNumber':
        if (value && value.length > 15) return 'Telefon numarası 15 karakterden uzun olamaz';
        return '';
      
      case 'address':
        if (value && value.length > 255) return 'Adres 255 karakterden uzun olamaz';
        return '';
      
      default:
        return '';
    }
  };
  
  // Şifre alanı doğrulama
  const validatePasswordField = (name: string, value: string): string => {
    switch (name) {
      case 'currentPassword':
        if (!value.trim()) return 'Mevcut şifre boş olamaz';
        return '';
      
      case 'newPassword':
        if (!value.trim()) return 'Yeni şifre boş olamaz';
        if (value.length < 6) return 'Yeni şifre en az 6 karakter olmalıdır';
        return '';
      
      case 'confirmPassword':
        if (!value.trim()) return 'Şifre onayı boş olamaz';
        if (value !== passwordData.newPassword) return 'Şifreler eşleşmiyor';
        return '';
      
      default:
        return '';
    }
  };
  
  // Profil formunu doğrula
  const validateProfileForm = (): boolean => {
    const errors: Partial<ProfileUpdateRequest> = {};
    
    Object.keys(profileData).forEach(key => {
      const fieldName = key as keyof ProfileUpdateRequest;
      const error = validateProfileField(fieldName, profileData[fieldName] || '');
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Şifre formunu doğrula
  const validatePasswordForm = (): boolean => {
    const errors: Partial<PasswordChangeRequest> = {};
    
    Object.keys(passwordData).forEach(key => {
      const fieldName = key as keyof PasswordChangeRequest;
      const error = validatePasswordField(fieldName, passwordData[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  // Profil formu gönderimi
  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateProfileForm()) return;
    
    setIsLoading(true);
    
    try {
      await authService.updateUserProfile(profileData);
      setIsSuccess(true);
      toast.success('Profil bilgileriniz başarıyla güncellendi.');
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Profil güncellenirken hata:', error);
      
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Profil güncellenirken bir hata oluştu.');
      } else {
        toast.error('Profil güncellenirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Şifre formu gönderimi
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validatePasswordForm()) return;
    
    setIsLoading(true);
    
    try {
    
      await authService.changePassword(
        passwordData.currentPassword, 
        passwordData.newPassword
      );
      
      setIsSuccess(true);
      toast.success('Şifreniz başarıyla değiştirildi.');
      
      // Şifre alanlarını temizle
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      
      // 3 saniye sonra başarı mesajını kaldır
      setTimeout(() => {
        setIsSuccess(false);
      }, 3000);
    } catch (error: any) {
      console.error('Şifre değiştirilirken hata:', error);
      
      if (error.response && error.response.data) {
        const errorMessage = error.response.data.message || 
                            (typeof error.response.data === 'string' ? error.response.data : 'Şifre değiştirilirken bir hata oluştu.');
        toast.error(errorMessage);
      } else {
        toast.error('Şifre değiştirilirken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 30, rotateX: 5 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotateX: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut" 
      } 
    }
  };
  
  return (
    <PageContainer>
      <Background />
      <Shape />
      <Shape />
      <Shape />
      <Shape />
      
      <FormContainer
        initial="hidden"
        animate="visible"
        variants={formVariants}
        whileHover={{ 
          transform: "scale(1.01)",
          transition: { duration: 0.3 }
        }}
      >
        <FormTitle>Profil Yönetimi</FormTitle>
        
        <TabContainer>
          <TabButton 
            $active={activeTab === 'profile'} 
            onClick={() => setActiveTab('profile')}
          >
            <FaUser /> Profil Bilgileri
          </TabButton>
          <TabButton 
            $active={activeTab === 'password'} 
            onClick={() => setActiveTab('password')}
          >
            <FaKey /> Şifre Değiştir
          </TabButton>
        </TabContainer>
        
        {activeTab === 'profile' && (
          <motion.form 
            onSubmit={handleProfileSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FormColumns>
              <FormGroup>
                <Label htmlFor="firstName">Ad</Label>
                <InputWrapper>
                  <Input
                    id="firstName"
                    name="firstName"
                    type="text"
                    placeholder="Adınızı girin"
                    value={profileData.firstName}
                    onChange={handleProfileChange}
                    $hasError={!!profileErrors.firstName}
                  />
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                </InputWrapper>
                {profileErrors.firstName && (
                  <ErrorMessage>
                    <FaExclamationCircle /> {profileErrors.firstName}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="lastName">Soyad</Label>
                <InputWrapper>
                  <Input
                    id="lastName"
                    name="lastName"
                    type="text"
                    placeholder="Soyadınızı girin"
                    value={profileData.lastName}
                    onChange={handleProfileChange}
                    $hasError={!!profileErrors.lastName}
                  />
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                </InputWrapper>
                {profileErrors.lastName && (
                  <ErrorMessage>
                    <FaExclamationCircle /> {profileErrors.lastName}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormColumns>
            
            <FormGroup>
              <Label htmlFor="email">E-posta</Label>
              <InputWrapper>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="E-posta adresinizi girin"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  $hasError={!!profileErrors.email}
                />
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
              </InputWrapper>
              {profileErrors.email && (
                <ErrorMessage>
                  <FaExclamationCircle /> {profileErrors.email}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormColumns>
              <FormGroup>
                <Label htmlFor="phoneNumber">Telefon Numarası</Label>
                <InputWrapper>
                  <Input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    placeholder="Telefon numaranızı girin"
                    value={profileData.phoneNumber}
                    onChange={handleProfileChange}
                    $hasError={!!profileErrors.phoneNumber}
                  />
                  <InputIcon>
                    <FaPhone />
                  </InputIcon>
                </InputWrapper>
                {profileErrors.phoneNumber && (
                  <ErrorMessage>
                    <FaExclamationCircle /> {profileErrors.phoneNumber}
                  </ErrorMessage>
                )}
              </FormGroup>
              
              <FormGroup>
                <Label htmlFor="address">Adres</Label>
                <InputWrapper>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    placeholder="Adresinizi girin"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    $hasError={!!profileErrors.address}
                  />
                  <InputIcon>
                    <FaMapMarkerAlt />
                  </InputIcon>
                </InputWrapper>
                {profileErrors.address && (
                  <ErrorMessage>
                    <FaExclamationCircle /> {profileErrors.address}
                  </ErrorMessage>
                )}
              </FormGroup>
            </FormColumns>
            
            {isSuccess && (
              <SuccessMessage>
                <FaCheckCircle /> Profil bilgileriniz başarıyla güncellendi.
              </SuccessMessage>
            )}
            
            <ActionButton
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<FaUserEdit />}
            >
              {isLoading ? 'Güncelleniyor...' : 'Profili Güncelle'}
            </ActionButton>
          </motion.form>
        )}
        
        {activeTab === 'password' && (
          <motion.form 
            onSubmit={handlePasswordSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <FormGroup>
              <Label htmlFor="currentPassword">Mevcut Şifre</Label>
              <InputWrapper>
                <Input
                  id="currentPassword"
                  name="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  placeholder="Mevcut şifrenizi girin"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  $hasError={!!passwordErrors.currentPassword}
                />
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <PasswordIcon onClick={() => setShowCurrentPassword(!showCurrentPassword)}>
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordIcon>
              </InputWrapper>
              {passwordErrors.currentPassword && (
                <ErrorMessage>
                  <FaExclamationCircle /> {passwordErrors.currentPassword}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="newPassword">Yeni Şifre</Label>
              <InputWrapper>
                <Input
                  id="newPassword"
                  name="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Yeni şifrenizi girin"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  $hasError={!!passwordErrors.newPassword}
                />
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <PasswordIcon onClick={() => setShowNewPassword(!showNewPassword)}>
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordIcon>
              </InputWrapper>
              {passwordErrors.newPassword && (
                <ErrorMessage>
                  <FaExclamationCircle /> {passwordErrors.newPassword}
                </ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="confirmPassword">Şifre Onayı</Label>
              <InputWrapper>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Yeni şifrenizi tekrar girin"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  $hasError={!!passwordErrors.confirmPassword}
                />
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <PasswordIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </PasswordIcon>
              </InputWrapper>
              {passwordErrors.confirmPassword && (
                <ErrorMessage>
                  <FaExclamationCircle /> {passwordErrors.confirmPassword}
                </ErrorMessage>
              )}
            </FormGroup>
            
            {isSuccess && (
              <SuccessMessage>
                <FaCheckCircle /> Şifreniz başarıyla değiştirildi.
              </SuccessMessage>
            )}
            
            <ActionButton
              type="submit"
              variant="primary"
              size="large"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={<FaKey />}
            >
              {isLoading ? 'Değiştiriliyor...' : 'Şifreyi Değiştir'}
            </ActionButton>
          </motion.form>
        )}
      </FormContainer>
    </PageContainer>
  );
};

export default ProfilePage; 