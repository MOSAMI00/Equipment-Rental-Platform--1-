import React, { useState } from 'react';
import { Outlet } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { visit } from '../../inertia/navigation';
import { useOwnerPageProps } from '../../inertia/owner-page-props';
import OwnerBottomNav from './layout/OwnerBottomNav';
import OwnerSidebar from './layout/OwnerSidebar';
import OwnerTopbar from './layout/OwnerTopbar';
import { createOwnerNavItems, getOwnerPageTitle, ownerBottomNavItems } from './layout/navigation';

const OwnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { rentals, ownerNotifications } = useOwnerPageProps();
  const pathname = window.location.pathname;
  const pendingRequests = rentals.filter((rental) => rental.ownerId === user?.id && rental.status === 'pending').length;
  const unreadOwnerNotifs = ownerNotifications.filter((n) => !n.read).length;
  const ownerInitial = (user?.fullName ?? '؟').charAt(0);
  const navItems = createOwnerNavItems({ pendingRequests, unreadOwnerNotifs });
  const pageTitle = getOwnerPageTitle(pathname, navItems);

  const handleNavigate = (path) => {
    setIsSidebarOpen(false);
    setIsProfileOpen(false);
    visit(path);
  };

  return (
    <div className="owner-layout">
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      <OwnerSidebar
        isOpen={isSidebarOpen}
        navItems={navItems}
        pathname={pathname}
        user={user}
        ownerInitial={ownerInitial}
        onNavigate={handleNavigate}
        onLogout={logout}
      />

      <div className="owner-main">
        <OwnerTopbar
          title={pageTitle}
          unreadCount={unreadOwnerNotifs}
          user={user}
          ownerInitial={ownerInitial}
          isProfileOpen={isProfileOpen}
          onMenuClick={() => setIsSidebarOpen((current) => !current)}
          onToggleProfile={() => setIsProfileOpen((current) => !current)}
          onNavigate={handleNavigate}
          onLogout={logout}
        />

        <div className="owner-content">
          <Outlet />
        </div>
      </div>

      <OwnerBottomNav items={ownerBottomNavItems} pathname={pathname} onNavigate={handleNavigate} />
    </div>
  );
};

export default OwnerLayout;
