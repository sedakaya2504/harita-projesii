# Coban ve Ciftci Erken Uyari Sistemi

Bu proje, kırsal alanda hayvancılıkla uğraşan üreticilerin; yırtıcı hayvan saldırısı, çit hasarı veya sürü kaybı gibi tehlikeleri harita üzerinden anlık olarak birbirlerine bildirmelerini sağlayan topluluk tabanlı bir erken uyarı sistemidir.

Waze veya Deprem Ağı mantığının, hayvancılık sektörü için özelleştirilmiş halidir.

## One Cikan Ozellikler

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

git clone [https://github.com/KULLANICI_ADINIZ/harita-projesii(https://github.com/KULLANICI_ADINIZ/proje-isminiz.git)
cd harita-projesii
2. Gerekli Paketleri Yukleyin Proje klasörü içindeyken bağımlılıkları yükleyin:npm install
3. Cevresel Degiskenleri (.env) Ayarlayin Projenin ana dizininde .env adında bir dosya oluşturun ve Supabase API anahtarlarınızı aşağıdaki formatta girin:Kod snippet'iVITE_SUPABASE_URL=[https://sizin-proje-id.supabase.co](https://sizin-proje-id.supabase.co)
VITE_SUPABASE_KEY=sizin-anon-public-key
4. Uygulamayi BaslatinGeliştirme sunucusunu başlatmak için:npm run dev
Telefondan test etmek için (Bilgisayar ve telefon aynı Wi-Fi ağında olmalıdır):npm run dev -- --host
Veritabani Yapisi
Proje, Supabase üzerinde "reports" adında tek bir tablo kullanır. Tablo yapısı şöyledir:
Sutun Adi,Tip,Aciklama
id,int8,Benzersiz kayıt ID (Primary Key)
lat,float8,Enlem bilgisi
lng,float8,Boylam bilgisi
typeLabel,text,"Tehlike türü (Örn: Kurt, Çit Hasarı)"
note,text,Kullanıcı açıklaması
imageUrl,text,Fotoğraf linki
created_at,timestamp,Oluşturulma tarihi
