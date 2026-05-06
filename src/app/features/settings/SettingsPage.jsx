import React, { useState } from 'react';
import { User, Shield, CreditCard, Bell } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { PageHeader } from '../../components/shared';
import { getSettingsConfig } from './settingsConfig';

// Tenant Forms
import { ProfileForm } from '../../components/tenant/Dashboard/Settings/Main/SettingsLayout/ContentArea/ProfileForm';
import { SecurityForm } from '../../components/tenant/Dashboard/Settings/Main/SettingsLayout/ContentArea/SecurityForm';
import { KYCUploaders } from '../../components/tenant/Dashboard/Settings/Main/SettingsLayout/ContentArea/KYCUploaders';

// Owner Forms
import ProfileInfoTab from '../../components/owner/pages/profile/ProfileInfoTab';
import SecurityTab from '../../components/owner/pages/profile/SecurityTab';
import PayoutMethodsTab from '../../components/owner/pages/profile/PayoutMethodsTab';
import NotificationPreferencesTab from '../../components/owner/pages/profile/NotificationPreferencesTab';
import TenantInsuranceTab from './TenantInsuranceTab';

const ICONS = {
  User: <User size={18} />,
  Shield: <Shield size={18} />,
  CreditCard: <CreditCard size={18} />,
  Bell: <Bell size={18} />
};

export default function SettingsPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getSettingsConfig(role);
  const [activeTab, setActiveTab] = useState(config.tabs[0].id);

  const ownerInitial = (user?.fullName ?? '؟').charAt(0);

  const renderContent = () => {
    if (role === 'owner') {
      switch (activeTab) {
        case 'profile': return <ProfileInfoTab user={user} ownerInitial={ownerInitial} />;
        case 'security': return <SecurityTab />;
        case 'payment': return <PayoutMethodsTab />;
        case 'notifications': return <NotificationPreferencesTab />;
        default: return null;
      }
    } else {
      switch (activeTab) {
        case 'profile': return <ProfileForm />;
        case 'security': return <SecurityForm />;
        case 'kyc': return <KYCUploaders />;
        case 'insurance': return <TenantInsuranceTab />;
        default: return null;
      }
    }
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader title={config.pageTitle} />

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
        <div className="w-full overflow-x-auto rounded-2xl border border-[#E8ECEF] bg-white p-1.5 shadow-sm">
          <div className="flex min-w-max gap-1">
            {config.tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'text-[#666666] hover:bg-[#F4F6F9] hover:text-[#222222]'
                }`}
              >
                {ICONS[tab.iconName]}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="min-w-0 w-full bg-white rounded-2xl border border-[#E0E0E0] p-5 md:p-8 shadow-sm">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
