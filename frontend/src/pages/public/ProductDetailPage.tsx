import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaArrowLeft, FaSpinner, FaExclamationCircle, FaShoppingCart, FaStar } from 'react-icons/fa';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
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

// Stil bileşenleri
const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.5s ease;
`;

const BackButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: none;
  border: none;
  color: #3b82f6;
  font-weight: 500;
  cursor: pointer;
  margin-bottom: 1rem;
  padding: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const ProductContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  margin-top: 1rem;
  background: white;
  border-radius: 1rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProductImageContainer = styled.div`
  position: relative;
  overflow: hidden;
  border-radius: 0.5rem;
  height: 500px;
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

const ProductImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
  
  &:hover {
    transform: scale(1.05);
  }
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 4rem;
`;

const ProductDetails = styled.div`
  padding: 2rem;
  display: flex;
  flex-direction: column;
`;

const ProductName = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 1rem 0;
`;

const ProductPrice = styled.div`
  font-size: 1.75rem;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 1.5rem;
`;

const ProductDescription = styled.p`
  font-size: 1rem;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const StockInfo = styled.div<{ $inStock: boolean }>`
  display: inline-block;
  padding: 0.5rem 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  background-color: ${props => props.$inStock ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$inStock ? '#16a34a' : '#dc2626'};
`;

const AddToCartContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: auto;
`;

const QuantityControl = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.5rem;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  border: none;
  font-size: 1rem;
  font-weight: bold;
  color: #3b82f6;
  cursor: pointer;
  
  &:hover {
    background: #e2e8f0;
  }
  
  &:disabled {
    color: #9ca3af;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.input`
  width: 3rem;
  height: 2.5rem;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: center;
  font-size: 1rem;
  color: #1e293b;
  
  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  
  &:focus {
    outline: none;
  }
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  flex: 1;
  justify-content: center;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 1.25rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 1.5rem;
  color: #6b7280;
`;

const ErrorContainer = styled.div`
  padding: 2rem;
  margin: 2rem auto;
  max-width: 600px;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  text-align: center;
`;

const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  
  // Ürün verilerini yükle
  useEffect(() => {
    if (id) {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const productId = parseInt(id);
          
          // ID geçerli bir sayı değilse (NaN), hata göster
          if (isNaN(productId)) {
            setError('Geçersiz ürün ID');
            setLoading(false);
            return;
          }
          
          const response = await productService.getProductById(productId);
          setProduct(response);
          setError(null);
        } catch (err: any) {
          console.error('Ürün detayları alınırken hata:', err);
          setError(err.response?.data?.message || 'Ürün detayları alınamadı');
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id]);
  
  // Miktar değişimi
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value > 0) {
      if (product && value <= product.stockQuantity) {
        setQuantity(value);
      } else if (product) {
        setQuantity(product.stockQuantity);
      }
    }
  };
  
  // Miktar artırma
  const increaseQuantity = () => {
    if (product && quantity < product.stockQuantity) {
      setQuantity(prev => prev + 1);
    }
  };
  
  // Miktar azaltma
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Sepete ekle
  const addToCart = () => {
    if (product) {
      try {
        cartService.addToCart(product, quantity);
        toast.success(`${product.name} sepete eklendi!`);
      } catch (err) {
        toast.error('Ürün sepete eklenirken bir hata oluştu.');
      }
    }
  };
  
  // Ürünler sayfasına geri dön
  const goBack = () => {
    navigate('/products');
  };
  
  // Sepet sayfasına git
  const goToCart = () => {
    navigate('/cart');
  };
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };
  
  // Yükleniyor
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner /> Ürün bilgileri yükleniyor...
      </LoadingContainer>
    );
  }
  
  // Hata
  if (error) {
    return (
      <ErrorContainer>
        <FaExclamationCircle style={{ fontSize: '3rem' }} />
        <h2>Bir hata oluştu</h2>
        <p>{error}</p>
        <button 
          onClick={goBack} 
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem', 
            cursor: 'pointer' 
          }}
        >
          Ürünlere Dön
        </button>
      </ErrorContainer>
    );
  }
  
  // Ürün bulunamadı
  if (!product) {
    return (
      <ErrorContainer>
        <FaExclamationCircle style={{ fontSize: '3rem' }} />
        <h2>Ürün Bulunamadı</h2>
        <p>Aradığınız ürün bulunamadı veya kaldırılmış olabilir.</p>
        <button 
          onClick={goBack} 
          style={{ 
            marginTop: '1rem', 
            padding: '0.5rem 1rem', 
            background: '#3b82f6', 
            color: 'white', 
            border: 'none', 
            borderRadius: '0.375rem', 
            cursor: 'pointer' 
          }}
        >
          Ürünlere Dön
        </button>
      </ErrorContainer>
    );
  }
  
  return (
    <PageContainer>
      <BackButton onClick={goBack}>
        <FaArrowLeft /> Ürünlere Dön
      </BackButton>
      
      <ProductContainer>
        <ProductImageContainer>
          {product.imageUrl ? (
            <ProductImage src={product.imageUrl} alt={product.name} />
          ) : (
            <ImagePlaceholder>🖼️</ImagePlaceholder>
          )}
        </ProductImageContainer>
        
        <ProductDetails>
          <ProductName>{product.name}</ProductName>
          
          <StockInfo $inStock={product.stockQuantity > 0}>
            {product.stockQuantity > 0 ? `Stokta (${product.stockQuantity} adet)` : 'Tükendi'}
          </StockInfo>
          
          <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
          
          <ProductDescription>{product.description}</ProductDescription>
          
          <AddToCartContainer>
            {product.stockQuantity > 0 && (
              <>
                <QuantityControl>
                  <QuantityButton 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                  >
                    -
                  </QuantityButton>
                  <QuantityInput
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={product.stockQuantity}
                  />
                  <QuantityButton 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stockQuantity}
                  >
                    +
                  </QuantityButton>
                </QuantityControl>
                
                <AddToCartButton onClick={addToCart}>
                  <FaShoppingCart /> Sepete Ekle
                </AddToCartButton>
              </>
            )}
            
            {product.stockQuantity <= 0 && (
              <AddToCartButton disabled>
                Ürün Tükendi
              </AddToCartButton>
            )}
          </AddToCartContainer>
        </ProductDetails>
      </ProductContainer>
    </PageContainer>
  );
};

export default ProductDetailPage; 