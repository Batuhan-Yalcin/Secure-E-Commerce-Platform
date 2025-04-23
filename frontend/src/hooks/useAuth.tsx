import { useState, useEffect, useContext, createContext, ReactNode } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

// API URL - backend'in API URL'si
const API_URL = '/api';

// LocalStorage anahtar adları - tüm sistemde standart anahtarlar kullanmak için
const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

interface User {
  id: string;
  username: string;
  email: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  checkAuthStatus: () => Promise<void>;
  clearError: () => void;
}

// Auth Context oluşturuluyor
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: false,
  error: null,
  token: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  checkAuthStatus: async () => {},
  clearError: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

// Auth Context Provider bileşeni
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Axios default headers'a token ekleniyor
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      console.log('Token useAuth içinde ayarlandı:', token.substring(0, 15) + '...');
    } else {
      delete axios.defaults.headers.common['Authorization'];
      console.log('Token silindi, anonim istekler gönderilecek');
    }
  }, [token]);

  // Kullanıcının auth durumunu kontrol eden fonksiyon
  const checkAuthStatus = async (): Promise<void> => {
    if (!token) return;

    try {
      setLoading(true);
      
      // Token'ı kontrol et - bu gerçekten geçerli bir token mı?
      const tokenParts = token.split('.');
      if (tokenParts.length !== 3) {
        console.error('Token geçersiz format (JWT değil)');
        logout();
        return;
      }

      // Kullanıcı zaten localStorage'da varsa, kullan
      const userFromStorage = localStorage.getItem(USER_KEY);
      if (userFromStorage) {
        try {
          const parsedUser = JSON.parse(userFromStorage);
          setUser(parsedUser);
          console.log('Kullanıcı bilgisi localStorage\'dan alındı:', parsedUser);
          return;
        } catch (e) {
          console.error('localStorage\'dan kullanıcı bilgisi alınamadı:', e);
        }
      }
    } catch (err: any) {
      console.error('Token kontrolü sırasında hata:', err);
      
      if (err.response && err.response.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  // Sayfa yüklendiğinde auth durumunu kontrol et
  useEffect(() => {
    const checkAuth = async () => {
      try {
        await checkAuthStatus();
      } catch (error) {
        console.log('Auth kontrolü sırasında yakalanan hata:', error);
      }
    };
    
    checkAuth();
  }, [token]);

  // Giriş yapma fonksiyonu
  const login = async (username: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('Login isteği gönderiliyor:', { username });
      
      const response = await api.post('/auth/login', { username, password });
      const { accessToken, username: responseUsername, role } = response.data;
      
      // Backend'den dönen bilgilerle User nesnesini oluştur
      const userData: User = {
        id: '0', // Backend spesifik ID dönmüyor, default değer kullan
        username: responseUsername,
        email: '', // Backend email dönmüyor, boş değer kullan
        isAdmin: role === 'ROLE_ADMIN' // role bilgisinden admin durumunu belirle
      };
      
      // Verileri localStorage'a kaydet
      localStorage.setItem(TOKEN_KEY, accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(userData));
      
      setToken(accessToken);
      setUser(userData);
      
      console.log('Login başarılı, token kaydedildi');
      console.log('Kullanıcı bilgileri:', userData);
    } catch (err: any) {
      console.error('Giriş hatası:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Giriş yapılırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Kayıt olma fonksiyonu
  const register = async (username: string, email: string, password: string): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      
      await api.post('/auth/register', { username, email, password });
      // Kullanıcı başarıyla kaydoldu, ancak otomatik giriş yapmayacağız
    } catch (err: any) {
      console.error('Kayıt hatası:', err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Kayıt olurken bir hata oluştu. Lütfen tekrar deneyin.');
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Çıkış yapma fonksiyonu
  const logout = (): void => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
    delete axios.defaults.headers.common['Authorization'];
    navigate('/login');
  };

  // Hata mesajını temizleme
  const clearError = (): void => {
    setError(null);
  };

  const contextValue: AuthContextType = {
    user,
    loading,
    error,
    token,
    login,
    register,
    logout,
    checkAuthStatus,
    clearError
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Auth hook'u
export const useAuth = () => useContext(AuthContext);

export default useAuth; 