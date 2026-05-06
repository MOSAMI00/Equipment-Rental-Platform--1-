import React, { useState } from 'react';
import { useAuth } from '../../../../auth/AuthContext';
import { PageHeader } from '../../../shared';
import ProfileSidebar from './ProfileSidebar';
import ProfileTabContent from './ProfileTabContent';
import { profileTabs } from './profileTabs';

const Profile = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const ownerInitial = (user?.fullName ?? '؟').charAt(0);

  return (
    <div>
      <PageHeader title="ملفي الشخصي" />

      <div className="settings-container">
        <ProfileSidebar
          tabs={profileTabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        <div className="settings-content">
          <div className="owner-card">
            <ProfileTabContent
              activeTab={activeTab}
              user={user}
              ownerInitial={ownerInitial}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
