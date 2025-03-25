
Secure E-Commerce Platform (Backend - Spring Boot)
📌 Proje Özeti
Bu proje, Spring Boot, Spring Security, JWT ve Spring Data JPA kullanarak geliştirilen güvenli bir e-ticaret platformunun backend kısmını içermektedir.

🚀 Kullanılan Teknolojiler
Spring Boot

Spring Security & JWT

Spring Data JPA & POSTGRESQL

JUnit (Testler)

🔑 Özellikler
JWT Authentication: Güvenli kullanıcı doğrulama sistemi.

Rol Bazlı Yetkilendirme: Admin ve kullanıcı yetkilendirmesi.

Ürün İşlemleri: Ürün ekleme, güncelleme, silme (Sadece adminler).

Sipariş Yönetimi: Sipariş oluşturma ve sipariş geçmişini görüntüleme.

📂 API Endpointleri
Kullanıcı İşlemleri
POST /api/auth/login – Kullanıcı girişi.

POST /api/auth/register – Kullanıcı kaydı.

Ürün İşlemleri (Admin Yetkisi Gerekir)
POST /api/products – Ürün ekleme.

GET /api/products/{id} – Ürün detaylarını getir.

Sipariş İşlemleri
POST /api/orders – Sipariş oluştur.

GET /api/orders/{userId} – Kullanıcıya ait siparişleri getir.
