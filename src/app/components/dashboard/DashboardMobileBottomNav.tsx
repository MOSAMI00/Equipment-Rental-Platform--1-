import { NavLink, useLocation } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { useRentalPlatform } from '../../data/mock-api';

const tenantItems = [
  { emoji: '🏠', label: 'طلباتي', href: '/dashboard', exact: true },
  { emoji: '📦', label: 'تسليم', href: '/dashboard/delivery' },
  { emoji: '🛡️', label: 'تأمين', href: '/dashboard/insurance' },
  { emoji: '🔔', label: 'إشعارات', href: '/dashboard/notifications', badge: 0 },
  { emoji: '⭐', label: 'تقييم', href: '/dashboard/ratings' },
  { emoji: '👤', label: 'حساب', href: '/dashboard/settings' },
];

const ownerItems = [
  { emoji: '🏠', label: 'الرئيسية', href: '/dashboard/overview', exact: true },
  { emoji: '🔧', label: 'معدات', href: '/dashboard/equipment', exact: false },
  { emoji: '📥', label: 'طلبات', href: '/dashboard/requests', exact: false },
  { emoji: '💰', label: 'أرباح', href: '/dashboard/earnings', exact: false },
  { emoji: '👤', label: 'حساب', href: '/dashboard/settings', exact: false },
];

export function DashboardMobileBottomNav() {
  const location = useLocation();
  const { user } = useAuth();
  const { notifications, ownerNotifications } = useRentalPlatform();

  const unreadTenant = notifications.filter((n) => !n.read).length;
  const unreadOwner = ownerNotifications.filter((n) => !n.read).length;

  const base = user?.type === 'owner' ? ownerItems : tenantItems;
  const items = base.map((item) =>
    item.href === '/dashboard/notifications'
      ? { ...item, badge: user?.type === 'owner' ? unreadOwner : unreadTenant }
      : item,
  );

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] z-40 flex items-stretch h-16">
      {items.map((item) => {
        const isActive = item.exact
          ? location.pathname === item.href
          : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
        return (
          <NavLink
            key={item.href + (item.label ?? '')}
            to={item.href}
            end={item.exact}
            className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
          >
            <span className={`text-xl transition-transform ${isActive ? 'scale-110' : 'scale-100'}`}>
              {item.emoji}
            </span>
            <span className={`text-[10px] font-medium transition-colors ${isActive ? 'text-[#2D5A27]' : 'text-[#888888]'}`}>
              {item.label}
            </span>
            {isActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#2D5A27] rounded-full" />
            )}
            {item.badge > 0 && (
              <span className="absolute top-2 right-3 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                {item.badge}
              </span>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
}
