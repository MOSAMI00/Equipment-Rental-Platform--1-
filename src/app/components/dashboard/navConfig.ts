import type { UserType } from '../../auth/AuthContext';

export interface DashboardNavItem {
  href: string;
  label: string;
  emoji: string;
  exact?: boolean;
  badge?: number;
}

export function getDashboardNavItems(
  userType: UserType,
  counts: { pendingRequests: number; unreadNotifs: number },
): DashboardNavItem[] {
  const { pendingRequests, unreadNotifs } = counts;

  if (userType === 'tenant') {
    return [
      { href: '/dashboard', label: 'طلباتي', emoji: '📋', exact: true },
      { href: '/dashboard/delivery', label: 'التسليم والإرجاع', emoji: '📦' },
      { href: '/dashboard/contracts', label: 'عقودي', emoji: '📄' },
      { href: '/dashboard/insurance', label: 'التأمينات', emoji: '🛡️' },
      { href: '/dashboard/notifications', label: 'الإشعارات', emoji: '🔔', badge: unreadNotifs || undefined },
      { href: '/dashboard/ratings', label: 'تقييماتي', emoji: '⭐' },
      { href: '/dashboard/settings', label: 'الإعدادات', emoji: '⚙️' },
    ];
  }

  return [
    { href: '/dashboard/overview', label: 'الرئيسية', emoji: '🏠' },
    { href: '/dashboard/equipment', label: 'معداتي', emoji: '🔧' },
    { href: '/dashboard/requests', label: 'الطلبات الواردة', emoji: '📥', badge: pendingRequests || undefined },
    { href: '/dashboard/rentals', label: 'إيجاراتي', emoji: '📋' },
    { href: '/dashboard/delivery', label: 'التسليم والإرجاع', emoji: '📦' },
    { href: '/dashboard/contracts', label: 'عقودي', emoji: '📄' },
    { href: '/dashboard/earnings', label: 'الأرباح', emoji: '💰' },
    { href: '/dashboard/insurance', label: 'التأمينات', emoji: '🛡️' },
    { href: '/dashboard/notifications', label: 'الإشعارات', emoji: '🔔', badge: unreadNotifs || undefined },
    { href: '/dashboard/ratings', label: 'تقييماتي', emoji: '⭐' },
    { href: '/dashboard/settings', label: 'الإعدادات', emoji: '⚙️' },
  ];
}

export function dashboardPageTitle(pathname: string, userType: UserType): string {
  const ownerTitles: Record<string, string> = {
    '/dashboard/overview': 'الرئيسية',
    '/dashboard/equipment': 'معداتي',
    '/dashboard/equipment/add': 'إضافة معدة',
    '/dashboard/requests': 'الطلبات الواردة',
    '/dashboard/rentals': 'إيجاراتي',
    '/dashboard/earnings': 'الأرباح',
  };

  const shared: Record<string, string> = {
    '/dashboard': 'طلباتي',
    '/dashboard/delivery': 'التسليم والإرجاع',
    '/dashboard/contracts': 'عقودي',
    '/dashboard/insurance': 'التأمينات',
    '/dashboard/notifications': 'الإشعارات',
    '/dashboard/ratings': 'تقييماتي',
    '/dashboard/settings': 'الإعدادات',
  };

  if (pathname.includes('/delivery') && pathname.includes('/order/')) {
    return 'التسليم والإرجاع';
  }
  if (pathname.startsWith('/dashboard/order/')) {
    return 'تفاصيل الطلب';
  }

  const merged = userType === 'owner' ? { ...shared, ...ownerTitles } : shared;
  const hit = Object.entries(merged)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => pathname === path || pathname.startsWith(`${path}/`));
  return hit?.[1] ?? 'لوحة التحكم';
}

export function dashboardSubtitle(userType: UserType): string {
  return userType === 'owner' ? 'لوحة تحكم المؤجر' : 'لوحة تحكم المستأجر';
}
