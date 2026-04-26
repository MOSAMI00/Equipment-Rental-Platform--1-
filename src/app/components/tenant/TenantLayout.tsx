import { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import {
  ClipboardList, Package, FileText, Bell, Star, Settings,
  LogOut, Menu, X, ChevronLeft, Home
} from 'lucide-react';

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
  const [isTablet, setIsTablet] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkTablet = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    checkTablet();
    window.addEventListener('resize', checkTablet);
    return () => window.removeEventListener('resize', checkTablet);
  }, []);

  // Close drawer on route change (mobile)
  useEffect(() => { setSidebarOpen(false); }, [location.pathname]);

  const currentTitle = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname === path || location.pathname.startsWith(path + '/'))?.[1] ?? 'لوحة التحكم';

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      {/* ───── Sidebar ───── */}
      {/* Desktop Sidebar (≥ 1024px) */}
      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <SidebarContent navigate={navigate} location={location} onClose={() => { }} />
      </aside>

      {/* Tablet Sidebar – icon-only (768–1023px) */}
      <aside className="hidden md:flex lg:hidden flex-col w-[68px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <div className="flex flex-col items-center py-5 gap-1 flex-1">
          {/* Logo icon */}
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
            <SidebarContent navigate={navigate} location={location} onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* ───── Main Area ───── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-[#E0E0E0] flex items-center justify-between px-4 md:px-6 flex-shrink-0">
          {/* Right side: Hamburger (mobile) + Page Title */}
          <div className="flex items-center gap-3">
            <button
              className="md:hidden p-2 rounded-lg hover:bg-[#F4F6F9] transition-colors"
              onClick={() => setSidebarOpen(true)}
              aria-label="فتح القائمة"
            >
              <Menu className="w-5 h-5 text-[#222222]" />
            </button>
            <div>
              <h1 className="font-bold text-[#222222] text-lg leading-tight">{currentTitle}</h1>
              <p className="text-xs text-[#888888] hidden sm:block">لوحة تحكم المستأجر</p>
            </div>
          </div>

          {/* Left side: Notifications + Avatar */}
          <div className="flex items-center gap-2">
            {/* Back to site */}
            <NavLink
              to="/"
              className="hidden md:flex items-center gap-1 text-xs text-[#888888] hover:text-[#2D5A27] transition-colors px-3 py-1.5 rounded-lg hover:bg-[#F4F6F9]"
            >
              <Home className="w-4 h-4" />
              <span>الموقع</span>
            </NavLink>

            {/* Notifications */}
            <NavLink
              to="/dashboard/notifications"
              className="relative p-2 rounded-lg hover:bg-[#F4F6F9] transition-colors"
            >
              <Bell className="w-5 h-5 text-[#888888]" />
              <span className="absolute top-1 right-1 w-4 h-4 bg-[#E74C3C] text-white text-[9px] rounded-full flex items-center justify-center">
                3
              </span>
            </NavLink>

            {/* Avatar */}
            <div className="w-9 h-9 rounded-full bg-[#2D5A27] text-white flex items-center justify-center font-bold text-sm cursor-pointer">
              أ
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

      </div>

      {/* ───── Mobile Bottom Nav ───── */}
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

/* ─── Sidebar Content (shared between desktop & mobile drawer) ─── */
function SidebarContent({ navigate, location, onClose }: {
  navigate: ReturnType<typeof useNavigate>;
  location: ReturnType<typeof useLocation>;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col h-full" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Logo */}
      <div className="px-5 py-5 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2D5A27] flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xl">م</span>
          </div>
          <div>
            <p className="font-bold text-[#222222] text-sm leading-tight">منصة تأجير</p>
            <p className="text-xs text-[#888888]">المعدات</p>
          </div>
        </div>
      </div>

      {/* User Avatar */}
      <div className="px-5 py-4 border-b border-[#E0E0E0]">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] text-white flex items-center justify-center font-bold text-lg flex-shrink-0 shadow-md">
            أ
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-[#222222] text-sm truncate">أحمد محمد</p>
            <p className="text-xs text-[#888888] truncate">ahmed@example.com</p>
          </div>
        </div>
      </div>

      {/* Nav Items */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(item.href + '/');
            return (
              <NavLink
                key={item.href}
                to={item.href}
                end={item.exact}
                onClick={onClose}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative ${isActive
                    ? 'bg-[#2D5A27] text-white shadow-sm'
                    : 'text-[#888888] hover:bg-[#F4F6F9] hover:text-[#222222]'
                  }`}
              >
                <span className="text-lg">{item.emoji}</span>
                <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className={`mr-auto w-5 h-5 text-[10px] rounded-full flex items-center justify-center font-bold ${isActive ? 'bg-white text-[#2D5A27]' : 'bg-[#E74C3C] text-white'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-[#E0E0E0]">
        <button
          id="sidebar-logout-btn"
          onClick={() => { onClose(); navigate('/login'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[#E74C3C] hover:bg-red-50 transition-colors"
        >
          <span className="text-lg">🔴</span>
          <span className="text-sm font-medium">تسجيل الخروج</span>
        </button>
      </div>
    </div>
  );
}
