import React, { useState, useEffect } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { FaShoppingCart, FaSearch, FaEye, FaSpinner, FaExclamationCircle, FaTimes, FaBoxOpen, FaMagic, FaShippingFast, FaCreditCard, FaCheckCircle, FaTimesCircle, FaStream } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

// API URL
const API_URL = 'http://localhost:8080/api';

// Renk Paleti
const COLORS = {
  primary: '#8b5cf6', // Mor
  secondary: '#6366f1', // İndigo
  accent1: '#ec4899', // Pembe
  accent2: '#06b6d4', // Turkuaz
  accent3: '#f97316', // Turuncu
  accent4: '#2dd4bf', // Mint
  accent5: '#4ade80', // Lime yeşil
  dark: '#1e293b',
  light: '#f1f5f9',
  background: '#e8f3fd', // Çok açık mavi
  cardBg: 'rgba(255, 255, 255, 0.9)', // Neredeyse beyaz, hafif transparan
  success: '#10b981',
  error: '#ef4444',
  warning: '#f59e0b',
  info: '#3b82f6',
};

// Global stil
const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(135deg, ${COLORS.background}, #d4e5f9);
    color: ${COLORS.dark};
    overflow-x: hidden;
  }
  
  * {
    box-sizing: border-box;
  }
  
  ::-webkit-scrollbar {
    width: 8px;
  }
  
  ::-webkit-scrollbar-track {
    background: rgba(200, 220, 240, 0.3);
    border-radius: 8px;
  }
  
  ::-webkit-scrollbar-thumb {
    background: ${COLORS.primary}80;
    border-radius: 8px;
    border: 2px solid transparent;
    background-clip: padding-box;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.primary};
    background-clip: padding-box;
  }
`;

// Arka plan parçacıkları için bileşenler
const particleAnimation = keyframes`
  0% {
    transform: translateY(0) rotate(0deg);
    opacity: 1;
    border-radius: 40%;
  }
  100% {
    transform: translateY(-1000px) rotate(720deg);
    opacity: 0;
    border-radius: 50%;
  }
`;

const ParticlesContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: -1;
  filter: blur(1px);
`;

interface ParticleProps {
  $size: number;
  $top: number;
  $left: number;
  $color: string;
  $delay: number;
  $duration: number;
}

const Particle = styled.div<ParticleProps>`
  position: absolute;
  display: block;
  pointer-events: none;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background: ${props => props.$color};
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  border-radius: 40%;
  animation: ${particleAnimation} ${props => props.$duration}s linear infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: 0.4;
  box-shadow: 0 0 ${props => props.$size * 2}px ${props => props.$color}66;
`;

// Parçacıklar bileşeni
const Particles: React.FC = () => {
  const particleCount = 25;
  const particleColors = [
    COLORS.primary, COLORS.secondary, COLORS.accent1, 
    COLORS.accent2, COLORS.accent3, '#f472b6', '#22d3ee', '#a78bfa'
  ];
  
  return (
    <ParticlesContainer>
      {Array.from({ length: particleCount }).map((_, i) => {
        const size = Math.random() * 25 + 5;
        const top = Math.random() * 100;
        const left = Math.random() * 100;
        const color = particleColors[Math.floor(Math.random() * particleColors.length)];
        const delay = Math.random() * 15;
        const duration = Math.random() * 20 + 20;
        
        return (
          <Particle
            key={i}
            $size={size}
            $top={top}
            $left={left}
            $color={color}
            $delay={delay}
            $duration={duration}
          />
        );
      })}
    </ParticlesContainer>
  );
};

// Durum ikonları
const getStatusIcon = (status: OrderStatus) => {
  switch (status) {
    case OrderStatus.PENDING:
      return <FaCreditCard />;
    case OrderStatus.PROCESSING:
      return <FaStream />;
    case OrderStatus.SHIPPED:
      return <FaShippingFast />;
    case OrderStatus.DELIVERED:
      return <FaCheckCircle />;
    case OrderStatus.CANCELLED:
      return <FaTimesCircle />;
    default:
      return null;
  }
};

// Sipariş veri türleri
interface OrderItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  userId: number;
  username?: string;
  orderDate: string;
  status: OrderStatus;
  totalAmount: number;
  orderItems: OrderItem[];
}

enum OrderStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

// Durum çevirileri
const getStatusLabel = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.PENDING:
      return 'BEKLEMEDE';
    case OrderStatus.PROCESSING:
      return 'İŞLEMDE';
    case OrderStatus.SHIPPED:
      return 'KARGOLANDI';
    case OrderStatus.DELIVERED:
      return 'TESLİM EDİLDİ';
    case OrderStatus.CANCELLED:
      return 'İPTAL EDİLDİ';
    default:
      return 'BEKLEMEDE';
  }
};

