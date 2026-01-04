import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import { renderToStaticMarkup } from 'react-dom/server'; 
import 'leaflet/dist/leaflet.css';
import './App.css'; 

// Supabase Bağlantısı
import { supabase } from './supabase';

// İkonlar
import { ShieldAlert, HeartPulse, HelpCircle, Footprints, Camera, Plus, X, Navigation, AlertTriangle, Image as ImageIcon } 
from 'lucide-react';
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

// --- İKON OLUŞTURUCU ---
const getMarkerIcon = (typeLabel) => {
  let iconColor = '#6c757d'; 
  let IconComponent = HelpCircle;

  switch (typeLabel) {
    case 'Yırtıcı Hayvan': iconColor = '#d62828'; IconComponent = Footprints; break;
    case 'Çit Hasarı': iconColor = '#f77f00'; IconComponent = ShieldAlert; break;
    case 'Yaralı Hayvan': iconColor = '#fcbf49'; IconComponent = HeartPulse; break;
    case 'Terk Edilmiş Sürü': iconColor = '#8e44ad'; IconComponent = AlertTriangle; break;
    default: break;
  }

  const iconHtml = renderToStaticMarkup(
    <div style={{
      backgroundColor: iconColor, width: '40px', height: '40px', borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: '0 3px 8px rgba(0,0,0,0.4)', border: '2px solid white', color: 'white'
    }}>
      <IconComponent size={22} strokeWidth={2.5} />
    </div>
  );

  return L.divIcon({
    html: iconHtml, className: 'custom-marker-icon', iconSize: [40, 40], iconAnchor: [20, 20], popupAnchor: [0, -20]
  });
};

// --- BİLEŞENLER ---

