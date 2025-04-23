import { Cart, CartItem, OrderCreateRequest, ProductResponse } from '../types';

// LocalStorage'da sepet bilgilerini saklayacak key
const CART_STORAGE_KEY = 'user_cart';

class CartService {
  // Sepeti getir
  getCart(): Cart {
    const cartData = localStorage.getItem(CART_STORAGE_KEY);
    if (cartData) {
      return JSON.parse(cartData);
    }
    return { items: [] };
  }

  // Sepeti kaydet
  saveCart(cart: Cart): void {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  }

  // Sepete ürün ekle
  addToCart(cartItem: CartItem): Cart {
    const cart = this.getCart();
    
    // Ürün zaten sepette var mı kontrol et
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === cartItem.productId
    );
    
    if (existingItemIndex >= 0) {
      // Ürün zaten sepette, miktarı güncelle
      cart.items[existingItemIndex].quantity += cartItem.quantity;
    } else {
      // Yeni ürün ekle
      cart.items.push(cartItem);
    }
    
    this.saveCart(cart);
    return cart;
  }

  // Sepetteki ürün miktarını güncelle
  updateCartItemQuantity(productId: number, quantity: number): Cart {
    const cart = this.getCart();
    
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );
    
    if (existingItemIndex >= 0) {
      if (quantity <= 0) {
        // Miktar 0 veya daha az ise ürünü sepetten kaldır
        cart.items.splice(existingItemIndex, 1);
      } else {
        // Miktarı güncelle
        cart.items[existingItemIndex].quantity = quantity;
      }
      
      this.saveCart(cart);
    }
    
    return cart;
  }

  // Sepetten ürün kaldır
  removeFromCart(productId: number): Cart {
    const cart = this.getCart();
    
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === productId
    );
    
    if (existingItemIndex >= 0) {
      cart.items.splice(existingItemIndex, 1);
      this.saveCart(cart);
    }
    
    return cart;
  }

  // Sepeti temizle
  clearCart(): Cart {
    const emptyCart: Cart = { items: [] };
    this.saveCart(emptyCart);
    return emptyCart;
  }

  // Sepetteki toplam ürün sayısı
  getCartItemCount(): number {
    const cart = this.getCart();
    return cart.items.reduce((total, item) => total + item.quantity, 0);
  }

  // Sepet toplam tutarı
  getCartTotal(): number {
    const cart = this.getCart();
    return cart.items.reduce((total, item) => {
      const price = item.product ? item.product.price : 0;
      return total + (price * item.quantity);
    }, 0);
  }

  // Sepeti sipariş isteğine dönüştür
  convertCartToOrderRequest(): OrderCreateRequest {
    const cart = this.getCart();
    
    // Boş sepet kontrolü
    if (cart.items.length === 0) {
      console.warn('Boş sepet sipariş isteğine dönüştürülmeye çalışıldı');
      return { orderItems: [] };
    }
    
    // Product bilgisi olmayanları filtrele
    const validItems = cart.items.filter(item => item.productId);
    
    if (validItems.length === 0) {
      console.warn('Sepette geçerli ürün bulunamadı');
      return { orderItems: [] };
    }
    
    console.log('Sepetten sipariş dönüştürülüyor:', cart);
    
    // Backend'in beklediği formatta bilgileri hazırla
    // OrderItemDTO formatında olmalı: { productId: Long, quantity: Integer }
    // JavaScript'te number, Java tarafında Long ve Integer olarak işlenir
    const orderRequest: OrderCreateRequest = {
      orderItems: validItems.map(item => ({
        productId: Number(item.productId), // Emin olmak için Number'a çevir
        quantity: Number(item.quantity)    // Emin olmak için Number'a çevir
      }))
    };
    
    console.log('Oluşturulan sipariş isteği:', orderRequest);
    return orderRequest;
  }
}

export default new CartService(); 