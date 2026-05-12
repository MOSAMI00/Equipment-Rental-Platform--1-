
import { FilterTabs } from '../../../../../components/shared';
import { RENTAL_TABS } from '../../../../../entities/rental';

export function OrderTabs({ activeTab, onTabChange, rentals }) {
  const tabs: FilterTabItem[] = RENTAL_TABS.map((tab) => ({
    id: tab.key,
    label: tab.label,
    count: tab.key === 'all' ? rentals.length : rentals.filter((r) => r.status === tab.key).length,
  }));

  return (
    <SharedFilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => onTabChange(tabId | 'all')}
      className="mb-5"
    />
  );
}
