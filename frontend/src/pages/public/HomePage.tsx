import React, { useState, useEffect, useRef } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaShoppingCart, FaRegHeart, FaHeart, FaStar, FaUser, FaSignOutAlt, FaUserCog, FaTachometerAlt, FaEye, FaFire, FaMagic, FaGem } from 'react-icons/fa';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import Button from '../../components/common/Button';
import authService from '../../services/authService';
import useAuth from '../../hooks/useAuth';
import cartService from '../../services/cartService';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import { ProductResponse } from '../../types';

// Animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const blink = keyframes`
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
`;

const gradientAnimation = keyframes`
  0% { background-position: 0% 50% }
  50% { background-position: 100% 50% }
  100% { background-position: 0% 50% }
`;

const borderFlow = keyframes`
  0% { height: 0; top: 0; opacity: 0; }
  20% { opacity: 1; }
  100% { height: 100%; top: 0; opacity: 0; }
`;

const borderFlowReverse = keyframes`
  0% { height: 0; bottom: 0; opacity: 0; }
  20% { opacity: 1; }
  100% { height: 100%; bottom: 0; opacity: 0; }
`;

const shooting = keyframes`
  0% { 
    transform: translateX(-100px) translateY(50px) rotate(45deg); 
    opacity: 1;
  }
  70% {
    opacity: 1;
  }
  100% { 
    transform: translateX(calc(100vw + 100px)) translateY(-100vh) rotate(45deg);
    opacity: 0;
  }
`;

const glitter = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.5; transform: scale(1.5); }
`;

const bounce = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-20px); }
`;

const shakeX = keyframes`
  0%, 100% { transform: translateX(0); }
  10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
  20%, 40%, 60%, 80% { transform: translateX(5px); }
`;

const rotateY = keyframes`
  0% { transform: rotateY(0deg); }
  100% { transform: rotateY(360deg); }
`;

// Stil Bileşenleri
const PageContainer = styled.div`
  min-height: 100vh;
  width: 100vw;
  background: linear-gradient(135deg, #f9fafb 0%, #eef2ff 50%, #e0f2fe 100%);
  background-size: 200% 200%;
  animation: ${gradientAnimation} 15s ease infinite;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-x: hidden;
  position: relative;
  margin: 0;
  padding: 0;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    pointer-events: none;
  }
  
  &::before {
    background: repeating-linear-gradient(
      45deg,
      rgba(255, 255, 255, 0.03),
      rgba(255, 255, 255, 0.03) 10px,
      rgba(255, 255, 255, 0.06) 10px,
      rgba(255, 255, 255, 0.06) 20px
    );
    z-index: 1;
  }

  &::after {
    background-image: 
      radial-gradient(circle at 20% 30%, rgba(255, 0, 128, 0.1) 0%, transparent 120px),
      radial-gradient(circle at 80% 20%, rgba(0, 255, 128, 0.1) 0%, transparent 120px),
      radial-gradient(circle at 40% 80%, rgba(128, 0, 255, 0.1) 0%, transparent 120px),
      radial-gradient(circle at 70% 60%, rgba(255, 255, 0, 0.1) 0%, transparent 120px);
    filter: blur(8px);
    z-index: 1;
  }
`;

const HeaderContainer = styled.header`
  position: fixed;
  top: 0;
  right: 0;
  padding: 1rem 2rem;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: 1rem;
`;

const CartIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  
  .count {
    position: absolute;
    top: -5px;
    right: -5px;
    background-color: #ef4444;
    color: white;
    font-size: 0.7rem;
    font-weight: bold;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

const ProfileIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  position: relative;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileMenu = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 50px;
  right: 0;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  width: 200px;
  padding: 0.5rem 0;
  display: ${props => props.$isOpen ? 'block' : 'none'};
  z-index: 101;
  
  &::before {
    content: '';
    position: absolute;
    top: -10px;
    right: 15px;
    width: 0;
    height: 0;
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid white;
  }
`;

const MenuItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: #4B5563;
  font-size: 0.95rem;
  transition: all 0.2s;
  text-decoration: none;
  
  &:hover {
    background-color: rgba(59, 130, 246, 0.1);
    color: #3B82F6;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  color: #4B5563;
  font-size: 0.95rem;
  transition: all 0.2s;
  width: 100%;
  text-align: left;
  border: none;
  background: none;
  cursor: pointer;
  
  &:hover {
    background-color: rgba(239, 68, 68, 0.1);
    color: #EF4444;
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const Hero = styled.div`
  background: linear-gradient(45deg, rgb(248, 6, 171), rgb(255, 174, 0), rgb(73, 255, 12), #3B82F6);
  background-size: 400% 400%;
  animation: ${gradientAnimation} 15s ease infinite;
  padding: 4rem 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  color: white;
  position: relative;
  overflow: hidden;
  width: 100vw;
  box-sizing: border-box;
  left: 0;
  right: 0;
  margin-top: 60px;
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 10%, transparent 10.5%);
    background-size: 20px 20px;
    opacity: 0.3;
  }
  
  &::after {
    background-size: 30px 30px;
    animation: ${float} 10s linear infinite;
  }
  
  .floating-icon {
    position: absolute;
    font-size: 2rem;
    color: rgba(255, 255, 255, 0.8);
    filter: drop-shadow(0 0 10px rgba(255, 255, 255, 0.5));
    
    &.icon1 {
      top: 15%;
      left: 10%;
      animation: ${float} 4s ease-in-out infinite;
    }
    
    &.icon2 {
      top: 30%;
      right: 10%;
      animation: ${float} 6s ease-in-out infinite;
      animation-delay: 1s;
    }
    
    &.icon3 {
      bottom: 20%;
      left: 15%;
      animation: ${float} 5s ease-in-out infinite;
      animation-delay: 2s;
    }
    
    &.icon4 {
      bottom: 15%;
      right: 15%;
      animation: ${float} 7s ease-in-out infinite;
      animation-delay: 0.5s;
    }
  }
`;

const HeroContent = styled.div`
  max-width: 900px;
  z-index: 1;
  position: relative;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  display: inline-block;
  
  background-image: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #ffffff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: ${gradientAnimation} 5s ease infinite;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    color: rgba(255, 255, 255, 0.3);
    filter: blur(8px);
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.5rem;
  margin-bottom: 2rem;
  opacity: 0.9;
  max-width: 700px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  position: relative;
  z-index: 1;
  animation: ${fadeIn} 1s ease-out;
  animation-delay: 0.5s;
  animation-fill-mode: both;
`;

const SearchContainer = styled.div`
  display: flex;
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  position: relative;
  z-index: 2;
  perspective: 500px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border-radius: 9999px;
  
  &::before {
    content: '';
    position: absolute;
    width: calc(100% + 10px);
    height: calc(100% + 10px);
    top: -5px;
    left: -5px;
    background: linear-gradient(90deg, #ff00cc, #3399ff, #33cc33, #ffcc00);
    background-size: 400% 400%;
    border-radius: 9999px;
    z-index: -1;
    animation: ${gradientAnimation} 3s ease infinite;
    opacity: 0.7;
    filter: blur(5px);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 1.2rem 1.5rem;
  font-size: 1.1rem;
  border: none;
  border-radius: 9999px 0 0 9999px;
  outline: none;
  background-color: rgba(255, 255, 255, 0.95);
  color: #333;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: inset 0 0 0 2px rgba(59, 130, 246, 0.5);
    background-color: rgba(255, 255, 255, 1);
  }
  
  &::placeholder {
    color: #94a3b8;
    transition: all 0.3s ease;
    font-weight: 400;
  }
  
  &:focus::placeholder {
    opacity: 0.5;
    transform: translateX(5px);
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  border: none;
  padding: 0 2rem;
  font-size: 1.25rem;
  border-radius: 0 9999px 9999px 0;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  svg {
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
  }
  
  &:hover {
    background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
    
    svg {
      transform: scale(1.2);
    }
  }
  
  &:active {
    transform: scale(0.95);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    z-index: 1;
    transition: all 0.5s ease;
    opacity: 0;
  }
  
  &:hover::before {
    opacity: 1;
    transform: rotate(45deg) translate(10%, 10%);
  }
`;

const HeroShape = styled.div`
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  
  &:nth-child(1) {
    width: 300px;
    height: 300px;
    bottom: -150px;
    right: 10%;
  }
  
  &:nth-child(2) {
    width: 200px;
    height: 200px;
    top: -100px;
    left: 15%;
  }
`;

const SectionWrapper = styled.section`
  width: 100vw;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 0;
  box-sizing: border-box;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: 
      radial-gradient(circle at 20% 25%, rgba(255, 100, 50, 0.05) 0%, transparent 25%),
      radial-gradient(circle at 75% 44%, rgba(100, 200, 255, 0.07) 0%, transparent 30%),
      radial-gradient(circle at 46% 75%, rgba(50, 255, 150, 0.07) 0%, transparent 30%);
    pointer-events: none;
    z-index: 0;
  }
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin: 3rem 0 2rem;
  color: #1E293B;
  width: 100%;
  position: relative;
  z-index: 2;
  
  span {
    background: linear-gradient(to right, rgb(95, 250, 6), #3B82F6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -8px;
      left: 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(to right, rgb(95, 250, 6), #3B82F6);
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.5s ease-out;
    }
  }
  
  &:hover span::after {
    transform: scaleX(1);
    transform-origin: left;
  }
  
  @keyframes titlePulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.03); }
  }
  
  animation: titlePulse 3s ease-in-out infinite;
`;

// Yıldız ve parçacık efektleri için section arka plan animasyonu
const ProductsSectionBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: 1;
`;

// Animasyonlu yıldız
const Star = styled.div<{ $size: number; $top: number; $left: number; $duration: number; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  top: ${props => props.$top}%;
  left: ${props => props.$left}%;
  background-color: rgba(255, 255, 255, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 ${props => props.$size * 2}px ${props => props.$size / 2}px rgba(70, 131, 255, 0.7);
  animation: ${blink} ${props => props.$duration}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  z-index: 1;
`;

// Animasyonlu mermi efekti
const Bullet = styled.div<{ $top: number; $delay: number }>`
  position: absolute;
  width: 3px;
  height: 20px;
  background: linear-gradient(to bottom, transparent, #3B82F6, transparent);
  left: -20px;
  top: ${props => props.$top}%;
  transform: rotate(-45deg);
  animation: ${shooting} 3s linear infinite;
  animation-delay: ${props => props.$delay}s;
  opacity: 0.7;
  z-index: 1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    box-shadow: 0 0 10px 1px rgba(59, 130, 246, 0.8);
  }
`;

const ProductsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 4rem;
  padding: 0 1.5rem;
  width: 100%;
  box-sizing: border-box;
  position: relative;
  z-index: 3;
`;

const ProductCard = styled(motion.div)`
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.5s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-12px) scale(1.02);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.12), 0 10px 10px rgba(0, 0, 0, 0.08);
  }
  
  &::before, &::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 0;
    background: linear-gradient(to bottom, transparent, rgb(255, 128, 0), transparent);
    z-index: 2;
    transition: 0.5s;
  }
  
  &::before {
    left: 0;
    top: 0;
    animation: ${borderFlow} 3s infinite;
    animation-delay: 0.5s;
  }
  
  &::after {
    right: 0;
    bottom: 0;
    animation: ${borderFlowReverse} 3s infinite;
    animation-delay: 1s;
  }
  
  &::before {
    top: 0;
    left: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(to right, transparent, rgb(246, 189, 0), transparent);
    animation: none;
  }
  
  &::after {
    bottom: 0;
    right: 0;
    width: 0;
    height: 3px;
    background: linear-gradient(to left, transparent, #3B82F6, transparent);
    animation: none;
  }
  
  &:hover::before {
    width: 100%;
    left: 0;
    transition: width 0.5s ease;
  }
  
  &:hover::after {
    width: 100%;
    right: 0;
    transition: width 0.5s ease;
  }
  
  &::before, &::after {
    content: "";
    position: absolute;
    top: -150%;
    left: -30%;
    width: 60%;
    height: 200%;
    opacity: 0;
    transform: rotate(30deg);
    background: rgba(255, 255, 255, 0.13);
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.3) 77%,
      rgba(255, 255, 255, 0.3) 92%,
      rgba(255, 255, 255, 0.1) 100%
    );
  }
  
  &:hover::before {
    opacity: 1;
    transition: all 0.8s ease;
    left: 130%;
  }
