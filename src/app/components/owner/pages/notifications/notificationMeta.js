export const notificationTypeIcons = {
  payment: '💰',
  order: '📋',
  return: '🔄',
  review: '⭐',
  dispute: '⚠️',
  system: '🔔',
};

export const notificationTypeColors = {
  payment: '#27AE60',
  order: '#3498DB',
  return: '#F39C12',
  review: '#9B59B6',
  dispute: '#E74C3C',
  system: '#95A5A6',
};

export const getNotificationTypeColor = (type) => notificationTypeColors[type] ?? '#95A5A6';
export const getNotificationTypeIcon = (notification) => (
  notification.emoji || notificationTypeIcons[notification.type] || notificationTypeIcons.system
);
