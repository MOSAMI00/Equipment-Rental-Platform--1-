import { useState } from 'react';
import { NavTabs } from './NavTabs';
import { ContentArea } from './ContentArea/ContentArea';

export type SettingsTab = 'profile' | 'security' | 'kyc';

export function SettingsLayout() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  return (
    <div className="flex flex-col md:flex-row gap-5">
      <NavTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      <ContentArea activeTab={activeTab} />
    </div>
  );
}