// Stil bileşenleri
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 1280px;
  margin: 2rem auto;
  padding: 1.5rem;
  position: relative;
  perspective: 1000px;
  
  &::before {
    content: "";
    position: absolute;
    top: -100px;
    right: -100px;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, ${COLORS.accent1}40, transparent 70%);
    filter: blur(60px);
    z-index: -1;
  }
  
  &::after {
    content: "";
    position: absolute;
    bottom: -100px;
    left: -100px;
    width: 350px;
    height: 350px;
    background: radial-gradient(circle, ${COLORS.accent2}40, transparent 70%);
    filter: blur(60px);
    z-index: -1;
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.5));
  border-radius: 16px;
  backdrop-filter: blur(10px);
  padding: 1.5rem 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.7);
  animation: ${fadeIn} 0.5s ease-out;
  position: relative;
  
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 16px;
    background: linear-gradient(45deg, transparent, rgba(99, 102, 241, 0.1), transparent);
    z-index: -1;
  }
`;

const glow = keyframes`
  0% {
    text-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(139, 92, 246, 0.5), 0 0 20px rgba(236, 72, 153, 0.3);
  }
  100% {
    text-shadow: 0 0 5px rgba(139, 92, 246, 0.3);
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: ${COLORS.dark};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 1px;
  animation: ${glow} 3s infinite ease-in-out;
  
  svg {
    color: ${COLORS.accent1};
    filter: drop-shadow(0 0 8px ${COLORS.accent1}80);
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 350px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 0.75rem 1rem 0.75rem 3rem;
  border-radius: 12px;
  border: 1px solid rgba(99, 102, 241, 0.3);
  width: 100%;
  font-size: 1rem;
  background-color: rgba(255, 255, 255, 0.7);
  color: ${COLORS.dark};
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${COLORS.primary};
    box-shadow: 0 0 0 4px ${COLORS.primary}33, 0 4px 16px rgba(0, 0, 0, 0.1);
    background-color: rgba(255, 255, 255, 0.9);
  }
  
  &::placeholder {
    color: rgba(30, 41, 59, 0.5);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: ${COLORS.accent2};
  font-size: 1.2rem;
`;

const FiltersContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.6s ease-out;
`;

const pulse = keyframes`
  0% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0.4);
  }
  70% {
    box-shadow: 0 0 0 8px rgba(99, 102, 241, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(99, 102, 241, 0);
  }
`;

const FilterButton = styled.button<{ $active: boolean }>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$active ? COLORS.primary : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => {
    if (props.$active) {
      // props.children'ın içeriğini kontrol et - Türkçe durum stringine göre renk belirle
      const childrenText = props.children && Array.isArray(props.children) 
        ? props.children[1]?.toString() 
        : '';
      
      switch (childrenText) {
        case 'BEKLEMEDE':
          return `linear-gradient(135deg, ${COLORS.warning}, #fdba74)`;
        case 'İŞLEMDE':
          return `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`;
        case 'KARGOLANDI':
          return `linear-gradient(135deg, ${COLORS.info}, ${COLORS.accent2})`;
        case 'TESLİM EDİLDİ':
          return `linear-gradient(135deg, ${COLORS.success}, ${COLORS.accent5})`;
        case 'İPTAL EDİLDİ':
          return `linear-gradient(135deg, ${COLORS.error}, #fb7185)`;
        default:
          return `linear-gradient(135deg, ${COLORS.accent4}, ${COLORS.accent2})`;
      }
    } else {
      return 'rgba(30, 41, 59, 0.5)';
    }
  }};
  color: ${props => props.$active ? '#ffffff' : 'rgba(248, 250, 252, 0.7)'};
  font-size: 0.95rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px);
  animation: ${props => props.$active ? pulse : 'none'} 2s infinite;
  text-shadow: ${props => props.$active ? '0 1px 3px rgba(0, 0, 0, 0.3)' : 'none'};
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  svg {
    font-size: 1.1rem;
    ${props => props.$active ? `
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
    ` : ''}
  }
  
  &:hover {
    transform: translateY(-2px);
    border-color: ${COLORS.primary};
    color: #ffffff;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    
    svg {
      filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.5));
    }
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const floatAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-3px);
  }
