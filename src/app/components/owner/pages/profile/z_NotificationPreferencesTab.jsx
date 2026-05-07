import React from 'react';

const notificationPreferences = [
  'طلبات الحجز الجديدة',
  'تأكيد الدفع',
  'تذكيرات التسليم',
  'النزاعات والمطالبات',
  'تحويل الأرباح',
];

const NotificationPreferencesTab = () => (
  <div>
    <h3 className="mb-6">تفضيلات الإشعارات</h3>
    {notificationPreferences.map((item) => (
      <div key={item} className="flex-between mb-4" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
        <span style={{ fontWeight: 600 }}>{item}</span>
        <label className="toggle-switch">
          <input type="checkbox" defaultChecked />
          <span className="toggle-slider" />
        </label>
      </div>
    ))}
  </div>
);

export default NotificationPreferencesTab;
