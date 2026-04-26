export const STATUS_CONFIG = {
  pending:   { label: 'معلق', color: '#F39C12', bg: '#FEF9E7' },
  confirmed: { label: 'مؤكد', color: '#3498DB', bg: '#EBF5FB' },
  in_use:    { label: 'قيد الاستخدام', color: '#E67E22', bg: '#FEF5EC' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: '#EAFAF1' },
  cancelled: { label: 'ملغي', color: '#95A5A6', bg: '#F2F3F4' },
  disputed:  { label: 'متنازع عليه', color: '#E74C3C', bg: '#FDEDEC' },
} as const;

export type Status = keyof typeof STATUS_CONFIG;

export interface Rental {
  id: string;
  orderNum: string;
  equipment: string;
  image: string;
  lessor: string;
  rating: number;
  dateFrom: string;
  dateTo: string;
  days: number;
  amount: string;
  status: Status;
}

export const SAMPLE_RENTALS: Rental[] = [
  { id: '1', orderNum: 'OP-1047', equipment: 'مولد كهرباء 5KVA', image: '⚡', lessor: 'أحمد علي', rating: 4.8, dateFrom: '01 فبراير', dateTo: '04 فبراير', days: 3, amount: '45,000', status: 'confirmed' },
  { id: '2', orderNum: 'OP-1048', equipment: 'حفارة صغيرة', image: '🚧', lessor: 'محمد سالم', rating: 4.5, dateFrom: '05 فبراير', dateTo: '10 فبراير', days: 5, amount: '120,000', status: 'in_use' },
  { id: '3', orderNum: 'OP-1049', equipment: 'كاميرا تصوير احترافية', image: '📷', lessor: 'خالد يوسف', rating: 4.9, dateFrom: '12 فبراير', dateTo: '13 فبراير', days: 1, amount: '15,000', status: 'pending' },
  { id: '4', orderNum: 'OP-1045', equipment: 'رافعة شوكية', image: '🏗️', lessor: 'علي حسن', rating: 4.2, dateFrom: '20 يناير', dateTo: '25 يناير', days: 5, amount: '200,000', status: 'completed' },
  { id: '5', orderNum: 'OP-1044', equipment: 'ضاغط هواء', image: '💨', lessor: 'عمر ناصر', rating: 4.6, dateFrom: '15 يناير', dateTo: '17 يناير', days: 2, amount: '30,000', status: 'cancelled' },
  { id: '6', orderNum: 'OP-1043', equipment: 'خلاط خرسانة', image: '🔩', lessor: 'حسام فارس', rating: 3.8, dateFrom: '10 يناير', dateTo: '14 يناير', days: 4, amount: '60,000', status: 'disputed' },
  { id: '7', orderNum: 'OP-1042', equipment: 'مضخة مياه', image: '💧', lessor: 'طارق محمود', rating: 4.7, dateFrom: '05 يناير', dateTo: '06 يناير', days: 1, amount: '12,000', status: 'completed' },
  { id: '8', orderNum: 'OP-1041', equipment: 'شاحنة نقل', image: '🚛', lessor: 'سامي عادل', rating: 4.4, dateFrom: '28 ديسمبر', dateTo: '30 ديسمبر', days: 2, amount: '80,000', status: 'completed' },
];

export const TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_use', label: 'In Use' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'disputed', label: 'Disputed' },
];
