import { Notification, TYPE_COLORS } from './NotificationTypes';

interface NotificationItemProps {
  notif: Notification;
  onMarkRead: (id: string) => void;
}

export function NotificationItem({ notif, onMarkRead }: NotificationItemProps) {
  return (
    <div
      onClick={() => onMarkRead(notif.id)}
      className={`bg-white rounded-2xl border p-4 cursor-pointer transition-all hover:shadow-sm ${
        notif.read ? 'border-[#E0E0E0]' : 'border-[#2D5A27]/30 bg-[#EAF3E9]/30'
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
          style={{ backgroundColor: TYPE_COLORS[notif.type] + '20' }}
        >
          {notif.emoji}
        </div>

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
  );
}