`;

const VerticalBorder = styled.div`
  position: absolute;
  width: 3px;
  height: 0;
  background: linear-gradient(to bottom, transparent, rgba(59, 130, 246, 0.8), transparent);
  z-index: 2;
  
  &.left {
    left: 0;
    top: 0;
    animation: ${borderFlow} 3s infinite;
  }
  
  &.right {
    right: 0;
    bottom: 0;
    animation: ${borderFlowReverse} 3s infinite;
  }
`;

const ProductImage = styled.div`
  height: 240px;
  background-color: rgba(241, 245, 249, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 10px;
    transition: transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, rgba(234, 12, 167, 0.2) 0%, rgba(255, 10, 177, 0) 50%);
    pointer-events: none;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.5s ease;
    z-index: 1;
  }
  
  ${ProductCard}:hover &::before {
    opacity: 1;
  }
`;

const ProductBadge = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: #EF4444;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  z-index: 1;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: white;
  border: none;
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #64748B;
  transition: all 0.2s;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 1;
  
  &:hover {
    color: #EF4444;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 1.25rem;
  position: relative;
  z-index: 1;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(5px);
`;

const ProductName = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 0.5rem;
`;

const ProductCategory = styled.p`
  font-size: 0.875rem;
  color: #64748B;
  margin-bottom: 0.75rem;
