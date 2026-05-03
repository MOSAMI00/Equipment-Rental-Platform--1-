import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

export function PhotoUploader({ label }: { label: string }) {
  const [photos, setPhotos] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const url = URL.createObjectURL(file);
      setPhotos(prev => [...prev, url]);
    });
  };

  return (
    <div>
      <p className="text-sm font-semibold text-[#222222] mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {photos.map((url, i) => (
          <img key={i} src={url} alt="" className="w-20 h-20 rounded-xl object-cover border border-[#E0E0E0]" />
        ))}
        <button
          onClick={() => inputRef.current?.click()}
          className="w-20 h-20 rounded-xl border-2 border-dashed border-[#E0E0E0] flex flex-col items-center justify-center text-[#888888] hover:border-[#2D5A27] hover:text-[#2D5A27] hover:bg-[#EAF3E9] transition-all"
        >
          <Camera className="w-5 h-5 mb-1" />
          <span className="text-[10px]">رفع صورة</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleUpload} />
      </div>
    </div>
  );
}
