import React from 'react';
import { getNotificationTypeColor, getNotificationTypeIcon } from './notificationMeta';

const NotificationCard = ({ notification, onOpen }) => {
  const color = getNotificationTypeColor(notification.type);
  const bg = `${color}18`;

  return (
    <button
      type="button"
      className="owner-card"
      style={{
        display: 'flex',
        gap: 16,
        padding: 16,
        width: '100%',
        border: 'none',
        borderRight: notification.read ? 'none' : `4px solid ${color}`,
        backgroundColor: notification.read ? 'white' : bg,
        cursor: 'pointer',
        transition: 'all 0.2s',
        textAlign: 'right',
        fontFamily: 'inherit',
      }}
      onClick={() => onOpen(notification)}
    >
      <div
        style={{
          backgroundColor: notification.read ? bg : 'white',
          borderRadius: '50%',
          width: 44,
          height: 44,
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 22,
        }}
      >
        {getNotificationTypeIcon(notification)}
      </div>
      <div style={{ flex: 1 }}>
        <div className="flex-between mb-2">
          <h4
            style={{
              margin: 0,
              color: notification.read ? 'var(--color-text-primary)' : color,
              fontSize: 15,
            }}
          >
            {notification.title}
          </h4>
          <span className="text-muted" style={{ fontSize: 12 }}>{notification.time}</span>
        </div>
        <p className="text-muted mb-0" style={{ fontSize: 14, lineHeight: 1.6 }}>
          {notification.message}
        </p>
        {notification.action ? (
          <span
            style={{
              display: 'inline-block',
              marginTop: 8,
              fontSize: 12,
              color: 'var(--color-primary-green)',
              fontWeight: 600,
              textDecoration: 'underline',
            }}
          >
            {notification.action.label}
          </span>
        ) : null}
      </div>
      {!notification.read ? (
        <div
          style={{
            width: 10,
            height: 10,
            borderRadius: '50%',
            backgroundColor: color,
            flexShrink: 0,
            marginTop: 6,
          }}
        />
      ) : null}
    </button>
  );
};

export default NotificationCard;
