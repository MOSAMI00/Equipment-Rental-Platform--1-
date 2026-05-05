import React from 'react';

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
    <div className="owner-tabs mb-6">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => onTabChange(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}

