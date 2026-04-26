import { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { NOTIFICATIONS } from './NotificationTypes';
import { NotificationItem } from './NotificationItem';

export function NotificationsPage() {
  const [activeTab, setActiveTab] = useState<'all' | 'unread'>('all');
  const [notifications, setNotifications] = useState(NOTIFICATIONS);

  const markAllRead = () => {
    setNotifications(n => n.map(notif => ({ ...notif, read: true })));
  };

  const markRead = (id: string) => {
    setNotifications(n => n.map(notif => notif.id === id ? { ...notif, read: true } : notif));
  };

  const unreadCount = notifications.filter(n => !n.read).length;
  const displayed = activeTab === 'all' ? notifications : notifications.filter(n => !n.read);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#222222]">الإشعارات</h2>
          {unreadCount > 0 && (
            <p className="text-sm text-[#888888] mt-0.5">{unreadCount} إشعار غير مقروء</p>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-[#2D5A27] hover:underline font-medium"
          >
            <CheckCheck className="w-4 h-4" />
            تعليم الكل كمقروء
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {[
          { key: 'all' as const, label: 'الكل', count: notifications.length },
          { key: 'unread' as const, label: 'غير مقروء', count: unreadCount },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-5 h-9 rounded-full text-sm font-semibold transition-all ${
              activeTab === tab.key
                ? 'bg-[#2D5A27] text-white'
                : 'bg-white border border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#F4F6F9] text-[#888888]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Notifications List */}
      {displayed.length > 0 ? (
        <div className="flex flex-col gap-3">
          {displayed.map(notif => (
            <NotificationItem 
              key={notif.id} 
              notif={notif} 
              onMarkRead={markRead} 
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">🔔</span>
          <h3 className="font-bold text-[#222222] text-lg mb-2">
            {activeTab === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
          </h3>
          <p className="text-[#888888] text-sm">ستظهر هنا الإشعارات الجديدة عند وصولها</p>
        </div>
      )}
    </div>
  );
}
