import { Rating } from '../../RatingsPage';

interface DistributionBarsProps {
  ratings: Rating[];
}

export function DistributionBars({ ratings }: DistributionBarsProps) {
  const total = ratings.length;

  return (
    <div className="flex-1 flex flex-col gap-1.5">
      {[5, 4, 3, 2, 1].map(star => {
        const count = ratings.filter(r => r.stars === star).length;
        const pct = total > 0 ? (count / total) * 100 : 0;
        return (
          <div key={star} className="flex items-center gap-2 text-xs">
            <span className="w-3 text-center opacity-75">{star}</span>
            <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F39C12] rounded-full transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="w-4 text-center opacity-75">{count}</span>
          </div>
        );
      })}
    </div>
  );
}
