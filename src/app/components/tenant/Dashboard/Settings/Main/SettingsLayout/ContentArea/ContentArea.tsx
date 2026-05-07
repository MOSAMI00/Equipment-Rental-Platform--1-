

// TODO: export content area components folder to a shared location if needed in other places
import { SettingsTab } from '../SettingsLayout';
import { ProfileForm } from './ProfileForm';
import { SecurityForm } from './SecurityForm';
import { KYCUploaders } from './KYCUploaders';

interface ContentAreaProps {
  activeTab: SettingsTab;
}

export function ContentArea({ activeTab }: ContentAreaProps) {
  return (
    <div className="flex-1 bg-white rounded-2xl border border-[#E0E0E0] p-5">
      {activeTab === 'profile' && <ProfileForm />}
      {activeTab === 'security' && <SecurityForm />}
      {activeTab === 'kyc' && <KYCUploaders />}
    </div>
  );
}
