import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import {
  ClipboardList, Package, FileText, Bell, Star, Settings,
  LogOut, X
} from 'lucide-react';
import { SidebarContent } from './SidebarContent';
import { DashboardTopbar } from './DashboardTopbar';

const navItems = [
  { icon: ClipboardList, label: 'طلباتي', href: '/dashboard', emoji: '📋', exact: true },
  { icon: Package, label: 'التسليم والإرجاع', href: '/dashboard/delivery', emoji: '📦' },
  { icon: FileText, label: 'عقودي', href: '/dashboard/contracts', emoji: '📄' },
  { icon: Bell, label: 'الإشعارات', href: '/dashboard/notifications', emoji: '🔔', badge: 3 },
  { icon: Star, label: 'تقييماتي', href: '/dashboard/ratings', emoji: '⭐' },
  { icon: Settings, label: 'الإعدادات', href: '/dashboard/settings', emoji: '⚙️' },
];

const pageTitles: Record<string, string> = {
  '/dashboard': 'طلباتي',
  '/dashboard/delivery': 'التسليم والإرجاع',
  '/dashboard/contracts': 'عقودي',
  '/dashboard/notifications': 'الإشعارات',
  '/dashboard/ratings': 'تقييماتي',
  '/dashboard/settings': 'الإعدادات',
};

export function TenantLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTablet = () => {
      // Is Tablet Logic if needed
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const currentTitle = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))?.[1] ?? 'لوحة التحكم';

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <SidebarContent navItems={navItems} onClose={() => { }} />
      </aside>

      {/* Tablet Sidebar – icon-only */}
      <aside className="hidden md:flex lg:hidden flex-col w-[68px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <div className="flex flex-col items-center py-5 gap-1 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#2D5A27] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">م</span>
          </div>
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                title={item.label}
                className={`relative w-12 h-12 flex items-center justify-center rounded-xl transition-all ${isActive ? 'bg-[#2D5A27] text-white' : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#2D5A27]'
                  }`}
              >
                <span className="text-xl">{item.emoji}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
          <div className="mt-auto mb-2">
            <button
              onClick={() => navigate('/login')}
              title="تسجيل الخروج"
              className="w-12 h-12 flex items-center justify-center rounded-xl text-[#E74C3C] hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[260px] bg-white h-full flex flex-col shadow-2xl" style={{ right: 0, left: 'auto', position: 'absolute' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-[#F4F6F9]"
            >
              <X className="w-5 h-5 text-[#888888]" />
            </button>
            <SidebarContent navItems={navItems} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopbar title={currentTitle} onOpenSidebar={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#E0E0E0] z-40 flex items-stretch h-16">
        {[
          { emoji: '🏠', label: 'طلباتي', href: '/dashboard', exact: true },
          { emoji: '📦', label: 'تسليم', href: '/dashboard/delivery' },
          { emoji: '🔔', label: 'إشعارات', href: '/dashboard/notifications', badge: 3 },
          { emoji: '⭐', label: 'تقييم', href: '/dashboard/ratings' },
          { emoji: '👤', label: 'حساب', href: '/dashboard/settings' },
        ].map((item) => {
          const isActive = item.exact
            ? location.pathname === item.href
            : location.pathname.startsWith(item.href);
          return (
            <NavLink
              key={item.href}
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
              {item.badge && (
                <span className="absolute top-2 right-3 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}
