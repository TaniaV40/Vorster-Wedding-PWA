
import React, { useState, useRef, useEffect } from 'react';
import { apiService } from '../services/apiService';

const Gallery: React.FC = () => {
  const [photos, setPhotos] = useState<Array<{ id: string; url: string; likes: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [likedPhotos, setLikedPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const data = await apiService.getGallery();
      setPhotos(data);
    } catch (err) {
      console.error('Failed to fetch gallery photos:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load liked photos from localStorage
    const saved = localStorage.getItem('liked_photos');
    if (saved) {
      try {
        setLikedPhotos(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading liked photos:', e);
      }
    }
    fetchPhotos();
  }, []);

  const handleLike = async (photoId: string) => {
    if (likedPhotos.includes(photoId)) return;

    // Snappy UX: increment immediately locally
    setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: p.likes + 1 } : p));
    const newLiked = [...likedPhotos, photoId];
    setLikedPhotos(newLiked);
    localStorage.setItem('liked_photos', JSON.stringify(newLiked));

    try {
      const res = await apiService.likePhoto(photoId);
      // Align with server returned exact count
      setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: res.likes } : p));
    } catch (err) {
      console.error('Failed to like photo:', err);
      // Rollback on failure
      setPhotos(prev => prev.map(p => p.id === photoId ? { ...p, likes: Math.max(0, p.likes - 1) } : p));
      const rolledBack = likedPhotos.filter(id => id !== photoId);
      setLikedPhotos(rolledBack);
      localStorage.setItem('liked_photos', JSON.stringify(rolledBack));
    }
  };

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > 35) {
        alert('File is too large. Please select a photo or video under 35 MB.');
        return;
      }
      setUploading(true);
      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
          const base64 = event.target?.result as string;
          await apiService.uploadPhoto({
            base64,
            filename: file.name,
            mimeType: file.type,
            guestName: 'Guest'
          });
          await fetchPhotos();
        } catch (err) {
          console.error('Failed to upload photo:', err);
          alert('Failed to upload photo. Please try again.');
        } finally {
          setUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-20 px-4 max-w-5xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-serif text-gold italic mb-2">Our Moments</h2>
        <p className="text-xs uppercase tracking-widest text-gray-400">Captured by family & friends</p>
        <div className="mt-8">
          <button 
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="px-8 py-3 bg-gold text-black rounded-full uppercase tracking-widest text-xs font-bold hover:scale-105 transition-transform disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Upload a Moment'}
          </button>
          <p className="text-[10px] text-gray-400 mt-3 max-w-md mx-auto leading-relaxed border border-gold/15 bg-black/35 py-2.5 px-4 rounded-lg">
            <span className="text-[#e1b382] font-bold">Video Note:</span> We welcome short clips! Please only upload videos that are <span className="text-white font-semibold">10 to 20 seconds</span> long or compressed (max 35 MB).<br />
            <span className="text-gray-400 italic mt-1 block">WhatsApp Jessica for longer videos.</span>
          </p>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleUpload} 
            className="hidden" 
            accept="image/*,video/*"
          />
        </div>
      </div>

      <div className="columns-2 md:columns-3 gap-4 space-y-4">
        {photos.map((photo) => {
          const isVideo = photo.url.includes('#video');
          return (
            <div key={photo.id} className="relative group overflow-hidden rounded-lg break-inside-avoid shadow-xl bg-black">
              {isVideo ? (
                <video 
                  src={photo.url} 
                  controls
                  className="w-full h-auto"
                  preload="metadata"
                />
              ) : (
                <img 
                  src={photo.url} 
                  alt="Wedding moment" 
                  className="w-full h-auto grayscale group-hover:grayscale-0 transition-all duration-700"
                  loading="lazy"
                />
              )}
              <div className="absolute inset-x-0 bottom-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex justify-end items-center p-3 pointer-events-none z-10">
                <button 
                  onClick={() => handleLike(photo.id)}
                  disabled={likedPhotos.includes(photo.id)}
                  className="flex items-center gap-2 text-white text-xs pointer-events-auto bg-black/40 hover:bg-black/60 px-3 py-1.5 rounded-full border border-[#e1b382]/30 hover:border-[#e1b382]/60 transition-all active:scale-95 disabled:pointer-events-none"
                >
                  <svg 
                    className={`w-4 h-4 transition-transform duration-300 ${likedPhotos.includes(photo.id) ? 'text-red-500 fill-current scale-125' : 'text-gray-300 fill-none stroke-current hover:text-red-400'}`} 
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                  >
                    <path d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                  </svg>
                  <span className="font-sans font-bold">{photo.likes}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gallery;