`;

const OrdersContainer = styled.div`
  background: linear-gradient(135deg, ${COLORS.cardBg}, rgba(255, 255, 255, 0.7));
  border-radius: 16px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1), 
              0 0 15px 0 rgba(139, 92, 246, 0.1),
              0 0 20px 0 rgba(236, 72, 153, 0.05);
  overflow: hidden;
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.7);
  transform-style: preserve-3d;
  transition: all 0.3s ease-in-out;
  animation: ${fadeIn} 0.8s ease-out;
  
  &::before {
    content: "";
    position: absolute;
    top: -10px;
    left: -10px;
    right: -10px;
    bottom: -10px;
    background: linear-gradient(135deg, ${COLORS.primary}10, ${COLORS.accent2}10);
    border-radius: 22px;
    z-index: -1;
    filter: blur(5px);
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  padding: 0.5rem;
`;

const TableHead = styled.thead`
  background: linear-gradient(90deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.15));
  backdrop-filter: blur(8px);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const shineThead = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const TableRow = styled.tr`
  position: relative;
  transition: all 0.3s ease;
  
  &:not(:last-child) {
    border-bottom: 1px solid rgba(99, 102, 241, 0.1);
  }
  
  &:nth-child(odd) {
    background-color: rgba(255, 255, 255, 0.7);
  }
  
  &:nth-child(even) {
    background-color: rgba(248, 250, 252, 0.5);
  }
  
  &:hover {
    background-color: rgba(99, 102, 241, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    z-index: 5;
    
    &::after {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
      background-size: 200% 100%;
      animation: ${shineThead} 1s linear;
      pointer-events: none;
    }
  }
`;

const TableHeader = styled.th`
  padding: 1rem 1.5rem;
  text-align: left;
  font-weight: 600;
  color: ${COLORS.dark};
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  text-transform: uppercase;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 2px;
    background: linear-gradient(90deg, ${COLORS.primary}, ${COLORS.accent1});
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.3s ease;
  }
  
  ${TableHead}:hover &::after {
    transform: scaleX(1);
  }
`;

const TableCell = styled.td`
  padding: 1.25rem 1.5rem;
  color: ${COLORS.dark};
  font-size: 0.95rem;
  position: relative;
  overflow: hidden;
  
  &:first-child {
    font-weight: 600;
    color: ${COLORS.primary};
  }
`;

const shineEffect = keyframes`
  0% {
    background-position: -100% 0;
  }
  100% {
    background-position: 200% 0;
  }
`;

const StatusBadge = styled.span<{ $status: OrderStatus }>`
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  font-size: 0.85rem;
  font-weight: 600;
  border-radius: 12px;
  gap: 0.5rem;
  position: relative;
  isolation: isolate;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: -1;
    border-radius: 12px;
    opacity: 0.7;
    background-size: 200% 100%;
    animation: ${shineEffect} 3s linear infinite;
  }
  
  ${({ $status }) => {
    switch ($status) {
      case OrderStatus.PENDING:
        return `
          background-color: rgba(245, 158, 11, 0.3);
          color: #fcd34d;
          border: 1px solid rgba(245, 158, 11, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(245, 158, 11, 0.5), transparent);
          }
          
          svg {
            color: #f59e0b;
            filter: drop-shadow(0 0 3px rgba(245, 158, 11, 0.7));
          }
        `;
      case OrderStatus.PROCESSING:
        return `
          background-color: rgba(99, 102, 241, 0.3);
          color: #a5b4fc;
          border: 1px solid rgba(99, 102, 241, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(99, 102, 241, 0.5), transparent);
          }
          
          svg {
            color: #6366f1;
            filter: drop-shadow(0 0 3px rgba(99, 102, 241, 0.7));
          }
        `;
      case OrderStatus.SHIPPED:
        return `
          background-color: rgba(6, 182, 212, 0.3);
          color: #67e8f9;
          border: 1px solid rgba(6, 182, 212, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(6, 182, 212, 0.5), transparent);
          }
          
          svg {
            color: ${COLORS.accent2};
            filter: drop-shadow(0 0 3px rgba(6, 182, 212, 0.7));
          }
        `;
      case OrderStatus.DELIVERED:
        return `
          background-color: rgba(16, 185, 129, 0.3);
          color: #6ee7b7;
          border: 1px solid rgba(16, 185, 129, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(16, 185, 129, 0.5), transparent);
          }
          
          svg {
            color: #10b981;
            filter: drop-shadow(0 0 3px rgba(16, 185, 129, 0.7));
          }
        `;
      case OrderStatus.CANCELLED:
        return `
          background-color: rgba(239, 68, 68, 0.3);
          color: #fca5a5;
          border: 1px solid rgba(239, 68, 68, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(239, 68, 68, 0.5), transparent);
          }
          
          svg {
            color: #ef4444;
            filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.7));
          }
        `;
      default:
        return `
          background-color: rgba(156, 163, 175, 0.3);
          color: #e5e7eb;
          border: 1px solid rgba(156, 163, 175, 0.4);
          
          &::before {
            background: linear-gradient(90deg, transparent, rgba(156, 163, 175, 0.5), transparent);
          }
        `;
    }
  }}
`;

