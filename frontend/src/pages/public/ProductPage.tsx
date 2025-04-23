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

const ActionContainer = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }
`;

const SearchContainer = styled.div`
  position: relative;
  max-width: 300px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 0.625rem 1rem 0.625rem 2.5rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  width: 100%;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #64748b;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: white;
  color: #64748b;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: #3b82f6;
  }
`;

const FilterContainer = styled.div<{ $isOpen: boolean }>`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  animation: ${fadeIn} 0.3s ease;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FilterTitle = styled.h3`
  font-size: 1.125rem;
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

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const FilterGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FilterLabel = styled.p`
  font-weight: 500;
  color: #334155;
  margin: 0 0 0.5rem 0;
`;

const RangeContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RangeInput = styled.input`
  width: 100%;
  -webkit-appearance: none;
  height: 0.5rem;
  border-radius: 0.25rem;
  background: #e2e8f0;
  outline: none;
  
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }
  
  &::-moz-range-thumb {
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
    border: none;
  }
`;

const RangeValue = styled.div`
  font-size: 0.875rem;
  color: #64748b;
`;

const ClearFiltersButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: none;
  color: #ef4444;
  border: 1px solid #ef4444;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  align-self: flex-start;
  
  &:hover {
    background-color: #fee2e2;
  }
`;

const ProductGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
`;

const ProductCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all 0.3s;
  animation: ${fadeIn} 0.5s ease;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }
`;

const ProductImage = styled.div`
  height: 200px;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.05);
  }
`;

const StockBadge = styled.span<{ $inStock: boolean }>`
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
  background-color: ${props => props.$inStock ? '#dcfce7' : '#fee2e2'};
  color: ${props => props.$inStock ? '#16a34a' : '#dc2626'};
`;

const ProductInfo = styled.div`
  padding: 1.25rem;
`;

const ProductName = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
`;

const ProductDescription = styled.p`
  font-size: 0.875rem;
  color: #64748b;
  margin: 0 0 1rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.5;
`;

const ProductFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProductPrice = styled.div`
  font-weight: 700;
  color: #1e293b;
  font-size: 1.25rem;
`;

const AddToCartButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuantityInput = styled.div`
  display: flex;
  align-items: center;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  overflow: hidden;
`;

const QuantityButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: #f8fafc;
  border: none;
  font-size: 1rem;
  color: #64748b;
  cursor: pointer;
  
  &:hover {
    background: #e2e8f0;
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuantityValue = styled.input`
  width: 2.5rem;
  height: 2rem;
  border: none;
  border-left: 1px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  text-align: center;
  font-size: 0.875rem;
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

const Pagination = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 2rem;
  gap: 0.5rem;
`;

const PageButton = styled.button<{ $active?: boolean }>`
  padding: 0.5rem 0.75rem;
  border-radius: 0.375rem;
  border: 1px solid ${props => props.$active ? '#3b82f6' : '#e2e8f0'};
  background-color: ${props => props.$active ? '#3b82f6' : 'white'};
  color: ${props => props.$active ? 'white' : '#1e293b'};
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    border-color: #3b82f6;
    color: ${props => props.$active ? 'white' : '#3b82f6'};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #e2e8f0;
    color: #9ca3af;
    
    &:hover {
      border-color: #e2e8f0;
      color: #9ca3af;
    }
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4rem;
  font-size: 1.5rem;
  color: #6b7280;
`;

const NoProductsContainer = styled.div`
  padding: 4rem;
  text-align: center;
  color: #6b7280;
  font-size: 1.125rem;
`;

const EmptyCartMessageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
`;

const EmptyCartMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  max-width: 400px;
  animation: ${fadeIn} 0.5s ease;
`;

const EmptyCartIcon = styled.div`
  font-size: 4rem;
  color: #cbd5e1;
  margin-bottom: 1rem;
`;

const EmptyCartTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
`;

const EmptyCartDescription = styled.p`
  color: #64748b;
  margin: 0 0 1.5rem 0;
`;

const ShopButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #2563eb;
  }
`;

// Her sayfada gösterilecek ürün sayısı
const ITEMS_PER_PAGE = 9;

const ProductPage: React.FC = () => {
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
  
  // Hata
  if (error) {
    return (
      <PageContainer>
        <div style={{ padding: '2rem', color: '#ef4444', textAlign: 'center' }}>
          <FaTimesCircle style={{ fontSize: '2rem', marginBottom: '1rem' }} />
          <h2>Bir hata oluştu</h2>
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{ 
              marginTop: '1rem', 
              padding: '0.5rem 1rem', 
              background: '#ef4444', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.375rem', 
              cursor: 'pointer' 
            }}
          >
            Tekrar Dene
          </button>
        </div>
      </PageContainer>
    );
  }
  
  return (
    <PageContainer>
      <PageHeader>
        <Title>Ürünlerimiz</Title>
        <ActionContainer>
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
          <FilterButton onClick={toggleFilter}>
            <FaFilter /> Filtrele
          </FilterButton>
          <CartButton onClick={navigateToCart}>
            <FaShoppingCart />
            {cartItemCount > 0 && <CartCount>{cartItemCount}</CartCount>}
            Sepet
          </CartButton>
        </ActionContainer>
      </PageHeader>
      
      <FilterContainer $isOpen={isFilterOpen}>
        <FilterHeader>
          <FilterTitle>Filtreleme Seçenekleri</FilterTitle>
          <CloseButton onClick={toggleFilter}>
            <FaTimesCircle />
          </CloseButton>
        </FilterHeader>
        <FilterGrid>
          <FilterGroup>
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
              <RangeValue>
                {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
              </RangeValue>
            </RangeContainer>
          </FilterGroup>
        </FilterGrid>
        <ClearFiltersButton onClick={clearFilters}>
          <FaTimesCircle /> Filtreleri Temizle
        </ClearFiltersButton>
      </FilterContainer>
      
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
              <ProductCard key={product.id}>
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
                      onClick={() => addToCart(product)}
                      disabled={product.stockQuantity <= 0}
                    >
                      <FaShoppingCart size={14} /> Sepete Ekle
                    </AddToCartButton>
                  </ProductFooter>
                </ProductInfo>
              </ProductCard>
            ))}
          </ProductGrid>
          
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
        </>
      )}
    </PageContainer>
  );
};

export default ProductPage; 