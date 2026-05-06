import { FilterTabs as SharedFilterTabs, type FilterTabItem } from '../../../../shared';
import { RatingTab } from '../RatingsPage';

interface FilterTabsProps {
  tabs: { key: RatingTab; label: string; count: number }[];
  activeTab: RatingTab;
  setActiveTab: (tab: RatingTab) => void;
}

export function FilterTabs({ tabs, activeTab, setActiveTab }: FilterTabsProps) {
  const sharedTabs: FilterTabItem[] = tabs.map((tab) => ({
    id: tab.key,
    label: tab.label,
    count: tab.count,
  }));

  return (
    <SharedFilterTabs
      tabs={sharedTabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as RatingTab)}
      className="mb-5"
    />
  );
}
