
// TODO: Delete this file 
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { SummaryCard } from './Main/SummaryCard/SummaryCard';
import { FilterTabs } from './Main/FilterTabs';
import { RatingsList } from './Main/RatingsList/RatingsList';
import { PendingForms } from './Main/PendingForms/PendingForms';
import {
  formatRentalDate,
  getEquipmentSnapshot,
  useRentalPlatform,
} from '../../../../data/mock-api';

export type RatingTab = 'received' | 'sent' | 'pending';

export interface Rating {
  id: string;
  equipment: string;
  person: string;
  stars: number;
  comment: string;
  date: string;
  image: string;
}

const RECEIVED: Rating[] = [
  { id: 'received-1', equipment: 'مولد كهرباء', person: 'محمد سالم (مؤجر)', stars: 5, comment: 'مستأجر ممتاز، يحترم المواعيد ويعامل المعدة بعناية.', date: '04 مايو 2026', image: '👤' },
  { id: 'received-2', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 4, comment: 'مستأجر جيد، أعاد المعدة بحالة ممتازة.', date: '25 أبريل 2026', image: '👤' },
];

export function RatingsPage() {
  const [searchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('orderId');
  const { rentals, reviews, submitReview } = useRentalPlatform();
  const [activeTab, setActiveTab] = useState<RatingTab>('pending');
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const sentRatings: Rating[] = reviews.map((review) => {
    const rental = rentals.find((item) => item.id === review.rentalOpId);
    const equipment = rental ? getEquipmentSnapshot(rental.equipmentId) : undefined;
    return {
      id: review.id,
      equipment: equipment?.name ?? 'طلب إيجار',
      person: equipment ? `${equipment.ownerName} (مؤجر)` : 'مؤجر',
      stars: review.rating,
      comment: review.reviewText,
      date: formatRentalDate(review.createdAt),
      image: equipment?.image ?? '⭐',
    };
  });

  const pendingRatings = useMemo(() => {
    const reviewedRentalIds = new Set(reviews.map((review) => review.rentalOpId));
    const pending = rentals
      .filter((rental) => rental.status === 'completed' && !reviewedRentalIds.has(rental.id))
      .map((rental) => {
        const equipment = getEquipmentSnapshot(rental.equipmentId);
        return {
          id: rental.id,
          orderNum: rental.orderNum,
          equipment: equipment.name,
          lessor: equipment.ownerName,
          ownerId: equipment.ownerId,
          image: equipment.image,
          date: formatRentalDate(rental.endDate),
        };
      });

    if (!selectedOrderId) return pending;
    return pending.sort((a, b) => (a.id === selectedOrderId ? -1 : b.id === selectedOrderId ? 1 : 0));
  }, [rentals, reviews, selectedOrderId]);

  const allRated = [...RECEIVED, ...sentRatings];
  const avgRating = allRated.length
    ? allRated.reduce((sum, rating) => sum + rating.stars, 0) / allRated.length
    : 0;
  const tabs = [
    { key: 'received' as RatingTab, label: 'مستلمة', count: RECEIVED.length },
    { key: 'sent' as RatingTab, label: 'مرسلة', count: sentRatings.length },
    { key: 'pending' as RatingTab, label: 'بانتظار التقييم', count: pendingRatings.length },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <SummaryCard received={RECEIVED} sent={sentRatings} avgRating={avgRating} />
      <FilterTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'received' && <RatingsList ratings={RECEIVED} />}
      {activeTab === 'sent' && <RatingsList ratings={sentRatings} />}
      {activeTab === 'pending' && (
        <PendingForms
          pendingRatings={pendingRatings}
          ratingValues={ratingValues}
          setRatingValues={setRatingValues}
          comments={comments}
          setComments={setComments}
          onSubmit={(item) => {
            submitReview({
              rentalOpId: item.id,
              targetType: 'user',
              targetId: item.ownerId,
              rating: ratingValues[item.id],
              reviewText: comments[item.id] || '',
            });
          }}
        />
      )}
    </div>
  );
}
