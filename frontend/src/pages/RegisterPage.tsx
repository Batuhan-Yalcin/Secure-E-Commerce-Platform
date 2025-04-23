import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { toast } from 'react-toastify';
import axios from 'axios';

// API URL
const API_URL = 'http://localhost:8080/api';

// Animasyon Tanımları
const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const borderAnimation = keyframes`
  0% { background-position: 0% 0% }
  100% { background-position: 300% 0% }
`;

const floatingAnimation = keyframes`
  0% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
  100% { transform: translateY(0px) rotate(0deg); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.4); }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

// Stil Bileşenleri
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem;
  overflow: hidden;
  background: linear-gradient(45deg, #0EA5E9, #38BDF8, #60A5FA, #3B82F6);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
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
      radial-gradient(circle at 20% 30%, rgba(255, 255, 255, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 50%);
    z-index: -1;
    animation: ${pulseAnimation} 10s infinite alternate;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'/%3E%3C/svg%3E");
    opacity: 0.3;
    z-index: -2;
  }
`;

const particleAnimation = keyframes`
  0%, 100% {
    transform: translateY(0) rotate(0deg);
    opacity: 0.8;
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
    opacity: 0.4;
  }
`;

const Particle = styled.div`
  position: absolute;
  width: 10px;
  height: 10px;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  z-index: -1;
  animation: ${particleAnimation} 5s infinite;
  
  &:nth-child(1) {
    top: 10%;
    left: 10%;
    width: 15px;
    height: 15px;
    animation-delay: 0s;
    animation-duration: 6s;
  }
  
  &:nth-child(2) {
    top: 20%;
    left: 80%;
    width: 20px;
    height: 20px;
    animation-delay: 1s;
    animation-duration: 7s;
  }
  
  &:nth-child(3) {
    top: 70%;
    left: 20%;
    width: 12px;
    height: 12px;
    animation-delay: 2s;
    animation-duration: 5s;
  }
  
  &:nth-child(4) {
    top: 50%;
    left: 85%;
    width: 18px;
    height: 18px;
    animation-delay: 3s;
    animation-duration: 8s;
  }
  
  &:nth-child(5) {
    top: 80%;
    left: 70%;
    width: 14px;
    height: 14px;
    animation-delay: 4s;
    animation-duration: 6.5s;
  }
`;

const slideInFromBottom = keyframes`
  from {
    transform: translateY(50px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 550px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  z-index: 1;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  transform-style: preserve-3d;
  perspective: 1000px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border-radius: 20px;
    padding: 2px;
    background: linear-gradient(90deg, #0EA5E9, #3B82F6, #8B5CF6, #0EA5E9);
    background-size: 300% 100%;
    animation: ${borderAnimation} 5s linear infinite;
    -webkit-mask: 
      linear-gradient(#fff 0 0) content-box, 
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    z-index: -1;
  }
  
  @media (max-width: 576px) {
    padding: 2rem 1.5rem;
    max-width: 90%;
  }
`;

const rotate3d = keyframes`
  0% {
    transform: rotateX(0deg) rotateY(0deg);
  }
  50% {
    transform: rotateX(5deg) rotateY(5deg);
  }
  100% {
    transform: rotateX(0deg) rotateY(0deg);
  }
`;

const FormTitle = styled.h1`
  text-align: center;
  color: #1E293B;
  font-size: 2.5rem;
  margin-bottom: 2rem;
  font-weight: 700;
  background: linear-gradient(to right, #0EA5E9, #3B82F6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: ${slideInFromBottom} 0.6s ease;
  
  @media (max-width: 576px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
  animation: ${slideInFromBottom} 0.6s ease;
  animation-fill-mode: both;
  
  &:nth-child(1) { animation-delay: 0.1s; }
  &:nth-child(2) { animation-delay: 0.2s; }
  &:nth-child(3) { animation-delay: 0.3s; }
  &:nth-child(4) { animation-delay: 0.4s; }
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

const Input = styled.input<{ hasError?: boolean; isValid?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${props => {
    if (props.hasError) return '#EF4444';
    if (props.isValid) return '#10B981';
    return '#E5E7EB';
  }};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  color: #1E293B;
  background-color: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: ${props => {
      if (props.hasError) return '#EF4444';
      if (props.isValid) return '#10B981';
      return '#3B82F6';
    }};
    box-shadow: ${props => {
      if (props.hasError) return '0 0 0 3px rgba(239, 68, 68, 0.2)';
      if (props.isValid) return '0 0 0 3px rgba(16, 185, 129, 0.2)';
      return '0 0 0 3px rgba(59, 130, 246, 0.2)';
    }};
  }
  
  &::placeholder {
    color: #9CA3AF;
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #4B5563;
  font-size: 1rem;
`;

const ValidationIcon = styled.div<{ isValid?: boolean }>`
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${props => props.isValid ? '#10B981' : '#EF4444'};
  font-size: 1rem;
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
    color: #3B82F6;
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

const PasswordStrength = styled.div`
  margin-top: 0.5rem;
