
// TODO: Delete this file 

import { useState } from 'react';
import { Header } from './Main/Header/Header';
import { FilterTabs } from './Main/FilterTabs';
import { NotificationList } from './Main/NotificationList/NotificationList';
import { useRentalPlatform } from '../../../../data/mock-api';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const { notifications, markAllNotificationsRead, markNotificationRead } = useRentalPlatform();

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = activeTab === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Header unreadCount={unreadCount} markAllRead={markAllNotificationsRead} />
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allCount={notifications.length}
        unreadCount={unreadCount}
      />
      <NotificationList displayed={displayed} markRead={markNotificationRead} activeTab={activeTab} />
    </div>
  );
}
