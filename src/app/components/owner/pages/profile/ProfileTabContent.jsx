import React from 'react';
import NotificationPreferencesTab from './NotificationPreferencesTab';
import PayoutMethodsTab from './PayoutMethodsTab';
import ProfileInfoTab from './ProfileInfoTab';
import SecurityTab from './SecurityTab';

const ProfileTabContent = ({ activeTab, user, ownerInitial }) => {
  if (activeTab === 'security') return <SecurityTab />;
  if (activeTab === 'payment') return <PayoutMethodsTab />;
  if (activeTab === 'notifications') return <NotificationPreferencesTab />;
  return <ProfileInfoTab user={user} ownerInitial={ownerInitial} />;
};

export default ProfileTabContent;
