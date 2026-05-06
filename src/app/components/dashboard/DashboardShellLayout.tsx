import { useEffect, useMemo, useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router';
import { LogOut, X } from 'lucide-react';
import { SidebarContent } from '../tenant/Dashboard/Sidebar/Sidebar';
import { DashboardTopbar } from '../tenant/Dashboard/Topbar/Topbar';
import { DashboardMobileBottomNav } from './DashboardMobileBottomNav';
import { useAuth } from '../../auth/AuthContext';
import { useRentalPlatform } from '../../data/mock-api';
import { dashboardPageTitle, dashboardSubtitle, getDashboardNavItems } from './navConfig';

export function DashboardShellLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, ownerNotifications, rentals } = useRentalPlatform();

  const pendingRequests = useMemo(
    () => rentals.filter((r) => r.ownerId === user?.id && r.status === 'pending').length,
    [rentals, user?.id],
  );

  const unreadNotifs = user?.type === 'owner'
    ? ownerNotifications.filter((n) => !n.read).length
    : notifications.filter((n) => !n.read).length;

  const navItemsWithBadges = useMemo(
    () => getDashboardNavItems(user?.type ?? 'tenant', { pendingRequests, unreadNotifs }),
    [user?.type, pendingRequests, unreadNotifs],
  );

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  const currentTitle = dashboardPageTitle(location.pathname, user?.type ?? 'tenant');
  const subtitle = dashboardSubtitle(user?.type ?? 'tenant');
  const displayName = user?.fullName ?? 'مستخدم';
  const displayEmail = user?.phone ? `+${user.phone}` : 'حسابي';
  const userInitial = displayName.charAt(0);

  return (
    <div className="flex h-screen bg-[#F4F6F9] overflow-hidden" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>

      <aside className="hidden lg:flex flex-col w-[260px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <SidebarContent
          navItems={navItemsWithBadges}
          onClose={() => { }}
          userName={displayName}
          userSubtitle={displayEmail}
          userInitial={userInitial}
          onLogout={() => { logout(); navigate('/login'); }}
        />
      </aside>

      <aside className="hidden md:flex lg:hidden flex-col w-[68px] bg-white border-l border-[#E0E0E0] flex-shrink-0 h-full">
        <div className="flex flex-col items-center py-5 gap-1 flex-1">
          <div className="w-10 h-10 rounded-lg bg-[#2D5A27] flex items-center justify-center mb-4">
            <span className="text-white font-bold text-xl">{userInitial}</span>
          </div>
          {navItemsWithBadges.map((item) => {
            const isActive = item.exact
              ? location.pathname === item.href
              : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);
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
              onClick={() => { logout(); navigate('/login'); }}
              title="تسجيل الخروج"
              className="w-12 h-12 flex items-center justify-center rounded-xl text-[#E74C3C] hover:bg-red-50 transition-colors"
              type="button"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="relative w-[260px] bg-white h-full flex flex-col shadow-2xl" style={{ right: 0, left: 'auto', position: 'absolute' }}>
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-[#F4F6F9]"
              type="button"
            >
              <X className="w-5 h-5 text-[#888888]" />
            </button>
            <SidebarContent
              navItems={navItemsWithBadges}
              onClose={() => setSidebarOpen(false)}
              userName={displayName}
              userSubtitle={displayEmail}
              userInitial={userInitial}
              onLogout={() => { logout(); navigate('/login'); }}
            />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <DashboardTopbar
          title={currentTitle}
          subtitle={subtitle}
          onOpenSidebar={() => setSidebarOpen(true)}
          unreadNotifications={unreadNotifs}
        />
        <main className="flex-1 overflow-y-auto">
          {user?.type === 'owner' ? (
            <div className="owner-content min-h-full">
              <Outlet />
            </div>
          ) : (
            <Outlet />
          )}
        </main>
      </div>
      <DashboardMobileBottomNav />
    </div>
  );
}
