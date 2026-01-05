Küçükbaş ve Büyükbaş Hayvanlar İçin Topluluk Tabanlı Erken Uyarı Sistemi

Bu proje, kırsal alanda hayvancılıkla uğraşan üreticilerin; yırtıcı hayvan saldırısı, çit hasarı veya sürü kaybı gibi tehlikeleri harita üzerinden anlık olarak birbirlerine bildirmelerini sağlayan topluluk tabanlı bir erken uyarı sistemidir.

Waze veya Deprem Ağı mantığının, hayvancılık sektörü için özelleştirilmiş halidir.

Öne ÇIkan Özellikler

  Interaktif Harita: Kullanıcılar tehlikeleri kuş bakışı harita üzerinde görebilir (OpenStreetMap ve Leaflet).
  Gercek Zamanli (Realtime): Bir kullanıcı bildirim girdiği anda, diğer tüm kullanıcıların haritasında anlık olarak belirir. Sayfa yenilemeye gerek yoktur.
  GPS Konumlandirma: "Beni Bul" özelliği ile kullanıcının arazideki konumu yüksek hassasiyetle tespit edilir.
  Fotografli Kanit: Kullanıcılar tehlike anında fotoğraf çekip sisteme yükleyebilir.
  Mobil Uyumlu: Telefon ve tablet tarayıcılarında sorunsuz çalışacak şekilde tasarlanmıştır.
 Kullanilan Teknolojiler

Bu proje Modern Web Mimarisi kullanılarak geliştirilmiştir:

Frontend: React.js, Vite
Harita Altyapisi: Leaflet.js, React-Leaflet
Backend ve Veritabani:Supabase (PostgreSQL)
Depolama: Supabase Storage (Fotoğraflar için)
UI/Stil: CSS3, Lucide React

 Kurulum ve Calistirma

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyin.

1. Projeyi Klonlayin
Terminali açın ve projeyi indirin:

git clone https://github.com/sedakaya2504/harita-projesii.git
cd harita-projesii
2. Gerekli Paketleri Yukleyin Proje klasörü içindeyken bağımlılıkları yükleyin:npm install
3. Cevresel Degiskenleri (.env) Ayarlayin Projenin ana dizininde .env adında bir dosya oluşturun ve Supabase API anahtarlarınızı aşağıdaki formatta girin:Kod snippet'iVITE_SUPABASE_URL=[https://sizin-proje-id.supabase.co](https://sizin-proje-id.supabase.co)
VITE_SUPABASE_KEY=sizin-anon-public-key
4. Uygulamayi BaslatinGeliştirme sunucusunu başlatmak için:npm run dev
Telefondan test etmek için (Bilgisayar ve telefon aynı Wi-Fi ağında olmalıdır):npm run dev -- --host
Veritabani Yapisi
Proje, Supabase üzerinde "reports" adında tek bir tablo kullanır. Tablo yapısı şöyledir:
<img width="515" height="864" alt="image" src="https://github.com/user-attachments/assets/29885ab1-3f6b-4fc0-887c-8ba755673ec0" />


