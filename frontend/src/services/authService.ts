import api from './api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '../types';

class AuthService {
  /**
   * Kullanıcı Girişi
   */
  async login(username: string, password: string): Promise<AuthResponse> {
    const request: LoginRequest = { username, password };
    const response = await api.post<AuthResponse>('/auth/login', request);
    
    // Token ve kullanıcı bilgilerini localStorage'a kaydet
    if (response.data.accessToken) {
      localStorage.setItem('accessToken', response.data.accessToken);
      
      // Kullanıcı bilgilerini oluştur
      const user: User = {
        id: 0, // API'dan gelen yanıtta ID yoksa default olarak 0 atanır
        username: response.data.username,
        email: '', // API'dan email dönmediği için boş bıraktık
        roles: [response.data.role], // API'dan gelen role bilgisini array'e çevirdik
      };
      
      localStorage.setItem('user', JSON.stringify(user));
    }
    
    return response.data;
  }

  /**
   * Kullanıcı Kaydı
   */
  async register(username: string, email: string, password: string): Promise<any> {
    const request: RegisterRequest = { username, email, password };
    return api.post('/auth/register', request);
  }

  /**
   * Kullanıcı Çıkışı
   */
  logout(): void {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  }

  /**
   * Mevcut Kullanıcı Bilgisini Alma
   */
  getCurrentUser(): User | null {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  }

  /**
   * Kullanıcının Token'ını Alma
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken');
  }

  /**
   * Kullanıcının Kimliği Doğrulanmış Olup Olmadığını Kontrol Etme
   */
  isAuthenticated(): boolean {
    const accessToken = this.getToken();
    return !!accessToken;
  }

  /**
   * Kullanıcının admin olup olmadığını kontrol eder
   */
  isAdmin(): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Eğer roles dizisi varsa, içinde 'ROLE_ADMIN' var mı kontrol et
    if (user.roles && Array.isArray(user.roles)) {
      return user.roles.includes('ROLE_ADMIN');
    }
    
    // Eğer role string bir alan varsa onu kontrol et
    if (user.role) {
      return user.role === 'ROLE_ADMIN';
    }
    
    // Eğer isAdmin boolean alanı varsa doğrudan onu kullan
    if (user.isAdmin !== undefined) {
      return user.isAdmin;
    }
    
    return false;
  }

  async getUserProfile(): Promise<User> {
    const response = await api.get('/users/profile');
    return response.data;
  }

  async updateUserProfile(updatedUser: Partial<User>): Promise<User> {
    const response = await api.put('/users/profile', updatedUser);
    // Kullanıcı bilgilerini güncelle
    const currentUser = this.getCurrentUser();
    if (currentUser) {
      const updatedUserData = { ...currentUser, ...response.data };
      localStorage.setItem('user', JSON.stringify(updatedUserData));
    }
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    try {
      console.log('Şifre değiştirme isteği gönderiliyor:', { currentPassword: '********', newPassword: '********' });
      
      // Backend'in beklediği formatta veri gönder
      const response = await api.put('/users/change-password', { 
        currentPassword, 
        newPassword,
        confirmPassword: newPassword // Backend confirmPassword da bekliyor olabilir
      });
      
      console.log('Şifre değiştirme başarılı');
      return response.data;
    } catch (error) {
      console.error('Şifre değiştirme hatası:', error);
      throw error;
    }
  }

  // Şifremi unuttum işlemi için
  async requestPasswordReset(email: string): Promise<any> {
    return api.post('/auth/forgot-password', { email });
  }

  // Şifre sıfırlama işlemi için
  async resetPassword(token: string, newPassword: string): Promise<any> {
    return api.post('/auth/reset-password', { token, newPassword });
  }
}

export default new AuthService(); 