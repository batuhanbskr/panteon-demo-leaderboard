# 🏆 Panteon Demo - Gerçek Zamanlı Liderlik Tablosu ve Ödül Sistemi

Bu proje, yüksek eşzamanlılığa (concurrency) sahip, performans odaklı ve tamamen TypeScript ile geliştirilmiş bir **Liderlik Tablosu (Leaderboard)** ve **Haftalık Ödül Dağıtım** sistemidir. 2 Milyondan fazla günlük aktif kullanıcıyı (DAU) destekleyebilecek vizyonla, Redis ve PostgreSQL kullanılarak stateless (durumsuz) bir mimaride tasarlanmıştır.

## 🚀 Canlı Demo
- **Frontend Uygulaması (Vercel):** [https://panteon-demo-leaderboard.vercel.app/](https://panteon-demo-leaderboard.vercel.app/)
- **Backend API (Render):** [https://panteon-backend.onrender.com/api](https://panteon-backend.onrender.com/api)

*(Not: Backend ücretsiz bir Render servisi üzerinde çalıştığından, uzun süre istek almadığında uyku moduna geçer. İlk açılışta yanıt gelmesi ~50 saniye sürebilir.)*

## ✨ Temel Özellikler

- ⚡ **Anlık Top 100 Görüntüleme:** Redis `ZSET` (Sorted Sets) altyapısı kullanılarak, veriler milyonlarca oyuncu arasında bile $O(\log N)$ zaman karmaşıklığı ile milisaniyeler içinde çekilir.
- 💰 **Dinamik Ödül Havuzu:** Oyuncuların kazandığı puanların %2'si anlık olarak haftalık ödül havuzunda birikir.
- ⚖️ **Akıllı Ödül Dağıtımı (Cron Job):** Her hafta çalışan otomatik görev ile biriken havuz dağıtılır. 1. sıraya %20, 2. sıraya %15, 3. sıraya %10 pay verilir. Geriye kalan %55'lik kısım ise 4. ve 100. sıralar arasındaki oyunculara tembel bir eşit dağılımla değil, `(n * (n + 1) / 2)` formülüyle ağırlıklı ve adil bir şekilde dağıtılır.
- 📌 **Dinamik "Sticky Rank Bar" (Yapışkan Bar):** Eğer kullanıcı ilk 100 listesinde değilse bile, kaçıncı sırada olduğunu aramak zorunda kalmaz. Alt kısımda beliren yapışkan bir bar aracılığıyla kullanıcının tam sırası, 3 üstündeki ve 2 altındaki rakipleriyle birlikte gösterilir (`ZREVRANK` ve `ZRANGE` kullanılarak).
- 🚀 **N+1 Problemsiz Bulk Update:** Ödül dağıtımı esnasında 100 ayrı veritabanı sorgusu (`UPDATE`) atmak yerine, PostgreSQL'in `UNNEST` fonksiyonu ile tek bir gidiş-dönüşte (round-trip) tüm ödüller güncellenir. Tam transaction güvenliği sağlanmıştır.
- 🤖 **Yapay Zeka Yorumcusu (AI Commentator):** Liderlik tablosundaki anlık durumu analiz edip, oyuncuların rekabet hissini artırmak için eğlenceli ve dinamik yorumlar üreten yapay zeka entegrasyonu.
- 🧪 **Simülasyon Botu:** Sistemi canlı tutmak ve test edebilmek için sürekli olarak rastgele oyunculara puan ekleyen arkaplan servisi.

## 🏗️ Mimari ve Teknoloji Yığını

Proje, istemci (client) ve sunucu (server) taraflarını kesin sınırlarla ayıran bir monorepo yapısında kurgulanmıştır.

### **Backend (`/panteon-server`)**
- **Node.js & Express.js:** Hızlı, hafif ve ölçeklenebilir REST API.
- **TypeScript:** Sıkı tip güvenliği ve gelişmiş geliştirici deneyimi.
- **Redis:** Liderlik tablosunun kalbi. Sıralama algoritmaları ve anlık performans gereksinimleri için kullanıldı.
- **PostgreSQL:** Kullanıcı cüzdan bakiyelerinin ve kalıcı verilerin güvenli bir şekilde saklandığı ana ilişkisel veritabanı.
- **Node-Cron:** Haftalık ödül havuzu dağıtımı ve sistem sıfırlaması için otomatik görev yöneticisi.
- **Google Generative AI:** Oyun içi spiker / yapay zeka yorumcusu entegrasyonu.

### **Frontend (`/panteon-client`)**
- **React (Vite) & TypeScript:** Modern, hızlı ve modüler kullanıcı arayüzü mimarisi.
- **Tailwind CSS:** Oyunlaştırma (gamification) temasına uygun, şık ve hızlı arayüz tasarımı.
- **Lucide React:** Modern ikon seti.

## ⚙️ Kurulum ve Çalıştırma (Lokal Ortam)

Projeyi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz. *Sisteminizde Node.js (v18+), PostgreSQL ve Redis kurulu olmalıdır.*

### 1. Backend Kurulumu

```bash
cd panteon-server
npm install
```

`panteon-server` dizini içerisinde bir `.env` dosyası oluşturun ve aşağıdaki değişkenleri tanımlayın:
```env
PORT=5000
DATABASE_URL=sizin_postgresql_baglanti_url_adresiniz
REDIS_URL=sizin_redis_baglanti_url_adresiniz
GEMINI_API_KEY=sizin_google_gemini_api_anahtariniz # AI Spiker için (Opsiyonel)
```

Sunucuyu başlatın:
```bash
npm run dev
```
*(İpucu: Sisteme hızlıca test verisi yüklemek için `http://localhost:5000/api/leaderboard/seed` adresine POST isteği göndererek 10.000 sahte kullanıcı oluşturabilirsiniz.)*

### 2. Frontend Kurulumu

Yeni bir terminal sekmesi açın:

```bash
cd panteon-client
npm install
```

`panteon-client` dizini içerisinde bir `.env` dosyası (veya `.env.development`) oluşturun:
```env
VITE_API_URL=http://localhost:5000/api
```

Geliştirme sunucusunu başlatın:
```bash
npm run dev
```

Uygulama başarılı bir şekilde derlendikten sonra tarayıcınızdan genellikle `http://localhost:5173` adresi üzerinden arayüze erişebilirsiniz.

Yapay zeka ile olan mimari tartışmaların ve geliştirici kararlarının tam detaylı dökümü için proje kök dizinindeki `AI_WORKFLOW.md` dosyasını inceleyebilirsiniz.