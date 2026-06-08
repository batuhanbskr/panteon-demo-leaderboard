# AI-Destekli Geliştirme İş Akışı (AI-Assisted Development Workflow)

Bu doküman, projenin geliştirme sürecinde yapay zeka araçlarının nasıl bir "Pair-Programmer" (Çalışma Arkadaşı) gibi konumlandırıldığını; stratejik mimari kararların ve temel mühendislik süreçlerinin ise nasıl yönetildiğini özetlemektedir. Temel felsefem: **Yapay zekayı kod yazan bir asistan olarak değil, kodu ölçeklendiren ve hızı artıran bir güç çarpanı olarak kullanmaktır.**

---

## 🛠 Kullanılan Araçlar

- **LLM (Gemini / Claude / ChatGPT):** Mimari fikir alışverişi (sparring), ileri seviye performans optimizasyonları, karmaşık TypeScript/yapılandırma hatalarının çözümü ve yazılan kodların "Code Review" süreçlerinde ortak akıl yürütmek için kullanıldı.
- **VS Code IntelliSense & GitHub Copilot:** Tekrar eden (boilerplate) kodların yazımı, interface tamamlama ve arayüz iskeletinin hızlı ve dogru ayağa kaldırılması için kullanıldı.

---

## 🧠 Yapay Zekanın Gücünden Faydalandığım Noktalar

Yapay zekayı, mimari vizyonuma uygun olarak angarya işleri hızlandırmak ve sistemin sınırlarını zorlamak için yönlendirdim:

1.  **Redis ZSET Optimizasyonu:** Başlangıçta sıralama için standart ilişkisel veritabanı sorguları kullanmayı planlarken, AI ile yapılan mimari tartışmalar sonucunda sistemi Redis `Sorted Sets` (`zAdd`, `zRangeWithScores`, `zRevRank`) yapısına geçirdik. Bu sayede 2 Milyon+ DAU (Günlük Aktif Kullanıcı) gereksinimini **O(log(N))** zaman karmaşıklığı ile anında yanıt verebilen, tamamen _stateless_ bir yapıya kavuşturduk.
2.  **PostgreSQL Bulk Update (UNSET Fonksiyonunun keşfi):** Haftalık ödül dağıtımı yapan Cron Job'ın 100 oyuncuya tek tek `UPDATE` atmasının yaratacağı veritabanı darboğazını (bottleneck) aşmak için AI ile beyin fırtınası yaptık. Sonuç olarak, işlemleri tek bir transaction içinde çözen gelişmiş bir `UNNEST` SQL fonksiyonunu keşfettik.
3.  **İleri Seviye Performans İyileştirmeleri (React `useMemo`):** Liderlik tablosundaki anlık güncellemelerde tüm sayfanın yeniden render edilmesini önlemek amacıyla, AI yardımıyla `App.tsx` içerisinde `useMemo` yapıları kurarak sadece verisi değişen satırların güncellenmesini sağladık.
4.  **Arayüz (Tailwind CSS) Üretimi:** Tasarımın koda dökülmesi sürecini hızlandırmak için CSS ve Tailwind sınıflarının %95'i AI'a yazdırıldı. Bu süreçte bir "Tech Lead" gibi davranarak üretilen kodun responsive yapısını ve component hiyerarşisini ben denetledim (Review & Direct).
5.  **Mock Data (Test Verisi) Entegrasyonu:** Sistemin performansını gerçekçi koşullarda test edebilmek için 10.000+ kullanıcıyı ve cüzdan bakiyesini saniyeler içinde içeri basan _seed_ algoritması AI ile ortaklaşa geliştirildi.
6.  **Hata Kontrolleri ve TypeScript Yapılandırması:** Vite ve Tailwind kurulumlarında yaşanan `verbatimModuleSyntax` ve ES Module / CommonJS çakışmaları gibi derleyici seviyesindeki hatalar AI'ın yönlendirmeleriyle hızlıca izole edilip çözüldü.

---

## 👨‍💻 Kendi Mühendisliğimi ve Kararlarımı Kattığım Noktalar (Core Architecture)

Kodun yazım hızı AI ile artırılmış olsa da, sistemin temelleri, mantığı ve sürdürülebilirliği tamamen kendi mimari kararlarıma dayanmaktadır:

