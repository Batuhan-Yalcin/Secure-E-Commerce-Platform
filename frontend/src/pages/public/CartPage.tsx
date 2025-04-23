import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes, css } from 'styled-components';
import { FaShoppingCart, FaTrash, FaPlus, FaMinus, FaArrowLeft, FaExclamationCircle, FaSpinner, FaGift, FaHeart } from 'react-icons/fa';
import cartService from '../../services/cartService';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import { Cart, CartItem, ProductResponse } from '../../types';
import { toast } from 'react-toastify';

// Zenginleştirilmiş Animasyonlar
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(30px); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.05); }
  100% { transform: scale(1); }
`;

const shimmer = keyframes`
  0% { background-position: -468px 0; }
  100% { background-position: 468px 0; }
`;

const rotate = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const bounce = keyframes`
  0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-10px); }
`;

// Genel konteynır stilini iyileştirme
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  background-image: linear-gradient(to bottom, #f9fafb, #f3f4f6);
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: white;
  padding: 1.5rem;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  animation: ${fadeIn} 0.5s ease;
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 3px;
    background: linear-gradient(to right, #3b82f6, #60a5fa, #93c5fd);
  }
`;

const Title = styled.h1`
  font-size: 2.25rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  svg {
    color: #3b82f6;
    animation: ${pulse} 2s infinite ease-in-out;
  }
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  background: none;
  color: #3b82f6;
  border: 1px solid #3b82f6;
  border-radius: 0.5rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  position: relative;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(to right, rgba(59, 130, 246, 0.1), rgba(59, 130, 246, 0.2));
    transition: all 0.3s ease;
    z-index: -1;
  }
  
  &:hover {
    color: #2563eb;
    border-color: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.3);
    
    &::before {
      left: 0;
    }
    
    svg {
      transform: translateX(-3px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const CartContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 350px;
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CartItemsContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  overflow: hidden;
  animation: ${fadeIn} 0.5s ease;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const CartSummaryContainer = styled.div`
  background: white;
  border-radius: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  padding: 1.75rem;
  height: fit-content;
  position: sticky;
  top: 2rem;
  animation: ${fadeIn} 0.7s ease;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(to right, #3b82f6, #60a5fa);
    border-top-left-radius: 0.75rem;
    border-top-right-radius: 0.75rem;
  }
`;

const CartItemList = styled.div`
  display: flex;
  flex-direction: column;
`;

const CartItemCard = styled.div`
  padding: 1.75rem;
  display: grid;
  grid-template-columns: 100px 1fr auto;
  gap: 1.75rem;
  border-bottom: 1px solid #e2e8f0;
  animation: ${slideIn} 0.5s ease;
  transition: all 0.3s ease;
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: #f8fafc;
    transform: translateY(-2px);
  }
  
  @media (max-width: 640px) {
    grid-template-columns: 80px 1fr;
    gap: 1rem;
  }
`;

const ProductImage = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 0.75rem;
  overflow: hidden;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover {
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
    
    img {
      transform: scale(1.1);
    }
  }
  
  @media (max-width: 640px) {
    width: 80px;
    height: 80px;
  }
`;

const ProductInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 0.5rem 0;
`;

const ProductName = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  transition: color 0.3s ease;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  
  &:hover {
    color: #3b82f6;
  }
`;