`;

const ProductRating = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  
  svg {
    color: #F59E0B;
    margin-right: 0.25rem;
  }
  
  span {
    font-size: 0.875rem;
    color: #64748B;
    margin-left: 0.5rem;
  }
`;

const ProductFooter = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const ProductPrice = styled.div`
  font-weight: 700;
  color: #1E293B;
  font-size: 1.25rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: linear-gradient(to right, #3B82F6, #60A5FA);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 5px rgba(59, 130, 246, 0.3);
  
  &:hover {
    background: linear-gradient(to right,rgb(92, 255, 22), #3B82F6);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
  }
  
  &:disabled {
    background: #94a3b8;
    color: #e2e8f0;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

const CTASection = styled.div`
  background: linear-gradient(135deg, rgb(55, 255, 0), rgb(255, 0, 255));
  background-size: 400% 400%;
  animation: ${gradientAnimation} 10s ease infinite;
  padding: 4rem 2rem;
  width: 100vw;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle, rgba(255,255,255,0.1) 8%, transparent 8.5%);
    background-size: 25px 25px;
    opacity: 0.3;
    animation: ${float} 15s linear infinite;
  }
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: 
      url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='1.5'/%3E%3Ccircle cx='13' cy='13' r='1.5'/%3E%3C/g%3E%3C/svg%3E");
    z-index: 0;
    animation: ${float} 20s linear infinite reverse;
  }
  
  .cta-particles {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    overflow: hidden;
    z-index: 0;
  }
`;

const CTAContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 1;
`;

const CTAParticle = styled.div<{ $size: number; $x: number; $y: number; $delay: number }>`
  position: absolute;
  width: ${props => props.$size}px;
  height: ${props => props.$size}px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 50%;
  left: ${props => props.$x}%;
  top: ${props => props.$y}%;
  animation: ${bounce} ${props => 2 + props.$delay}s ease-in-out infinite;
  animation-delay: ${props => props.$delay}s;
  filter: blur(1px);
  opacity: 0.6;
`;

const CTATitle = styled(motion.h2)`
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  position: relative;
  text-shadow: 0 0 15px rgba(255, 255, 255, 0.5);
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 0;
    top: 0;
    z-index: -1;
    color: rgba(255, 255, 255, 0.3);
    filter: blur(8px);
  }
`;

const CTADescription = styled(motion.p)`
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  opacity: 0.9;
  position: relative;
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
`;

const CTAButton = styled(Button)`
  font-size: 1.1rem;
  padding: 0.75rem 2rem;
  margin: 0 0.5rem;
  position: relative;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: rgba(255, 255, 255, 0.1);
    transform: rotate(45deg);
    z-index: -1;
    transition: all 0.5s ease;
    opacity: 0;
  }
  
  &:hover::before {
    opacity: 1;
    transform: rotate(45deg) translate(10%, 10%);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
  font-size: 1.5rem;
  color: #3B82F6;
  position: relative;
  
  &::after {
    content: '';
    display: block;
    width: 30px;
    height: 30px;
    margin-left: 10px;
    border: 3px solid rgba(59, 130, 246, 0.3);
    border-radius: 50%;
    border-top-color: #3B82F6;
    animation: ${spin} 1s linear infinite;
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: -20px;
    border-radius: 10px;
    background: radial-gradient(circle at center, rgba(59, 130, 246, 0.1) 0%, transparent 60%);
    z-index: -1;
    opacity: 0.7;
    animation: ${pulse} 2s ease-in-out infinite;
  }
`;

