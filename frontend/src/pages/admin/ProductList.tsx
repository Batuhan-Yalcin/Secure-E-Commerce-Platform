import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { FaBoxOpen, FaSearch, FaPlus, FaEdit, FaTrash, FaExclamationCircle, FaSpinner, FaTimes, FaCube, FaSort, FaFilter, FaShoppingBag } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import { ProductResponse } from '../../types';

// Zengin renk paleti - 3D efektleri için
const colors = {
  primary: {
    light: '#60a5fa',
    main: '#3b82f6',
    dark: '#2563eb',
    gradient: 'linear-gradient(135deg, #60a5fa, #2563eb)',
    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
    glow: 'rgba(59, 130, 246, 0.5)'
  },
  success: {
    light: '#4ade80',
    main: '#22c55e',
    dark: '#16a34a',
    gradient: 'linear-gradient(135deg, #4ade80, #16a34a)',
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    glow: 'rgba(34, 197, 94, 0.5)'
  },
  danger: {
    light: '#f87171',
    main: '#ef4444',
    dark: '#dc2626',
    gradient: 'linear-gradient(135deg, #f87171, #dc2626)',
    background: 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)',
    glow: 'rgba(239, 68, 68, 0.5)'
  },
  warning: {
    light: '#fbbf24',
    main: '#f59e0b',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #fbbf24, #d97706)',
    background: 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
    glow: 'rgba(245, 158, 11, 0.5)'
  },
  neutral: {
    light: '#e2e8f0',
    main: '#cbd5e1',
    dark: '#94a3b8',
    darker: '#334155',
    deep: '#1e293b',
    gradient: 'linear-gradient(135deg, #f8fafc, #cbd5e1)',
    background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
    glow: 'rgba(148, 163, 184, 0.3)'
  },
  purple: {
    light: '#c4b5fd',
    main: '#8b5cf6',
    dark: '#7c3aed',
    gradient: 'linear-gradient(135deg, #c4b5fd, #7c3aed)',
    background: 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
    glow: 'rgba(139, 92, 246, 0.5)'
  },
  teal: {
    light: '#5eead4',
    main: '#14b8a6',
    dark: '#0d9488',
    gradient: 'linear-gradient(135deg, #5eead4, #0d9488)',
    background: 'linear-gradient(135deg, #f0fdfa 0%, #ccfbf1 100%)',
    glow: 'rgba(20, 184, 166, 0.5)'
  },
  pink: {
    light: '#f9a8d4',
    main: '#ec4899',
    dark: '#db2777',
    gradient: 'linear-gradient(135deg, #f9a8d4, #db2777)',
    background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
    glow: 'rgba(236, 72, 153, 0.5)'
  }
};

// Sayfanın farklı bölümleri için tema renkleri
const themes = [
  {
    main: colors.primary,
    accent: colors.purple
  },
  {
    main: colors.teal,
    accent: colors.primary
  },
  {
    main: colors.purple,
    accent: colors.pink
  },
  {
    main: colors.pink,
    accent: colors.purple
  }
];

// Rastgele bir tema seçimi (sonradan gerçek tema sistemi ile değiştirilebilir)
const theme = themes[Math.floor(Math.random() * themes.length)];

// 3D görünüm için zengin animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 ${colors.primary.glow}; }
  70% { box-shadow: 0 0 0 10px rgba(59, 130, 246, 0); }
  100% { box-shadow: 0 0 0 0 rgba(59, 130, 246, 0); }
`;

const floatAnimation = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-8px); }
  100% { transform: translateY(0px); }
`;

const rotateAnimation = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const shimmerAnimation = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const breatheAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

const shake = keyframes`
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px) rotate(-1deg); }
  50% { transform: translateX(5px) rotate(1deg); }
  75% { transform: translateX(-5px) rotate(-1deg); }
  100% { transform: translateX(0); }
`;

// 3D efektleri için stil yardımcıları
const neuomorphicStyle = css`
  background: ${colors.neutral.background};
  box-shadow: 
    8px 8px 16px rgba(0, 0, 0, 0.05),
    -8px -8px 16px rgba(255, 255, 255, 0.8);
  border-radius: 16px;
`;

