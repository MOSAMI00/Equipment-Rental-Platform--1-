import React, { useMemo } from 'react';
import type { RentalListItem, ReviewSummary } from '../../../../types/owner';
import { OverviewKPISection } from './OverviewKPISection';
import { OverviewCharts } from './OverviewCharts';
import { RecentRentalsList } from './RecentRentalsList';

interface OverviewContentProps {
  rentals: RentalListItem[];
  reviews: ReviewSummary[];
  stats: Record<string, unknown> | null;
  isLoading?: boolean;
}

export function OverviewContent({ rentals, reviews, stats, isLoading }: OverviewContentProps) {
  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 5; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = rentals
        .filter((rental) => {
          if (!rental.createdAt) return false;
          const created = new Date(rental.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, rental) => total + (rental.rentalAmount ?? 0), 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [rentals]);

  const monthEarnings = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const previousMonthEarnings = dataEarnings[dataEarnings.length - 2]?.amount ?? 0;
  const monthGrowth = previousMonthEarnings > 0
    ? Math.round(((monthEarnings - previousMonthEarnings) / previousMonthEarnings) * 100)
    : 0;

  return (
    <div>
      <OverviewKPISection
        rentals={rentals}
        reviews={reviews}
        monthEarnings={monthEarnings}
        monthGrowth={monthGrowth}
        isLoading={isLoading}
      />
      <OverviewCharts rentals={rentals} dataEarnings={dataEarnings} isLoading={isLoading} />
      <RecentRentalsList rentals={rentals} isLoading={isLoading} />
    </div>
  );
}
