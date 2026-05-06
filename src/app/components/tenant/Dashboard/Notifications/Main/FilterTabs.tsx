import { FilterTabs as SharedFilterTabs, type FilterTabItem } from '../../../../shared';

interface FilterTabsProps {
  activeTab: 'all' | 'unread';
  setActiveTab: (tab: 'all' | 'unread') => void;
  allCount: number;
  unreadCount: number;
}

export function FilterTabs({ activeTab, setActiveTab, allCount, unreadCount }: FilterTabsProps) {
  const tabs: FilterTabItem[] = [
    { id: 'all', label: 'الكل', count: allCount },
    { id: 'unread', label: 'غير مقروء', count: unreadCount },
  ];

  return (
    <SharedFilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={(tabId) => setActiveTab(tabId as 'all' | 'unread')}
      className="mb-5"
    />
  );
}
