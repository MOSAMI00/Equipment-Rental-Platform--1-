import React from 'react';
import { Trash2, CheckCircle } from 'lucide-react';
import { useRentalPlatform } from '../../../data/mock-api';
import { useNavigate } from 'react-router';

const TYPE_ICONS = {
  payment: '💰',
  order: '📋',
  return: '🔄',
  review: '⭐',
  dispute: '⚠️',
  system: '🔔',
};

const TYPE_COLORS = {
  payment: '#27AE60',
  order: '#3498DB',
  return: '#F39C12',
  review: '#9B59B6',
  dispute: '#E74C3C',
  system: '#95A5A6',
};

const Notifications = () => {
  const {
    ownerNotifications,
    markOwnerNotificationRead,
    markAllOwnerNotificationsRead,
  } = useRentalPlatform();
  const navigate = useNavigate();

  const unreadCount = ownerNotifications.filter((n) => !n.read).length;

  return (
    <div>
      <div className="flex-between mb-8">
        <div className="flex-center gap-4">
          <h2 style={{ margin: 0 }}>الإشعارات</h2>
          {unreadCount > 0 && (
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
          )}
        </div>
        <div className="flex-center gap-4">
          <button
            className="owner-btn owner-btn-outline"
            onClick={markAllOwnerNotificationsRead}
          >
            <CheckCircle size={16} /> تحديد الكل كمقروء
          </button>
        </div>
      </div>

      {ownerNotifications.length === 0 ? (
        <div className="owner-card" style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔔</div>
          <h3 style={{ color: 'var(--color-text-muted)' }}>لا توجد إشعارات</h3>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {ownerNotifications.map((n) => {
            const color = TYPE_COLORS[n.type] ?? '#95A5A6';
            const bg = `${color}18`;
            return (
              <div
                key={n.id}
                className="owner-card"
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: 16,
                  borderRight: n.read ? 'none' : `4px solid ${color}`,
                  backgroundColor: n.read ? 'white' : bg,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onClick={() => {
                  markOwnerNotificationRead(n.id);
                  if (n.action?.href) navigate(n.action.href);
                }}
              >
                <div
                  style={{
                    backgroundColor: n.read ? bg : 'white',
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
                  {n.emoji || TYPE_ICONS[n.type]}
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex-between mb-2">
                    <h4
                      style={{
                        margin: 0,
                        color: n.read ? 'var(--color-text-primary)' : color,
                        fontSize: 15,
                      }}
                    >
                      {n.title}
                    </h4>
                    <span className="text-muted" style={{ fontSize: 12 }}>
                      {n.time} 🕐
                    </span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 14, lineHeight: 1.6 }}>
                    {n.message}
                  </p>
                  {n.action && (
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
                      {n.action.label} ←
                    </span>
                  )}
                </div>
                {!n.read && (
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
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Notifications;
