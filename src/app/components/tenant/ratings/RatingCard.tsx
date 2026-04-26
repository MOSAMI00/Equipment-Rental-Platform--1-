import { StarRating } from './StarRating';

interface Rating {
  id: string;
  equipment: string;
  person: string;
  stars: number;
  comment: string;
  date: string;
  image: string;
}

export function RatingCard({ rating }: { rating: Rating }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-2xl flex-shrink-0">
          {rating.image}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#222222] text-sm">{rating.equipment}</p>
          <p className="text-xs text-[#888888]">{rating.person}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={rating.stars} />
            <span className="font-bold text-[#F39C12] text-sm">{rating.stars}.0</span>
          </div>
        </div>
        <span className="text-xs text-[#888888]">{rating.date}</span>
      </div>
      <p className="text-sm text-[#888888] bg-[#F4F6F9] rounded-xl p-3 leading-relaxed">
        "{rating.comment}"
      </p>
    </div>
  );
}