`;

const StrengthBar = styled.div<{ strength: number }>`
  height: 4px;
  border-radius: 2px;
  background: ${props => {
    if (props.strength === 0) return '#E5E7EB';
    if (props.strength === 1) return '#EF4444';
    if (props.strength === 2) return '#F59E0B';
    if (props.strength === 3) return '#10B981';
    return '#10B981';
  }};
  transition: all 0.3s;
  width: ${props => props.strength * 33.33}%;
`;

const StrengthText = styled.div<{ strength: number }>`
  font-size: 0.75rem;
  margin-top: 0.25rem;
  color: ${props => {
    if (props.strength === 0) return '#6B7280';
    if (props.strength === 1) return '#EF4444';
    if (props.strength === 2) return '#F59E0B';
    if (props.strength === 3) return '#10B981';
    return '#10B981';
  }};
`;

const SubmitButton = styled(Button)`
  width: 100%;
  padding: 0.9rem;
  margin-top: 1rem;
  animation: ${pulseAnimation} 2s infinite;
  
  &:hover {
    animation: none;
  }
`;

const LinkText = styled.p`
  text-align: center;
  margin-top: 1.5rem;
  color: #4B5563;
  font-size: 0.95rem;
  
  a {
    color: #3B82F6;
    font-weight: 600;
    text-decoration: none;
    transition: all 0.2s;
    
    &:hover {
      color: #2563EB;
      text-decoration: underline;
    }
  }