const glassmorphismStyle = css`
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.05);
`;

const shimmerEffect = css`
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.6) 50%,
    rgba(255, 255, 255, 0) 100%
  );
  background-size: 200% 100%;
  animation: ${shimmerAnimation} 1.5s infinite;
`;

// Gelişmiş animasyonlar için yeni tanımlar
const bounceAnimation = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px ${colors.primary.glow}; }
  50% { box-shadow: 0 0 20px ${colors.primary.glow}, 0 0 30px ${colors.primary.glow}; }
  100% { box-shadow: 0 0 10px ${colors.primary.glow}; }
`;

const rippleAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 ${colors.primary.glow}; }
  100% { box-shadow: 0 0 0 20px rgba(0, 0, 0, 0); }
`;

const modalEnterAnimation = keyframes`
  from { opacity: 0; transform: scale(0.8) translateY(30px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
`;

// Stil bileşenleri
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  position: relative;
  animation: ${fadeIn} 0.6s ease-out;
  perspective: 1000px;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(circle at top right, 
      ${theme.main.glow}, 
      transparent 70%
    );
    pointer-events: none;
    z-index: -1;
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100px;
    height: 3px;
    background: ${theme.main.gradient};
    border-radius: 3px;
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 800;
  background: linear-gradient(90deg, ${theme.main.main}, ${theme.accent.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
  
  svg {
    font-size: 1.75rem;
    color: ${theme.main.main};
    animation: ${floatAnimation} 4s infinite ease-in-out;
    filter: drop-shadow(0 4px 6px ${theme.main.glow});
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 0;
    width: 40px;
    height: 3px;
    background: ${theme.main.gradient};
    border-radius: 3px;
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1.25rem;
  align-items: center;
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
  transform-style: preserve-3d;
  perspective: 500px;
`;

const SearchInput = styled.input`
  padding: 0.85rem 1rem 0.85rem 3rem;
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.7);
  width: 100%;
  font-size: 0.95rem;
  transition: all 0.3s ease;
  background-color: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transform: translateZ(0);
  
  &:focus {
    outline: none;
    border-color: ${theme.main.main};
    box-shadow: 0 0 0 3px ${theme.main.glow}, 0 8px 16px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px) translateZ(5px);
  }
  
  &::placeholder {
    color: ${colors.neutral.dark};
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.main.main};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: 10;
  transition: all 0.3s ease;
  
  ${SearchInput}:focus + & {
    color: ${theme.main.dark};
    transform: translateY(-50%) scale(1.1);
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1.25rem;
  background: ${theme.main.gradient};
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px ${theme.main.glow};
  transform-style: preserve-3d;
  transform: translateZ(0);
  
  &:hover {
    transform: translateY(-3px) translateZ(5px);
    box-shadow: 0 6px 15px ${theme.main.glow};
    
    &::before {
      transform: translateX(100%);
    }
  }
  
  &:active {
    transform: translateY(-1px) translateZ(2px);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: transform 0.6s ease;
  }
  
  svg {
    font-size: 1.1rem;
    animation: ${pulseAnimation} 2s infinite;
  }
`;

const ProductsContainer = styled.div`
  ${glassmorphismStyle}
  padding: 0.5rem;
  border-radius: 16px;
  overflow: hidden;
  transform-style: preserve-3d;
  animation: ${fadeIn} 0.6s ease-out;
  animation-delay: 0.1s;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      circle at top right,
      ${theme.main.glow}20, 
      transparent 70%
    );
    pointer-events: none;
    z-index: 0;
  }
`;

// Temel tablo bileşenlerini muhafaza edelim
const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  background: ${colors.neutral.background};
`;

const TableRow = styled.tr`
  &:not(:last-child) {
    border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  }
  
  &:hover {
    background-color: rgba(248, 250, 252, 0.7);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
  }
`;

const TableHeader = styled.th`
  padding: 1rem 1.25rem;
  text-align: left;
  font-weight: 600;
  color: ${colors.neutral.darker};
  font-size: 0.875rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 50%;
    width: 0;
    height: 2px;
    background: ${colors.primary.gradient};
    transition: all 0.3s ease;
    transform: translateX(-50%);
  }
  
  &:hover::after {
    width: 50%;
  }
`;