const ErrorContainer = styled.div`
  background-color: rgba(254, 215, 215, 0.8);
  color: #C53030;
  padding: 1.2rem;
  border-radius: 0.5rem;
  margin: 2rem 0;
  text-align: center;
  box-shadow: 0 4px 6px rgba(197, 48, 48, 0.1);
  position: relative;
  overflow: hidden;
  animation: ${shakeX} 0.5s ease-in-out;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 5px;
    background: linear-gradient(to right, #C53030, #FEB2B2);
  }
`;

const EmptyContainer = styled.div`
  text-align: center;
  padding: 3rem 2rem;
  color: #718096;
  position: relative;
  background: rgba(255, 255, 255, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  p {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    opacity: 0.8;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(to right, transparent, #718096, transparent);
    opacity: 0.5;
  }
`;

// Yıldız animasyonu için bileşen
const ShootingStar = styled.div`
  position: absolute;
  width: 4px;
  height: 4px;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 0 10px 2px rgba(255, 255, 255, 0.7),
              0 0 20px 5px rgba(0, 191, 255, 0.5),
              0 0 30px 7px rgba(0, 127, 255, 0.3);
  opacity: 0;
  z-index: 2;
  
  &.star1 {
    top: 15%;
    left: 10%;
    animation: ${shooting} 5s linear infinite;
    animation-delay: 0s;
  }
  
  &.star2 {
    top: 5%;
    left: 30%;
    animation: ${shooting} 7s linear infinite;
    animation-delay: 2s;
  }
  
  &.star3 {
    top: 25%;
    left: 50%;
    animation: ${shooting} 6s linear infinite;
    animation-delay: 4s;
  }
  
  &.star4 {
    top: 10%;
    left: 70%;
    animation: ${shooting} 8s linear infinite;
    animation-delay: 1s;
  }
  
  &.star5 {
    top: 20%;
    left: 85%;
    animation: ${shooting} 5.5s linear infinite;
    animation-delay: 3s;
  }
`;

const Particle = styled.div`
  position: absolute;
  width: 3px;
  height: 3px;
  background-color: white;
  border-radius: 50%;
  filter: blur(1px);
  opacity: 0;
  z-index: 1;
  
  &.p1 {
    top: 10%;
    left: 20%;
    animation: ${glitter} 3s ease-in-out infinite;
    animation-delay: 0.3s;
  }
  
  &.p2 {
    top: 30%;
    left: 80%;
    animation: ${glitter} 4s ease-in-out infinite;
    animation-delay: 1.5s;
  }
  
  &.p3 {
    top: 60%;
    left: 40%;
    animation: ${glitter} 5s ease-in-out infinite;
    animation-delay: 0.7s;
  }
  
  &.p4 {
    top: 80%;
    left: 10%;
    animation: ${glitter} 3.5s ease-in-out infinite;
    animation-delay: 2s;
  }
  
  &.p5 {
    top: 40%;
    left: 60%;
    animation: ${glitter} 4.5s ease-in-out infinite;
    animation-delay: 1s;
  }
`;

// StockBadge bileşenini ekleyelim
const StockBadge = styled.div<{ $inStock: boolean }>`
  position: absolute;
  top: 0.75rem;
  left: 0.75rem;
  background-color: ${props => props.$inStock ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  z-index: 2;
`;

