import { useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { PageHeader } from '../../shared';
import { SettingsLayout } from '../../tenant/Dashboard/Settings/Main/SettingsLayout/SettingsLayout';
import ProfileSidebar from '../../owner/pages/profile/ProfileSidebar';
import ProfileTabContent from '../../owner/pages/profile/ProfileTabContent';
import { profileTabs } from '../../owner/pages/profile/profileTabs';

export function UnifiedSettingsPage() {
  const { user } = useAuth();

  if (user?.type === 'tenant') {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <h2 className="text-2xl font-bold text-[#222222] mb-5">الإعدادات</h2>
        <SettingsLayout />
      </div>
    );
  }

  const [activeTab, setActiveTab] = useState('profile');
  const ownerInitial = (user?.fullName ?? '؟').charAt(0);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader title="الإعدادات والملف الشخصي" />

      <div className="settings-container">
        <ProfileSidebar tabs={profileTabs} activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="settings-content">
          <div className="owner-card">
            <ProfileTabContent activeTab={activeTab} user={user} ownerInitial={ownerInitial} />
          </div>
        </div>
      </div>
    </div>
  );
}