const ProductPrice = styled.div`
  font-size: 1.125rem;
  color: #64748b;
  font-weight: 500;
  position: relative;
  display: inline-block;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -4px;
    left: 0;
    width: 0;
    height: 2px;
    background-color: #3b82f6;
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const CartItemActions = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 1.25rem;
  
  @media (max-width: 640px) {
    grid-column: 1 / -1;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  gap: 0.875rem;
  background: linear-gradient(to bottom, #f0f9ff, #e0f2fe);
  padding: 0.75rem 1rem;
  border-radius: 1.5rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15), inset 0 1px 2px rgba(255, 255, 255, 0.5);
  transition: all 0.3s ease;
  border: 1px solid rgba(186, 230, 253, 0.7);
  
  &:hover {
    background: linear-gradient(to bottom, #e0f2fe, #bae6fd);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), inset 0 1px 3px rgba(255, 255, 255, 0.5);
    transform: translateY(-2px);
  }
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3rem;
  height: 3rem;
  border-radius: 50%;
  background: linear-gradient(to bottom, #ffffff, #f9fafb);
  border: 2px solid #3b82f6;
  color: #3b82f6;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  z-index: 1;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(to bottom, #3b82f6, #2563eb);
    opacity: 0;
    transition: opacity 0.3s ease;
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
    pointer-events: none;
    transform: scale(0.5);
  }
  
  svg {
    font-size: 1.5rem;
    font-weight: bold;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    transition: all 0.3s ease;
    stroke-width: 1;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-3px);
    box-shadow: 0 6px 12px rgba(59, 130, 246, 0.3);
    color: white;
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      opacity: 1;
      animation: shimmerEffect 1.5s infinite;
    }
    
    svg {
      transform: scale(1.3);
      filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
    }
  }
  
  @keyframes shimmerEffect {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #cbd5e1;
    color: #cbd5e1;
    box-shadow: none;
  }
`;

const QuantityText = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  min-width: 3rem;
  text-align: center;
  color: #1e293b;
  padding: 0 0.5rem;
  background: linear-gradient(to bottom, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`;

const RemoveButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  border: none;
  background: none;
  color: #ef4444;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 0.5rem;
  
  &:hover {
    background-color: #fee2e2;
    color: #dc2626;
    
    svg {
      animation: ${rotate} 0.5s ease;
    }
  }
  
  svg {
    transition: all 0.3s;
  }
`;

const ItemTotal = styled.div`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
`;

const SummaryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1.75rem 0;
  text-align: center;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -0.75rem;
    left: 50%;
    transform: translateX(-50%);
    width: 50px;
    height: 3px;
    background: linear-gradient(to right, #3b82f6, #60a5fa);
    border-radius: 3px;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  font-size: 1.125rem;
  color: #64748b;
  padding: 0.75rem 0;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateX(5px);
    color: #475569;
  }
  
  span:last-child {
    font-weight: 600;
  }
`;

const SummaryItemIcon = styled.span`
  margin-right: 0.5rem;
  color: #60a5fa;
`;

const SummaryTotal = styled.div`
  display: flex;
  justify-content: space-between;
  padding-top: 1.25rem;
  margin-top: 1.25rem;
  border-top: 2px dashed #e2e8f0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
  animation: ${pulse} 2s infinite ease-in-out;
  
  span:last-child {
    background: linear-gradient(to right, #3b82f6, #2563eb);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
`;

const Divider = styled.hr`
  border: none;
  border-top: 1px solid #e2e8f0;
  margin: 1.5rem 0;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }
`;

const CheckoutButton = styled.button<{ $isDisabled?: boolean }>`
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  margin-top: 2rem;
  background-color: ${props => props.$isDisabled ? '#9ca3af' : '#3b82f6'};
  background-image: ${props => !props.$isDisabled ? 'linear-gradient(to right, #3b82f6, #2563eb)' : 'none'};
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 700;
  font-size: 1.125rem;
  cursor: ${props => props.$isDisabled ? 'not-allowed' : 'pointer'};
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
  box-shadow: ${props => props.$isDisabled ? 'none' : '0 4px 6px -1px rgba(59, 130, 246, 0.5)'};
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(255, 255, 255, 0),
      rgba(255, 255, 255, 0.3),
      rgba(255, 255, 255, 0)
    );
    transition: all 0.8s ease;
  }
  
  &:hover:not([disabled]) {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5);
    
    &::before {
      left: 100%;
    }
  }
`;

const EmptyCartContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 70vh;
  text-align: center;
`;

const EmptyCartMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
  max-width: 500px;
  animation: ${fadeIn} 0.7s ease;
  padding: 3rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
