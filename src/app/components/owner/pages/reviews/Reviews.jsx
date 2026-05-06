import React, { useMemo } from 'react';
import { useAuth } from '../../../../auth/AuthContext';
import { useOwnerPageProps } from '../../../../inertia/owner-page-props';
import { PageHeader } from '../../../shared';
import ReviewSummary from './ReviewSummary';
import ReviewsTable from './ReviewsTable';
import { getAverageRating, getRatingsDistribution } from './reviewHelpers';

const Reviews = () => {
  const { user } = useAuth();
  const { reviews } = useOwnerPageProps();

  const ownerReviews = useMemo(
    () => reviews.filter((review) => review.targetId === user?.id),
    [reviews, user?.id],
  );

  const average = getAverageRating(ownerReviews);
  const ratings = getRatingsDistribution(ownerReviews);

  return (
    <div>
      <PageHeader title="تقييماتي" />

      <ReviewSummary average={average} reviewsCount={ownerReviews.length} ratings={ratings} />
      <ReviewsTable reviews={ownerReviews} />
    </div>
  );
};

export default Reviews;