const TableCell = styled.td`
  padding: 1rem 1.25rem;
  color: ${colors.neutral.deep};
  font-size: 0.875rem;
  transition: all 0.3s ease;
`;

const ProductImage = styled.img`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
`;

const StockBadge = styled.span<{ $inStock: boolean }>`
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${props => props.$inStock ? colors.success.background : colors.danger.background};
  color: ${props => props.$inStock ? colors.success.dark : colors.danger.dark};
  border: 1px solid ${props => props.$inStock ? colors.success.light : colors.danger.light}50;
  box-shadow: 0 2px 5px ${props => props.$inStock ? colors.success.glow : colors.danger.glow}30;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px ${props => props.$inStock ? colors.success.glow : colors.danger.glow}50;
  }
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  border: none;
  transition: all 0.3s ease;
  background: white;
  
  &.edit {
    color: ${colors.primary.main};
    border: 1px solid ${colors.primary.light}30;
    
    &:hover {
      background: ${colors.primary.gradient};
      color: white;
      box-shadow: 0 4px 10px ${colors.primary.glow};
      transform: translateY(-3px);
    }
  }
  
  &.delete {
    color: ${colors.danger.main};
    border: 1px solid ${colors.danger.light}30;
    
    &:hover {
      background: ${colors.danger.gradient};
      color: white;
      box-shadow: 0 4px 10px ${colors.danger.glow};
      transform: translateY(-3px);
    }
  }
  
  svg {
    font-size: 1rem;
    transition: all 0.3s ease;
  }
  
  &:hover svg {
    transform: scale(1.2);
  }
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
`;

// Modal bileşenleri
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  animation: ${fadeIn} 0.4s ease-out;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(
      circle at center,
      ${theme.accent.glow}10, 
      transparent 70%
    );
    pointer-events: none;
    z-index: -1;
  }
`;

const ModalContent = styled.div`
  ${glassmorphismStyle}
  max-width: 500px;
  width: 100%;
  padding: 2rem;
  animation: ${modalEnterAnimation} 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  transform: translateY(0);
  transition: all 0.3s ease;
  border-radius: 20px;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 0, 0, 0.1);
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, 
      ${colors.primary.light}80, 
      transparent
    );
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${colors.neutral.deep};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: ${colors.danger.main};
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: ${colors.neutral.dark};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    color: ${colors.neutral.deep};
    transform: rotate(90deg);
  }
`;

const ModalBody = styled.div`
  margin-bottom: 1.5rem;
`;

const ConfirmMessage = styled.p`
  color: ${colors.neutral.darker};
  margin: 0;
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(255, 255, 255, 0.2) 50%,
      transparent 100%
    );
    transition: transform 0.6s ease;
  }
  
  &:hover::before {
    transform: translateX(100%);
  }
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.main.gradient};
          border: none;
          color: white;
          box-shadow: 0 4px 10px ${theme.main.glow};
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px ${theme.main.glow};
          }
          
          &:active {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px ${theme.main.glow};
          }
        `;
      case 'danger':
        return `
          background: ${colors.danger.gradient};
          border: none;
          color: white;
          box-shadow: 0 4px 10px ${colors.danger.glow};
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px ${colors.danger.glow};
            animation: ${shake} 0.5s ease-in-out;
          }
          
          &:active {
            transform: translateY(-1px);
            box-shadow: 0 4px 10px ${colors.danger.glow};
          }
        `;
      default:
        return `
          background: white;
          border: 1px solid ${colors.neutral.light};
          color: ${colors.neutral.darker};
          
          &:hover {
            border-color: ${theme.main.light};
            color: ${theme.main.dark};
            transform: translateY(-3px);
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
          }
          
          &:active {
            transform: translateY(-1px);
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
          }
        `;
    }
  }}
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 3rem;
  font-size: 1.25rem;
  color: ${colors.neutral.dark};
  height: 300px;
  
  svg {
    color: ${colors.primary.main};
    font-size: 3rem;
    margin-bottom: 1.5rem;
    animation: ${floatAnimation} 3s infinite ease-in-out;
  }
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background: ${colors.danger.background};
  border-radius: 12px;
  color: ${colors.danger.dark};
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border: 1px solid ${colors.danger.light}30;
  box-shadow: 0 4px 10px ${colors.danger.glow}30;
  animation: ${fadeIn} 0.3s ease-out;
  
  svg {
    color: ${colors.danger.main};
    font-size: 1.25rem;
  }
`;