`;

const EmptyCartIcon = styled.div`
  font-size: 5rem;
  color: #3b82f6;
  margin-bottom: 1rem;
  animation: ${bounce} 2s ease infinite;
  background: linear-gradient(45deg, #3b82f6, #60a5fa);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const EmptyCartText = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
  background: linear-gradient(to right, #1e293b, #475569);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const EmptyCartSubtext = styled.p`
  font-size: 1.125rem;
  color: #64748b;
  margin: 0 0 2rem 0;
  line-height: 1.6;
`;

const ContinueShoppingButton = styled.button`
  padding: 0.875rem 1.75rem;
  background: linear-gradient(to right, #3b82f6, #2563eb);
  color: white;
  border: none;
  border-radius: 0.75rem;
  font-weight: 600;
  font-size: 1.125rem;
  cursor: pointer;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.5);
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 15px -3px rgba(59, 130, 246, 0.5);
    
    svg {
      transform: translateX(-5px);
    }
  }
  
  svg {
    transition: transform 0.3s ease;
  }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: ${fadeIn} 0.3s ease;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  background-color: white;
  border-radius: 1rem;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  gap: 1.5rem;
  max-width: 400px;
  width: 90%;
`;

const LoadingSpinner = styled.div`
  font-size: 3rem;
  color: #3b82f6;
  animation: spin 1.5s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.div`
  font-size: 1.25rem;
  color: #1e293b;
  font-weight: 600;
  text-align: center;
`;

const SuccessMessage = styled.div`
  text-align: center;
  padding: 2rem;
  background-color: #f0fdf4;
  border-radius: 0.75rem;
  border: 1px solid #bbf7d0;
  color: #16a34a;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 4px 6px -1px rgba(22, 163, 74, 0.1);
  
  svg {
    font-size: 2rem;
    margin-bottom: 1rem;
    animation: ${bounce} 1s ease;
  }
`;

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 2rem;
  background-color: #fef2f2;
  border-radius: 0.75rem;
  border: 1px solid #f87171;
  color: #ef4444;
  font-size: 1rem;
  font-weight: 500;
  margin: 2rem auto;
  max-width: 500px;
  animation: ${fadeIn} 0.5s ease;
  box-shadow: 0 4px 6px -1px rgba(239, 68, 68, 0.1);
  
  svg {
    font-size: 3rem;
    animation: ${pulse} 2s infinite;
  }
`;

// Yeni bileşenler
const ClearCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1.25rem;
  background: none;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s;
  margin-left: 1rem;
  
  &:hover {
    background-color: #fee2e2;
    transform: translateY(-2px);
    
    svg {
      animation: ${rotate} 0.5s ease;
    }
  }
`;

const CartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 1.75rem;
  border-bottom: 1px solid #e2e8f0;
`;

const CartHeaderTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const CartHeaderActions = styled.div`
  display: flex;
  align-items: center;
`;

const ProductBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: linear-gradient(to right, #f43f5e, #e11d48);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  animation: ${pulse} 2s infinite;
`;

const ProductImageWrapper = styled.div`
  position: relative;
`;

const CartPage: React.FC = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState<Cart>({ items: [] });
  const [products, setProducts] = useState<Map<number, ProductResponse>>(new Map());
  const [loading, setLoading] = useState<boolean>(true);
  const [checkoutLoading, setCheckoutLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Sepeti ve ürün detaylarını yükle
  useEffect(() => {
    const loadCart = async () => {
      try {
        setLoading(true);
        
        // Sepeti getir
        const cartData = cartService.getCart();
        setCart(cartData);
        
        // Eğer sepet boşsa, yükleme durumunu kapat
        if (cartData.items.length === 0) {
          setLoading(false);
          return;
        }
        
        // Sepetteki her ürün için detayları getir
        const productMap = new Map<number, ProductResponse>();
        const productPromises = cartData.items.map(async (item) => {
          try {
            const product = await productService.getProductById(item.productId);
            productMap.set(item.productId, product);
          } catch (err) {
            console.error(`Ürün detayları yüklenemedi: ID: ${item.productId}`, err);
          }
        });
        
        await Promise.all(productPromises);
        setProducts(productMap);
        setError(null);
      } catch (err) {
        console.error('Sepet yüklenirken hata oluştu:', err);
        setError('Sepet yüklenirken bir hata oluştu. Lütfen tekrar deneyin.');
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, []);
  
  // Ürün miktarını güncelle
  const handleUpdateQuantity = (productId: number, quantity: number) => {
    try {
      // Miktarı güncelle
      const updatedCart = cartService.updateCartItemQuantity(productId, quantity);
      
      // State'i güncelle
      setCart(updatedCart);
    } catch (err) {
      console.error('Miktar güncellenirken hata oluştu:', err);
      toast.error('Miktar güncellenirken bir hata oluştu.');
    }
  };
  
  // Ürünü sepetten kaldır
  const handleRemoveItem = (productId: number) => {
    try {
      // Ürünü sepetten kaldır
      const updatedCart = cartService.removeFromCart(productId);
      
      // State'i güncelle
      setCart(updatedCart);
      
      toast.success('Ürün sepetten kaldırıldı');
    } catch (err) {
      console.error('Ürün kaldırılırken hata oluştu:', err);
      toast.error('Ürün kaldırılırken bir hata oluştu.');
    }
  };
  
  // Sepeti temizle
  const handleClearCart = () => {
    try {
      // Sepeti temizle
      const emptyCart = cartService.clearCart();
      
      // State'i güncelle
      setCart(emptyCart);
      
      toast.success('Sepet temizlendi');
    } catch (err) {
      console.error('Sepet temizlenirken hata oluştu:', err);
      toast.error('Sepet temizlenirken bir hata oluştu.');
    }
  };
  
  // Sipariş oluştur
  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      
      // Sepeti sipariş isteğine dönüştür
      const orderRequest = cartService.convertCartToOrderRequest();
      
      console.log('Sipariş isteği:', JSON.stringify(orderRequest));
      
      // Sepetteki ürünleri kontrol et - içi boş olmamalı
      if (orderRequest.orderItems.length === 0) {
        toast.error('Sepetiniz boş veya geçersiz ürünler içeriyor.');
        return;
      }
      
      // Sipariş oluştur
      const order = await orderService.createOrder(orderRequest);
      console.log('Oluşturulan sipariş:', order);
      
      // Sepeti temizle
      cartService.clearCart();
      setCart({ items: [] });
      
      // Başarı mesajı
      toast.success('Siparişiniz başarıyla oluşturuldu!');
      
      // Anasayfaya yönlendir
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err: any) {
      console.error('Sipariş oluşturulurken hata oluştu:', err);
      console.error('Hata detayları:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message
      });
      
      // Hata mesajı
      if (err.response?.status === 401) {
        toast.error('Sipariş vermek için giriş yapmalısınız. Giriş sayfasına yönlendiriliyorsunuz...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else if (err.response?.data?.message) {
        toast.error(`Hata: ${err.response.data.message}`);
      } else {
        toast.error(`Sipariş oluşturulurken bir hata oluştu: ${err.message}`);
      }
    } finally {
      setCheckoutLoading(false);
    }
  };
  
  // Toplam tutarı hesapla
  const calculateTotal = () => {
    return cart.items.reduce((total, item) => {
      const product = products.get(item.productId);
      const price = product ? product.price : 0;
      return total + (price * item.quantity);
    }, 0);
  };
  
  // Yükleme durumu
  if (loading) {
    return (
      <PageContainer>
        <LoadingContainer>
          <LoadingSpinner>
            <FaSpinner />
          </LoadingSpinner>
          <LoadingText>Sepetiniz yükleniyor...</LoadingText>
        </LoadingContainer>
      </PageContainer>
    );
  }
  
  // Hata durumu
  if (error) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>
            <FaShoppingCart /> Sepetim
          </Title>
          <BackButton onClick={() => navigate('/')}>
            <FaArrowLeft /> Alışverişe Devam Et
          </BackButton>
        </PageHeader>
        
        <ErrorContainer>
          <FaExclamationCircle />
          <span>{error}</span>
          <ContinueShoppingButton onClick={() => navigate('/')}>
            <FaArrowLeft /> Alışverişe Devam Et
          </ContinueShoppingButton>
        </ErrorContainer>
      </PageContainer>
    );
  }
  
  // Sepet boş
  if (cart.items.length === 0) {
    return (
      <PageContainer>
        <PageHeader>
          <Title>
            <FaShoppingCart /> Sepetim
          </Title>
          <BackButton onClick={() => navigate('/')}>
            <FaArrowLeft /> Alışverişe Devam Et
          </BackButton>
        </PageHeader>
        
        <EmptyCartContainer>
          <EmptyCartMessage>
            <EmptyCartIcon>
              <FaShoppingCart />
            </EmptyCartIcon>
            <EmptyCartText>Sepetiniz Boş</EmptyCartText>
            <EmptyCartSubtext>
              Sepetinize ürün eklemek için alışverişe devam edin. Keşfedeceğiniz harika ürünler sizi bekliyor!
            </EmptyCartSubtext>
            <ContinueShoppingButton onClick={() => navigate('/')}>
              <FaArrowLeft /> Alışverişe Devam Et
            </ContinueShoppingButton>
          </EmptyCartMessage>
        </EmptyCartContainer>
      </PageContainer>
    );
  }
  
  // Sepet dolu durumu
  return (
    <PageContainer>
      <PageHeader>
        <Title>
          <FaShoppingCart /> Sepetim
        </Title>
        <BackButton onClick={() => navigate('/')}>
          <FaArrowLeft /> Alışverişe Devam Et
        </BackButton>
      </PageHeader>
      
      <CartContainer>
        <CartItemsContainer>
          <CartHeader>
            <CartHeaderTitle>
              <FaShoppingCart /> Ürünler ({cart.items.length})
            </CartHeaderTitle>
            <CartHeaderActions>
              <ClearCartButton onClick={handleClearCart}>
                <FaTrash /> Sepeti Temizle
              </ClearCartButton>
            </CartHeaderActions>
          </CartHeader>
          <CartItemList>
            {cart.items.map((item) => {
              const product = products.get(item.productId);
              
              if (!product) {
                return null;
              }
              
              return (
                <CartItemCard key={item.productId}>
                  <ProductImageWrapper>
                    <ProductImage>
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <FaShoppingCart size={36} color="#3b82f6" />
                      )}
                    </ProductImage>
                    <ProductBadge>{item.quantity}</ProductBadge>
                  </ProductImageWrapper>
                  <ProductInfo>
                    <ProductName>{product.name}</ProductName>
                    <ProductPrice>{product.price?.toFixed(2)} TL</ProductPrice>
                  </ProductInfo>
                  <CartItemActions>
                    <QuantityControl>
                      <QuantityButton 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        title="Azalt"
                      >
                        <FaMinus size={20} />
                      </QuantityButton>
                      <QuantityText>{item.quantity}</QuantityText>
                      <QuantityButton 
                        onClick={() => handleUpdateQuantity(item.productId, item.quantity + 1)}
                        disabled={item.quantity >= (product?.stockQuantity || 0)}
                        title="Artır"
                      >
                        <FaPlus size={20} />
                      </QuantityButton>
                    </QuantityControl>
                    <ItemTotal>{(product.price * item.quantity).toFixed(2)} TL</ItemTotal>
                    <RemoveButton onClick={() => handleRemoveItem(item.productId)}>
                      <FaTrash /> Kaldır
                    </RemoveButton>
                  </CartItemActions>
                </CartItemCard>
              );
            })}
          </CartItemList>
        </CartItemsContainer>
        
        <CartSummaryContainer>
          <SummaryTitle>Sipariş Özeti</SummaryTitle>
          <SummaryItem>
            <span><SummaryItemIcon><FaShoppingCart /></SummaryItemIcon>Ara Toplam</span>
            <span>{calculateTotal().toFixed(2)} TL</span>
          </SummaryItem>
          <SummaryItem>
            <span><SummaryItemIcon><FaGift /></SummaryItemIcon>Kargo</span>
            <span>Ücretsiz</span>
          </SummaryItem>
          <SummaryTotal>
            <span>Toplam</span>
            <span>{calculateTotal().toFixed(2)} TL</span>
          </SummaryTotal>
          <CheckoutButton 
            onClick={handleCheckout}
            disabled={checkoutLoading}
          >
            {checkoutLoading ? (
              <>
                <FaSpinner style={{ marginRight: '0.5rem' }} /> İşleniyor...
              </>
            ) : (
              'Satın Al'
            )}
          </CheckoutButton>
        </CartSummaryContainer>
      </CartContainer>
      
      {checkoutLoading && (
        <LoadingOverlay>
          <LoadingContainer>
            <LoadingSpinner>
              <FaSpinner />
            </LoadingSpinner>
            <LoadingText>Siparişiniz işleniyor...</LoadingText>
          </LoadingContainer>
        </LoadingOverlay>
      )}
    </PageContainer>
  );
};

export default CartPage; 