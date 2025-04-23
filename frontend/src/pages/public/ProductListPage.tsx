import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaShoppingCart, FaSearch, FaFilter, FaTimesCircle, FaStar, FaSpinner } from 'react-icons/fa';
import productService from '../../services/productService';
import cartService from '../../services/cartService';
import { ProductResponse } from '../../types';
import { toast } from 'react-toastify';

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
  min-height: 100vh;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
`;

const CartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

const CartCount = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-color: white;
  color: #3b82f6;
  font-size: 0.75rem;
  font-weight: 600;
  min-width: 1.5rem;
  height: 1.5rem;
  border-radius: 9999px;
  padding: 0 0.25rem;
`;

const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  background-color: white;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  width: 100%;
  max-width: 400px;
  transition: all 0.2s;
  
  &:focus-within {
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  @media (max-width: 768px) {
    max-width: 100%;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  border: none;
  padding: 0.5rem;
  font-size: 0.875rem;
  outline: none;
  color: #1e293b;
  
  &::placeholder {
    color: #94a3b8;
  }
`;

const SearchIcon = styled(FaSearch)`
  color: #94a3b8;
  margin-right: 0.5rem;
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  animation: ${fadeIn} 0.4s ease-out;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  transition: all 0.3s;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  position: relative;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const StockBadge = styled.div<{ $inStock: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background-color: ${props => props.$inStock ? 'rgba(34, 197, 94, 0.9)' : 'rgba(239, 68, 68, 0.9)'};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
`;

const ProductInfo = styled.div`
  padding: 1.25rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3.2rem;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 3.8rem;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
`;

const ProductPrice = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    background-color: #cbd5e1;
    cursor: not-allowed;
  }
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: white;
  color: #475569;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #f8fafc;
    border-color: #cbd5e1;
  }
`;

const FilterPanel = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 300px;
  height: 100vh;
  background-color: white;
  box-shadow: -4px 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  padding: 2rem;
  transform: translateX(${props => props.$isOpen ? '0' : '100%'});
  transition: transform 0.3s ease-in-out;
  overflow-y: auto;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #64748b;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
  
  &:hover {
    color: #1e293b;
  }
`;

const FilterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.p`
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin: 0 0 0.75rem 0;
`;

const RangeContainer = styled.div`
  margin-bottom: 1rem;
`;

const RangeInput = styled.input`
  width: 100%;
  margin: 0.5rem 0;
`;

const RangeValues = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.875rem;
  color: #64748b;
`;

const ClearFilterButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #f1f5f9;
  color: #475569;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  margin-top: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #e2e8f0;
  }
`;

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 3rem;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  background-color: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#475569'};
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
  font-weight: ${props => props.$active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: ${props => props.$active ? '#2563eb' : '#f8fafc'};
    border-color: ${props => props.$active ? '#2563eb' : '#cbd5e1'};
  }
  
  &:disabled {
    background-color: #f1f5f9;
    color: #94a3b8;
    border-color: #e2e8f0;
    cursor: not-allowed;
  }
`;

const NoProductsContainer = styled.div`
  text-align: center;
  padding: 3rem;
  background-color: #f8fafc;
  border-radius: 0.5rem;
  border: 1px dashed #cbd5e1;
  color: #64748b;
  animation: ${fadeIn} 0.4s ease-out;
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  font-size: 1.25rem;
  color: #64748b;
  gap: 1rem;
  
  svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const Overlay = styled.div<{ $isVisible: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.$isVisible ? '1' : '0'};
  visibility: ${props => props.$isVisible ? 'visible' : 'hidden'};
  transition: opacity 0.3s, visibility 0.3s;
`;

// Her sayfada gösterilecek ürün sayısı
const ITEMS_PER_PAGE = 9;

const ProductListPage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Arama ve filtreleme state'leri
  const [searchTerm, setSearchTerm] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [maxPrice, setMaxPrice] = useState(10000);
  
  // Sayfalama state'leri
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // Sepet state'i
  const [cartItemCount, setCartItemCount] = useState(0);
  
  // Ürünleri getir
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await productService.getAllProducts();
        setProducts(response);
        setFilteredProducts(response);
        
        // Maksimum fiyatı hesapla
        if (response.length > 0) {
          const highestPrice = Math.max(...response.map(product => product.price));
          setMaxPrice(Math.ceil(highestPrice * 1.2)); // Biraz marj ekle
          setPriceRange([0, highestPrice]);
        }
        
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
    
    // Sepet sayısını güncelle
    updateCartCount();
  }, []);
  
  // Filtreleme ve aramayı uygula
  useEffect(() => {
    let filtered = [...products];
    
    // Arama filtreleme
    if (searchTerm.trim() !== '') {
      const lowercasedSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(lowercasedSearch) ||
        product.description.toLowerCase().includes(lowercasedSearch)
      );
    }
    
    // Fiyat aralığı filtreleme
    filtered = filtered.filter(product => 
      product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    setFilteredProducts(filtered);
    setTotalPages(Math.ceil(filtered.length / ITEMS_PER_PAGE));
    setCurrentPage(1); // Filtreleme sonrası ilk sayfaya dön
  }, [searchTerm, priceRange, products]);
  
  // Sepet sayısını güncelle
  const updateCartCount = () => {
    const count = cartService.getCartItemCount();
    setCartItemCount(count);
  };
  
  // Filtrele panelini aç/kapat
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };
  
  // Filtreleri temizle
  const clearFilters = () => {
    setSearchTerm('');
    setPriceRange([0, maxPrice]);
    setIsFilterOpen(false);
  };
  
  // Ürünü sepete ekle
  const addToCart = (product: ProductResponse) => {
    try {
      cartService.addToCart(product, 1);
      updateCartCount();
      toast.success(`${product.name} sepete eklendi!`);
    } catch (err) {
      toast.error('Ürün sepete eklenirken bir hata oluştu.');
    }
  };
  
  // Sepet sayfasına git
  const navigateToCart = () => {
    navigate('/cart');
  };
  
  // Ürün detay sayfasına git
  const navigateToProductDetail = (productId: number) => {
    navigate(`/products/${productId}`);
  };
  
  // Sayfalanmış ürünler
  const paginatedProducts = React.useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);
  
  // Sayfa değiştirme
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Para birimi formatı
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('tr-TR', {
      style: 'currency',
      currency: 'TRY'
    });
  };
  
  // Yükleniyor
  if (loading && products.length === 0) {
    return (
      <LoadingContainer>
        <FaSpinner /> Ürünler yükleniyor...
      </LoadingContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Ürünlerimiz</Title>
        
        <CartButton onClick={navigateToCart}>
          <FaShoppingCart />
          Sepet
          {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
        </CartButton>
      </PageHeader>
      
      <ActionContainer>
        <SearchContainer>
          <SearchIcon />
          <SearchInput 
            placeholder="Ürün ara..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </SearchContainer>
        
        <FilterButton onClick={toggleFilter}>
          <FaFilter /> Filtrele
        </FilterButton>
      </ActionContainer>
      
      {error && (
        <div style={{ 
          padding: '1rem', 
          backgroundColor: '#fee2e2', 
          color: '#b91c1c', 
          borderRadius: '0.375rem', 
          marginTop: '1rem' 
        }}>
          {error}
        </div>
      )}
      
      {paginatedProducts.length === 0 ? (
        <NoProductsContainer>
          <p>Aramanızla eşleşen ürün bulunamadı.</p>
          <button 
            onClick={clearFilters} 
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
            Filtreleri Temizle
          </button>
        </NoProductsContainer>
      ) : (
        <>
          <ProductGrid>
            {paginatedProducts.map(product => (
              <ProductCard 
                key={product.id}
                onClick={() => navigateToProductDetail(product.id)}
              >
                <ProductImage>
                  {product.imageUrl ? (
                    <img src={product.imageUrl} alt={product.name} />
                  ) : (
                    <div style={{ fontSize: '3rem', color: '#cbd5e1' }}>🖼️</div>
                  )}
                  <StockBadge $inStock={product.stockQuantity > 0}>
                    {product.stockQuantity > 0 ? 'Stokta' : 'Tükendi'}
                  </StockBadge>
                </ProductImage>
                <ProductInfo>
                  <ProductName>{product.name}</ProductName>
                  <ProductDescription>{product.description}</ProductDescription>
                  <ProductFooter>
                    <ProductPrice>{formatCurrency(product.price)}</ProductPrice>
                    <AddToCartButton 
                      onClick={(e) => {
                        e.stopPropagation(); // Ürün kartına tıklamayı engelle
                        addToCart(product);
                      }}
                      disabled={product.stockQuantity <= 0}
                    >
                      <FaShoppingCart size={14} /> Sepete Ekle
                    </AddToCartButton>
                  </ProductFooter>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
          
          {/* Sayfalama */}
          {totalPages > 1 && (
            <Pagination>
              <PageButton 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                &#8592;
              </PageButton>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Sadece mevcut sayfanın etrafındaki sayfaları ve ilk/son sayfaları göster
                  return page === 1 || 
                         page === totalPages || 
                         Math.abs(page - currentPage) <= 1;
                })
                .map((page, index, array) => {
                  // Sayfa numaraları arasında boşluk varsa "..." göster
                  if (index > 0 && page - array[index - 1] > 1) {
                    return (
                      <React.Fragment key={`ellipsis-${page}`}>
                        <div style={{ padding: '0 0.5rem', color: '#64748b' }}>...</div>
                        <PageButton 
                          key={page} 
                          $active={page === currentPage}
                          onClick={() => handlePageChange(page)}
                        >
                          {page}
                        </PageButton>
                      </React.Fragment>
                    );
                  }
                  return (
                    <PageButton 
                      key={page} 
                      $active={page === currentPage}
                      onClick={() => handlePageChange(page)}
                    >
                      {page}
                    </PageButton>
                  );
                })}
              
              <PageButton 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                &#8594;
              </PageButton>
            </Pagination>
          )}
        </>
      )}
      
      {/* Filtre paneli */}
      <Overlay $isVisible={isFilterOpen} onClick={toggleFilter} />
      <FilterPanel $isOpen={isFilterOpen}>
        <FilterHeader>
          <FilterTitle>Filtrele</FilterTitle>
          <CloseButton onClick={toggleFilter}>
            <FaTimesCircle />
          </CloseButton>
        </FilterHeader>
        
        <FilterSection>
          <FilterLabel>Fiyat Aralığı</FilterLabel>
          <RangeContainer>
            <RangeInput 
              type="range" 
              min={0} 
              max={maxPrice} 
              value={priceRange[0]}
              onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
            />
            <RangeInput 
              type="range" 
              min={0} 
              max={maxPrice} 
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
            />
          </RangeContainer>
          <RangeValues>
            <span>{formatCurrency(priceRange[0])}</span>
            <span>{formatCurrency(priceRange[1])}</span>
          </RangeValues>
        </FilterSection>
        
        <ClearFilterButton onClick={clearFilters}>
          Filtreleri Temizle
        </ClearFilterButton>
      </FilterPanel>
    </PageContainer>
  );
};

export default ProductListPage;