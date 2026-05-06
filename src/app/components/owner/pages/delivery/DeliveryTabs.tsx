import React from 'react';
import { FilterTabs } from '../../../shared';

type TabItem = {
  id: string;
  label: string;
};

type DeliveryTabsProps = {
  tabs: TabItem[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export default function DeliveryTabs({ tabs, activeTab, onTabChange }: DeliveryTabsProps) {
  return (
    <FilterTabs
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={onTabChange}
    />
  );
}

