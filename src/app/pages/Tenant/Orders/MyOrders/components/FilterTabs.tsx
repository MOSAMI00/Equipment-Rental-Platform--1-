
import { FilterTabs as SharedFilterTabs, type FilterTabItem } from '../../../../../components/shared';
import { Status, TABS } from '../../../../../types/orderTypes';
import type { TenantRental } from '../../../../../data/mock-api';

interface OrderTabsProps {
  activeTab: Status | 'all';
  onTabChange: (tab: Status | 'all') => void;
  rentals: TenantRental[];
}

export function OrderTabs({ activeTab, onTabChange, rentals }: OrderTabsProps) {
  const tabs: FilterTabItem[] = TABS.map((tab) => ({
    id: tab.key,
    label: tab.label,
    count: tab.key === 'all' ? rentals.length : rentals.filter((r) => r.status === tab.key).length,
  }));

  return (
    <SharedFilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId as Status | 'all')}
      className="mb-5"
    />
  );
}
