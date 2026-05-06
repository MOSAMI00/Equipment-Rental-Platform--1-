import React from 'react';
import { EmptyState } from '../../../shared';
import NotificationCard from './NotificationCard';

const NotificationList = ({ notifications, onOpen }) => {
  if (notifications.length === 0) {
    return <EmptyState icon="🔔" title="لا توجد إشعارات" description="ستظهر الإشعارات الجديدة هنا." />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {notifications.map((notification) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
};

export default NotificationList;
