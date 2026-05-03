import { X, Filter } from 'lucide-react';
import { useState } from 'react';

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const [priceRange, setPriceRange] = useState([0, 50000]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="bg-white rounded-2xl w-full max-w-md p-6 relative shadow-xl">
        <button 
          onClick={onClose}
          className="absolute top-4 left-4 p-2 rounded-full hover:bg-muted transition-colors"
        >
          <X className="w-5 h-5 text-muted-foreground" />
        </button>

        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          <Filter className="w-6 h-6 text-primary" />
          تصفية النتائج
        </h2>

        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <h3 className="font-semibold mb-3">السعر (ريال يمني / يوم)</h3>
            <div className="flex items-center gap-4">
              <input
                type="number"
                value={priceRange[0]}
                onChange={e => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary focus:outline-none"
              />
              <span className="text-muted-foreground">إلى</span>
              <input
                type="number"
                value={priceRange[1]}
                onChange={e => setPriceRange([priceRange[0], parseInt(e.target.value) || 0])}
                className="w-full h-11 px-3 rounded-lg border border-border focus:border-primary focus:outline-none"
              />
            </div>
          </div>

          {/* Condition */}
          <div>
            <h3 className="font-semibold mb-3">الحالة</h3>
            <div className="flex gap-2">
              {['جديد', 'مستعمل - ممتاز', 'مستعمل - جيد'].map(cond => (
                <button key={cond} className="px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm">
                  {cond}
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div>
            <h3 className="font-semibold mb-3">القسم</h3>
            <div className="flex flex-wrap gap-2">
              {['معدات بناء', 'مولدات كهربائية', 'رافعات', 'معدات زراعية', 'أدوات خفيفة'].map(cat => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer bg-muted/50 px-3 py-2 rounded-lg border border-transparent hover:border-border transition-colors">
                  <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" />
                  <span className="text-sm">{cat}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-border mt-6">
            <button className="flex-1 h-12 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-colors">
              تطبيق الفلاتر
            </button>
            <button onClick={onClose} className="w-24 h-12 bg-muted text-foreground rounded-xl font-bold hover:bg-muted/80 transition-colors">
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
