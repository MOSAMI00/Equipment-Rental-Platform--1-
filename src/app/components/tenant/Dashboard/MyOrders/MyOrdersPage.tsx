import { useState } from 'react';
import { Status } from '../shared/OrderTypes';
import { getEquipmentSnapshot, useTenantRentals } from '../../../../data/mock-api';
import { OrderHeader } from './Main/OrderHeader/OrderHeader';
import { OrderActionBanner } from './Main/ActionBanner';
import { OrderTabs } from './Main/FilterTabs';
import { OrdersGrid } from './Main/OrdersGrid/OrdersGrid';

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const rentals = useTenantRentals();

  const hasActions = rentals.some((r) => r.status === 'confirmed' || r.status === 'pending');
  const filtered = rentals.filter((r) => {
    const equipment = getEquipmentSnapshot(r.equipmentId);
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchSearch =
      equipment.name.includes(searchQuery) ||
      r.orderNum.includes(searchQuery) ||
      equipment.ownerName.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <OrderHeader
        count={rentals.length}
        search={searchQuery}
        onSearchChange={setSearchQuery}
      />
      {hasActions && <OrderActionBanner rentals={rentals} />}
      <OrderTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
        rentals={rentals}
      />
      <OrdersGrid filtered={filtered} />
    </div>
  );
}
