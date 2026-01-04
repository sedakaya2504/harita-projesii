// React Leaflet ile Haritaya Tıklama Olayı
function HaritaIsaretleyici() {
  const [markers, setMarkers] = useState([]);

  // Haritaya tıklanınca çalışır
  useMapEvents({
    click(e) {
      const yeniMarker = {
        lat: e.latlng.lat,
        lng: e.latlng.lng,
        id: Date.now(), // Basit ID
        tip: "yirtici" // Varsayılan tip, burada modal açıp kullanıcıya seçtirmelisin
      };
      // State'i güncelle ve Backend'e gönder
      setMarkers([...markers, yeniMarker]);
    },
  });

  return (
    <>
      {markers.map((marker) => (
        <Marker 
          key={marker.id} 
          position={[marker.lat, marker.lng]} 
          icon={KurtIkonu} // İkonu tipe göre değiştirebilirsin
        >
          <Popup>Burada bir tehlike bildirildi!</Popup>
        </Marker>
      ))}
    </>
  );
}