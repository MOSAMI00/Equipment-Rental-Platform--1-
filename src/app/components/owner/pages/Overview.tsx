import React from 'react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import { OverviewContent } from './overview/OverviewContent';

export default function Overview() {
  const { rentals, reviews, stats, isLoading } = useOwnerPageProps();

  return (
    <OverviewContent
      rentals={rentals}
      reviews={reviews}
      stats={stats}
      isLoading={isLoading}
    />
  );
}
