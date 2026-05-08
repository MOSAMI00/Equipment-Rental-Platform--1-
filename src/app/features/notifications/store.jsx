import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

const NotificationsContext = createContext(null);

const STORAGE_KEYS = {
  notifications: 'equipment-platform.notifications',
  ownerNotifications: 'equipment-platform.owner-notifications',
};

const INITIAL_NOTIFICATIONS = [
  {
    id: 'notif-1',
    type: 'payment',
    emoji: '💰',
    title: 'الدفع مطلوب',
    message: 'لديك طلب مؤكد #OP-1047 ينتظر الدفع. يرجى إتمام الدفع خلال 24 ساعة.',
    time: 'منذ 10 دقائق',
    read: false,
    action: { label: 'أكمل الدفع', href: '/dashboard/order/1' },
  },
  {
    id: 'notif-2',
    type: 'order',
    emoji: '✅',
    title: 'تم تأكيد طلبك',
    message: 'تم تأكيد طلب إيجار خلاطة خرسانة صناعية #OP-1048.',
    time: 'منذ 30 دقيقة',
    read: false,
    action: { label: 'عرض الطلب', href: '/dashboard/order/2' },
  },
  {
    id: 'notif-3',
    type: 'return',
    emoji: '📦',
    title: 'تذكير الإرجاع',
    message: 'الموعد النهائي لإرجاع خلاطة خرسانة صناعية قريب. راجع صفحة التسليم والإرجاع.',
    time: 'منذ ساعتين',
    read: false,
    action: { label: 'إدارة التسليم', href: '/dashboard/order/2/delivery' },
  },
  {
    id: 'notif-4',
    type: 'review',
    emoji: '⭐',
    title: 'قيّم تجربتك',
    message: 'لديك تجربة إيجار مكتملة #OP-1042 في انتظار تقييمك.',
    time: 'منذ يوم',
    read: true,
    action: { label: 'قيّم الآن', href: '/dashboard/ratings?orderId=7' },
  },
  {
    id: 'notif-5',
    type: 'dispute',
    emoji: '⚠️',
    title: 'نزاع مفتوح',
    message: 'تم فتح نزاع على طلب #OP-1043. الفريق يراجع القضية.',
    time: 'منذ يومين',
    read: true,
    action: { label: 'عرض النزاع', href: '/dashboard/order/6/delivery' },
  },
  {
    id: 'notif-6',
    type: 'system',
    emoji: '🔔',
    title: 'تحديث المنصة',
    message: 'تم تحديث منصتك بميزات جديدة تشمل تتبع الطلبات المحسن ودعم فوري.',
    time: 'منذ 3 أيام',
    read: true,
  },
];

const INITIAL_OWNER_NOTIFICATIONS = [
  {
    id: 'own-notif-1',
    type: 'order',
    emoji: '📋',
    title: 'طلب حجز جديد',
    message: 'أحمد محمد طلب تأجير مولد كهرباء 10KVA — OP-1047. بانتظار موافقتك.',
    time: 'منذ 5 دقائق',
    read: false,
    referenceType: 'rental_operation',
    referenceId: '1',
    action: { label: 'مراجعة الطلب', href: '/owner/requests' },
  },
  {
    id: 'own-notif-2',
    type: 'payment',
    emoji: '💰',
    title: 'تأكيد الدفع في الضمان',
    message: 'تم حجز مبلغ الإيجار في الضمان للطلب #OP-1048. المعدة جاهزة للتسليم.',
    time: 'منذ ساعة',
    read: false,
    referenceType: 'rental_operation',
    referenceId: '2',
    action: { label: 'إدارة التسليم', href: '/owner/delivery' },
  },
  {
    id: 'own-notif-3',
    type: 'return',
    emoji: '📦',
    title: 'تقرير استلام من المستأجر',
    message: 'أحمد محمد أرسل تقرير استلام المعدة للطلب #OP-1048. راجع التفاصيل وأكّد.',
    time: 'منذ 3 ساعات',
    read: false,
    referenceType: 'handover',
    referenceId: 'handover-1',
    action: { label: 'مراجعة التقرير', href: '/owner/delivery' },
  },
  {
    id: 'own-notif-4',
    type: 'dispute',
    emoji: '⚠️',
    title: 'مطالبة من مستأجر',
    message: 'تم فتح نزاع على الطلب #OP-1043 من المستأجر. يرجى الرد على المطالبة.',
    time: 'بالأمس',
    read: false,
    referenceType: 'dispute',
    referenceId: 'dispute-1',
    action: { label: 'عرض النزاع', href: '/owner/requests' },
  },
  {
    id: 'own-notif-5',
    type: 'system',
    emoji: '🏦',
    title: 'تحويل أرباح',
    message: 'تم تحويل 42,750 ر.ي إلى حسابك البنكي بعد اكتمال الطلب #OP-1042.',
    time: 'منذ 3 أيام',
    read: true,
  },
];

function readStorage(key, fallback) {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;
  try {
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function numericId(prefix) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState(() => {
    const raw = readStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
    return raw.filter(n => !n.message.includes('OP-1043'));
  });

  const [ownerNotifications, setOwnerNotifications] = useState(() => {
    const raw = readStorage(STORAGE_KEYS.ownerNotifications, INITIAL_OWNER_NOTIFICATIONS);
    return raw.filter(n => !n.message.includes('OP-1043'));
  });

  useEffect(() => {
    writeStorage(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  useEffect(() => {
    writeStorage(STORAGE_KEYS.ownerNotifications, ownerNotifications);
  }, [ownerNotifications]);

  useEffect(() => {
    const handler = (event) => {
      if (event.key === STORAGE_KEYS.notifications) {
        const raw = readStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS);
        setNotifications(raw.filter(n => !n.message.includes('OP-1043')));
      }
      if (event.key === STORAGE_KEYS.ownerNotifications) {
        const raw = readStorage(STORAGE_KEYS.ownerNotifications, INITIAL_OWNER_NOTIFICATIONS);
        setOwnerNotifications(raw.filter(n => !n.message.includes('OP-1043')));
      }
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const addNotification = (notification) => {
    setNotifications((existing) => [
      { ...notification, id: numericId('notif'), time: 'الآن', read: false },
      ...existing,
    ]);
  };

  const addOwnerNotification = (notification) => {
    setOwnerNotifications((existing) => [
      { ...notification, id: numericId('own-notif'), time: 'الآن', read: false },
      ...existing,
    ]);
  };

  const markNotificationRead = (id) => {
    setNotifications((existing) =>
      existing.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((existing) => existing.map((n) => ({ ...n, read: true })));
  };

  const markOwnerNotificationRead = (id) => {
    setOwnerNotifications((existing) =>
      existing.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllOwnerNotificationsRead = () => {
    setOwnerNotifications((existing) => existing.map((n) => ({ ...n, read: true })));
  };

  const value = useMemo(() => ({
    notifications,
    ownerNotifications,
    addNotification,
    addOwnerNotification,
    markNotificationRead,
    markAllNotificationsRead,
    markOwnerNotificationRead,
    markAllOwnerNotificationsRead,
  }), [notifications, ownerNotifications]);

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications must be used inside NotificationsProvider');
  }
  return context;
}

export function useUnreadCount(role = 'tenant') {
  const { notifications, ownerNotifications } = useNotifications();
  return useMemo(() => {
    const list = role === 'owner' ? ownerNotifications : notifications;
    return list.filter((n) => !n.read).length;
  }, [notifications, ownerNotifications, role]);
}