const rotatePulse = keyframes`
  0% {
    transform: scale(1) rotate(0);
  }
  50% {
    transform: scale(1.15) rotate(5deg);
    box-shadow: 0 0 15px ${COLORS.primary};
  }
  100% {
    transform: scale(1) rotate(0);
  }
`;

const ActionButton = styled.button`
  background: rgba(99, 102, 241, 0.2);
  border: 1px solid rgba(99, 102, 241, 0.3);
  padding: 0.6rem;
  border-radius: 12px;
  color: ${COLORS.primary};
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &:hover {
    background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.accent2});
    color: white;
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(99, 102, 241, 0.4);
    animation: ${rotatePulse} 0.5s ease-out;
  }
  
  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
    mix-blend-mode: overlay;
  }
  
  &:hover::after {
    opacity: 1;
  }
  
  svg {
    font-size: 1.25rem;
    filter: drop-shadow(0 0 5px rgba(99, 102, 241, 0.5));
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 1.25rem 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  gap: 0.75rem;
  background: linear-gradient(to right, rgba(99, 102, 241, 0.05), rgba(139, 92, 246, 0.1));
  backdrop-filter: blur(8px);
`;

const pageButtonHover = keyframes`
  0% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 1rem;
  border-radius: 12px;
  border: 1px solid ${props => props.$active ? COLORS.primary : 'rgba(255, 255, 255, 0.1)'};
  background: ${props => props.$active 
    ? `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})` 
    : 'rgba(15, 23, 42, 0.7)'};
  color: ${props => props.$active ? 'white' : 'rgba(255, 255, 255, 0.8)'};
  font-size: 0.9rem;
  font-weight: ${props => props.$active ? '600' : '500'};
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &:not(:disabled):hover {
    transform: translateY(-3px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    animation: ${pageButtonHover} 0.5s ease-out;
    border-color: ${COLORS.primary}80;
    background: linear-gradient(135deg, ${COLORS.accent2}, ${COLORS.primary});
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -100%;
    left: -100%;
    width: 300%;
    height: 300%;
    background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
    transform: rotate(45deg);
  }
  
  &:hover::before {
    opacity: 1;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: rgba(255, 255, 255, 0.05);
    color: rgba(255, 255, 255, 0.3);
    
    &:hover {
      transform: none;
      box-shadow: none;
      animation: none;
    }
  }
`;

const modalFadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const modalScaleIn = keyframes`
  from {
    opacity: 0;
    transform: scale(0.9) perspective(500px) rotateX(5deg);
  }
  to {
    opacity: 1;
    transform: scale(1) perspective(500px) rotateX(0);
  }
`;

const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at center, rgba(15, 23, 42, 0.7), rgba(3, 7, 18, 0.85));
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  backdrop-filter: blur(10px);
  animation: ${modalFadeIn} 0.3s ease-out;
  perspective: 1200px;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, ${COLORS.cardBg}, rgba(15, 23, 42, 0.9));
  border-radius: 16px;
  box-shadow: 
    0 25px 50px -12px rgba(0, 0, 0, 0.4),
    0 0 0 1px rgba(255, 255, 255, 0.1),
    0 0 30px rgba(99, 102, 241, 0.15);
  max-width: 650px;
  width: 100%;
  padding: 2rem;
  max-height: 90vh;
  overflow-y: auto;
  animation: ${modalScaleIn} 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  transform-style: preserve-3d;
  
  &::-webkit-scrollbar {
    width: 8px;
  }
  
  &::-webkit-scrollbar-track {
    background: rgba(15, 23, 42, 0.5);
    border-radius: 8px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: ${COLORS.primary}80;
    border-radius: 8px;
    transition: all 0.3s ease;
  }
  
  &::-webkit-scrollbar-thumb:hover {
    background: ${COLORS.primary};
  }
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 1rem;
`;

const pulseGlow = keyframes`
  0%, 100% {
    text-shadow: 0 0 5px rgba(99, 102, 241, 0.3);
  }
  50% {
    text-shadow: 0 0 15px rgba(99, 102, 241, 0.6), 0 0 20px rgba(139, 92, 246, 0.4);
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${COLORS.light};
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  letter-spacing: 0.5px;
  animation: ${pulseGlow} 3s infinite;
  
  svg {
    color: ${COLORS.accent1};
    filter: drop-shadow(0 0 5px ${COLORS.accent1}80);
  }
`;

const CloseButton = styled.button`
  background: rgba(239, 68, 68, 0.15);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: ${COLORS.light};
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${COLORS.error};
    transform: rotate(90deg);
    box-shadow: 0 0 15px rgba(239, 68, 68, 0.4);
  }
  
  svg {
    filter: drop-shadow(0 0 3px rgba(239, 68, 68, 0.5));
  }
