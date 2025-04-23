import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaExclamationCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from '../components/common/Button';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';

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
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  padding: 2rem;
  overflow: hidden;
`;

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, #0EA5E9, #38BDF8, #60A5FA, #3B82F6);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  z-index: -2;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: 
      radial-gradient(circle at 20% 30%, rgba(56, 189, 248, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 80% 70%, rgba(59, 130, 246, 0.3) 0%, transparent 20%),
      radial-gradient(circle at 50% 50%, rgba(2, 132, 199, 0.2) 0%, transparent 50%);
    z-index: -1;
  }
`;

const Shape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(5px);
  border-radius: 50%;
  z-index: -1;
  animation: ${floatingAnimation} 8s ease-in-out infinite;
  
  &:nth-child(1) {
    width: 150px;
    height: 150px;
    top: 20%;
    left: 10%;
    animation-duration: 12s;
  }
  
  &:nth-child(2) {
    width: 200px;
    height: 200px;
    bottom: 15%;
    right: 10%;
    animation-duration: 15s;
    animation-delay: 1s;
  }
  
  &:nth-child(3) {
    width: 120px;
    height: 120px;
    bottom: 30%;
    left: 20%;
    animation-duration: 10s;
    animation-delay: 2s;
  }
`;

const FormContainer = styled(motion.div)`
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 3rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  z-index: 1;
  position: relative;
  animation: ${fadeIn} 0.8s ease-out;
  
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
  
  @media (max-width: 576px) {
    font-size: 2rem;
    margin-bottom: 1.5rem;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
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

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 2px solid ${props => props.hasError ? '#EF4444' : '#E5E7EB'};
  border-radius: 10px;
  font-size: 1rem;
  transition: all 0.3s;
  color: #1E293B;
  background-color: rgba(255, 255, 255, 0.8);
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#EF4444' : '#3B82F6'};
    box-shadow: ${props => props.hasError ? '0 0 0 3px rgba(239, 68, 68, 0.2)' : '0 0 0 3px rgba(59, 130, 246, 0.2)'};
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

const Register: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [formValues, setFormValues] = useState<FormValues>({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [formErrors, setFormErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
    
    // Anlık doğrulama yapmak için
    if (formErrors[name as keyof FormErrors]) {
      validateField(name, value);
    }
  };
  
  const validateField = (name: string, value: string): string => {
    switch (name) {
      case 'username':
        if (!value.trim()) return 'Kullanıcı adı gereklidir';
        if (value.length < 3) return 'Kullanıcı adı en az 3 karakter olmalıdır';
        if (value.length > 20) return 'Kullanıcı adı en fazla 20 karakter olmalıdır';
        return '';
      
      case 'email':
        if (!value.trim()) return 'E-posta adresi gereklidir';
        if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) return 'Geçerli bir e-posta adresi giriniz';
        return '';
      
      case 'password':
        if (!value) return 'Şifre gereklidir';
        if (value.length < 6) return 'Şifre en az 6 karakter olmalıdır';
        return '';
      
      case 'confirmPassword':
        if (!value) return 'Şifre onayı gereklidir';
        if (value !== formValues.password) return 'Şifreler eşleşmiyor';
        return '';
      
      default:
        return '';
    }
  };
  
  const validateForm = (): boolean => {
    const errors: FormErrors = {};
    
    Object.keys(formValues).forEach(key => {
      const fieldName = key as keyof FormValues;
      const error = validateField(fieldName, formValues[fieldName]);
      if (error) {
        errors[fieldName] = error;
      }
    });
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const { username, email, password } = formValues;
      await register(username, email, password);
      
      toast.success('Kayıt başarılı! Yönlendiriliyorsunuz...');
      
      // Kısa bir gecikme ile login sayfasına yönlendir
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error: any) {
      console.error('Kayıt hatası:', error);
      
      // Sunucudan gelen hata mesajını göster
      if (error.response && error.response.data) {
        toast.error(error.response.data);
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
      <Shape />
      <Shape />
      <Shape />
      
      <FormContainer
        initial="hidden"
        animate="visible"
        variants={formVariants}
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
                autoFocus
              />
              <InputIcon>
                <FaUser />
              </InputIcon>
            </InputWrapper>
            {formErrors.username && (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.username}
              </ErrorMessage>
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
              />
              <InputIcon>
                <FaEnvelope />
              </InputIcon>
            </InputWrapper>
            {formErrors.email && (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.email}
              </ErrorMessage>
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
              />
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordIcon onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordIcon>
            </InputWrapper>
            {formErrors.password && (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.password}
              </ErrorMessage>
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
              />
              <InputIcon>
                <FaLock />
              </InputIcon>
              <PasswordIcon onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </PasswordIcon>
            </InputWrapper>
            {formErrors.confirmPassword && (
              <ErrorMessage>
                <FaExclamationCircle /> {formErrors.confirmPassword}
              </ErrorMessage>
            )}
          </FormGroup>
          
          <SubmitButton
            type="submit"
            variant="primary"
            size="large"
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

export default Register; 