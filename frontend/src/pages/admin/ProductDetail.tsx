import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaArrowLeft, FaSpinner, FaExclamationCircle, FaSave, FaImage, FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import productService from '../../services/productService';
import { ProductCreateRequest, ProductUpdateRequest, ProductResponse } from '../../types';
import SubmitButton from '../../components/common/SubmitButton';

// Stil bileşenleri
const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const PageHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 700;
  color: #1e293b;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.75rem;
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
  padding: 0.5rem;
  transition: all 0.2s;
  
  &:hover {
    color: #2563eb;
    text-decoration: underline;
  }
`;

const FormCard = styled.div`
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 500;
  color: #1e293b;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.625rem;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  font-size: 0.875rem;
  min-height: 100px;
  transition: all 0.2s;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const ImagePreviewContainer = styled.div`
  margin-top: 1rem;
  position: relative;
  max-width: 300px;
`;

const ImagePreview = styled.img`
  width: 100%;
  height: auto;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
`;

const ImagePlaceholder = styled.div`
  width: 100%;
  height: 200px;
  border-radius: 0.375rem;
  border: 1px solid #e2e8f0;
  background-color: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748b;
  font-size: 1.5rem;
`;

const RemoveImageButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #ef4444;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: #dc2626;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  font-size: 1.25rem;
  color: #6b7280;
  
  svg {
    animation: spin 1s linear infinite;
    margin-right: 0.5rem;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ErrorContainer = styled.div`
  padding: 1.5rem;
  background-color: #fee2e2;
  border-radius: 0.5rem;
  color: #dc2626;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

// Default empty product
const emptyProduct: ProductCreateRequest = {
  name: '',
  description: '',
  price: 0,
  stockQuantity: 0,
  imageUrl: ''
};

interface ProductFormErrors {
  name?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ProductCreateRequest | ProductUpdateRequest>(emptyProduct);
  const [errors, setErrors] = useState<ProductFormErrors>({});
  
  // Yeni ürün sayfası için loading'i başlangıçta false yapalım
  const isNewProduct = id === 'new';
  const [loading, setLoading] = useState<boolean>(!isNewProduct);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Ürün verilerini yükle (düzenleme modu) veya yeni ürün için boş form göster
  useEffect(() => {
    // Yeni ürün ekleme modu
    if (isNewProduct) {
      console.log('Yeni ürün ekleme modu');
      setProduct(emptyProduct);
      setLoading(false);
      return;
    }
    
    // Düzenleme modu - mevcut ürünü getir
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
          
          setProduct({
            name: response.name,
            description: response.description,
            price: response.price,
            stockQuantity: response.stockQuantity,
            imageUrl: response.imageUrl
          });
          
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
  }, [id, isNewProduct]);
  
  // Form alanları değiştiğinde
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Fiyat ve stok için sayısal değerlere dönüştürme
    if (name === 'price' || name === 'stockQuantity') {
      const numValue = parseFloat(value);
      setProduct(prev => ({
        ...prev,
        [name]: isNaN(numValue) ? 0 : numValue
      }));
    } else {
      setProduct(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Hata mesajını temizle
    if (errors[name as keyof ProductFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };
  
  // Resim URL'sini kaldır
  const handleRemoveImage = () => {
    setProduct(prev => ({
      ...prev,
      imageUrl: ''
    }));
  };
  
  // Form doğrulama
  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {};
    
    if (!product.name.trim()) {
      newErrors.name = 'Ürün adı zorunludur';
    }
    
    if (!product.description.trim()) {
      newErrors.description = 'Ürün açıklaması zorunludur';
    }
    
    if (product.price <= 0) {
      newErrors.price = 'Fiyat 0\'dan büyük olmalıdır';
    }
    
    if (product.stockQuantity < 0) {
      newErrors.stockQuantity = 'Stok adedi negatif olamaz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Ürün kaydet
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form gönderiliyor...');
    
    if (!validateForm()) {
      console.error('Form doğrulama başarısız');
      toast.error('Lütfen form alanlarını doğru şekilde doldurun.');
      return;
    }
    
    setIsSubmitting(true);
    console.log('Form gönderme işlemi başlatıldı...');
    
    try {
      // Formdan gelen verileri hazırlayalım
      const productData = {
        name: product.name.trim(),
        description: product.description.trim(),
        price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
        stockQuantity: typeof product.stockQuantity === 'string' ? parseInt(String(product.stockQuantity)) : product.stockQuantity,
        imageUrl: product.imageUrl || ''
      };
      
      console.log('İşlenecek veri:', productData);
      
      if (isNewProduct) {
        // Null kontrolleri ekleyelim
        if (!productData.name || !productData.description || productData.price === undefined || productData.stockQuantity === undefined) {
          throw new Error("Ürün bilgileri eksik");
        }
        
        // Debugging için token kontrolü
        const token = localStorage.getItem('accessToken');
        console.log('Token durumu:', token ? 'Token var' : 'Token yok');
        
        // Ürün servisi ile ürün ekleme
        try {
          const result = await productService.createProduct(productData);
          console.log('Ürün başarıyla oluşturuldu:', result);
          toast.success('Ürün başarıyla eklendi!');
          
          setTimeout(() => {
            navigate('/admin/products');
          }, 2000);
        } catch (createError: any) {
          console.error('Ürün oluşturma hatası:', createError);
          console.error('Hata detayları:', {
            status: createError.response?.status,
            data: createError.response?.data,
            message: createError.message
          });
          throw createError;
        }
      } else {
        // Mevcut ürünü güncelleme
        if (!id || isNaN(parseInt(id))) {
          toast.error('Geçersiz ürün ID');
          setIsSubmitting(false);
          return;
        }
        
        const productId = parseInt(id);
        
        // Null kontrolleri ekleyelim
        if (!productData.name || !productData.description || productData.price === undefined || productData.stockQuantity === undefined) {
          throw new Error("Ürün bilgileri eksik");
        }
        
        const result = await productService.updateProduct(productId, {
          ...productData,
          id: productId
        });
        
        console.log('Ürün başarıyla güncellendi:', result);
        toast.success('Ürün başarıyla güncellendi!');
        
        setTimeout(() => {
          navigate('/admin/products');
        }, 2000);
      }
    } catch (err: any) {
      console.error('Genel bir hata oluştu:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Bilinmeyen hata';
      console.error('Hata detayları:', errorMessage);
      toast.error(`İşlem sırasında hata: ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Yükleme durumu
  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner /> Yükleniyor...
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
        <div>
          <BackButton onClick={() => navigate('/admin/products')}>
            <FaArrowLeft /> Ürünlere Dön
          </BackButton>
          <Title>
            {isNewProduct ? 'Yeni Ürün Ekle' : `Ürünü Düzenle: ${product.name}`}
          </Title>
        </div>
        <SubmitButton 
          text={isNewProduct ? 'Ürünü Ekle' : 'Değişiklikleri Kaydet'}
          loadingText="Kaydediliyor..."
          isLoading={isSubmitting}
          icon={<FaSave />}
          onClick={handleSubmit}
          type="button"
        />
      </PageHeader>
      
      <FormCard>
        <form onSubmit={handleSubmit}>
          <FormGroup>
            <Label htmlFor="name">Ürün Adı</Label>
            <Input
              type="text"
              id="name"
              name="name"
              value={product.name}
              onChange={handleChange}
            />
            {errors.name && <ErrorText>{errors.name}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="description">Ürün Açıklaması</Label>
            <Textarea
              id="description"
              name="description"
              value={product.description}
              onChange={handleChange}
            />
            {errors.description && <ErrorText>{errors.description}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="price">Fiyat (TL)</Label>
            <Input
              type="number"
              id="price"
              name="price"
              min="0"
              step="0.01"
              value={product.price}
              onChange={handleChange}
            />
            {errors.price && <ErrorText>{errors.price}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="stockQuantity">Stok Adedi</Label>
            <Input
              type="number"
              id="stockQuantity"
              name="stockQuantity"
              min="0"
              step="1"
              value={product.stockQuantity}
              onChange={handleChange}
            />
            {errors.stockQuantity && <ErrorText>{errors.stockQuantity}</ErrorText>}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="imageUrl">Ürün Görseli URL</Label>
            <Input
              type="text"
              id="imageUrl"
              name="imageUrl"
              value={product.imageUrl || ''}
              onChange={handleChange}
              placeholder="https://example.com/image.jpg"
            />
            
            <ImagePreviewContainer>
              {product.imageUrl ? (
                <>
                  <ImagePreview src={product.imageUrl} alt="Ürün görseli" />
                  <RemoveImageButton onClick={handleRemoveImage}>
                    <FaTrash size={14} />
                  </RemoveImageButton>
                </>
              ) : (
                <ImagePlaceholder>
                  <FaImage />
                </ImagePlaceholder>
              )}
            </ImagePreviewContainer>
          </FormGroup>
        </form>
      </FormCard>
    </PageContainer>
  );
};

export default ProductDetail; 