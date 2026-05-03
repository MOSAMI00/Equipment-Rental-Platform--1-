import { X, MapPin, Search } from 'lucide-react';
import { useState } from 'react';

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (location: string) => void;
}

const CITIES = ['صنعاء', 'عدن', 'تعز', 'إب', 'الحديدة', 'حضرموت', 'مأرب', 'ذمار'];

export function LocationPickerModal({ isOpen, onClose, onSelect }: LocationPickerModalProps) {
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c => c.includes(search));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 relative shadow-xl flex flex-col max-h-[80vh]">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <MapPin className="w-6 h-6 text-primary" />
          تحديد الموقع
        </h2>

        <div className="relative mb-4">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="ابحث عن مدينة..."
            className="w-full h-11 pr-10 pl-4 rounded-xl border border-border bg-muted/50 focus:outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>

        <div className="flex-1 overflow-y-auto pr-1 space-y-1">
          {filteredCities.map(city => (
            <button
              key={city}
              onClick={() => { onSelect(city); onClose(); }}
              className="w-full text-right px-4 py-3 rounded-xl hover:bg-primary/5 hover:text-primary transition-colors font-medium border border-transparent hover:border-primary/20"
            >
              {city}
            </button>
          ))}
          {filteredCities.length === 0 && (
            <p className="text-center text-muted-foreground py-8">لا توجد نتائج</p>
          )}
        </div>
      </div>
    </div>
  );
}
