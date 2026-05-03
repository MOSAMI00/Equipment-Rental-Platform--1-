import { Link } from 'react-router';
import { ClipboardList, Package, FileText, Bell, Star, Settings } from 'lucide-react';

const accountMenuItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋' },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔' },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];

interface DashboardLinksProps {
  setMobileMenuOpen: (open: boolean) => void;
}

export function DashboardLinks({ setMobileMenuOpen }: DashboardLinksProps) {
  return (
    <>
      <p className="text-xs font-semibold text-[#888888] uppercase tracking-wide mb-2">لوحة التحكم</p>
      {accountMenuItems.map((item) => (
        <Link
          key={item.href}
          to={item.href}
          onClick={() => setMobileMenuOpen(false)}
          className="flex items-center gap-3 p-3 rounded-lg hover:bg-[#F4F6F9] text-[#222222]"
        >
          <span>{item.emoji}</span>
          <span className="text-sm">{item.label}</span>
        </Link>
      ))}
    </>
  );
}
