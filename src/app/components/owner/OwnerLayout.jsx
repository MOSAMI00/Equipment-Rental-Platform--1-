import React, { useState } from 'react';
import { Outlet } from 'react-router';
import {
  Home, Wrench, ClipboardList, FileText, Package, DollarSign,
  Shield, Bell, Star, User, LogOut, Menu, ChevronDown
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import { visit } from '../../inertia/navigation';
import { useOwnerPageProps } from '../../inertia/owner-page-props';

const OwnerLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const { rentals, ownerNotifications } = useOwnerPageProps();
  const pathname = window.location.pathname;
  const pendingRequests = rentals.filter((rental) => rental.ownerId === user?.id && rental.status === 'pending').length;
  const unreadOwnerNotifs = ownerNotifications.filter((n) => !n.read).length;

  const navItems = [
    { path: '/owner/overview', name: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/owner/equipment', name: 'معداتي', icon: <Wrench size={20} /> },
    { path: '/owner/requests', name: 'الطلبات الواردة', icon: <ClipboardList size={20} />, badge: pendingRequests },
    { path: '/owner/contracts', name: 'عقودي', icon: <FileText size={20} /> },
    { path: '/owner/delivery', name: 'التسليم والإرجاع', icon: <Package size={20} /> },
    { path: '/owner/earnings', name: 'الأرباح', icon: <DollarSign size={20} /> },
    { path: '/owner/insurance', name: 'التأمينات', icon: <Shield size={20} /> },
    { path: '/owner/notifications', name: 'الإشعارات', icon: <Bell size={20} />, badge: unreadOwnerNotifs, badgeRed: true },
    { path: '/owner/reviews', name: 'تقييماتي', icon: <Star size={20} /> },
    { path: '/owner/profile', name: 'ملفي الشخصي', icon: <User size={20} /> },
  ];

  const bottomNavItems = [
    { path: '/owner/overview', name: 'الرئيسية', icon: <Home size={20} /> },
    { path: '/owner/equipment', name: 'معداتي', icon: <Wrench size={20} /> },
    { path: '/owner/requests', name: 'الطلبات', icon: <ClipboardList size={20} /> },
    { path: '/owner/earnings', name: 'الأرباح', icon: <DollarSign size={20} /> },
    { path: '/owner/profile', name: 'حسابي', icon: <User size={20} /> },
  ];

  const getPageTitle = () => {
    const item = navItems.find((i) => pathname.startsWith(i.path));
    return item ? item.name : 'الرئيسية';
  };

  return (
    <div className="owner-layout">
      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <div className={`owner-sidebar ${isSidebarOpen ? 'drawer-open' : ''}`}>
        <div className="owner-sidebar-header">
          <h2 style={{ margin: 0 }}>منصة التأجير</h2>
          <div className="owner-profile-summary">
            <div className="owner-profile-pic">
              <img src="https://i.pravatar.cc/150?img=11" alt="Owner" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            </div>
            <h3 style={{ margin: '8px 0 2px', fontSize: '16px' }}>{user?.fullName ?? 'أحمد المؤجر'}</h3>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', display: 'flex', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
              🏪 متجر المعدات
            </span>
            <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginTop: 4 }}>
              📍 صنعاء | مؤجر <span style={{ color: 'var(--color-completed)' }}>✅</span>
            </span>
            <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginTop: 4 }}>⭐ 4.8 | 102 عملية</span>
          </div>
        </div>

        <div className="owner-nav">
          {navItems.map((item) => (
            <button
              key={item.path}
              className={`owner-nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
              style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}
              type="button"
              onClick={() => {
                setIsSidebarOpen(false);
                visit(item.path);
              }}
            >
              {item.icon}
              <span>{item.name}</span>
              {item.badge && (
                <span className={`owner-nav-badge ${item.badgeRed ? 'owner-nav-badge-red' : ''}`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid var(--color-border)' }}>
          <button onClick={logout} className="owner-nav-item" style={{ width: '100%', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-disputed)', fontFamily: 'inherit', fontSize: 14 }}>
            <LogOut size={20} />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="owner-main">
        {/* Topbar */}
        <div className="owner-topbar">
          <div className="owner-topbar-right">
            <button
              className="mobile-menu-btn"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              aria-label="القائمة"
            >
              <Menu size={24} />
            </button>
            <h3 className="owner-topbar-title">{getPageTitle()}</h3>
          </div>

          <div className="owner-topbar-left">
            <button
              type="button"
              onClick={() => visit('/owner/notifications')}
              style={{ position: 'relative', color: 'var(--color-text-muted)', border: 'none', background: 'transparent', cursor: 'pointer' }}
            >
              <Bell size={22} />
              {unreadOwnerNotifs > 0 && <span className="topbar-notification-badge">{unreadOwnerNotifs}</span>}
            </button>
            <div
              className="topbar-profile"
              onClick={() => setIsProfileOpen(!isProfileOpen)}
            >
              <img src="https://i.pravatar.cc/150?img=11" alt="Profile" />
              <span>{user?.fullName?.split(' ')[0] ?? 'أحمد'}</span>
              <ChevronDown size={16} />
              {isProfileOpen && (
                <div className="topbar-dropdown">
                  <button
                    type="button"
                    className="topbar-dropdown-item"
                    style={{ width: '100%', border: 'none', background: 'transparent', textAlign: 'right', cursor: 'pointer' }}
                    onClick={() => {
                      setIsProfileOpen(false);
                      visit('/owner/profile');
                    }}
                  >
                    <User size={16} /> ملفي الشخصي
                  </button>
                  <div onClick={logout} className="topbar-dropdown-item" style={{ color: 'var(--color-disputed)' }}>
                    <LogOut size={16} /> تسجيل الخروج
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="owner-content">
          <Outlet />
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="mobile-bottom-nav">
        {bottomNavItems.map((item) => (
          <button
            key={item.path}
            type="button"
            className={`bottom-nav-item ${pathname.startsWith(item.path) ? 'active' : ''}`}
            style={{ border: 'none', background: 'transparent', cursor: 'pointer' }}
            onClick={() => visit(item.path)}
          >
            {item.icon}
            <span>{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default OwnerLayout;
