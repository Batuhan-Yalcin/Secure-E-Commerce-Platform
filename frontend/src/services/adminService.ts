import api from './api';
import { User, OrderResponse } from '../types';

class AdminService {
  // Dashboard istatistiklerini getir
  async getDashboardStats() {
    try {
      const response = await api.get('/admin/dashboard');
      
      // Backend verilerini frontend için uygun formata dönüştür
      // Eğer API tüm alanları dönmüyorsa, burada varsayılan değerler ekleriz
      const dashboardData = {
        totalUsers: response.data.totalUsers || 0,
        totalOrders: response.data.totalOrders || 0,
        totalProducts: response.data.totalProducts || 0,
        revenue: response.data.revenue || 0,
        recentOrders: response.data.recentOrders || [],
        orderStatusCounts: response.data.orderStatusCounts || {}
      };
      
      return dashboardData;
    } catch (error) {
      console.error('Dashboard istatistikleri alınamadı:', error);
      throw error;
    }
  }

  // Tüm kullanıcıları getir
  async getAllUsers(): Promise<User[]> {
    try {
      const response = await api.get('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Kullanıcılar alınamadı:', error);
      throw error;
    }
  }

  // Tüm siparişleri getir
  async getAllOrders(): Promise<OrderResponse[]> {
    try {
      const response = await api.get('/admin/orders');
      return response.data;
    } catch (error) {
      console.error('Siparişler alınamadı:', error);
      throw error;
    }
  }

  // Kullanıcı silme
  async deleteUser(userId: number): Promise<void> {
    try {
      await api.delete(`/admin/users/${userId}`);
    } catch (error) {
      console.error('Kullanıcı silinemedi:', error);
      throw error;
    }
  }

  // Kullanıcı rolünü değiştir
  async updateUserRole(userId: number, role: string): Promise<User> {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Kullanıcı rolü değiştirilemedi:', error);
      throw error;
    }
  }
}

export default new AdminService(); 