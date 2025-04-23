import api from './api';
import { ProductResponse, ProductCreateRequest, ProductUpdateRequest } from '../types';

class ProductService {
  // Tüm ürünleri getir
  async getAllProducts(): Promise<ProductResponse[]> {
    try {
      console.log('Tüm ürünler getiriliyor...');
      const response = await api.get('/products');
      console.log('Ürünler başarıyla alındı:', response.data);
      return response.data;
    } catch (error) {
      console.error('Ürünler alınamadı:', error);
      throw error;
    }
  }

  // Belirli bir ürünün detaylarını getir
  async getProductById(id: number): Promise<ProductResponse> {
    try {
      console.log(`Ürün detayları getiriliyor... ID: ${id}`);
      const response = await api.get(`/products/${id}`);
      console.log('Ürün detayları başarıyla alındı:', response.data);
      return response.data;
    } catch (error) {
      console.error(`ID:${id} olan ürün detayları alınamadı:`, error);
      throw error;
    }
  }

  // Yeni ürün oluştur
  async createProduct(productData: ProductCreateRequest): Promise<ProductResponse> {
    try {
      console.log('Yeni ürün oluşturuluyor:', productData);
      
      // Veriyi backend formatına uyumlu hale getir
      const requestData = {
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price, // BigDecimal olarak otomatik dönüşecek
        stockQuantity: productData.stockQuantity,
        imageUrl: productData.imageUrl || ''
      };
      
      console.log('Gönderilecek veri:', requestData);
      
      // Token kontrolü
      const token = localStorage.getItem('accessToken');
      console.log('Token durumu:', token ? 'Token mevcut' : 'Token yok');
      
      const response = await api.post('/products', requestData);
      console.log('Ürün başarıyla oluşturuldu:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Ürün oluşturulamadı:', error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  // Ürün güncelle
  async updateProduct(id: number, productData: ProductUpdateRequest): Promise<ProductResponse> {
    try {
      console.log(`ID:${id} olan ürün güncelleniyor:`, productData);
      
      // Veriyi backend formatına uyumlu hale getir
      const requestData = {
        id: id,
        name: productData.name || '',
        description: productData.description || '',
        price: productData.price, // BigDecimal olarak otomatik dönüşecek
        stockQuantity: productData.stockQuantity,
        imageUrl: productData.imageUrl || ''
      };
      
      console.log('Gönderilecek veri:', requestData);
      
      const response = await api.put(`/products/${id}`, requestData);
      console.log('Ürün başarıyla güncellendi:', response.data);
      return response.data;
    } catch (error: any) {
      console.error(`ID:${id} olan ürün güncellenemedi:`, error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  // Ürün sil
  async deleteProduct(id: number): Promise<void> {
    try {
      console.log(`ID:${id} olan ürün siliniyor...`);
      await api.delete(`/products/${id}`);
      console.log(`ID:${id} olan ürün başarıyla silindi`);
    } catch (error: any) {
      console.error(`ID:${id} olan ürün silinemedi:`, error);
      console.error('Hata detayları:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }
}

export default new ProductService(); 