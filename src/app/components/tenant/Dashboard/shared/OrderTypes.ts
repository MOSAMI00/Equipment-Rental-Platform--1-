// TODO: explore who components uses this file and if it can be deleted or separated or merged with another file



export type RentalStatus =
  | 'pending'
  | 'confirmed'
  | 'in_use'
  | 'completed'
  | 'cancelled'
  | 'disputed';

export interface RentalOperation {
  id: string;
  orderNum: string;
  tenantId: string;
  ownerId: string;
  equipmentId: number;
  startDate: string;
  endDate: string;
  durationDays: number;
  rentalAmount: number;
  insuranceAmount: number;
  totalAmount: number;
  status: RentalStatus;
}

export const STATUS_CONFIG: Record<RentalStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'معلق', color: '#F39C12', bg: '#FEF9E7' },
  confirmed: { label: 'مؤكد', color: '#3498DB', bg: '#EBF5FB' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: '#FEF5EC' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: '#EAFAF1' },
  cancelled: { label: 'ملغي', color: '#95A5A6', bg: '#F2F3F4' },
  disputed: { label: 'متنازع عليه', color: '#E74C3C', bg: '#FDEDEC' },
};

export type Status = RentalStatus;

export const TABS: { key: RentalStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'معلقة' },
  { key: 'confirmed', label: 'مؤكدة' },
  { key: 'in_use', label: 'قيد الاستخدام' },
  { key: 'completed', label: 'مكتملة' },
  { key: 'cancelled', label: 'ملغية' },
  { key: 'disputed', label: 'نزاعات' },
];
