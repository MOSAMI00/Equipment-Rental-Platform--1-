import React from 'react';
import {
  Bell,
  ClipboardList,
  DollarSign,
  FileText,
  Home,
  Package,
  Shield,
  Star,
  User,
  Wrench,
} from 'lucide-react';

export const createOwnerNavItems = ({ pendingRequests, unreadOwnerNotifs }) => [
  { path: '/dashboard/overview', name: 'الرئيسية', icon: <Home size={20} /> },
  { path: '/dashboard/equipment', name: 'معداتي', icon: <Wrench size={20} /> },
  { path: '/dashboard/requests', name: 'الطلبات الواردة', icon: <ClipboardList size={20} />, badge: pendingRequests },
  { path: '/dashboard/contracts', name: 'عقودي', icon: <FileText size={20} /> },
  { path: '/dashboard/delivery', name: 'التسليم والإرجاع', icon: <Package size={20} /> },
  { path: '/dashboard/earnings', name: 'الأرباح', icon: <DollarSign size={20} /> },
  { path: '/dashboard/insurance', name: 'التأمينات', icon: <Shield size={20} /> },
  { path: '/dashboard/notifications', name: 'الإشعارات', icon: <Bell size={20} />, badge: unreadOwnerNotifs, badgeRed: true },
  { path: '/dashboard/ratings', name: 'تقييماتي', icon: <Star size={20} /> },
  { path: '/dashboard/settings', name: 'ملفي الشخصي', icon: <User size={20} /> },
];

export const ownerBottomNavItems = [
  { path: '/dashboard/overview', name: 'الرئيسية', icon: <Home size={20} /> },
  { path: '/dashboard/equipment', name: 'معداتي', icon: <Wrench size={20} /> },
  { path: '/dashboard/requests', name: 'الطلبات', icon: <ClipboardList size={20} /> },
  { path: '/dashboard/earnings', name: 'الأرباح', icon: <DollarSign size={20} /> },
  { path: '/dashboard/settings', name: 'حسابي', icon: <User size={20} /> },
];

export const getOwnerPageTitle = (pathname, navItems) => (
  navItems.find((item) => pathname.startsWith(item.path))?.name ?? 'الرئيسية'
);
