# 🛒 Secure E-Commerce Platform

## 📌 Proje Özeti
Bu proje, güvenli bir e-ticaret platformu sunmak amacıyla geliştirilmiştir. Backend kısmı Spring Boot, frontend kısmı ise React teknolojileri kullanılarak oluşturulmuştur. Kullanıcılar ürünleri görüntüleyebilir, sepete ekleyebilir ve sipariş verebilirler. Admin kullanıcılar ise ürün yönetimi, sipariş takibi ve kullanıcı yönetimi gibi işlemleri gerçekleştirebilirler.

## 🚀 Kullanılan Teknolojiler

### Backend
- **Spring Boot**: API geliştirme ve uygulama yapılandırması için kullanılmıştır.
- **Spring Security**: Kimlik doğrulama ve yetkilendirme işlemleri için.
- **JWT (JSON Web Token)**: Güvenli oturum yönetimi için.
- **Spring Data JPA**: Veritabanı işlemleri için ORM çözümü.
- **PostgreSQL**: Veritabanı olarak kullanılmıştır.
- **JUnit & Mockito**: Birim ve entegrasyon testleri için.
- **Maven**: Bağımlılık yönetimi ve proje yapılandırması için.

### Frontend
- **React**: Kullanıcı arayüzünün geliştirilmesi için JavaScript kütüphanesi.
- **Redux**: Uygulama durumunu yönetmek için.
- **Axios**: HTTP istekleri için.
- **Material-UI**: Modern ve duyarlı kullanıcı arayüzü bileşenleri için.
- **React Router**: Sayfa yönlendirmeleri için.
- **Formik & Yup**: Form yönetimi ve doğrulama işlemleri için.

## 🏗️ Mimari Yapı
Uygulama, modern microservice mimarisi prensiplerine uygun olarak geliştirilmiştir:

### Backend Mimarisi
- **Controller Layer**: API endpoint'lerini yönetir.
- **Service Layer**: İş mantığını içerir.
- **Repository Layer**: Veritabanı işlemlerini gerçekleştirir.
- **DTO (Data Transfer Objects)**: Veri transferi için kullanılır.
- **Entity**: Veritabanı tablolarını temsil eder.

### Frontend Mimarisi
- **Components**: Yeniden kullanılabilir UI bileşenleri.
- **Pages**: Sayfa düzenlerini içerir.
- **Services**: API çağrıları ve veri işlemleri.
- **Redux Store**: Uygulama durumu yönetimi.
- **Hooks**: Özel React hook'ları.
- **Utils**: Yardımcı fonksiyonlar.

## 🔑 Özellikler

### Kullanıcı Özellikleri
- **Kullanıcı Kaydı ve Girişi**: JWT tabanlı güvenli kimlik doğrulama.
- **Ürün Kataloğu**: Tüm ürünleri görüntüleme ve filtreleme.
- **Ürün Detayı**: Ürün hakkında detaylı bilgi görüntüleme.
- **Sepet Yönetimi**: Ürün ekleme, çıkarma ve miktarı güncelleme.
- **Sipariş Oluşturma**: Ödeme işlemleri ve sipariş onaylama.
- **Sipariş Geçmişi**: Önceki siparişleri görüntüleme.
- **Profil Yönetimi**: Kullanıcı bilgilerini güncelleme.

### Admin Özellikleri
- **Ürün Yönetimi**: Ürün ekleme, güncelleme ve silme.
- **Kategori Yönetimi**: Kategori ekleme, güncelleme ve silme.
- **Sipariş Takibi**: Tüm siparişleri görüntüleme ve durumlarını güncelleme.
- **Kullanıcı Yönetimi**: Kullanıcıları görüntüleme ve rollerini değiştirme.
- **Raporlama**: Satış ve stok raporları.

## 📂 API Endpointleri

