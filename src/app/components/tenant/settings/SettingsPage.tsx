import { useState } from 'react';
import { Shield, User, CreditCard } from 'lucide-react';
import { ProfileTab } from './ProfileTab';
import { SecurityTab } from './SecurityTab';
import { KYCTab } from './KYCTab';

type SettingsTab = 'profile' | 'security' | 'kyc';

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<SettingsTab>('profile');

  const tabs: { key: SettingsTab; label: string; icon: React.ReactNode }[] = [
    { key: 'profile', label: 'الملف الشخصي', icon: <User className="w-4 h-4" /> },
    { key: 'security', label: 'الأمان', icon: <Shield className="w-4 h-4" /> },
    { key: 'kyc', label: 'التحقق من الهوية KYC', icon: <CreditCard className="w-4 h-4" /> },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-2xl font-bold text-[#222222] mb-5">الإعدادات</h2>

      <div className="flex flex-col md:flex-row gap-5">
        {/* Tab Nav */}
        <div className="md:w-52 flex-shrink-0">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-2 flex md:flex-col gap-1">
            {tabs.map(tab => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-right flex-1 md:flex-none ${
                  activeTab === tab.key
                    ? 'bg-[#2D5A27] text-white'
                    : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#222222]'
                }`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 bg-white rounded-2xl border border-[#E0E0E0] p-5">
          {activeTab === 'profile' && <ProfileTab />}
          {activeTab === 'security' && <SecurityTab />}
          {activeTab === 'kyc' && <KYCTab />}
        </div>
      </div>
    </div>
  );
}