`;

const ModalSection = styled.div`
  margin-bottom: 2rem;
  background: rgba(15, 23, 42, 0.3);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(15, 23, 42, 0.5);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    transform: translateY(-3px);
  }
`;

const SectionTitle = styled.h4`
  font-size: 1.15rem;
  font-weight: 600;
  color: ${COLORS.light};
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, ${COLORS.primary}80, transparent);
    margin-left: 0.5rem;
  }
`;

const DetailGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.25rem;
  
  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(15, 23, 42, 0.2);
  padding: 1rem;
  border-radius: 10px;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(99, 102, 241, 0.1);
    border-color: rgba(99, 102, 241, 0.3);
    transform: translateY(-2px);
  }
`;

const DetailLabel = styled.div`
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  margin-bottom: 0.5rem;
`;

const DetailValue = styled.div`
  font-weight: 600;
  color: ${COLORS.light};
  font-size: 1.1rem;
`;

const ModalFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'danger' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transform: translateX(-100%);
    transition: transform 0.6s;
  }
  
  &:hover::before {
    transform: translateX(100%);
  }
  
  ${({ $variant }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary});
          border: 1px solid ${COLORS.primary};
          color: white;
          box-shadow: 0 5px 15px rgba(99, 102, 241, 0.3);
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(99, 102, 241, 0.5);
          }
          
          &:active {
            transform: translateY(-1px);
          }
        `;
      case 'danger':
        return `
          background: linear-gradient(135deg, ${COLORS.error}, #fb7185);
          border: 1px solid ${COLORS.error};
          color: white;
          box-shadow: 0 5px 15px rgba(239, 68, 68, 0.3);
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(239, 68, 68, 0.5);
          }
          
          &:active {
            transform: translateY(-1px);
          }
        `;
      default:
        return `
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: ${COLORS.light};
          
          &:hover {
            transform: translateY(-3px);
            background: rgba(30, 41, 59, 0.7);
            border-color: rgba(255, 255, 255, 0.2);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
          }
          
          &:active {
            transform: translateY(-1px);
          }
        `;
    }
  }}
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const pulseScale = keyframes`
  0%, 100% {
    transform: scale(0.95);
    opacity: 0.8;
  }
  50% {
    transform: scale(1.05);
    opacity: 1;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem;
  font-size: 1.25rem;
  color: ${COLORS.light};
  gap: 1.5rem;
  
  svg {
    font-size: 3rem;
    color: ${COLORS.primary};
    animation: ${rotate} 1.5s linear infinite;
    filter: drop-shadow(0 0 10px ${COLORS.primary}80);
  }
  
  &::after {
    content: "";
    width: 80px;
    height: 80px;
    border-radius: 50%;
    position: absolute;
    background: radial-gradient(circle, ${COLORS.primary}30, transparent 70%);
    animation: ${pulseScale} 2s ease-in-out infinite;
    z-index: -1;
  }
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  background: linear-gradient(135deg, rgba(239, 68, 68, 0.15), rgba(239, 68, 68, 0.05));
  border-radius: 16px;
  color: #f87171;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 1px solid rgba(239, 68, 68, 0.3);
  box-shadow: 0 10px 30px rgba(239, 68, 68, 0.1);
  backdrop-filter: blur(10px);
  
  svg {
    font-size: 2rem;
    animation: ${pulseScale} 2s infinite;
    filter: drop-shadow(0 0 5px rgba(239, 68, 68, 0.5));
  }
`;

const NoDataContainer = styled.div`
  padding: 4rem 2rem;
  text-align: center;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1.15rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
`;

const EmptyBox = styled.div`
  font-size: 4rem;
  perspective: 800px;
  transform-style: preserve-3d;
  animation: ${floatAnimation} 4s ease-in-out infinite;
  margin-bottom: 1rem;
  
  &::before {
    content: "📦";
    display: inline-block;
    filter: drop-shadow(0 10px 15px rgba(0, 0, 0, 0.4));
  }
`;

// Loading animasyonu
const loadingCircleAnimation = keyframes`
  0%, 100% {
    animation-timing-function: cubic-bezier(0.5, 0, 1, 0.5);
  }
  0% {
    transform: rotateY(0deg);
  }
  50% {
    transform: rotateY(1800deg);
    animation-timing-function: cubic-bezier(0, 0.5, 0.5, 1);
  }
  100% {
    transform: rotateY(3600deg);
  }
`;

const LoadingCircle = styled.div`
  display: inline-block;
  transform-style: preserve-3d;
  perspective: 600px;
  width: 80px;
  height: 80px;
  
  &::after {
    content: '';
    display: block;
    width: 64px;
    height: 64px;
    margin: 8px;
    border-radius: 50%;
    border: 6px solid ${COLORS.primary};
    border-color: ${COLORS.primary} transparent ${COLORS.secondary} transparent;
    animation: ${loadingCircleAnimation} 3s linear infinite;
    box-shadow: 0 0 20px ${COLORS.primary}80;
  }
`;

// Hover için scale efekti
const HoverScale = styled.div`
  transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  
  &:hover {
    transform: scale(1.05);
  }
`;

// Boş sonuç için 3D animasyon
const emptyBoxAnimation = keyframes`
  0% {
    transform: translateY(0) rotateY(0) rotateX(0);
  }
  25% {
    transform: translateY(-20px) rotateY(10deg) rotateX(5deg);
  }
  50% {
    transform: translateY(0) rotateY(180deg) rotateX(10deg);
  }
  75% {
    transform: translateY(-10px) rotateY(360deg) rotateX(5deg);
  }
  100% {
    transform: translateY(0) rotateY(0) rotateX(0);
  }
`;

// Her sayfada gösterilecek sipariş sayısı
const ITEMS_PER_PAGE = 10;

// ActionButton'dan önce ekleyelim
const CategoryIcons = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 1rem 0 2rem;
  flex-wrap: wrap;
  gap: 1.5rem;
`;

const CategoryIcon = styled.div<{ $type: string }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  
  .icon-container {
    width: 80px;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    font-size: 2rem;
    background: ${props => {
      switch(props.$type) {
        case 'pending': return `linear-gradient(135deg, ${COLORS.warning}40, ${COLORS.warning}80)`;
        case 'processing': return `linear-gradient(135deg, ${COLORS.primary}40, ${COLORS.secondary}80)`;
        case 'shipped': return `linear-gradient(135deg, ${COLORS.info}40, ${COLORS.accent2}80)`;
        case 'delivered': return `linear-gradient(135deg, ${COLORS.success}40, ${COLORS.accent5}80)`;
        case 'cancelled': return `linear-gradient(135deg, ${COLORS.error}40, ${COLORS.accent1}80)`;
        default: return `linear-gradient(135deg, ${COLORS.accent2}40, ${COLORS.accent4}80)`;
      }
    }};
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateY(-5px) scale(1.05);
      box-shadow: 0 12px 20px rgba(0, 0, 0, 0.15);
    }
  }
  
  .label {
    font-size: 0.9rem;
    font-weight: 600;
    color: ${COLORS.dark};
  }
  
  .count {
    font-size: 1.2rem;
    font-weight: 700;
    color: ${props => {
      switch(props.$type) {
        case 'pending': return COLORS.warning;
        case 'processing': return COLORS.primary;
        case 'shipped': return COLORS.info;
        case 'delivered': return COLORS.success;
        case 'cancelled': return COLORS.error;
        default: return COLORS.accent2;
      }
    }};
  }
