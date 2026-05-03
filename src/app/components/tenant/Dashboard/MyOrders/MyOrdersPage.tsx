import { useState } from 'react';
import { SAMPLE_RENTALS, Status } from '../shared/OrderTypes';
import { OrderHeader } from './Main/OrderHeader/OrderHeader';
import { OrderActionBanner } from './Main/ActionBanner';
import { OrderTabs } from './Main/FilterTabs';
import { OrdersGrid } from './Main/OrdersGrid/OrdersGrid';

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActions = SAMPLE_RENTALS.some((r) => r.status === 'confirmed' || r.status === 'pending');
  const filtered = SAMPLE_RENTALS.filter((r) => {
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchSearch = r.equipment.includes(searchQuery) || r.orderNum.includes(searchQuery) || r.lessor.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <OrderHeader
        count={SAMPLE_RENTALS.length}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {hasActions && <OrderActionBanner />}
      <OrderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rentals={SAMPLE_RENTALS}
      />
      <OrdersGrid filtered={filtered} />
    </div>
  );
}
