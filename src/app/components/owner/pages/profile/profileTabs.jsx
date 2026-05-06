import React from 'react';
import { Bell, CreditCard, Lock, User } from 'lucide-react';

export const profileTabs = [
  { id: 'profile', name: 'ملفي الشخصي', icon: <User size={18} /> },
  { id: 'security', name: 'الأمان وكلمة المرور', icon: <Lock size={18} /> },
  { id: 'payment', name: 'وسائل استلام الأرباح', icon: <CreditCard size={18} /> },
  { id: 'notifications', name: 'الإشعارات والتفضيلات', icon: <Bell size={18} /> },
];
