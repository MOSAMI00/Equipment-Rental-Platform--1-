import { useState } from 'react';
import { CheckCheck } from 'lucide-react';

type NotifType = 'payment' | 'order' | 'return' | 'review' | 'dispute' | 'system';

interface Notification {
  id: string;
  type: NotifType;
  emoji: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: { label: string; href: string };
}

const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'payment', emoji: '💰', title: 'الدفع مطلوب', message: 'لديك طلب مؤكد #OP-1047 ينتظر الدفع. يرجى إتمام الدفع خلال 24 ساعة.', time: 'منذ 10 دقائق', read: false, action: { label: 'ادفع الآن', href: '/dashboard' } },
  { id: '2', type: 'order', emoji: '✅', title: 'تم تأكيد طلبك', message: 'تم تأكيد طلب إيجار الحفارة الصغيرة #OP-1048 من قبل المؤجر محمد سالم.', time: 'منذ 30 دقيقة', read: false, action: { label: 'عرض الطلب', href: '/dashboard/order/2' } },
  { id: '3', type: 'return', emoji: '📦', title: 'ذكرى الإرجاع', message: 'الموعد النهائي لإرجاع الحفارة الصغيرة هو غداً. تأكد من إعادتها في الوقت المحدد.', time: 'منذ 2 ساعة', read: false, action: { label: 'تفاصيل', href: '/dashboard/delivery' } },
  { id: '4', type: 'review', emoji: '⭐', title: 'قيّم تجربتك', message: 'لديك تجربة إيجار مكتملة #OP-1045 في انتظار تقييمك. شاركنا رأيك!', time: 'منذ يوم', read: true, action: { label: 'قيّم الآن', href: '/dashboard/ratings' } },
  { id: '5', type: 'dispute', emoji: '⚠️', title: 'نزاع مفتوح', message: 'تم فتح نزاع على طلب #OP-1043. الفريق يراجع القضية.', time: 'منذ 2 يوم', read: true, action: { label: 'عرض النزاع', href: '/dashboard/order/6' } },
  { id: '6', type: 'system', emoji: '🔔', title: 'تحديث المنصة', message: 'تم تحديث منصتك بميزات جديدة تشمل تتبع الطلبات المحسّن ودعم فوري.', time: 'منذ 3 أيام', read: true },
  { id: '7', type: 'order', emoji: '🚧', title: 'المعدة في الطريق', message: 'سيصل المؤجر لتسليم الحفارة الصغيرة خلال ساعة. يرجى الاستعداد.', time: 'منذ 4 أيام', read: true },
];

const TYPE_COLORS: Record<NotifType, string> = {
  payment:  '#F39C12',
  order:    '#27AE60',
  return:   '#3498DB',
  review:   '#9B59B6',
  dispute:  '#E74C3C',
  system:   '#888888',
};

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
            <div
              key={notif.id}
              onClick={() => markRead(notif.id)}
              className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
                notif.read ? 'border-[#E0E0E0]' : 'border-[#2D5A27]/30 bg-[#EAF3E9]/30'
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                  style={{ backgroundColor: TYPE_COLORS[notif.type] + '20' }}
                >
                  {notif.emoji}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={`font-bold text-sm ${notif.read ? 'text-[#222222]' : 'text-[#2D5A27]'}`}>
                      {notif.title}
                    </p>
                    {!notif.read && (
                      <span className="w-2.5 h-2.5 rounded-full bg-[#2D5A27] flex-shrink-0 mt-1" />
                    )}
                  </div>
                  <p className="text-sm text-[#888888] mt-0.5 leading-relaxed">{notif.message}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[#888888]">{notif.time}</span>
                    {notif.action && (
                      <a
                        href={notif.action.href}
                        onClick={e => e.stopPropagation()}
                        className="text-xs font-bold text-[#2D5A27] hover:underline"
                      >
                        {notif.action.label} ←
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
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
