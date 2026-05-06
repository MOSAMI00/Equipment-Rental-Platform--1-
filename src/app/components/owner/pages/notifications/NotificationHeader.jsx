import React from 'react';
import { CheckCircle } from 'lucide-react';
import { AppButton, PageHeader } from '../../../shared';

const NotificationHeader = ({ unreadCount, onMarkAllRead }) => (
  <PageHeader
    title={(
      <span className="flex-center gap-4">
        الإشعارات
        {unreadCount > 0 ? (
          <span
            style={{
              backgroundColor: '#E74C3C',
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 700,
            }}
          >
            {unreadCount}
          </span>
        ) : null}
      </span>
    )}
    actions={(
      <AppButton variant="outline" onClick={onMarkAllRead}>
        <CheckCircle size={16} /> تحديد الكل كمقروء
      </AppButton>
    )}
  />
);

export default NotificationHeader;