`;

// Form tipleri
interface FormValues {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface FormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

interface FormValid {
  username?: boolean;
  email?: boolean;
  password?: boolean;
  confirmPassword?: boolean;
}

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [formValid, setFormValid] = useState<FormValid>({});
  const [passwordStrength, setPasswordStrength] = useState<number>(0);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Anlık doğrulama 
    const validationResult = validateField(name, value);
    
    // Hata mesajını güncelle
    setFormErrors(prev => ({
      ...prev,
      [name]: validationResult.error
    }));
    
    // Geçerlilik durumunu güncelle
    setFormValid(prev => ({
      ...prev,
      [name]: validationResult.isValid
    }));
    
    // Şifre gücünü kontrol et
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
    
    // Şifre onayını kontrol et
    if (name === 'confirmPassword' || (name === 'password' && formValues.confirmPassword)) {
      const passwordToCheck = name === 'password' ? value : formValues.password;
      const confirmToCheck = name === 'confirmPassword' ? value : formValues.confirmPassword;
      
      const confirmValidation = validateConfirmPassword(passwordToCheck, confirmToCheck);
      setFormErrors(prev => ({
        ...prev,
        confirmPassword: confirmValidation.error
      }));
      
      setFormValid(prev => ({
        ...prev,
        confirmPassword: confirmValidation.isValid
      }));
    }
  };
  
  const checkPasswordStrength = (password: string): number => {
    if (!password) return 0;
    
    // En basit kontrol
    if (password.length < 6) return 1;
    
    // Karmaşıklık kontrolü
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    
    const complexity = [hasUpperCase, hasLowerCase, hasNumber, hasSpecial].filter(Boolean).length;
    
    if (password.length >= 8 && complexity >= 3) return 3;
    if (password.length >= 6 && complexity >= 2) return 2;
    return 1;
  };
  
  const getPasswordStrengthText = (): string => {
    switch (passwordStrength) {
      case 0: return 'Şifre Gücü';
      case 1: return 'Zayıf';
      case 2: return 'Orta';
      case 3: return 'Güçlü';
      default: return 'Şifre Gücü';
    }
  };
  
  const validateField = (name: string, value: string): { error: string; isValid: boolean } => {
    let error = '';
    let isValid = false;
    
    switch (name) {
      case 'username':
        if (!value.trim()) {
          error = 'Kullanıcı adı gereklidir';
        } else if (value.length < 3) {
          error = 'Kullanıcı adı en az 3 karakter olmalıdır';
        } else if (value.length > 20) {
          error = 'Kullanıcı adı en fazla 20 karakter olmalıdır';
        } else {
          isValid = true;
        }
        break;
      
      case 'email':
        if (!value.trim()) {
          error = 'E-posta adresi gereklidir';
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
          error = 'Geçerli bir e-posta adresi giriniz';
        } else {
          isValid = true;
        }
        break;
      
      case 'password':
        if (!value) {
          error = 'Şifre gereklidir';
        } else if (value.length < 6) {
          error = 'Şifre en az 6 karakter olmalıdır';
        } else {
          isValid = true;
        }
        break;
      
      default:
        break;
    }
    
    return { error, isValid };
  };
  
  const validateConfirmPassword = (password: string, confirmPassword: string): { error: string; isValid: boolean } => {
    let error = '';
    let isValid = false;
    
    if (!confirmPassword) {
      error = 'Şifre onayı gereklidir';
    } else if (confirmPassword !== password) {
      error = 'Şifreler eşleşmiyor';
    } else {
      isValid = true;
    }
    
    return { error, isValid };
  };
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    const validFields: FormValid = {};
    
    // Kullanıcı adı doğrulama
    const usernameValidation = validateField('username', formValues.username);
    errors.username = usernameValidation.error;
    validFields.username = usernameValidation.isValid;
    
    // E-posta doğrulama
    const emailValidation = validateField('email', formValues.email);
    errors.email = emailValidation.error;
    validFields.email = emailValidation.isValid;
    
    // Şifre doğrulama
    const passwordValidation = validateField('password', formValues.password);
    errors.password = passwordValidation.error;
    validFields.password = passwordValidation.isValid;
    
    // Şifre onayı doğrulama
    const confirmValidation = validateConfirmPassword(formValues.password, formValues.confirmPassword);
    errors.confirmPassword = confirmValidation.error;
    validFields.confirmPassword = confirmValidation.isValid;
    
    setFormErrors(errors);
    setFormValid(validFields);
    
    // Tüm alanlar geçerli ise true döndür
    return Object.values(errors).every(error => !error);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Backend API'ye kayıt isteği gönder
      await axios.post(`${API_URL}/auth/register`, {
        username: formValues.username,
        email: formValues.email,
        password: formValues.password
      });
      
      // Başarılı mesajı göster
      toast.success('Kayıt başarılı! Giriş sayfasına yönlendiriliyorsunuz...');
      
      // Kısa bir gecikme ile login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      
      // Sunucudan gelen hata mesajını göster
      if (error.response && error.response.data) {
        toast.error(error.response.data.message || 'Kayıt başarısız. Lütfen bilgilerinizi kontrol edin.');
      } else {
        toast.error('Kayıt işlemi sırasında bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };
  
  return (
    <PageContainer>
      <Background />
      <Particle />
      <Particle />
      <Particle />
      <Particle />
      <Particle />
      
      <FormContainer
        initial="hidden"
        animate="visible"
        variants={formVariants}
        whileHover={{ 
          transform: "scale(1.02)",
          transition: { duration: 0.3 }
        }}
      >
        <FormTitle>Hesap Oluştur</FormTitle>
        
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <InputWrapper>
              <Input
                id="username"
                name="username"
                type="text"
                placeholder="Kullanıcı adınızı girin"
                value={formValues.username}
                onChange={handleChange}
                hasError={!!formErrors.username}
                isValid={formValid.username}
                autoFocus
              />
              <InputIcon>
                <FaUser />
              </InputIcon>
              {formValid.username && (
                <ValidationIcon isValid>
                  <FaCheckCircle />
                </ValidationIcon>
              )}
            </InputWrapper>
            {formErrors.username ? (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.username}
              </ErrorMessage>
            ) : formValid.username && (
              <SuccessMessage>
                <FaCheckCircle /> Kullanıcı adı uygun
              </SuccessMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="email">E-posta Adresi</Label>
            <InputWrapper>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="E-posta adresinizi girin"
                value={formValues.email}
                onChange={handleChange}
                hasError={!!formErrors.email}
                isValid={formValid.email}
              />
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
              {formValid.email && (
                <ValidationIcon isValid>
                  <FaCheckCircle />
                </ValidationIcon>
              )}
            </InputWrapper>
            {formErrors.email ? (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.email}
              </ErrorMessage>
            ) : formValid.email && (
              <SuccessMessage>
                <FaCheckCircle /> E-posta adresi uygun
              </SuccessMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="password">Şifre</Label>
            <InputWrapper>
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Şifrenizi girin"
                value={formValues.password}
                onChange={handleChange}
                hasError={!!formErrors.password}
                isValid={passwordStrength >= 2}
              />
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordIcon>
            </InputWrapper>
            {formErrors.password ? (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.password}
              </ErrorMessage>
            ) : formValues.password && (
              <PasswordStrength>
                <StrengthBar strength={passwordStrength} />
                <StrengthText strength={passwordStrength}>
                  {getPasswordStrengthText()}
                </StrengthText>
              </PasswordStrength>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="confirmPassword">Şifre Tekrarı</Label>
            <InputWrapper>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Şifrenizi tekrar girin"
                value={formValues.confirmPassword}
                onChange={handleChange}
                hasError={!!formErrors.confirmPassword}
                isValid={formValid.confirmPassword}
              />
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordIcon>
            </InputWrapper>
            {formErrors.confirmPassword ? (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.confirmPassword}
              </ErrorMessage>
            ) : formValid.confirmPassword && (
              <SuccessMessage>
                <FaCheckCircle /> Şifreler eşleşti
              </SuccessMessage>
            )}
          </FormGroup>
          
          <SubmitButton
            type="submit"
            variant="primary"
            size="large"
            isLoading={isSubmitting}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Kaydediliyor...' : 'Kayıt Ol'}
          </SubmitButton>
        </form>
        
        <LinkText>
          Zaten bir hesabınız var mı? <Link to="/login">Giriş Yap</Link>
        </LinkText>
      </FormContainer>
    </PageContainer>
  );
};

export default RegisterPage; 