const TypeSelector = ({ onSelect, onClose }) => {
  const types = [
    { id: 'yirtici', label: 'Yırtıcı Hayvan', desc: 'Kurt, ayı vb.', icon: <Footprints size={28} color="#d62828" /> },
    { id: 'cit', label: 'Çit Hasarı', desc: 'Kırık, delik çit', icon: <ShieldAlert size={28} color="#f77f00" /> },
    { id: 'yarali', label: 'Yaralı Hayvan', desc: 'Veteriner gerekir', icon: <HeartPulse size={28} color="#fcbf49" /> },
    { id: 'suru', label: 'Terk Edilmiş Sürü', desc: 'Sahipsiz hayvanlar', icon: <AlertTriangle size={28} color="#8e44ad" /> },
    { id: 'diger', label: 'Diğer', desc: 'Farklı bir tehlike', icon: <HelpCircle size={28} color="#6c757d" /> },
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center', marginBottom: '15px'}}>
            <h3 style={{margin:0}}>Tehlike Türü Seçin</h3>
            <button onClick={onClose} style={{background:'none', border:'none', cursor:'pointer'}}><X size={24} /></button>
        </div>
        <div className="type-grid">
          {types.map((t) => (
            <div key={t.id} className="type-button" onClick={() => onSelect(t)}>
              <div className="type-icon">{t.icon}</div>
              <strong>{t.label}</strong>
              <small style={{color:'#666', fontSize:'12px'}}>{t.desc}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- GÜNCELLENMİŞ DETAY FORMU ---
const DetailForm = ({ selectedType, location, onSubmit, onBack, isSaving }) => {
  const [note, setNote] = useState("");
  const [selectedFile, setSelectedFile] = useState(null); // Dosya için state
  const [preview, setPreview] = useState(null); // Önizleme için state

  if (!location) return null; 

  // Dosya seçilince çalışır
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        setSelectedFile(file);
        // Önizleme oluştur
        const objectUrl = URL.createObjectURL(file);
        setPreview(objectUrl);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <div style={{marginBottom:'20px'}}>
             <button onClick={onBack} style={{background:'none', border:'none', cursor:'pointer', fontSize: '16px'}}>← Geri</button>
        </div>
        
        <div style={{background: '#f8f9fa', padding:'15px', borderRadius:'12px', marginBottom:'15px', display:'flex', alignItems:'center', gap:'15px', border:'1px solid #eee'}}>
            <div style={{transform: 'scale(1.2)'}}>{selectedType.icon}</div>
            <div>
                <strong style={{fontSize:'18px', display:'block'}}>{selectedType.label}</strong>
                <span style={{fontSize:'13px', color:'#666'}}>Konum: {location?.lat?.toFixed(5)}, {location?.lng?.toFixed(5)}</span>
            </div>
        </div>

        <div className="form-group">
          <label style={{display:'block', marginBottom:'5px', fontWeight:'bold'}}>Kısa Not Ekle</label>
          <textarea className="form-textarea" rows="3" placeholder="Örn: 3 tane kurt görüldü..." value={note} onChange={(e) => setNote(e.target.value)}></textarea>
        </div>

         {/* --- GÜNCELLENEN FOTOĞRAF ALANI --- */}
         <div className="form-group">
            <input 
                type="file" 
                id="photo-upload" 
                accept="image/*" 
                style={{display: 'none'}} 
                onChange={handleFileChange}
            />
            <label htmlFor="photo-upload" style={{
                border:'2px dashed #ccc', 
                padding:'20px', 
                textAlign:'center', 
                borderRadius:'10px', 
                color:'#888', 
                marginTop: '15px', 
                cursor: 'pointer',
                display: 'block',
                backgroundColor: preview ? '#f0f0f0' : 'transparent'
            }}>
                {preview ? (
                    <div style={{position:'relative'}}>
                        <img src={preview} alt="Önizleme" style={{maxHeight: '150px', maxWidth: '100%', borderRadius:'8px'}} />
                        <div style={{marginTop:'5px', fontSize:'12px', color:'#333'}}>Değiştirmek için tıkla</div>
                    </div>
                ) : (
                    <>
                        <Camera size={40} />
                        <p style={{margin:'5px 0 0 0'}}>Fotoğraf Yüklemek İçin Tıkla</p>
                    </>
                )}
            </label>
        </div>

        <button 
          className="submit-btn" 
          // Notu ve dosyayı gönderiyoruz
          onClick={() => onSubmit(note, selectedFile)} 
          style={{marginTop: '15px', opacity: isSaving ? 0.7 : 1}}
          disabled={isSaving}
        >
          {isSaving ? 'YÜKLENİYOR...' : 'HERKESE BİLDİR'}
        </button>
      </div>
    </div>
  );
};

// --- ANA UYGULAMA ---

function App() {
  const [markers, setMarkers] = useState([]); 
  const [appState, setAppState] = useState('MAP'); 
  const [tempLocation, setTempLocation] = useState(null); 
  const [selectedType, setSelectedType] = useState(null); 
  const [isSaving, setIsSaving] = useState(false); 
  const [userPos, setUserPos] = useState(null);
  const mapRef = useRef(null);

  const locateUser = () => {
    if (!navigator.geolocation) { alert("Konum desteklenmiyor."); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const latlng = { lat: latitude, lng: longitude };
        setUserPos(latlng);
        if (mapRef.current) mapRef.current.flyTo([latitude, longitude], 15);
      },
      (error) => { console.error("Konum hatası:", error); },
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    const fetchReports = async () => {
      const { data } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
      setMarkers(data || []);
    };
    fetchReports();
    locateUser();

    const channel = supabase.channel('realtime-reports')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'reports' }, (payload) => {
        setMarkers((prev) => [payload.new, ...prev]);
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const handleAddClick = () => {
    if (mapRef.current) {
      setTempLocation(mapRef.current.getCenter());
      setAppState('SELECT_TYPE'); 
    }
  };

  // --- GÜNCELLENEN GÖNDERME FONKSİYONU ---
  const handleSubmit = async (note, file) => {
    if (!tempLocation) return;
    setIsSaving(true);
    
    try {
        let uploadedImageUrl = null;

        // 1. Eğer dosya seçildiyse önce Supabase Storage'a yükle
        if (file) {
            const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '')}`; // Türkçe karakterleri temizle
            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('tehlike-fotolari')
                .upload(fileName, file);

            if (uploadError) {
                console.error('Fotoğraf yükleme hatası:', uploadError);
                throw new Error("Fotoğraf yüklenemedi!");
            }

            // 2. Yüklenen dosyanın herkese açık linkini al
            const { data: urlData } = supabase.storage
                .from('tehlike-fotolari')
                .getPublicUrl(fileName);
            
            uploadedImageUrl = urlData.publicUrl;
        }

        // 3. Veritabanına kaydet (Resim linkiyle beraber)
        const { error } = await supabase.from('reports').insert([{
            lat: tempLocation.lat,
            lng: tempLocation.lng,
            typeLabel: selectedType.label,
            note: note,
            imageUrl: uploadedImageUrl, // Yeni sütun
            dateString: new Date().toLocaleString()
        }]);

        if (error) throw error;

        setAppState('MAP'); 
        setTempLocation(null);

    } catch (error) {
      alert("Hata: " + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="map-container" style={{ width: "100vw", height: "100vh", position: "relative" }}>
      <MapContainer center={[39.92, 32.85]} zoom={6} style={{ height: "100%", width: "100%" }} ref={mapRef} whenCreated={(map) => { mapRef.current = map; }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />

        {userPos && (
             <CircleMarker center={[userPos.lat, userPos.lng]} radius={8} pathOptions={{ color: 'white', fillColor: '#2196F3', fillOpacity: 1, weight: 2 }}>
                <Popup>Şu an buradasınız</Popup>
             </CircleMarker>
        )}

        {markers.map((m) => (
          <Marker key={m.id} position={[m.lat, m.lng]} icon={getMarkerIcon(m.typeLabel)}>
            <Popup>
              <strong>{m.typeLabel}</strong> <br/>
              {m.note} <br/>
              {/* Fotoğraf varsa göster */}
              {m.imageUrl && (
                  <div style={{marginTop:'5px', marginBottom:'5px'}}>
                      <img src={m.imageUrl} alt="Tehlike" style={{width:'100%', borderRadius:'5px', maxHeight:'150px', objectFit:'cover'}} />
                  </div>
              )}
              <small style={{color:'#999'}}>{m.dateString}</small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {appState === 'MAP' && (
        <>
            <button className="add-button" onClick={locateUser} style={{ bottom: '100px', backgroundColor: 'white', color: '#333' }}>
                <Navigation size={28} />
            </button>
            <button className="add-button" onClick={handleAddClick}><Plus size={32} /></button>
        </>
      )}

      {appState === 'SELECT_TYPE' && <TypeSelector onSelect={(t) => { setSelectedType(t); setAppState('DETAILS'); }} onClose={() => setAppState('MAP')} />}

      {appState === 'DETAILS' && tempLocation && (
        <DetailForm selectedType={selectedType} location={tempLocation} onSubmit={handleSubmit} onBack={() => setAppState('SELECT_TYPE')} isSaving={isSaving} />
      )}
    </div>
  );
}

export default App;