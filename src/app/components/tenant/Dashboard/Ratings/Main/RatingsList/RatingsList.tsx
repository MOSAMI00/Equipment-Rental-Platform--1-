import { RatingCard } from './RatingCard';
import { Rating } from '../../RatingsPage';

interface RatingsListProps {
  ratings: Rating[];
}

export function RatingsList({ ratings }: RatingsListProps) {
  return (
    <div className="flex flex-col gap-3">
      {ratings.map(r => <RatingCard key={r.id} rating={r} />)}
    </div>
  );
}