### Kimlik Doğrulama İşlemleri
- `POST /api/auth/login` – Kullanıcı girişi.
- `POST /api/auth/register` – Kullanıcı kaydı.
- `POST /api/auth/refresh` – Token yenileme.
- `GET /api/auth/profile` – Kullanıcı profil bilgilerini getir.
- `PUT /api/auth/profile` – Kullanıcı profil bilgilerini güncelle.
- `PUT /api/auth/password` – Kullanıcı şifresini güncelle.

### Ürün İşlemleri
- `GET /api/products` – Tüm ürünleri getir (sayfalama ve filtreleme desteği ile).
- `GET /api/products/{id}` – Belirli bir ürünün detaylarını getir.
- `POST /api/products` – Yeni ürün ekle (Admin yetkisi gerekir).
- `PUT /api/products/{id}` – Ürün güncelle (Admin yetkisi gerekir).
- `DELETE /api/products/{id}` – Ürün sil (Admin yetkisi gerekir).
- `GET /api/products/categories` – Tüm kategorileri getir.
- `GET /api/products/categories/{categoryId}` – Kategoriye göre ürünleri getir.

### Sepet İşlemleri
- `GET /api/cart` – Kullanıcının sepetini getir.
- `POST /api/cart/items` – Sepete ürün ekle.
- `PUT /api/cart/items/{itemId}` – Sepetteki ürün miktarını güncelle.
- `DELETE /api/cart/items/{itemId}` – Sepetten ürün çıkar.
- `DELETE /api/cart/clear` – Sepeti tamamen temizle.

### Sipariş İşlemleri
- `POST /api/orders` – Yeni sipariş oluştur.
- `GET /api/orders` – Kullanıcının siparişlerini getir.
- `GET /api/orders/{id}` – Belirli bir siparişin detaylarını getir.
- `GET /api/orders/admin` – Tüm siparişleri getir (Admin yetkisi gerekir).
- `PUT /api/orders/{id}/status` – Sipariş durumunu güncelle (Admin yetkisi gerekir).

### Kategori İşlemleri (Admin)
- `GET /api/categories` – Tüm kategorileri getir.
- `POST /api/categories` – Yeni kategori ekle.
- `PUT /api/categories/{id}` – Kategori güncelle.
- `DELETE /api/categories/{id}` – Kategori sil.

### Kullanıcı Yönetimi (Admin)
- `GET /api/admin/users` – Tüm kullanıcıları getir.
- `GET /api/admin/users/{id}` – Kullanıcı detaylarını getir.
- `PUT /api/admin/users/{id}/role` – Kullanıcı rolünü güncelle.
- `DELETE /api/admin/users/{id}` – Kullanıcıyı sil.

## 🔒 Güvenlik Özellikleri
- JWT (JSON Web Token) tabanlı kimlik doğrulama
- Parola şifreleme (BCrypt)
- CORS yapılandırması
- CSRF koruması
- Rol tabanlı yetkilendirme
- Giriş denemesi sınırlama
- Güvenli HTTP başlıkları
- API Rate limiting

## 🚀 Kurulum ve Çalıştırma

### Backend (Spring Boot)
1. Gereksinimleri kontrol edin: Java 17+, Maven, PostgreSQL.
2. PostgreSQL veritabanı oluşturun.
3. `application.properties` dosyasında veritabanı bağlantı ayarlarını yapılandırın.
4. Terminal veya komut istemcisinde proje dizinine gidin.
5. `mvn clean install` komutu ile projeyi derleyin.
6. `java -jar target/ecommerce-0.0.1-SNAPSHOT.jar` komutu ile uygulamayı başlatın.

### Frontend (React)
1. Gereksinimleri kontrol edin: Node.js (v14+), npm.
2. Terminal veya komut istemcisinde frontend proje dizinine gidin.
3. `npm install` komutu ile bağımlılıkları yükleyin.
4. `.env` dosyasında API URL'sini yapılandırın.
5. `npm start` komutu ile geliştirme sunucusunu başlatın.
6. Üretim için: `npm run build` komutu ile projeyi derleyin.

## 📄 Lisans
Bu proje MIT lisansı altında lisanslanmıştır.
