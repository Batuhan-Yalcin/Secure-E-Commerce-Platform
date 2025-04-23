// Kimlik doğrulama tipleri
export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  username: string;
  role: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

// Kullanıcı tipleri
export interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  role?: string;
  isAdmin?: boolean;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  address?: string;
}

export interface ProfileUpdateRequest {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  address?: string;
}

export interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// Ürün tipleri
export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface ProductCreateRequest {
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

export interface ProductUpdateRequest {
  id?: number;
  name: string;
  description: string;
  price: number;
  stockQuantity: number;
  imageUrl?: string;
}

// Sipariş tipleri
export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSING = "PROCESSING",
  SHIPPED = "SHIPPED",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED"
}

export interface OrderItem {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  orderItems: OrderItem[];
}

export interface OrderResponse {
  id: number;
  userId: number;
  orderItems: OrderItem[];
  totalAmount: number;
  orderDate: string;
  status: OrderStatus;
}

export interface OrderStatusUpdateRequest {
  status: OrderStatus;
}

// Sepet tipleri
export interface CartItem {
  productId: number;
  product?: ProductResponse;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
} 