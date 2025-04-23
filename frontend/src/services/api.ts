import axios from 'axios';

// Proxy kullanıldığında, göreceli URL kullanmalıyız
const API_URL = '/api';

// Konsola log ekleyelim
console.log('API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  // Zaman aşımını artıralım
  timeout: 30000, // 30 saniye
  // CORS için withCredentials ayarı
  withCredentials: false,
});

// Her istekte token kontrolü
api.interceptors.request.use(
  (config) => {
    // Token'ı localStorage'dan al ve Authorization header'ına ekle
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      console.log('Token kullanılıyor:', token.substring(0, 15) + '...');
    } else {
      delete config.headers['Authorization'];
      console.log('Token bulunamadı, kimliksiz istek gönderiliyor');
    }
    
    console.log('API İsteği:', {
      method: config.method?.toUpperCase(),
      url: config.url,
      data: config.data
    });
    
    return config;
  },
  (error) => {
    console.error('API İstek Hatası:', error);
    return Promise.reject(error);
  }
);

// Yanıt logları ve hata işleme
api.interceptors.response.use(
  (response) => {
    console.log('API Yanıtı:', {
      status: response.status,
      statusText: response.statusText,
      url: response.config.url,
      data: response.data
    });
    return response;
  },
  async (error) => {
    // Hata detaylarını genişletilmiş olarak logla
    const errorDetails = {
      message: error.message,
      config: {
        url: error.config?.url,
        method: error.config?.method,
        headers: error.config?.headers,
        data: error.config?.data
      },
      response: error.response ? {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers
      } : 'Yanıt alınamadı'
    };
    
    console.error('API Yanıt Hatası:', errorDetails);

    // Yetkilendirme hatası (401) durumunda token'ları temizleme
    if (error.response && error.response.status === 401) {
      console.log('401 Yetkilendirme hatası, tokenler temizleniyor');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
    }
    
    return Promise.reject(error);
  }
);

export default api; 