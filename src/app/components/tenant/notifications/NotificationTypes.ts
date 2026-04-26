export type NotifType = 'payment' | 'order' | 'return' | 'review' | 'dispute' | 'system';

export interface Notification {
  id: string;
  type: NotifType;
  emoji: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  action?: { label: string; href: string };
}

export const NOTIFICATIONS: Notification[] = [
  { id: '1', type: 'payment', emoji: '💰', title: 'الدفع مطلوب', message: 'لديك طلب مؤكد #OP-1047 ينتظر الدفع. يرجى إتمام الدفع خلال 24 ساعة.', time: 'منذ 10 دقائق', read: false, action: { label: 'ادفع الآن', href: '/dashboard' } },
  { id: '2', type: 'order', emoji: '✅', title: 'تم تأكيد طلبك', message: 'تم تأكيد طلب إيجار الحفارة الصغيرة #OP-1048 من قبل المؤجر محمد سالم.', time: 'منذ 30 دقيقة', read: false, action: { label: 'عرض الطلب', href: '/dashboard/order/2' } },
  { id: '3', type: 'return', emoji: '📦', title: 'ذكرى الإرجاع', message: 'الموعد النهائي لإرجاع الحفارة الصغيرة هو غداً. تأكد من إعادتها في الوقت المحدد.', time: 'منذ 2 ساعة', read: false, action: { label: 'تفاصيل', href: '/dashboard/delivery' } },
  { id: '4', type: 'review', emoji: '⭐', title: 'قيّم تجربتك', message: 'لديك تجربة إيجار مكتملة #OP-1045 في انتظار تقييمك. شاركنا رأيك!', time: 'منذ يوم', read: true, action: { label: 'قيّم الآن', href: '/dashboard/ratings' } },
  { id: '5', type: 'dispute', emoji: '⚠️', title: 'نزاع مفتوح', message: 'تم فتح نزاع على طلب #OP-1043. الفريق يراجع القضية.', time: 'منذ 2 يوم', read: true, action: { label: 'عرض النزاع', href: '/dashboard/order/6' } },
  { id: '6', type: 'system', emoji: '🔔', title: 'تحديث المنصة', message: 'تم تحديث منصتك بميزات جديدة تشمل تتبع الطلبات المحسّن ودعم فوري.', time: 'منذ 3 أيام', read: true },
  { id: '7', type: 'order', emoji: '🚧', title: 'المعدة في الطريق', message: 'سيصل المؤجر لتسليم الحفارة الصغيرة خلال ساعة. يرجى الاستعداد.', time: 'منذ 4 أيام', read: true },
];

export const TYPE_COLORS: Record<NotifType, string> = {
  payment:  '#F39C12',
  order:    '#27AE60',
  return:   '#3498DB',
  review:   '#9B59B6',
  dispute:  '#E74C3C',
  system:   '#888888',
};