const NoDataContainer = styled.div`
  padding: 3rem;
  text-align: center;
  color: ${colors.neutral.dark};
  font-size: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  
  svg {
    font-size: 2.5rem;
    color: ${colors.neutral.main};
    opacity: 0.5;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1rem 1.5rem;
  border-top: 1px solid rgba(226, 232, 240, 0.7);
  gap: 0.75rem;
  background: linear-gradient(to bottom, transparent, ${colors.primary.background}40);
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.875rem;
  border-radius: 10px;
  border: 1px solid ${props => props.$active ? colors.primary.main : colors.neutral.light};
  background-color: ${props => props.$active ? colors.primary.main : 'white'};
  color: ${props => props.$active ? 'white' : colors.neutral.deep};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? `0 4px 12px ${colors.primary.glow}` : '0 2px 4px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${colors.primary.main};
    color: ${props => props.$active ? 'white' : colors.primary.main};
    box-shadow: 0 6px 15px ${colors.primary.glow}80;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: ${colors.neutral.light};
    color: ${colors.neutral.dark};
    box-shadow: none;
    transform: none;
    
    &:hover {
      border-color: ${colors.neutral.light};
      color: ${colors.neutral.dark};
      box-shadow: none;
    }
  }
`;

// Ürün kartı için grid görünümü
const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1.5rem;
`;

const ProductCard = styled.div`
  ${neuomorphicStyle}
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  perspective: 1000px;
  transform: translateZ(0);
  position: relative;
  overflow: hidden;
  
  &:hover {
    transform: translateY(-5px) rotateX(2deg) rotateY(2deg);
    box-shadow: 0 20px 30px rgba(0, 0, 0, 0.07),
                0 10px 15px rgba(0, 0, 0, 0.03);
                
    &::after {
      opacity: 1;
    }
    
    .card-actions {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: ${theme.main.gradient};
    opacity: 0;
    transition: opacity 0.3s ease;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 1rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to bottom,
      transparent 50%,
      rgba(0, 0, 0, 0.2) 100%
    );
    z-index: 1;
    pointer-events: none;
  }
`;

const EnhancedProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.5s ease;
  transform-origin: center;
  
  ${ProductCard}:hover & {
    transform: scale(1.08);
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  z-index: 1;
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${colors.neutral.deep};
  margin: 0;
  line-height: 1.3;
`;

const ProductPrice = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: ${theme.main.dark};
  background: linear-gradient(90deg, ${theme.main.dark}, ${theme.main.main});
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const ProductMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const StockIndicator = styled.div<{ $inStock: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.85rem;
  
  &::before {
    content: '';
    display: block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.$inStock ? colors.success.main : colors.danger.main};
    box-shadow: 0 0 8px ${props => props.$inStock ? colors.success.glow : colors.danger.glow};
    animation: ${pulseAnimation} 2s infinite;
  }
`;

const CardActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;
  opacity: 0;
  transform: translateY(10px);
  transition: all 0.3s ease;
  class-name: "card-actions";
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  z-index: 20;
`;

const CardActionButton = styled.button<{ $variant?: 'edit' | 'delete' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.$variant === 'delete' 
    ? colors.danger.background 
    : theme.main.background};
  color: ${props => props.$variant === 'delete' 
    ? colors.danger.dark 
    : theme.main.dark};
  border: 1px solid ${props => props.$variant === 'delete' 
    ? colors.danger.light 
    : theme.main.light}50;
  position: relative;
  overflow: hidden;
  font-size: 1.1rem;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 1.2rem;
    transition: all 0.3s ease;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
    z-index: 10;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: ${props => props.$variant === 'delete' 
      ? colors.danger.gradient 
      : theme.main.gradient};
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px ${props => props.$variant === 'delete' 
      ? colors.danger.glow 
      : theme.main.glow};
    color: white;
    border-color: transparent;
    
    &::before {
      opacity: 1;
    }
    
    svg {
      transform: scale(1.2);
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }
  }
