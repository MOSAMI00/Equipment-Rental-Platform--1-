import React from 'react';

export const TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الموافقة' },
  { id: 'confirmed', label: 'مؤكدة' },
  { id: 'in_use', label: 'قيد الاستخدام' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغية' },
  { id: 'disputed', label: 'نزاعات' },
];

interface RentalsTabsProps {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}

export function RentalsTabs({ activeTab, setActiveTab }: RentalsTabsProps) {
  return (
    <div className="owner-tabs">
      {TABS.map((tab) => (
        <div
          key={tab.id}
          className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </div>
      ))}
    </div>
  );
}