1.  **Ana Mimari ve Ölçeklenebilirlik Vizyonu:** Projenin uçtan uca mimarisi, veritabanı şemaları, sistemin _stateless_ yapısı ve performans sınırlarının belirlenmesi tamamen tarafımca tasarlandı. Frontend ve Backend arasındaki veri akışı algoritmalarının temelleri benim tarafımdan atıldı.
2.  **Ağırlıklı Ödül Dağıtım Algoritması (Game Design):** Case gereksinimi olan "havuzun %55'inin 4. ile 100. sıralar arasına dağıtılması" kuralını tembel bir eşit dağılımla yapmak yerine oyuna adalet katmak istedim. Matematiksel bir formül olan `(n * (n + 1) / 2)` yapısını algoritmaya entegre ederek, 4. sıradaki oyuncunun 100. sıradaki oyuncudan çok daha anlamlı ve yüksek bir ödül almasını sağladım.
3.  **Akıllı UI/UX Stratejisi (Sticky Rank Bar):** Oyuncuların binlerce veri arasında kaybolmadan veya sayfalama (pagination) beklemeksizin kendi sırasını anında görebilmesi şarttı. Bu gereksinimi karşılamak için kullanıcının ilk 100'de olmadığı durumlarda ekranın altında beliren, sırasını ve en yakın rakiplerini gösteren dinamik bir _Sticky Bar_ arayüzü tasarladım.
4.  **Temiz Mimari, Component Reusability & SOLID:** Sistemin sürdürülebilirliği adına arayüzü `Header`, `LeaderboardTable` ve `PlayerRow` gibi birbirinden tamamen bağımsız, tekrar kullanılabilir (reusable) component'lere böldüm. Kodun olabildiğince sade, SOLID prensiplerine uygun (tek sorumluluk) ve başka bir geliştirici tarafından anında anlaşılabilecek temizlikte olmasına özen gösterdim.
5.  **İşlem Güvenliği (Transaction Safety):** Kritik finansal işlemlerin yönetildiği haftalık Cron Job sürecinde `BEGIN`, `COMMIT` ve `ROLLBACK` kurallarını manuel olarak zorunlu kıldım. Dağıtımın tam ortasında sunucu çökse dahi veritabanı kilitlenerek geri alınır; hiçbir oyuncunun sanal parası kaybolmaz veya mükerrer dağıtılmaz.
6.  **N+1 Probleminden Kaçınma ve Bulk Update (Toplu Güncelleme) Stratejisi:** Ödül dağıtımı senaryosunda sıkça düşülen "for döngüsü içinde her oyuncu için ayrı bir veritabanı sorgusu atma" (N+1 problemi) tuzağından bilinçli olarak kaçındım. 100 ayrı `UPDATE` işlemi atıp I/O darboğazı yaratmak ve veritabanı bağlantı havuzunu (connection pool) yormak yerine, PostgreSQL'in gücünden faydalandım. `UNNEST` fonksiyonunu kullanarak oyuncu ID'lerini ve kazanılan ödülleri eşleştiren, 100 farklı güncellemeyi tek bir veritabanı gidiş-dönüşünde (round-trip) ve milisaniyeler içinde çözen yüksek performanslı bir Bulk Update mimarisi kurguladım.
7.  **Gerek Görülmeyen ve Fazlalık Olabilecek Teknolojilerin Kapsam Dışı Bırakılması:**Proje gereksinimlerinde belirtilen teknoloji yığınından Node.js, PostgreSQL ve Redis kullanılmıştır. Liderlik tablosunun anlık okunması için Redis, ödül verisi bütünlüğü için PostgreSQL tercih edilmiştir. Mevcut yığında yer alan MongoDB, mevcut gereksinimler doğrultusunda bu spesifik servise yapısal bir avantaj sağlamayacağı için, over-engineering'den kaçınılarak mimariye dahil edilmemiştir.
8.  **Yapay Zeka Entegrasyonu:** Vakit olması sebebi ile projeye AI Entegrasyon ekleme fikri geliştirdim. Bunu bir chatbot gibi kompleks ve sırf yapmak için yapmak istemedim. Onun yerine slider şeklinde bir leaderboard anlatımı daha görsel olarak hoş ve kullanıcıyı bu yazılarda isminin geçmek istemesi üzerine daha fazla oyunu oynama isteğinin kabarmasını amaçladım.
