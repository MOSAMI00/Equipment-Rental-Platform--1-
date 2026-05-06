import { useState } from 'react';
import { Header } from '../../tenant/Dashboard/Notifications/Main/Header/Header';
import { FilterTabs } from '../../tenant/Dashboard/Notifications/Main/FilterTabs';
import { NotificationList } from '../../tenant/Dashboard/Notifications/Main/NotificationList/NotificationList';
import { useAuth } from '../../../auth/AuthContext';
import { useRentalPlatform, type TenantNotification } from '../../../data/mock-api';

export function UnifiedNotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { user } = useAuth();
  const {
    notifications,
    ownerNotifications,
    markAllNotificationsRead,
    markNotificationRead,
    markAllOwnerNotificationsRead,
    markOwnerNotificationRead,
  } = useRentalPlatform();

  const isOwner = user?.type === 'owner';
  const list = isOwner ? ownerNotifications : notifications;
  const unreadCount = list.filter((n) => !n.read).length;
  const displayed = activeTab === 'all' ? list : list.filter((n) => !n.read);

  const markAllRead = () => {
    if (isOwner) markAllOwnerNotificationsRead();
    else markAllNotificationsRead();
  };

  const markRead = (id: string) => {
    if (isOwner) markOwnerNotificationRead(id);
    else markNotificationRead(id);
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Header unreadCount={unreadCount} markAllRead={markAllRead} />
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allCount={list.length}
        unreadCount={unreadCount}
      />
      <NotificationList displayed={displayed as TenantNotification[]} markRead={markRead} activeTab={activeTab} />
    </div>
  );
}