`;

const OrderList: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');
  
  // Modal state'leri
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState<boolean>(false);
  
  const navigate = useNavigate();
  
  // Siparişleri getir
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_URL}/admin/orders`);
        setOrders(response.data);
        setFilteredOrders(response.data);
        setTotalPages(Math.ceil(response.data.length / ITEMS_PER_PAGE));
        setError(null);
      } catch (err: any) {
        console.error('Siparişler alınırken hata:', err);
        setError(err.response?.data?.message || 'Siparişler alınamadı');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, []);
  
  // Filtreleme
  useEffect(() => {
    let filtered = [...orders];
    
    // Durum filtreleme
    if (statusFilter !== 'ALL') {
      filtered = filtered.filter(order => order.status === statusFilter);
    }
    
    // Arama terimi filtreleme
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(order => 
        order.id.toString().includes(lowercasedSearch) ||
        (order.username && order.username.toLowerCase().includes(lowercasedSearch))
      );
    }
    
    setFilteredOrders(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Filtreleme sonrası ilk sayfaya dön
  }, [statusFilter, searchTerm, orders]);
  
  // Sipariş durumunu güncellemek için 
  const updateOrderStatus = async (orderId: number, newStatus: OrderStatus) => {
    try {
      setLoading(true);
      
      // Backend'e sipariş durumu güncelleme isteği
      await axios.put(`${API_URL}/admin/orders/${orderId}/status`, { status: newStatus });
      
      // UI'da güncelleme
      const updatedOrders = orders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      
      setOrders(updatedOrders);
      setSelectedOrder(prev => prev && prev.id === orderId ? { ...prev, status: newStatus } : prev);
      
      toast.success(`Sipariş #${orderId} durumu "${getStatusLabel(newStatus)}" olarak güncellendi`);
    } catch (err: any) {
      console.error('Sipariş durumu güncellenirken hata:', err);
      toast.error(err.response?.data?.message || 'Sipariş durumu güncellenemedi');
    } finally {
      setLoading(false);
    }
  };
  
  // Sipariş detaylarını göster
  const handleViewOrder = (order: Order) => {
    navigate(`/admin/orders/${order.id}`);
  };
  
  // Sayfalanmış siparişler
  const paginatedOrders = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredOrders.slice(startIndex, endIndex);
  }, [filteredOrders, currentPage]);
  
  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  
  // Tarih formatı
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };
  
  // Sipariş sayıları hesapla
  const orderCounts = React.useMemo(() => {
    const counts = {
      total: orders.length,
      pending: orders.filter(order => order.status === OrderStatus.PENDING).length,
      processing: orders.filter(order => order.status === OrderStatus.PROCESSING).length,
      shipped: orders.filter(order => order.status === OrderStatus.SHIPPED).length,
      delivered: orders.filter(order => order.status === OrderStatus.DELIVERED).length,
      cancelled: orders.filter(order => order.status === OrderStatus.CANCELLED).length,
    };
    return counts;
  }, [orders]);
  
  // Yükleme durumu
  if (loading && orders.length === 0) {
    return (
      <>
        <GlobalStyle />
        <Particles />
        <LoadingContainer>
          <LoadingCircle />
          <span>Siparişler Yükleniyor...</span>
        </LoadingContainer>
      </>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <>
        <GlobalStyle />
        <ErrorContainer>
          <FaExclamationCircle />
          <div>
            <h3>Bir hata oluştu!</h3>
            <p>{error}</p>
          </div>
        </ErrorContainer>
      </>
    );
  }
  
  return (
    <>
      <GlobalStyle />
      <Particles />
      <PageContainer>
        <PageHeader>
          <Title>
            <FaShoppingCart /> Siparişler
          </Title>
          <SearchContainer>
            <SearchIcon>
              <FaSearch />
            </SearchIcon>
            <SearchInput
              type="text"
              placeholder="Sipariş ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </SearchContainer>
        </PageHeader>
        
        <CategoryIcons>
          <CategoryIcon $type="total">
            <div className="icon-container">
              <FaBoxOpen />
            </div>
            <div className="label">Toplam</div>
            <div className="count">{orderCounts.total}</div>
          </CategoryIcon>
          <CategoryIcon $type="pending">
            <div className="icon-container">
              <FaCreditCard />
            </div>
            <div className="label">{getStatusLabel(OrderStatus.PENDING)}</div>
            <div className="count">{orderCounts.pending}</div>
          </CategoryIcon>
          <CategoryIcon $type="processing">
            <div className="icon-container">
              <FaStream />
            </div>
            <div className="label">{getStatusLabel(OrderStatus.PROCESSING)}</div>
            <div className="count">{orderCounts.processing}</div>
          </CategoryIcon>
          <CategoryIcon $type="shipped">
            <div className="icon-container">
              <FaShippingFast />
            </div>
            <div className="label">{getStatusLabel(OrderStatus.SHIPPED)}</div>
            <div className="count">{orderCounts.shipped}</div>
          </CategoryIcon>
          <CategoryIcon $type="delivered">
            <div className="icon-container">
              <FaCheckCircle />
            </div>
            <div className="label">{getStatusLabel(OrderStatus.DELIVERED)}</div>
            <div className="count">{orderCounts.delivered}</div>
          </CategoryIcon>
          <CategoryIcon $type="cancelled">
            <div className="icon-container">
              <FaTimesCircle />
            </div>
            <div className="label">{getStatusLabel(OrderStatus.CANCELLED)}</div>
            <div className="count">{orderCounts.cancelled}</div>
          </CategoryIcon>
        </CategoryIcons>
        
        <FiltersContainer>
          <FilterButton 
            $active={statusFilter === 'ALL'}
            onClick={() => setStatusFilter('ALL')}
          >
            <FaBoxOpen /> Tümü
          </FilterButton>
          {Object.values(OrderStatus).map(status => (
            <FilterButton
              key={status}
              $active={statusFilter === status}
              onClick={() => setStatusFilter(status)}
            >
              {getStatusIcon(status)} {getStatusLabel(status)}
            </FilterButton>
          ))}
        </FiltersContainer>
        
        <OrdersContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeader>Sipariş No</TableHeader>
                <TableHeader>Kullanıcı</TableHeader>
                <TableHeader>Tarih</TableHeader>
                <TableHeader>Toplam</TableHeader>
                <TableHeader>Durum</TableHeader>
                <TableHeader>İşlemler</TableHeader>
              </TableRow>
            </TableHead>
            <tbody>
              {paginatedOrders.length > 0 ? (
                paginatedOrders.map(order => (
                  <TableRow key={order.id}>
                    <TableCell>#{order.id}</TableCell>
                    <TableCell>{order.username || `Kullanıcı #${order.userId}`}</TableCell>
                    <TableCell>{formatDate(order.orderDate)}</TableCell>
                    <TableCell>{formatCurrency(order.totalAmount)}</TableCell>
                    <TableCell>
                      <StatusBadge $status={order.status}>
                        {getStatusIcon(order.status)} {getStatusLabel(order.status)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>
                      <ActionButton 
                        onClick={() => handleViewOrder(order)}
                        title="Görüntüle"
                      >
                        <FaEye />
                      </ActionButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6}>
                    <NoDataContainer>
                      <EmptyBox />
                      <span>Sipariş bulunamadı</span>
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
        </OrdersContainer>
        
        {/* Sipariş Detay Modal */}
        {detailModalOpen && selectedOrder && (
          <ModalBackdrop onClick={() => setDetailModalOpen(false)}>
            <ModalContent onClick={e => e.stopPropagation()}>
              <ModalHeader>
                <ModalTitle>
                  <FaShoppingCart /> Sipariş #{selectedOrder.id}
                </ModalTitle>
                <CloseButton onClick={() => setDetailModalOpen(false)}>
                  <FaTimes />
                </CloseButton>
              </ModalHeader>
              
              <ModalSection>
                <SectionTitle>Sipariş Bilgileri</SectionTitle>
                <DetailGrid>
                  <DetailItem>
                    <DetailLabel>Müşteri</DetailLabel>
                    <DetailValue>
                      {selectedOrder.username || `Kullanıcı #${selectedOrder.userId}`}
                    </DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Sipariş Tarihi</DetailLabel>
                    <DetailValue>{formatDate(selectedOrder.orderDate)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Toplam Tutar</DetailLabel>
                    <DetailValue>{formatCurrency(selectedOrder.totalAmount)}</DetailValue>
                  </DetailItem>
                  <DetailItem>
                    <DetailLabel>Durum</DetailLabel>
                    <DetailValue>
                      <StatusBadge $status={selectedOrder.status}>
                        {getStatusIcon(selectedOrder.status)} {getStatusLabel(selectedOrder.status)}
                      </StatusBadge>
                    </DetailValue>
                  </DetailItem>
                </DetailGrid>
              </ModalSection>
              
              <ModalSection>
                <SectionTitle>Sipariş Öğeleri</SectionTitle>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableHeader>Ürün</TableHeader>
                      <TableHeader>Adet</TableHeader>
                      <TableHeader>Birim Fiyat</TableHeader>
                      <TableHeader>Toplam</TableHeader>
                    </TableRow>
                  </TableHead>
                  <tbody>
                    {selectedOrder.orderItems.map(item => (
                      <TableRow key={item.id}>
                        <TableCell>{item.productName}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{formatCurrency(item.price)}</TableCell>
                        <TableCell>{formatCurrency(item.price * item.quantity)}</TableCell>
                      </TableRow>
                    ))}
                  </tbody>
                </Table>
              </ModalSection>
              
              <ModalSection>
                <SectionTitle>Durumu Güncelle</SectionTitle>
                <FiltersContainer>
                  {Object.values(OrderStatus).map(status => (
                    <FilterButton
                      key={status}
                      $active={selectedOrder.status === status}
                      onClick={() => updateOrderStatus(selectedOrder.id, status)}
                      disabled={selectedOrder.status === status}
                    >
                      {getStatusLabel(status)}
                    </FilterButton>
                  ))}
                </FiltersContainer>
              </ModalSection>
              
              <ModalFooter>
                <Button onClick={() => setDetailModalOpen(false)}>
                  Kapat
                </Button>
              </ModalFooter>
            </ModalContent>
          </ModalBackdrop>
        )}
      </PageContainer>
    </>
  );
};

export default OrderList; 