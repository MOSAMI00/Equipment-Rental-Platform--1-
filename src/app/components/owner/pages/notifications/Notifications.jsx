import React, { useEffect, useState } from 'react';
import { useRentalPlatform } from '../../../../data/mock-api';
import { visit } from '../../../../inertia/navigation';
import { useOwnerPageProps } from '../../../../inertia/owner-page-props';
import { ChartSkeleton } from '../../shared/OwnerSkeletons';
import NotificationHeader from './NotificationHeader';
import NotificationList from './NotificationList';

const Notifications = () => {
  const {
    markOwnerNotificationRead,
    markAllOwnerNotificationsRead,
  } = useRentalPlatform();
  const { ownerNotifications } = useOwnerPageProps();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const unreadCount = ownerNotifications.filter((n) => !n.read).length;

  const handleOpenNotification = (notification) => {
    markOwnerNotificationRead(notification.id);
    if (notification.action?.href) visit(notification.action.href);
  };

  return (
    <div>
      <NotificationHeader
        unreadCount={unreadCount}
        onMarkAllRead={markAllOwnerNotificationsRead}
      />

      {isLoading ? (
        <ChartSkeleton height={200} />
      ) : (
        <NotificationList
          notifications={ownerNotifications}
          onOpen={handleOpenNotification}
        />
      )}
    </div>
  );
};

export default Notifications;