// HomePage bileşeninin dışında bir yardımcı fonksiyon tanımlayalım
const getCategoryFromProduct = (product: ProductResponse): string => {
  // Description'dan kategori çıkarma
  // Genellikle açıklamanın başında "Kategori: X" şeklinde olur
  const description = product.description || '';
  
  // Kategori: yazısını arayalım
  const categoryMatch = description.match(/kategori:?\s*([^.,\n]+)/i);
  if (categoryMatch && categoryMatch[1]) {
    return categoryMatch[1].trim();
  }
  
  // Eğer kategori: etiketi yoksa, açıklamadan akıllı tahmin yapalım
  if (description.toLowerCase().includes('telefon') || 
      description.toLowerCase().includes('iphone') ||
      description.toLowerCase().includes('airpods')) {
    return 'Elektronik';
  } else if (description.toLowerCase().includes('mutfak') || 
            description.toLowerCase().includes('fincan') ||
            description.toLowerCase().includes('bardak')) {
    return 'Mutfak Eşyaları';
  }
  
  // Son çare olarak ürün adına bakalım
  if (product.name.toLowerCase().includes('iphone') || 
      product.name.toLowerCase().includes('airpods') ||
      product.name.toLowerCase().includes('pro')) {
    return 'Elektronik';
  } else if (product.name.toLowerCase().includes('fincan') || 
            product.name.toLowerCase().includes('bardak')) {
    return 'Mutfak Eşyaları';
  }
  
  // Hiçbir şey bulamazsak genel bir kategori
  return 'Genel';
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [favoriteProducts, setFavoriteProducts] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Kullanıcı giriş durumunu kontrol et
  useEffect(() => {
    setIsLoggedIn(!!user);
  }, [user]);

  // Gerçek ürünleri yükle
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await productService.getAllProducts();

        // Ekstra kategori bilgisi olmadan ürünleri kaydedelim
        setProducts(data);
        setError(null);
      } catch (err: any) {
        console.error('Ürünler alınırken hata:', err);
        setError('Ürünler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Sepetteki ürün sayısını güncelle
  useEffect(() => {
    const count = cartService.getCartItemCount();
    setCartItemCount(count);
  }, []);

  const toggleFavorite = (productId: number) => {
    if (favoriteProducts.includes(productId)) {
      setFavoriteProducts(favoriteProducts.filter(id => id !== productId));
    } else {
      setFavoriteProducts([...favoriteProducts, productId]);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    authService.logout();
    setIsLoggedIn(false);
    setIsMenuOpen(false);
    navigate('/login');
  };

  // Sepete ürün ekle
  const handleAddToCart = async (product: ProductResponse) => {
    if (product.stockQuantity <= 0) {
      toast.error('Bu ürün tükenmiştir!');
      return;
    }
    
    try {
      await cartService.addToCart({
        productId: product.id,
        quantity: 1,
        product: product
      });
      
      // Sepet sayısını güncelle
      const newCount = cartService.getCartItemCount();
      setCartItemCount(newCount);
      
      toast.success(`${product.name} sepete eklendi!`);
    } catch (err) {
      console.error('Sepete eklenirken hata:', err);
      toast.error('Ürün sepete eklenemedi');
    }
  };

  // Sepet sayfasına git
  const goToCart = () => {
    navigate('/cart');
  };

  // Ürünler sayfasına git
  const goToProducts = () => {
    navigate('/products');
  };

  // Menüyü dışarı tıklandığında kapat
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isMenuOpen && !target.closest('#profile-menu') && !target.closest('#profile-icon')) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const formatCurrency = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 2
    }).format(price);
  };

  // Arama işlevi ekle
  const filteredProducts = searchTerm.trim() 
    ? products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : products;

  return (
    <PageContainer>
      <ShootingStar className="star1" />
      <ShootingStar className="star2" />
      <ShootingStar className="star3" />
      <ShootingStar className="star4" />
      <ShootingStar className="star5" />
      <Particle className="p1" />
      <Particle className="p2" />
      <Particle className="p3" />
      <Particle className="p4" />
      <Particle className="p5" />
      
      <HeaderContainer>
        <CartIcon onClick={goToCart}>
          <FaShoppingCart color="#3B82F6" />
          {cartItemCount > 0 && <div className="count">{cartItemCount}</div>}
        </CartIcon>
        <ProfileIcon id="profile-icon" onClick={toggleMenu}>
          <FaUser color="#3B82F6" />
        </ProfileIcon>
        <ProfileMenu id="profile-menu" $isOpen={isMenuOpen}>
          {isLoggedIn ? (
            <>
              <MenuItem to="/profile">
                <FaUserCog /> Profil Yönetimi
              </MenuItem>
              <MenuItem to="/admin/dashboard">
                <FaTachometerAlt /> Admin Paneline Git
              </MenuItem>
              <LogoutButton onClick={handleLogout}>
                <FaSignOutAlt /> Çıkış Yap
              </LogoutButton>
            </>
          ) : (
            <>
              <MenuItem to="/login">
                <FaUser /> Giriş Yap
              </MenuItem>
              <MenuItem to="/register">
                <FaUserCog /> Kayıt Ol
              </MenuItem>
            </>
          )}
        </ProfileMenu>
      </HeaderContainer>

      <Hero>
        <HeroShape />
        <HeroShape />
        <FaFire className="floating-icon icon1" />
        <FaMagic className="floating-icon icon2" />
        <FaGem className="floating-icon icon3" />
        <FaStar className="floating-icon icon4" />
        <HeroContent>
          <HeroTitle data-text="Güvenli E-Ticaret Platformu">Güvenli E-Ticaret Platformu</HeroTitle>
          <HeroSubtitle>
            En kaliteli ürünler, güvenli alışveriş deneyimi ve hızlı teslimat ile ihtiyacınız olan her şey burada.
          </HeroSubtitle>
          <SearchContainer>
            <SearchInput 
              type="text" 
              placeholder="Ürün ara..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <SearchButton type="button">
              <FaSearch />
            </SearchButton>
          </SearchContainer>
        </HeroContent>
      </Hero>

      <SectionWrapper>
        <SectionTitle>Tüm <span>Ürünlerimiz</span></SectionTitle>
        
        <ProductsSectionBackground>
          {Array.from({ length: 12 }).map((_, i) => (
            <Star
              key={`star-${i}`}
              $size={Math.random() * 3 + 1}
              $top={Math.random() * 100}
              $left={Math.random() * 100}
              $duration={Math.random() * 3 + 2}
              $delay={Math.random() * 3}
            />
          ))}
          {Array.from({ length: 8 }).map((_, i) => (
            <Bullet
              key={`bullet-${i}`}
              $top={Math.random() * 100}
              $delay={Math.random() * 5}
            />
          ))}
        </ProductsSectionBackground>
        
        {loading ? (
          <LoadingContainer>Ürünler yükleniyor...</LoadingContainer>
        ) : error ? (
          <ErrorContainer>{error}</ErrorContainer>
        ) : filteredProducts.length === 0 ? (
          <EmptyContainer>
            <p>"{searchTerm}" ile eşleşen ürün bulunamadı.</p>
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                style={{
                  padding: '0.5rem 1rem',
                  background: '#3B82F6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.5rem',
                  marginTop: '1rem',
                  cursor: 'pointer'
                }}
              >
                Aramayı Temizle
              </button>
            )}
          </EmptyContainer>
        ) : (
          <ProductsContainer>
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 20px 30px rgba(0, 0, 0, 0.15)"
                }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(`/products/${product.id}`)}
              >
                <VerticalBorder className="left" />
                <VerticalBorder className="right" />
                <ProductImage>
                  <img 
                    src={product.imageUrl || 'https://via.placeholder.com/300x200?text=Ürün+Görseli'} 
                    alt={product.name} 
                  />
                  <StockBadge $inStock={product.stockQuantity > 0}>
                    {product.stockQuantity > 0 ? 'Stokta' : 'Tükendi'}
                  </StockBadge>
                  <FavoriteButton onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(product.id);
                  }}>
                    {favoriteProducts.includes(product.id) ? <FaHeart color="#EF4444" /> : <FaRegHeart />}
                  </FavoriteButton>
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductCategory>
                    {getCategoryFromProduct(product)}
                  </ProductCategory>
                  <ProductRating>
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} size={14} color={i < 4 ? '#F59E0B' : '#E2E8F0'} />
                    ))}
                    <span>4.0 (12 değerlendirme)</span>
                  </ProductRating>
                  <ProductFooter>
                    <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                    <AddToCartButton onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    disabled={product.stockQuantity <= 0}
                    >
                      <FaShoppingCart /> Sepete Ekle
                    </AddToCartButton>
                  </ProductFooter>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductsContainer>
        )}
      </SectionWrapper>

      <CTASection>
        <div className="cta-particles">
          {Array.from({ length: 15 }).map((_, i) => (
            <CTAParticle 
              key={`particle-${i}`}
              $size={Math.random() * 5 + 2}
              $x={Math.random() * 100}
              $y={Math.random() * 100}
              $delay={Math.random() * 2}
            />
          ))}
        </div>
        <CTAContainer>
          <CTATitle 
            data-text="Hemen Üye Olun, Fırsatları Kaçırmayın!"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Hemen Üye Olun, Fırsatları Kaçırmayın!
          </CTATitle>
          <CTADescription
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Özel indirimler, kampanyalar ve yeni ürün bilgileri için üye olun.
          </CTADescription>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <CTAButton as={Link} to="/register" variant="primary">
              Üye Ol
            </CTAButton>
            <CTAButton as={Link} to="/login" variant="outline">
              Giriş Yap
            </CTAButton>
          </motion.div>
        </CTAContainer>
      </CTASection>
    </PageContainer>
  );
};

export default HomePage; 