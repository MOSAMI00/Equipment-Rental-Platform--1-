import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { useRentalPlatform, getEquipmentSnapshot, formatRentalDate } from '../../data/mock-api';
import { getReviewsConfig } from './reviewsConfig';
import { ReviewSummary } from './ReviewSummary';
import { ReviewCard } from './ReviewCard';
import { PageHeader, EmptyState } from '../../components/shared';

const RECEIVED_MOCK = [
  { id: 'received-1', equipment: 'مولد كهرباء', person: 'محمد سالم (مؤجر)', stars: 5, comment: 'مستأجر ممتاز، يحترم المواعيد ويعامل المعدة بعناية.', date: '04 مايو 2026', image: '👤' },
  { id: 'received-2', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 4, comment: 'مستأجر جيد، أعاد المعدة بحالة ممتازة.', date: '25 أبريل 2026', image: '👤' },
];

export default function ReviewsPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getReviewsConfig(role);
  const [searchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('orderId');
  const [activeTab, setActiveTab] = useState(config.tabs[0]);

  const { rentals, reviews, submitReview } = useRentalPlatform();

  const sentReviews = useMemo(() => {
    if (role === 'owner') return [];
    return reviews.map((review) => {
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
  }, [reviews, rentals, role]);

  const receivedReviews = useMemo(() => {
    if (role === 'owner') {
      const ownerId = user?.id || 'owner-1';
      return reviews
        .filter((review) => review.targetId === ownerId)
        .map((review) => {
          const rental = rentals.find((item) => item.id === review.rentalOpId);
          const equipment = rental ? getEquipmentSnapshot(rental.equipmentId) : undefined;
          return {
            id: review.id,
            equipment: equipment?.name ?? 'معدة غير معروفة',
            person: review.reviewerId || 'مستأجر',
            stars: review.rating,
            comment: review.reviewText,
            date: formatRentalDate(review.createdAt),
            image: '👤',
          };
        });
    } else {
      return RECEIVED_MOCK;
    }
  }, [reviews, rentals, role, user?.id]);

  const pendingReviews = useMemo(() => {
    if (role === 'owner') return [];
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
  }, [rentals, reviews, selectedOrderId, role]);

  const [ratingValues, setRatingValues] = useState({});
  const [comments, setComments] = useState({});

  const handlePendingSubmit = (item) => {
    submitReview({
      rentalOpId: item.id,
      targetType: 'user',
      targetId: item.ownerId,
      rating: ratingValues[item.id],
      reviewText: comments[item.id] || '',
    });
  };

  const getDisplayedList = () => {
    if (activeTab === 'مستلمة' || activeTab === 'التقييمات المستلمة') return receivedReviews;
    if (activeTab === 'مرسلة') return sentReviews;
    return [];
  };

  const displayedList = getDisplayedList();

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader title={config.pageTitle} />

      <ReviewSummary reviews={role === 'owner' ? receivedReviews : [...receivedReviews, ...sentReviews]} />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-[#E0E0E0] pb-2">
        {config.tabs.map((tab) => {
          let count = 0;
          if (tab === 'مستلمة' || tab === 'التقييمات المستلمة') count = receivedReviews.length;
          if (tab === 'مرسلة') count = sentReviews.length;
          if (tab === 'بانتظار التقييم') count = pendingReviews.length;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 flex items-center gap-2 ${
                activeTab === tab
                  ? 'border-[#2D5A27] text-[#2D5A27]'
                  : 'border-transparent text-[#888888] hover:text-[#222222]'
              }`}
            >
              <span>{tab}</span>
              <span className={`px-2 py-0.5 rounded-full text-xs ${activeTab === tab ? 'bg-[#2D5A27]/10 text-[#2D5A27]' : 'bg-[#F4F6F9] text-[#888888]'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {activeTab === 'بانتظار التقييم' ? (
        <div className="flex flex-col gap-4">
          {pendingReviews.length > 0 ? (
            pendingReviews.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] overflow-hidden flex-shrink-0">
                    <img src={item.image} alt={item.equipment} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-bold text-[#222222] text-sm">{item.equipment}</p>
                    <p className="text-xs text-[#888888]">الطلب: {item.orderNum} • {item.date}</p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <div className="flex text-3xl cursor-pointer">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRatingValues({ ...ratingValues, [item.id]: star })}
                        className={`transition-colors ${star <= (ratingValues[item.id] || 0) ? 'text-[#F39C12]' : 'text-[#E0E0E0]'}`}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  <textarea
                    placeholder="اكتب تعليقك هنا (اختياري)..."
                    value={comments[item.id] || ''}
                    onChange={(e) => setComments({ ...comments, [item.id]: e.target.value })}
                    className="w-full bg-[#F4F6F9] border-none rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#2D5A27] resize-none"
                    rows={3}
                  />

                  <button
                    type="button"
                    disabled={!ratingValues[item.id]}
                    onClick={() => handlePendingSubmit(item)}
                    className="w-full md:w-auto self-end bg-[#2D5A27] text-white px-6 py-2 rounded-xl font-semibold text-sm disabled:opacity-50 transition-opacity"
                  >
                    إرسال التقييم
                  </button>
                </div>
              </div>
            ))
          ) : (
            <EmptyState icon="⭐" title="لا توجد تقييمات معلقة" description="أنجزت جميع تقييماتك!" />
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {displayedList.length > 0 ? (
            displayedList.map((r) => <ReviewCard key={r.id} review={r} />)
          ) : (
            <EmptyState
              icon={config.emptyStateIcon}
              title={config.emptyStateTitle}
              description={config.emptyStateDesc}
            />
          )}
        </div>
      )}
    </div>
  );
}
