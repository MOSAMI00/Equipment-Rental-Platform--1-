import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import {
  useRentalPlatform,
  getEquipmentSnapshot,
  getTenantProfile,
  formatRentalDate,
} from '../../data/mock-api';
import { getReviewsConfig } from './reviewsConfig';
import { ReviewSummary } from './ReviewSummary';
import { ReviewCard } from './ReviewCard';
import { PageHeader, EmptyState, FilterTabs } from '../../components/shared';

const RECEIVED_MOCK = [
  { id: 'received-1', equipment: 'مولد كهرباء', person: 'محمد سالم (مؤجر)', stars: 5, comment: 'مستأجر ممتاز، يحترم المواعيد ويعامل المعدة بعناية.', date: '04 مايو 2026', image: '👤' },
  { id: 'received-2', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 4, comment: 'مستأجر جيد، أعاد المعدة بحالة ممتازة.', date: '25 أبريل 2026', image: '👤' },
];

function mapReviewCard({ review, rentals, role, direction }) {
  const rental = rentals.find((item) => item.id === review.rentalOpId);
  const equipment = rental ? getEquipmentSnapshot(rental.equipmentId) : undefined;
  const tenant = rental ? getTenantProfile(rental.tenantId) : undefined;
  const isOwner = role === 'owner';

  return {
    id: review.id,
    equipment: equipment?.name ?? 'طلب إيجار',
    person: direction === 'received'
      ? (isOwner ? tenant?.name || review.reviewerId || 'مستأجر' : equipment?.ownerName || review.reviewerId || 'مؤجر')
      : (isOwner ? tenant?.name || review.targetId || 'مستأجر' : equipment?.ownerName || review.targetId || 'مؤجر'),
    stars: review.rating,
    comment: review.reviewText,
    date: formatRentalDate(review.createdAt),
    image: equipment?.image ?? '⭐',
  };
}

export default function ReviewsPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getReviewsConfig(role);
  const [searchParams] = useSearchParams();
  const selectedOrderId = searchParams.get('orderId');
  const [activeTab, setActiveTab] = useState(config.tabs[0]);

  const { rentals, reviews, submitReview } = useRentalPlatform();
  const userId = user?.id || (role === 'owner' ? 'owner-1' : 'tenant-1');

  const sentReviews = useMemo(() => {
    return reviews
      .filter((review) => review.reviewerId === userId)
      .map((review) => mapReviewCard({ review, rentals, role, direction: 'sent' }));
  }, [reviews, rentals, role, userId]);

  const receivedReviews = useMemo(() => {
    const received = reviews
      .filter((review) => review.targetId === userId)
      .map((review) => mapReviewCard({ review, rentals, role, direction: 'received' }));

    return role === 'tenant' && received.length === 0 ? RECEIVED_MOCK : received;
  }, [reviews, rentals, role, userId]);

  const pendingReviews = useMemo(() => {
    const reviewedRentalIds = new Set(
      reviews
        .filter((review) => review.reviewerId === userId)
        .map((review) => review.rentalOpId)
    );
    const pending = rentals
      .filter((rental) => {
        if (rental.status !== 'completed' || reviewedRentalIds.has(rental.id)) return false;
        return role === 'owner' ? rental.ownerId === userId : rental.tenantId === userId;
      })
      .map((rental) => {
        const equipment = getEquipmentSnapshot(rental.equipmentId);
        const tenant = getTenantProfile(rental.tenantId);
        return {
          id: rental.id,
          orderNum: rental.orderNum,
          equipment: equipment.name,
          partnerName: role === 'owner' ? tenant.name : equipment.ownerName,
          targetId: role === 'owner' ? rental.tenantId : equipment.ownerId,
          image: role === 'owner' ? '👤' : equipment.image,
          date: formatRentalDate(rental.endDate),
        };
      });

    if (!selectedOrderId) return pending;
    return pending.sort((a, b) => (a.id === selectedOrderId ? -1 : b.id === selectedOrderId ? 1 : 0));
  }, [rentals, reviews, selectedOrderId, role, userId]);

  const [ratingValues, setRatingValues] = useState({});
  const [comments, setComments] = useState({});

  const handlePendingSubmit = (item) => {
    submitReview({
      rentalOpId: item.id,
      targetType: 'user',
      targetId: item.targetId,
      rating: ratingValues[item.id],
      reviewText: comments[item.id] || '',
    });
  };

  const tabRegistry = {
    // Tabs come from reviewsConfig, while each list is resolved by user role and review direction.
    مستلمة: receivedReviews,
    مرسلة: sentReviews,
    'بانتظار التقييم': pendingReviews,
    'التقييمات المستلمة': receivedReviews,
  };
  const displayedList = tabRegistry[activeTab] || [];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader title={config.pageTitle} />

      <ReviewSummary reviews={[...receivedReviews, ...sentReviews]} />

      <FilterTabs
        tabs={config.tabs.map((tab) => {
          const list = tabRegistry[tab] || [];
          return { id: tab, label: tab, count: list.length };
        })}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {activeTab === 'بانتظار التقييم' ? (
        <div className="flex flex-col gap-4">
          {pendingReviews.length > 0 ? (
            pendingReviews.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] overflow-hidden flex-shrink-0">
                    {item.image?.startsWith('http') ? (
                      <img src={item.image} alt={item.equipment} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-2xl">{item.image || '⭐'}</div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-[#222222] text-sm">{item.equipment}</p>
                    <p className="text-xs text-[#888888]">الطلب: {item.orderNum} • {item.partnerName} • {item.date}</p>
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
