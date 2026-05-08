import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import {
  useRentalPlatform,
  getEquipmentSnapshot,
  getTenantProfile,
  formatRentalDate,
} from '../../data/mock-api';
import { getReviewsConfig } from './lib/reviewsConfig';
import { ReviewSummary } from './ui/ReviewSummary';
import { TenantReviewsList } from './ui/TenantReviewsList';
import { OwnerReviewsList } from './ui/OwnerReviewsList';
import { PageHeader, FilterTabs } from '../../components/shared';

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

export default function ReviewsPage({ role: roleProp }) {
  const { user } = useAuth();
  const role = roleProp || user?.type || 'tenant';
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
    مستلمة: receivedReviews,
    مرسلة: sentReviews,
    'بانتظار التقييم': pendingReviews,
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

      {role === 'tenant' ? (
        <TenantReviewsList
          activeTab={activeTab}
          displayedList={displayedList}
          pendingReviews={pendingReviews}
          ratingValues={ratingValues}
          comments={comments}
          setRatingValues={setRatingValues}
          setComments={setComments}
          handlePendingSubmit={handlePendingSubmit}
          config={config}
        />
      ) : (
        <OwnerReviewsList
          activeTab={activeTab}
          displayedList={displayedList}
          pendingReviews={pendingReviews}
          ratingValues={ratingValues}
          comments={comments}
          setRatingValues={setRatingValues}
          setComments={setComments}
          handlePendingSubmit={handlePendingSubmit}
          config={config}
        />
      )}
    </div>
  );
}
