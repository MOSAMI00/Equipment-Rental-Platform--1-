import { Star } from 'lucide-react';

interface AverageScoreProps {
  avgRating: number;
}

export function AverageScore({ avgRating }: AverageScoreProps) {
  return (
    <div className="text-center">
      <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
      <div className="flex justify-center gap-0.5 mt-1">
        {[1, 2, 3, 4, 5].map(s => (
          <Star
            key={s}
            className="w-4 h-4"
            fill={avgRating >= s ? '#F39C12' : 'rgba(255,255,255,0.3)'}
            stroke="none"
          />
        ))}
      </div>
      <p className="text-xs opacity-75 mt-1">متوسط التقييم</p>
    </div>
  );
}