`;

// Görünüm değiştirme düğmeleri
const ViewToggle = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-left: auto;
`;

const ViewToggleButton = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: none;
  background: ${props => props.$active ? theme.main.gradient : 'white'};
  color: ${props => props.$active ? 'white' : colors.neutral.dark};
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$active ? `0 5px 10px ${theme.main.glow}` : '0 2px 5px rgba(0, 0, 0, 0.05)'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  }
  
  svg {
    font-size: 1rem;
  }
`;

// Her sayfada gösterilecek ürün sayısı
const ITEMS_PER_PAGE = 10;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 4px solid ${theme.main.glow}30;
  border-radius: 50%;
  border-top: 4px solid ${theme.main.main};
  animation: ${rotateAnimation} 1s linear infinite;
`;

const ProductList: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal state'leri
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductResponse | null>(null);
  
  // Grid görünüm state'i
  const [isGridView, setIsGridView] = useState(true);
  
  // Ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response);
        setFilteredProducts(response);
        setTotalPages(Math.ceil(response.length / ITEMS_PER_PAGE));
        setError(null);
      } catch (err: any) {
        console.error('Ürünler alınırken hata:', err);
        setError(err.response?.data?.message || 'Ürünler alınamadı');
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Arama terimi değiştiğinde filtreleme yap
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const lowercasedSearch = searchTerm.toLowerCase();
      const filtered = products.filter(product => 
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.description.toLowerCase().includes(lowercasedSearch)
      );
      setFilteredProducts(filtered);
    }
    
    setCurrentPage(1);
    setTotalPages(Math.ceil(filteredProducts.length / ITEMS_PER_PAGE));
  }, [searchTerm, products]);
  
  // Sayfalanmış ürünler
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);
  
  // Ürün düzenleme sayfasına git
  const handleEditProduct = (product: ProductResponse) => {
    navigate(`/admin/products/${product.id}`);
  };
  
  // Ürün silme onay penceresi
  const handleDeleteClick = (product: ProductResponse) => {
    setSelectedProduct(product);
    setDeleteModalOpen(true);
  };
  
  // Ürün silme işlemi
  const handleDeleteProduct = async () => {
    if (!selectedProduct) return;
    
    try {
      setLoading(true);
      await productService.deleteProduct(selectedProduct.id);
      
      // Ürünü state'den kaldır
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
      setProducts(updatedProducts);
      setFilteredProducts(updatedProducts);
      setTotalPages(Math.ceil(updatedProducts.length / ITEMS_PER_PAGE));
      
      toast.success(`${selectedProduct.name} ürünü başarıyla silindi!`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: colors.success.gradient,
          color: 'white',
          boxShadow: `0 8px 16px ${colors.success.glow}`,
          borderRadius: '10px'
        }
      });
      
      setDeleteModalOpen(false);
      setSelectedProduct(null);
    } catch (err: any) {
      console.error('Ürün silinirken hata:', err);
      toast.error(err.response?.data?.message || 'Ürün silinemedi', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: colors.danger.gradient,
          color: 'white',
          boxShadow: `0 8px 16px ${colors.danger.glow}`,
          borderRadius: '10px'
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };
  
  // Yeni ürün ekleme sayfasına git
  const handleAddProduct = () => {
    navigate('/admin/products/new');
  };
  
  // Görünüm değiştirme
  const toggleView = () => {
    setIsGridView(!isGridView);
  };
  
  // Yükleme durumu
  if (loading && products.length === 0) {
    return (
      <LoadingContainer>
        <LoadingSpinner />
        <span>Ürünler Yükleniyor...</span>
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
          <FaCube /> Ürünler
        </Title>
        <ActionContainer>
          <ViewToggle>
            <ViewToggleButton 
              $active={!isGridView} 
              onClick={() => setIsGridView(false)}
              title="Liste Görünümü"
            >
              <FaSort />
            </ViewToggleButton>
            <ViewToggleButton 
              $active={isGridView} 
              onClick={() => setIsGridView(true)}
              title="Grid Görünümü"
            >
              <FaFilter />
            </ViewToggleButton>
          </ViewToggle>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Ürün ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
          <AddButton onClick={handleAddProduct}>
            <FaPlus /> Yeni Ürün
          </AddButton>
        </ActionContainer>
      </PageHeader>
      
      <ProductsContainer>
        {isGridView ? (
          <ProductGrid>
            {paginatedProducts.length > 0 ? (
              paginatedProducts.map(product => (
                <ProductCard key={product.id}>
                  <ProductImageContainer>
                    {product.imageUrl ? (
                      <EnhancedProductImage src={product.imageUrl} alt={product.name} />
                    ) : (
                      <div style={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        backgroundColor: '#f1f5f9', 
                        color: colors.neutral.dark 
                      }}>
                        <FaShoppingBag size={40} />
                      </div>
                    )}
                  </ProductImageContainer>
                  
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                    
                    <ProductMeta>
                      <StockIndicator $inStock={product.stockQuantity > 0}>
                        {product.stockQuantity > 0 ? 'Stokta' : 'Tükendi'} ({product.stockQuantity})
                      </StockIndicator>
                    </ProductMeta>
                  </ProductInfo>
                  
                  <CardActions className="card-actions">
                    <CardActionButton 
                      $variant="edit"
                      onClick={() => handleEditProduct(product)}
                      title="Düzenle"
                    >
                      <FaEdit style={{ color: theme.main.dark }} />
                    </CardActionButton>
                    <CardActionButton 
                      $variant="delete"
                      onClick={() => handleDeleteClick(product)}
                      title="Sil"
                    >
                      <FaTrash style={{ color: colors.danger.dark }} />
                    </CardActionButton>
                  </CardActions>
                </ProductCard>
              ))
            ) : (
              <NoDataContainer>
                <FaShoppingBag />
                Ürün bulunamadı
              </NoDataContainer>
            )}
          </ProductGrid>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Resim</TableHeader>
                <TableHeader>Ürün Adı</TableHeader>
                <TableHeader>Fiyat</TableHeader>
                <TableHeader>Stok</TableHeader>
                <TableHeader>Durum</TableHeader>
                <TableHeader>İşlemler</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {paginatedProducts.length > 0 ? (
                paginatedProducts.map(product => (
                  <TableRow key={product.id}>
                    <TableCell>
                      {product.imageUrl ? (
                        <ProductImage src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div style={{ width: 50, height: 50, backgroundColor: '#e2e8f0', borderRadius: '0.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                          <FaBoxOpen />
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{product.name}</TableCell>
                    <TableCell>{formatCurrency(product.price)}</TableCell>
                    <TableCell>{product.stockQuantity}</TableCell>
                    <TableCell>
                      <StockBadge $inStock={product.stockQuantity > 0}>
                        {product.stockQuantity > 0 ? 'Stokta' : 'Tükendi'}
                      </StockBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButtonsContainer>
                        <ActionButton 
                          className="edit"
                          onClick={() => handleEditProduct(product)}
                          title="Düzenle"
                        >
                          <FaEdit />
                        </ActionButton>
                        <ActionButton 
                          className="delete"
                          onClick={() => handleDeleteClick(product)}
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
                  <TableCell colSpan={6}>
                    <NoDataContainer>
                      <FaShoppingBag />
                      Ürün bulunamadı
                    </NoDataContainer>
                  </TableCell>
                </TableRow>
              )}
            </tbody>
          </Table>
        )}
        
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
      </ProductsContainer>
      
      {/* Ürün Silme Modal */}
      {deleteModalOpen && selectedProduct && (
        <ModalBackdrop onClick={() => setDeleteModalOpen(false)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalHeader>
              <ModalTitle>
                <FaTrash /> Ürün Sil
              </ModalTitle>
              <CloseButton onClick={() => setDeleteModalOpen(false)}>
                <FaTimes />
              </CloseButton>
            </ModalHeader>
            <ModalBody>
              <ConfirmMessage>
                <strong>{selectedProduct.name}</strong> ürününü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
              </ConfirmMessage>
            </ModalBody>
            <ModalFooter>
              <Button onClick={() => setDeleteModalOpen(false)}>
                İptal
              </Button>
              <Button 
                $variant="danger" 
                onClick={handleDeleteProduct}
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

export default ProductList; 