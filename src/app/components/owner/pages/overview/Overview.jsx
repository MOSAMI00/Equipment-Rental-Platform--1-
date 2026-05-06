import React, { useEffect, useState } from 'react';
import OverviewKpis from './OverviewKpis';
import EarningsChart from './EarningsChart';
import OrderStatusChart from './OrderStatusChart';
import RecentOrdersTable from './RecentOrdersTable';
import { useOwnerOverview } from './useOwnerOverview';

const Overview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const overview = useOwnerOverview();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <div>
      <OverviewKpis
        isLoading={isLoading}
        activeOrders={overview.activeOrders}
        monthEarnings={overview.monthEarnings}
        monthGrowth={overview.monthGrowth}
        equipmentCount={overview.equipmentCount}
        averageRating={overview.averageRating}
        reviewsCount={overview.reviewsCount}
      />

      <div className="owner-grid-2">
        <EarningsChart data={overview.dataEarnings} isLoading={isLoading} />
        <OrderStatusChart data={overview.dataOrders} isLoading={isLoading} />
      </div>

      <RecentOrdersTable rentals={overview.recentRentals} isLoading={isLoading} />
    </div>
  );
};

export default Overview;


