import { useState } from 'react';
import { NOTIFICATIONS } from './NotificationTypes';
import { Header } from './Main/Header/Header';
import { FilterTabs } from './Main/FilterTabs';
import { NotificationList } from './Main/NotificationList/NotificationList';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications((n) => n.map((notif) => ({ ...notif, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications((n) => n.map((notif) => notif.id === id ? { ...notif, read: true } : notif));
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const displayed = activeTab === 'all' ? notifications : notifications.filter((n) => !n.read);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Header unreadCount={unreadCount} markAllRead={markAllRead} />
      <FilterTabs
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        allCount={notifications.length}
        unreadCount={unreadCount}
      />
      <NotificationList displayed={displayed} markRead={markRead} activeTab={activeTab} />
    </div>
  );
}
