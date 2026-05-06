import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { useRentalPlatform } from '../../data/mock-api';
import { getNotificationsConfig } from './notificationsConfig';
import { NotificationCard } from './NotificationCard';
import { PageHeader, EmptyState } from '../../components/shared';

export default function NotificationsPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getNotificationsConfig(role);
  const navigate = useNavigate();

  const {
    notifications: tenantNotifs,
    ownerNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    markOwnerNotificationRead,
    markAllOwnerNotificationsRead,
  } = useRentalPlatform();

  const [activeTab, setActiveTab] = useState(config.tabs[0]);

  const allNotifications = role === 'owner' ? ownerNotifications : tenantNotifs;
  const unreadCount = allNotifications.filter((n) => !n.read).length;

  const displayed = activeTab === config.tabs[1]
    ? allNotifications.filter((n) => !n.read)
    : allNotifications;

  const handleMarkAllRead = () => {
    if (role === 'owner') {
      markAllOwnerNotificationsRead();
    } else {
      markAllNotificationsRead();
    }
  };

  const handleOpenNotification = (notification) => {
    if (role === 'owner') {
      markOwnerNotificationRead(notification.id);
    } else {
      markNotificationRead(notification.id);
    }
    
    if (notification.action?.href) {
      navigate(notification.action.href);
    }
  };

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={`${unreadCount} ${config.unreadLabel}`}
        actions={
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className="text-sm font-semibold text-[#2D5A27] hover:underline disabled:opacity-50"
          >
            {config.markAllReadLabel}
          </button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2 border-b border-[#E0E0E0] pb-2">
        {config.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-semibold transition-colors border-b-2 ${
              activeTab === tab
                ? 'border-[#2D5A27] text-[#2D5A27]'
                : 'border-transparent text-[#888888] hover:text-[#222222]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {displayed.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayed.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onOpen={handleOpenNotification}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={config.emptyStateIcon}
          title={activeTab === config.tabs[1] ? config.emptyStateTitleUnread : config.emptyStateTitleAll}
          description={config.emptyStateDesc}
        />
      )}
    </div>
  );
}
