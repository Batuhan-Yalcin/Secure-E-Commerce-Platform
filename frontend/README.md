# Güvenli E-Ticaret Platformu

Bu proje, modern ve güvenli bir e-ticaret platformunu içermektedir. Kullanıcıların ürünlere göz atabileceği, sepete ekleyebileceği, sipariş verebileceği ve yönetici paneli üzerinden ürün/kullanıcı yönetimi yapabileceği kapsamlı bir sistem oluşturulmuştur.

## Proje Yapısı

Proje iki ana bölümden oluşmaktadır:

1. **Backend (Java Spring Boot)**: RESTful API hizmetlerini sağlar
2. **Frontend (React + TypeScript + Vite)**: Kullanıcı arayüzünü sağlar

## Backend (Spring Boot)

### Teknolojiler

- Java 17
- Spring Boot 3.x
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL (veritabanı)
- Maven (bağımlılık yönetimi)

### Özellikler

- **Kimlik Doğrulama**: JWT tabanlı güvenli oturum yönetimi
- **Yetkilendirme**: Rol tabanlı erişim kontrolü (USER, ADMIN)
- **Ürün Yönetimi**: Ürün ekleme, güncelleme, silme ve listeleme
- **Sipariş Yönetimi**: Sipariş oluşturma ve durumunu takip etme
- **Kullanıcı Yönetimi**: Kullanıcı kaydı, giriş ve profil yönetimi

### API Endpointleri

#### Kimlik Doğrulama

- `POST /api/auth/register`: Yeni kullanıcı kaydı
- `POST /api/auth/login`: Kullanıcı girişi

#### Ürün İşlemleri

- `GET /api/products`: Tüm ürünleri listele
- `GET /api/products/{id}`: Belirli bir ürünün detaylarını getir
- `POST /api/products`: Yeni ürün ekle (ADMIN)
- `PUT /api/products/{id}`: Ürün güncelle (ADMIN)
- `DELETE /api/products/{id}`: Ürün sil (ADMIN)

#### Sipariş İşlemleri

- `POST /api/orders`: Yeni sipariş oluştur
- `GET /api/orders/user/{userId}`: Kullanıcının siparişlerini getir
- `GET /api/orders/{id}`: Sipariş detaylarını getir
- `PUT /api/orders/{id}/status`: Sipariş durumunu güncelle (ADMIN)
- `PUT /api/orders/{id}/cancel`: Siparişi iptal et

#### Admin Paneli

- `GET /api/admin/users`: Tüm kullanıcıları listele
- `GET /api/admin/orders`: Tüm siparişleri listele
- `GET /api/admin/dashboard`: Dashboard istatistiklerini getir

### Kurulum

1. PostgreSQL veritabanını oluşturun
2. `application.properties` dosyasını güncelleyin:
   ```properties
   spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
   spring.datasource.username=yourUsername
   spring.datasource.password=yourPassword
   ```
3. Projeyi derleyin ve çalıştırın:
   ```bash
   chmod +x mvnw
   ./mvnw clean package
   java -jar target/SecureECommercePlatform-0.0.1-SNAPSHOT.jar
   ```

## Frontend (React + TypeScript + Vite)

### Teknolojiler

- React 18
- TypeScript
- Vite (build aracı)
- React Router (yönlendirme)
- Styled Components (stil)
- Axios (HTTP istekleri)
- React Icons

### Özellikler

#### Kullanıcı Arayüzü

- **Ana Sayfa**: Ürünleri listele
- **Ürün Detayı**: Ürün bilgilerini görüntüle ve sepete ekle
- **Sepet**: Sepet içeriğini görüntüle, düzenle ve satın al
- **Kullanıcı Profili**: Kullanıcı bilgilerini ve siparişleri görüntüle

#### Admin Paneli

- **Dashboard**: Satış ve kullanıcı istatistikleri
- **Ürün Yönetimi**: Ürün ekleme, düzenleme ve silme
- **Sipariş Yönetimi**: Sipariş durumunu güncelleme ve takip
- **Kullanıcı Yönetimi**: Kullanıcıları listeleme ve yönetme

### Kurulum

1. Bağımlılıkları yükleyin:
   ```bash
   cd frontend
   npm install
   ```

2. Geliştirme sunucusunu başlatın:
   ```bash
   npm run dev
   ```

3. Üretim derlemesi:
   ```bash
   npm run build
   ```

### Kullanım Klavuzu

#### Kullanıcı İşlemleri

1. **Kayıt Olma**:
   - "Kayıt Ol" bağlantısına tıkla
   - Gerekli bilgileri doldur (kullanıcı adı, email, şifre)
   - Formu gönder

2. **Giriş Yapma**:
   - "Giriş Yap" bağlantısına tıkla
   - Kullanıcı adı ve şifreni gir
   - Giriş yap butonuna tıkla

3. **Ürün İnceleme**:
   - Ana sayfada ürünlere göz at
   - Detaylar için ürüne tıkla

4. **Sepete Ekleme**:
   - Ürün detay sayfasında miktar seç
   - "Sepete Ekle" butonuna tıkla

5. **Sipariş Verme**:
   - Sepet ikonuna tıkla
   - Sepet sayfasında siparişi gözden geçir
   - "Satın Al" butonuna tıkla

#### Admin İşlemleri

1. **Admin Paneline Erişim**:
   - Admin yetkili hesapla giriş yap
   - "Admin Panel" bağlantısına tıkla

2. **Ürün Yönetimi**:
   - Yeni ürün ekle: "+ Yeni Ürün" butonuna tıkla
   - Ürün düzenle: Ürünün yanındaki düzenle ikonuna tıkla
   - Ürün sil: Ürünün yanındaki sil ikonuna tıkla

3. **Sipariş Yönetimi**:
   - Siparişleri görüntüle
   - Sipariş durumunu güncelle

## Güvenlik Özellikleri

- JWT tabanlı kimlik doğrulama ve yetkilendirme
- Rol tabanlı erişim kontrolü
- Şifre hashlenme (BCrypt)
- Input doğrulama ve sanitasyon
- CORS koruması
- CSRF koruması

## Bilinen Sorunlar ve Çözümleri

- **Sipariş oluşturulamıyor (400 Bad Request)**: Bu durumda tarayıcı konsolundaki hata detaylarını kontrol edin. Genellikle token eksikliği veya ürün bilgilerinin uyumsuzluğu nedeniyle olabilir.
  - **Çözüm**: Kullanıcı oturumunuzu kontrol edin ve sepette geçerli ürünler olduğundan emin olun.

- **Token hatası (401 Unauthorized)**: Geçersiz veya süresi dolmuş token.
  - **Çözüm**: Çıkış yapıp tekrar giriş yapın.

## Katkıda Bulunma

1. Bu repoyu fork edin
2. Kendi branch'inizi oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## Lisans

MIT Lisansı altında dağıtılmaktadır. Daha fazla bilgi için `LICENSE` dosyasına bakın.

---

# İletişim

Batuhan Yalçın - [GitHub](https://github.com/Batuhan-Yalcin) - batuhanyalcin5834@gmail.com
