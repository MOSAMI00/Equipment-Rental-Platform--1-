import { useState } from 'react';
import { Star } from 'lucide-react';

export function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl transition-all ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className="w-6 h-6 transition-colors"
            fill={(hover || value) >= star ? '#F39C12' : 'none'}
            stroke={(hover || value) >= star ? '#F39C12' : '#E0E0E0'}
          />
        </button>
      ))}
    </div>
  );
}
