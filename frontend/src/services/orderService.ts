import api from './api';
import { OrderCreateRequest, OrderResponse, OrderStatusUpdateRequest } from '../types';

class OrderService {
  // Kullanıcının siparişlerini getir
  async getUserOrders(userId: number): Promise<OrderResponse[]> {
    try {
      const response = await api.get(`/orders/user/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Kullanıcı siparişleri alınamadı:', error);
      throw error;
    }
  }

  // Belirli bir siparişin detaylarını getir
  async getOrderById(id: number): Promise<OrderResponse> {
    try {
      const response = await api.get(`/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Sipariş detayları alınamadı:', error);
      throw error;
    }
  }

  // Yeni sipariş oluştur
  async createOrder(orderData: OrderCreateRequest): Promise<OrderResponse> {
    console.log('Sipariş oluşturuluyor:', orderData);
    
    // Veri kontrolü
    if (!orderData.orderItems || orderData.orderItems.length === 0) {
      console.error('Sipariş oluşturma hatası: Boş sipariş öğeleri');
      throw new Error('Sepette ürün bulunmuyor veya ürünler geçersiz.');
    }
    
    try {
      // Gönderilen veriyi tam olarak logla
      console.log('Sunucuya gönderilen sipariş verisi:', JSON.stringify(orderData));
      
      const response = await api.post(`/orders`, orderData);
      console.log('Sipariş başarıyla oluşturuldu:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Sipariş oluşturulamadı:', error);
      
      // Detaylı hata bilgisi
      if (error.response) {
        console.error('Sunucu yanıtı:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data
        });
      }
      
      throw error;
    }
  }

  // Sipariş durumunu güncelle (Admin)
  async updateOrderStatus(id: number, statusData: OrderStatusUpdateRequest): Promise<OrderResponse> {
    try {
      const response = await api.put(`/orders/${id}/status`, statusData);
      return response.data;
    } catch (error) {
      console.error('Sipariş durumu güncellenemedi:', error);
      throw error;
    }
  }

  // Siparişi iptal et
  async cancelOrder(id: number): Promise<OrderResponse> {
    try {
      const response = await api.put(`/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Sipariş iptal edilemedi:', error);
      throw error;
    }
  }

  // Tüm siparişleri getir (Admin)
  async getAllOrders(): Promise<OrderResponse[]> {
    try {
      const response = await api.get(`/admin/orders`);
      return response.data;
    } catch (error) {
      console.error('Siparişler alınamadı:', error);
      throw error;
    }
  }
}

export default new OrderService(); 