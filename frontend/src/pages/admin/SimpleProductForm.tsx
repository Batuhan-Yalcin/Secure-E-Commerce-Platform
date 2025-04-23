import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSave, FaSpinner } from 'react-icons/fa';
import { toast } from 'react-toastify';
import productService from '../../services/productService';

// Stil bileşenleri
const FormCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 0.5rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  min-height: 120px;
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e5e7eb;
  border-radius: 0.25rem;
  background-color: white;
`;

const SubmitButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background-color: #3b82f6;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 0.375rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  margin-top: 1rem;
  
  &:hover {
    background-color: #2563eb;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.div`
  color: #ef4444;
  font-size: 0.875rem;
  margin-top: 0.25rem;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface FormErrors {
  name?: string;
  description?: string;
  price?: string;
  stockQuantity?: string;
  category?: string;
}

const kategoriler = [
  "Elektronik",
  "Giyim",
  "Ev & Yaşam",
  "Spor & Outdoor",
  "Kozmetik",
  "Kitap",
  "Oyuncak",
  "Diğer"
];

const SimpleProductForm: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stockQuantity: '',
    imageUrl: '',
    category: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Hata varsa temizle
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Ürün adı zorunludur';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Ürün açıklaması zorunludur';
    }
    
    const price = parseFloat(formData.price);
    if (isNaN(price) || price <= 0) {
      newErrors.price = 'Geçerli bir fiyat giriniz';
    }
    
    const stockQuantity = parseInt(formData.stockQuantity);
    if (isNaN(stockQuantity) || stockQuantity < 0) {
      newErrors.stockQuantity = 'Geçerli bir stok adedi giriniz';
    }
    
    if (!formData.category) {
      newErrors.category = 'Lütfen bir kategori seçiniz';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Lütfen form alanlarını doğru şekilde doldurun.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const productData = {
        name: formData.name.trim(),
        description: `Kategori: ${formData.category}\n${formData.description.trim()}`,
        price: parseFloat(formData.price),
        stockQuantity: parseInt(formData.stockQuantity),
        imageUrl: formData.imageUrl.trim() || ''
      };
      
      console.log('Gönderilecek ürün verisi:', productData);
      const result = await productService.createProduct(productData);
      console.log('Ürün başarıyla oluşturuldu:', result);
      toast.success('Ürün başarıyla eklendi!');
      
      // Ürünler sayfasına yönlendirme
      // Önce admin sayfası, sonra kullanıcıları home sayfasına yönlendir
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (err: any) {
      console.error('Ürün eklenirken hata oluştu:', err);
      toast.error(`Hata: ${err.response?.data?.message || err.message || 'Bilinmeyen bir hata oluştu'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormCard>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="name">Ürün Adı</Label>
          <Input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <ErrorText>{errors.name}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="category">Kategori</Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            <option value="">Kategori Seçiniz</option>
            {kategoriler.map((kategori, index) => (
              <option key={index} value={kategori}>{kategori}</option>
            ))}
          </Select>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </FormGroup>
        
        <FormGroup>
          <Label htmlFor="description">Ürün Açıklaması</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
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
            value={formData.price}
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
            value={formData.stockQuantity}
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
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="https://example.com/image.jpg"
          />
        </FormGroup>
        
        <ButtonContainer>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <FaSpinner style={{ animation: 'spin 1s linear infinite' }} /> Kaydediliyor...
              </>
            ) : (
              <>
                <FaSave /> Ürünü Kaydet
              </>
            )}
          </SubmitButton>
        </ButtonContainer>
      </form>
    </FormCard>
  );
};

export default SimpleProductForm; 