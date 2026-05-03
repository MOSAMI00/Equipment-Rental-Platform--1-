import { Rating } from '../../RatingsPage';
import { AverageScore } from './AverageScore';
import { DistributionBars } from './DistributionBars';

interface SummaryCardProps {
  received: Rating[];
  sent: Rating[];
  avgRating: number;
}

export function SummaryCard({ received, sent, avgRating }: SummaryCardProps) {
  const allRatings = [...received, ...sent];

  return (
    <div className="bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] rounded-2xl p-5 mb-5 text-white">
      <h2 className="font-bold text-lg mb-3">تقييماتي</h2>
      <div className="flex items-center gap-6">
        <AverageScore avgRating={avgRating} />
        <DistributionBars ratings={allRatings} />
      </div>
    </div>
  );
}
