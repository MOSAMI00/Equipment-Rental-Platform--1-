import { NotificationItem } from './NotificationItem';
import type { TenantNotification } from '../../../../../../data/mock-api';

interface NotificationListProps {
  displayed: TenantNotification[];
  markRead: (id: string) => void;
  activeTab: 'all' | 'unread';
}

export function NotificationList({ displayed, markRead, activeTab }: NotificationListProps) {
  if (displayed.length > 0) {
    return (
      <div className="flex flex-col gap-3">
        {displayed.map(notif => (
          <NotificationItem 
            key={notif.id} 
            notif={notif} 
            onMarkRead={markRead} 
          />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <span className="text-5xl mb-4">🔔</span>
      <h3 className="font-bold text-[#222222] text-lg mb-2">
        {activeTab === 'unread' ? 'لا توجد إشعارات غير مقروءة' : 'لا توجد إشعارات'}
      </h3>
      <p className="text-[#888888] text-sm">ستظهر هنا الإشعارات الجديدة عند وصولها</p>
    </div>
  );
}
