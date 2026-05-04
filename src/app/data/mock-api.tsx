import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { products } from './products';
import type { ProductCardProps } from '../components/pages/Home/Main/EquipmentSection/ProductCard';
import type { RentalOperation, RentalStatus } from '../components/tenant/Dashboard/shared/OrderTypes';
import { useAuth } from '../auth/AuthContext';

const SERVICE_FEE_RATE = 0.05;
const DEFAULT_TENANT_ID = 'tenant-1';

const STORAGE_KEYS = {
  rentals: 'equipment-platform.rentals',
  cart: 'equipment-platform.cart',
  handovers: 'equipment-platform.handovers',
  disputes: 'equipment-platform.disputes',
  reviews: 'equipment-platform.reviews',
  notifications: 'equipment-platform.notifications',
  ownerNotifications: 'equipment-platform.owner-notifications',
};

export type PaymentMethod = 'card' | 'wallet' | 'cash';
export type PaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type EscrowStatus = 'not_started' | 'held' | 'released' | 'refunded';
export type HandoverPhase = 'delivery' | 'return';
export type DisputeStatus = 'open' | 'under_review' | 'resolved';
export type ReviewTargetType = 'user' | 'equipment';
export type NotificationType = 'payment' | 'order' | 'return' | 'review' | 'dispute' | 'system';

export interface EquipmentSnapshot {
  equipmentId: number;
  name: string;
  image: string;
  location: string;
  category: string;
  rating: number;
  dailyRate: number;
  insuranceAmount: number;
  ownerId: string;
  ownerName: string;
  ownerPhone: string;
  ownerRating: number;
}

export interface TenantRental extends RentalOperation {
  dailyRate: number;
  serviceFee: number;
  paymentStatus: PaymentStatus;
  escrowStatus: EscrowStatus;
  deliveryInfo?: DeliveryInfo;
  timeSlot?: TimeSlot;
  notes?: string;
  createdAt: string;
}

export interface CartRentalItem {
  id: number;
  equipmentId: number;
  ownerId: string;
  name: string;
  image: string;
  owner: string;
  location: string;
  category: string;
  startDate: string;
  endDate: string;
  days: number;
  dailyRate: number;
  deposit: number;
  serviceFee: number;
  rentalAmount: number;
  totalAmount: number;
  notes?: string;
}

export interface DeliveryInfo {
  governorate: string;
  district: string;
  address: string;
  phone: string;
}

export type TimeSlot = 'morning' | 'afternoon' | 'evening' | null;

export interface HandoverReport {
  id: string;
  rentalOpId: string;
  phase: HandoverPhase;
  submittedById: string;
  submittedByRole: 'tenant' | 'owner';
  conditionStatus?: string;
  hasIssues: boolean;
  hasDamage?: boolean;
  notes?: string;
  evidencePhotos?: string[];
  createdAt: string;
  // Owner confirmation fields
  confirmedById?: string;
  confirmedByRole?: 'owner';
  confirmedAt?: string;
  // Owner return fields
  proposedDeduction?: number;
  ownerDecision?: 'full_refund' | 'partial_refund' | 'no_refund';
  objectionDeadline?: string;
}

export interface Dispute {
  id: string;
  rentalOpId: string;
  equipmentHandoverId?: string;
  openedById: string;
  openedByRole: 'tenant' | 'owner';
  reason: string;
  details: string;
  tenantClaim?: string;
  requestedAmount?: number;
  status: DisputeStatus;
  createdAt: string;
  // Owner response
  ownerNotes?: string;
  proposedSolution?: string;
  // Admin decision (ready for admin panel)
  adminDecision?: string;
  finalCompensation?: number;
  resolvedAt?: string;
}

export interface Review {
  id: string;
  reviewerId: string;
  targetType: ReviewTargetType;
  targetId: string;
  rentalOpId: string;
  rating: number;
  reviewText: string;
  createdAt: string;
}

export interface TenantNotification {
  id: string;
  type: NotificationType;
  emoji: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  referenceType?: 'rental_operation' | 'dispute' | 'handover';
  referenceId?: string;
  action?: { label: string; href: string };
}

export interface OwnerNotification {
  id: string;
  type: NotificationType;
  emoji: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  referenceType?: 'rental_operation' | 'dispute' | 'handover';
  referenceId?: string;
  action?: { label: string; href: string };
}

export interface CreateRentalInput {
  deliveryInfo: DeliveryInfo;
  timeSlot: TimeSlot;
  /** يربط الطلب بالمستأجر الحقيقي؛ الافتراضي للوضع التجريبي: tenant-1 */
  tenantId?: string;
}

interface RentalPlatformContextValue {
  rentals: TenantRental[];
  cartItems: CartRentalItem[];
  handoverReports: HandoverReport[];
  disputes: Dispute[];
  reviews: Review[];
  notifications: TenantNotification[];
  ownerNotifications: OwnerNotification[];
  addToCartFromProduct: (input: {
    product: ProductCardProps;
    startDate: string;
    endDate: string;
    notes?: string;
  }) => CartRentalItem | null;
  removeCartItem: (id: number) => void;
  clearCart: () => void;
  createRentalFromCart: (input: CreateRentalInput) => TenantRental | null;
  approveRentalRequest: (rentalId: string) => void;
  rejectRentalRequest: (rentalId: string) => void;
  payRental: (rentalId: string, paymentMethod?: PaymentMethod) => void;
  createHandoverReport: (input: {
    rentalOpId: string;
    phase: HandoverPhase;
    submittedByRole?: 'tenant' | 'owner';
    conditionStatus?: string;
    hasIssues?: boolean;
    hasDamage?: boolean;
    notes?: string;
    proposedDeduction?: number;
    ownerDecision?: 'full_refund' | 'partial_refund' | 'no_refund';
    evidencePhotos?: string[];
  }) => HandoverReport | null;
  confirmHandoverReport: (handoverId: string, ownerId: string) => void;
  updateDisputeOwnerNotes: (disputeId: string, ownerNotes: string, proposedSolution?: string) => void;
  submitTenantDisputeResponse: (disputeId: string, tenantResponse: string) => void;
  createDispute: (input: {
    rentalOpId: string;
    equipmentHandoverId?: string;
    reason: string;
    details: string;
    openedByRole?: 'tenant' | 'owner';
    tenantClaim?: string;
    requestedAmount?: number;
  }) => Dispute | null;
  submitReview: (input: {
    rentalOpId: string;
    targetType: ReviewTargetType;
    targetId: string;
    rating: number;
    reviewText: string;
  }) => Review | null;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  markOwnerNotificationRead: (id: string) => void;
  markAllOwnerNotificationsRead: () => void;
  getRentalById: (id?: string) => TenantRental | undefined;
  getHandoverReportsForRental: (rentalOpId?: string) => HandoverReport[];
  getDisputesForRental: (rentalOpId?: string) => Dispute[];
  getReviewsForRental: (rentalOpId?: string) => Review[];
  resolveDispute: (disputeId: string) => void;
  escalateDispute: (disputeId: string) => void;
}

/** وضع العرض: حساب تسجيل الدخول التجريبي للمؤجر هو owner-1؛ توحيد الملاك يضمن ظهور كل الطلبات في لوحة المؤجر */
const DEMO_OWNER_BLOCK: Omit<
  EquipmentSnapshot,
  'equipmentId' | 'name' | 'image' | 'location' | 'category' | 'rating' | 'dailyRate' | 'insuranceAmount'
> = {
  ownerId: 'owner-1',
  ownerName: 'أحمد المؤجر',
  ownerPhone: '+967 733 123 456',
  ownerRating: 4.8,
};

const OWNER_BY_EQUIPMENT: Record<number, typeof DEMO_OWNER_BLOCK> = {
  1: DEMO_OWNER_BLOCK,
  2: DEMO_OWNER_BLOCK,
  3: DEMO_OWNER_BLOCK,
  4: DEMO_OWNER_BLOCK,
  5: DEMO_OWNER_BLOCK,
  6: DEMO_OWNER_BLOCK,
  7: DEMO_OWNER_BLOCK,
  8: DEMO_OWNER_BLOCK,
};

const FALLBACK_OWNER = DEMO_OWNER_BLOCK;

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  const raw = window.localStorage.getItem(key);
  if (!raw) return fallback;

  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeStorage<T>(key: string, value: T) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

function numericId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

function getProductById(equipmentId: number) {
  return products.find((product) => Number(product.id) === Number(equipmentId)) ?? products[0];
}

export function getEquipmentSnapshot(equipmentId: number): EquipmentSnapshot {
  const product = getProductById(equipmentId);
  const owner = OWNER_BY_EQUIPMENT[Number(equipmentId)] ?? FALLBACK_OWNER;

  return {
    equipmentId: Number(product.id),
    name: product.name,
    image: product.image,
    location: product.location,
    category: product.category,
    rating: product.rating,
    dailyRate: product.price,
    insuranceAmount: product.insurance,
    ...owner,
  };
}

export function calculateRentalDays(startDate: string, endDate: string) {
  if (!startDate || !endDate) return 0;
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diff = end.getTime() - start.getTime();
  if (Number.isNaN(diff) || diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function formatCurrency(value: number) {
  return Math.round(value).toLocaleString('ar-YE');
}

export function formatRentalDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ar-YE', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatRentalDateRange(startDate: string, endDate: string) {
  return `${formatRentalDate(startDate)} ← ${formatRentalDate(endDate)}`;
}

export function isRentalStartingSoon(rental: TenantRental) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(rental.startDate);
  start.setHours(0, 0, 0, 0);
  const diffDays = Math.ceil((start.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 && diffDays <= 2;
}

function nextOrderNum(existing: TenantRental[]) {
  const currentMax = existing.reduce((max, rental) => {
    const match = rental.orderNum.match(/OP-(\d+)/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1040);
  return `OP-${currentMax + 1}`;
}

function nextNumericRentalId(existing: TenantRental[]) {
  const currentMax = existing.reduce((max, rental) => {
    const parsed = Number(rental.id);
    return Number.isFinite(parsed) ? Math.max(max, parsed) : max;
  }, 0);
  return String(currentMax + 1);
}

function createSeedRental(input: {
  id: string;
  orderNum: string;
  equipmentId: number;
  startDate: string;
  endDate: string;
  status: RentalStatus;
  paymentStatus?: PaymentStatus;
  escrowStatus?: EscrowStatus;
  createdAt: string;
}): TenantRental {
  const equipment = getEquipmentSnapshot(input.equipmentId);
  const durationDays = calculateRentalDays(input.startDate, input.endDate);
  const rentalAmount = durationDays * equipment.dailyRate;
  const serviceFee = Math.round(rentalAmount * SERVICE_FEE_RATE);
  const paymentStatus = input.paymentStatus ?? (input.status === 'pending' ? 'unpaid' : 'paid');

  return {
    id: input.id,
    orderNum: input.orderNum,
    tenantId: DEFAULT_TENANT_ID,
    ownerId: equipment.ownerId,
    equipmentId: equipment.equipmentId,
    startDate: input.startDate,
    endDate: input.endDate,
    durationDays,
    rentalAmount,
    insuranceAmount: equipment.insuranceAmount,
    serviceFee,
    totalAmount: rentalAmount + equipment.insuranceAmount + serviceFee,
    status: input.status,
    dailyRate: equipment.dailyRate,
    paymentStatus,
    escrowStatus: input.escrowStatus ?? (paymentStatus === 'paid' ? 'held' : 'not_started'),
    deliveryInfo: {
      governorate: equipment.location.split(' - ')[0] ?? 'صنعاء',
      district: equipment.location.split(' - ')[1] ?? '',
      address: equipment.location,
      phone: '777 123 456',
    },
    timeSlot: 'morning',
    createdAt: input.createdAt,
  };
}

const INITIAL_RENTALS: TenantRental[] = [
  createSeedRental({
    id: '1',
    orderNum: 'OP-1047',
    equipmentId: 1,
    startDate: '2026-05-06',
    endDate: '2026-05-09',
    status: 'confirmed',
    paymentStatus: 'unpaid',
    escrowStatus: 'not_started',
    createdAt: '2026-05-03T09:30:00.000Z',
  }),
  createSeedRental({
    id: '2',
    orderNum: 'OP-1048',
    equipmentId: 2,
    startDate: '2026-05-01',
    endDate: '2026-05-06',
    status: 'in_use',
    createdAt: '2026-04-28T10:10:00.000Z',
  }),
  createSeedRental({
    id: '3',
    orderNum: 'OP-1049',
    equipmentId: 3,
    startDate: '2026-05-12',
    endDate: '2026-05-13',
    status: 'pending',
    paymentStatus: 'unpaid',
    escrowStatus: 'not_started',
    createdAt: '2026-05-04T07:45:00.000Z',
  }),
  createSeedRental({
    id: '4',
    orderNum: 'OP-1045',
    equipmentId: 5,
    startDate: '2026-04-20',
    endDate: '2026-04-25',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-04-18T12:00:00.000Z',
  }),
  createSeedRental({
    id: '5',
    orderNum: 'OP-1044',
    equipmentId: 7,
    startDate: '2026-04-15',
    endDate: '2026-04-17',
    status: 'cancelled',
    paymentStatus: 'refunded',
    escrowStatus: 'refunded',
    createdAt: '2026-04-12T11:15:00.000Z',
  }),
  createSeedRental({
    id: '6',
    orderNum: 'OP-1043',
    equipmentId: 8,
    startDate: '2026-04-10',
    endDate: '2026-04-14',
    status: 'disputed',
    createdAt: '2026-04-08T08:25:00.000Z',
  }),
  createSeedRental({
    id: '7',
    orderNum: 'OP-1042',
    equipmentId: 4,
    startDate: '2026-04-05',
    endDate: '2026-04-06',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-04-02T15:20:00.000Z',
  }),
  createSeedRental({
    id: '8',
    orderNum: 'OP-1041',
    equipmentId: 6,
    startDate: '2026-03-28',
    endDate: '2026-03-30',
    status: 'completed',
    escrowStatus: 'released',
    createdAt: '2026-03-26T13:05:00.000Z',
  }),
];

const INITIAL_HANDOVERS: HandoverReport[] = [
  {
    id: 'handover-1',
    rentalOpId: '2',
    phase: 'delivery',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    conditionStatus: 'good',
    hasIssues: false,
    createdAt: '2026-05-01T08:35:00.000Z',
  },
  {
    id: 'handover-2',
    rentalOpId: '4',
    phase: 'delivery',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    conditionStatus: 'excellent',
    hasIssues: false,
    createdAt: '2026-04-20T08:05:00.000Z',
    confirmedById: 'owner-1',
    confirmedByRole: 'owner',
    confirmedAt: '2026-04-20T09:00:00.000Z',
  },
  {
    id: 'handover-3',
    rentalOpId: '4',
    phase: 'return',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    hasIssues: false,
    hasDamage: false,
    ownerDecision: 'full_refund',
    createdAt: '2026-04-25T17:40:00.000Z',
  },
  {
    id: 'handover-4',
    rentalOpId: '6',
    phase: 'return',
    submittedById: DEFAULT_TENANT_ID,
    submittedByRole: 'tenant',
    hasIssues: true,
    hasDamage: true,
    notes: 'اعتراض على تقدير التلفيات عند الإرجاع.',
    proposedDeduction: 15000,
    ownerDecision: 'partial_refund',
    createdAt: '2026-04-14T18:10:00.000Z',
  },
];

const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'dispute-1',
    rentalOpId: '6',
    equipmentHandoverId: 'handover-4',
    openedById: DEFAULT_TENANT_ID,
    openedByRole: 'tenant',
    reason: 'damage',
    details: 'تم تسجيل تلفيات إضافية غير موجودة في تقرير الاستلام.',
    tenantClaim: 'المعدة كانت بحالة ممتازة عند الاستلام ولا يوجد ما يثبت التلفيات.',
    requestedAmount: 0,
    status: 'under_review',
    ownerNotes: 'توجد تلفيات واضحة في الجزء السفلي للمعدة.',
    createdAt: '2026-04-14T18:20:00.000Z',
  },
];

const INITIAL_REVIEWS: Review[] = [
  {
    id: 'review-1',
    reviewerId: DEFAULT_TENANT_ID,
    targetType: 'user',
    targetId: 'owner-1',
    rentalOpId: '4',
    rating: 3,
    reviewText: 'المعدة جيدة لكن التواصل كان بطيئا.',
    createdAt: '2026-04-26T10:00:00.000Z',
  },
  {
    id: 'review-2',
    reviewerId: DEFAULT_TENANT_ID,
    targetType: 'user',
    targetId: 'owner-1',
    rentalOpId: '8',
    rating: 5,
    reviewText: 'تجربة ممتازة والتسليم كان في الوقت المحدد.',
    createdAt: '2026-03-31T09:15:00.000Z',
  },
];

const INITIAL_NOTIFICATIONS: TenantNotification[] = [
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

const INITIAL_OWNER_NOTIFICATIONS: OwnerNotification[] = [
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

export function getTenantRentals() {
  return readStorage<TenantRental[]>(STORAGE_KEYS.rentals, INITIAL_RENTALS);
}

export function getRentalById(id?: string) {
  if (!id) return undefined;
  return getTenantRentals().find((rental) => rental.id === id || rental.orderNum === id);
}

function buildCartItem(input: {
  product: ProductCardProps;
  startDate: string;
  endDate: string;
  notes?: string;
}): CartRentalItem | null {
  const equipmentId = Number(input.product.id);
  const equipment = getEquipmentSnapshot(equipmentId);
  const days = calculateRentalDays(input.startDate, input.endDate);
  if (!days) return null;

  const rentalAmount = days * equipment.dailyRate;
  const serviceFee = Math.round(rentalAmount * SERVICE_FEE_RATE);

  return {
    id: equipmentId,
    equipmentId,
    ownerId: equipment.ownerId,
    name: equipment.name,
    image: equipment.image,
    owner: equipment.ownerName,
    location: equipment.location,
    category: equipment.category,
    startDate: input.startDate,
    endDate: input.endDate,
    days,
    dailyRate: equipment.dailyRate,
    deposit: equipment.insuranceAmount,
    serviceFee,
    rentalAmount,
    totalAmount: rentalAmount + equipment.insuranceAmount + serviceFee,
    notes: input.notes,
  };
}

export function createRentalFromCart(
  cartState: CartRentalItem[],
  input: CreateRentalInput,
  existingRentals = getTenantRentals(),
) {
  const createdAt = new Date().toISOString();
  const created: TenantRental[] = [];

  cartState.forEach((item) => {
    const rental: TenantRental = {
      id: nextNumericRentalId([...existingRentals, ...created]),
      orderNum: nextOrderNum([...existingRentals, ...created]),
      tenantId: input.tenantId ?? DEFAULT_TENANT_ID,
      ownerId: item.ownerId,
      equipmentId: item.equipmentId,
      startDate: item.startDate,
      endDate: item.endDate,
      durationDays: item.days,
      rentalAmount: item.rentalAmount,
      insuranceAmount: item.deposit,
      totalAmount: item.totalAmount,
      status: 'pending',
      dailyRate: item.dailyRate,
      serviceFee: item.serviceFee,
      paymentStatus: 'unpaid',
      escrowStatus: 'not_started',
      deliveryInfo: input.deliveryInfo,
      timeSlot: input.timeSlot,
      notes: item.notes,
      createdAt,
    };
    created.push(rental);
  });

  return created;
}

const RentalPlatformContext = createContext<RentalPlatformContextValue | null>(null);

export function RentalPlatformProvider({ children }: { children: ReactNode }) {
  const [rentals, setRentals] = useState<TenantRental[]>(() => getTenantRentals());
  const [cartItems, setCartItems] = useState<CartRentalItem[]>(() => readStorage(STORAGE_KEYS.cart, []));
  const [handoverReports, setHandoverReports] = useState<HandoverReport[]>(() =>
    readStorage(STORAGE_KEYS.handovers, INITIAL_HANDOVERS),
  );
  const [disputes, setDisputes] = useState<Dispute[]>(() => readStorage(STORAGE_KEYS.disputes, INITIAL_DISPUTES));
  const [reviews, setReviews] = useState<Review[]>(() => readStorage(STORAGE_KEYS.reviews, INITIAL_REVIEWS));
  const [notifications, setNotifications] = useState<TenantNotification[]>(() =>
    readStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS),
  );
  const [ownerNotifications, setOwnerNotifications] = useState<OwnerNotification[]>(() =>
    readStorage(STORAGE_KEYS.ownerNotifications, INITIAL_OWNER_NOTIFICATIONS),
  );

  useEffect(() => writeStorage(STORAGE_KEYS.rentals, rentals), [rentals]);
  useEffect(() => writeStorage(STORAGE_KEYS.cart, cartItems), [cartItems]);
  useEffect(() => writeStorage(STORAGE_KEYS.handovers, handoverReports), [handoverReports]);
  useEffect(() => writeStorage(STORAGE_KEYS.disputes, disputes), [disputes]);
  useEffect(() => writeStorage(STORAGE_KEYS.reviews, reviews), [reviews]);
  useEffect(() => writeStorage(STORAGE_KEYS.notifications, notifications), [notifications]);
  useEffect(() => writeStorage(STORAGE_KEYS.ownerNotifications, ownerNotifications), [ownerNotifications]);

  // Keep tenant/owner views in sync across tabs/windows in the demo (localStorage is the single source of truth).
  useEffect(() => {
    const handler = (event: StorageEvent) => {
      if (!event.key) return;

      if (event.key === STORAGE_KEYS.rentals) setRentals(readStorage(STORAGE_KEYS.rentals, INITIAL_RENTALS));
      if (event.key === STORAGE_KEYS.cart) setCartItems(readStorage(STORAGE_KEYS.cart, []));
      if (event.key === STORAGE_KEYS.handovers) setHandoverReports(readStorage(STORAGE_KEYS.handovers, INITIAL_HANDOVERS));
      if (event.key === STORAGE_KEYS.disputes) setDisputes(readStorage(STORAGE_KEYS.disputes, INITIAL_DISPUTES));
      if (event.key === STORAGE_KEYS.reviews) setReviews(readStorage(STORAGE_KEYS.reviews, INITIAL_REVIEWS));
      if (event.key === STORAGE_KEYS.notifications) setNotifications(readStorage(STORAGE_KEYS.notifications, INITIAL_NOTIFICATIONS));
      if (event.key === STORAGE_KEYS.ownerNotifications) {
        setOwnerNotifications(readStorage(STORAGE_KEYS.ownerNotifications, INITIAL_OWNER_NOTIFICATIONS));
      }
    };

    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const value = useMemo<RentalPlatformContextValue>(() => {
    const addNotification = (notification: Omit<TenantNotification, 'id' | 'time' | 'read'>) => {
      setNotifications((existing) => [
        { ...notification, id: numericId('notif'), time: 'الآن', read: false },
        ...existing,
      ]);
    };

    const addOwnerNotification = (notification: Omit<OwnerNotification, 'id' | 'time' | 'read'>) => {
      setOwnerNotifications((existing) => [
        { ...notification, id: numericId('own-notif'), time: 'الآن', read: false },
        ...existing,
      ]);
    };

    const getRentalByIdFromState = (id?: string) => {
      if (!id) return undefined;
      return rentals.find((rental) => rental.id === id || rental.orderNum === id);
    };

    const getHandoverReportsForRental = (rentalOpId?: string) => {
      if (!rentalOpId) return [];
      return handoverReports.filter((report) => report.rentalOpId === rentalOpId);
    };

    const getDisputesForRental = (rentalOpId?: string) => {
      if (!rentalOpId) return [];
      return disputes.filter((dispute) => dispute.rentalOpId === rentalOpId);
    };

    const getReviewsForRental = (rentalOpId?: string) => {
      if (!rentalOpId) return [];
      return reviews.filter((review) => review.rentalOpId === rentalOpId);
    };

    return {
      rentals,
      cartItems,
      handoverReports,
      disputes,
      reviews,
      notifications,
      ownerNotifications,
      addToCartFromProduct: (input) => {
        const item = buildCartItem(input);
        if (!item) return null;
        setCartItems([item]);
        return item;
      },
      removeCartItem: (id) => setCartItems((items) => items.filter((item) => item.id !== id)),
      clearCart: () => setCartItems([]),
      createRentalFromCart: (input) => {
        const created = createRentalFromCart(cartItems, input, rentals);
        if (!created.length) return null;

        setRentals((existing) => [...created, ...existing]);
        setCartItems([]);

        created.forEach((rental) => {
          const equipment = getEquipmentSnapshot(rental.equipmentId);
          // Notify tenant
          addNotification({
            type: 'order',
            emoji: '📨',
            title: 'تم إرسال طلب الحجز',
            message: `تم إرسال طلب إيجار ${equipment.name} #${rental.orderNum} إلى المؤجر بانتظار الموافقة.`,
            referenceType: 'rental_operation',
            referenceId: rental.id,
            action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
          });
          // Notify owner
          addOwnerNotification({
            type: 'order',
            emoji: '📋',
            title: 'طلب حجز جديد',
            message: `مستأجر طلب تأجير ${equipment.name} #${rental.orderNum}. بانتظار موافقتك.`,
            referenceType: 'rental_operation',
            referenceId: rental.id,
            action: { label: 'مراجعة الطلب', href: '/owner/requests' },
          });
        });

        return created[0];
      },
      approveRentalRequest: (rentalId) => {
        const rental = getRentalByIdFromState(rentalId);
        if (!rental) return;

        setRentals((existing) =>
          existing.map((item) =>
            item.id === rentalId
              ? { ...item, status: 'confirmed', paymentStatus: 'unpaid', escrowStatus: 'not_started' }
              : item,
          ),
        );

        const equipment = getEquipmentSnapshot(rental.equipmentId);
        addNotification({
          type: 'payment',
          emoji: '💰',
          title: 'تم قبول طلبك',
          message: `وافق المؤجر على طلب ${equipment.name} #${rental.orderNum}. الرجاء إتمام الدفع لتأكيد الحجز.`,
          action: { label: 'إتمام الدفع', href: `/dashboard/order/${rental.id}` },
        });
      },
      rejectRentalRequest: (rentalId) => {
        const rental = getRentalByIdFromState(rentalId);
        if (!rental) return;

        setRentals((existing) =>
          existing.map((item) => (item.id === rentalId ? { ...item, status: 'cancelled' } : item)),
        );

        const equipment = getEquipmentSnapshot(rental.equipmentId);
        addNotification({
          type: 'order',
          emoji: '❌',
          title: 'تم رفض طلب الحجز',
          message: `لم يتم قبول طلب ${equipment.name} #${rental.orderNum}. يمكنك اختيار معدة أخرى أو تاريخ مختلف.`,
          action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
        });
      },
      payRental: (rentalId) => {
        const rental = getRentalByIdFromState(rentalId);
        if (!rental) return;

        setRentals((existing) =>
          existing.map((item) =>
            item.id === rentalId
              ? { ...item, paymentStatus: 'paid', escrowStatus: 'held', status: item.status === 'pending' ? 'confirmed' : item.status }
              : item,
          ),
        );

        const equipment = getEquipmentSnapshot(rental.equipmentId);
        // Notify tenant
        addNotification({
          type: 'payment',
          emoji: '🔒',
          title: 'تم الدفع وحجز الضمان',
          message: `تم دفع طلب ${equipment.name} #${rental.orderNum} وحفظ المبلغ في الضمان.`,
          referenceType: 'rental_operation',
          referenceId: rental.id,
          action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
        });
        // Notify owner
        addOwnerNotification({
          type: 'payment',
          emoji: '💰',
          title: 'تأكيد الدفع في الضمان',
          message: `تم حجز مبلغ إيجار ${equipment.name} #${rental.orderNum} في الضمان. المعدة جاهزة للتسليم.`,
          referenceType: 'rental_operation',
          referenceId: rental.id,
          action: { label: 'إدارة التسليم', href: '/owner/delivery' },
        });
      },
      createHandoverReport: (input) => {
        const rental = getRentalByIdFromState(input.rentalOpId);
        if (!rental) return null;

        const submittedByRole = input.submittedByRole ?? 'tenant';
        const report: HandoverReport = {
          id: numericId('handover'),
          rentalOpId: input.rentalOpId,
          phase: input.phase,
          submittedById: submittedByRole === 'owner' ? rental.ownerId : DEFAULT_TENANT_ID,
          submittedByRole,
          conditionStatus: input.conditionStatus,
          hasIssues: input.hasIssues ?? Boolean(input.hasDamage),
          hasDamage: input.hasDamage,
          notes: input.notes,
          evidencePhotos: input.evidencePhotos,
          proposedDeduction: input.proposedDeduction,
          ownerDecision: input.ownerDecision,
          createdAt: new Date().toISOString(),
        };

        setHandoverReports((existing) => [report, ...existing]);
        setRentals((existing) =>
          existing.map((item) => {
            if (item.id !== input.rentalOpId) return item;
            if (input.phase === 'delivery' && submittedByRole === 'tenant') return { ...item, status: 'in_use' };
            if (input.phase === 'return' && submittedByRole === 'owner' && item.status !== 'disputed') {
              return {
                ...item,
                status: 'completed',
                escrowStatus: item.escrowStatus === 'held' ? 'released' : item.escrowStatus,
              };
            }
            return item;
          }),
        );

        const equipment = getEquipmentSnapshot(rental.equipmentId);
        if (submittedByRole === 'tenant') {
          // Tenant submitted → notify tenant confirmation + notify owner to review
          addNotification({
            type: input.phase === 'delivery' ? 'order' : 'return',
            emoji: input.phase === 'delivery' ? '📦' : '🔄',
            title: input.phase === 'delivery' ? 'تم تأكيد الاستلام' : 'تم تسجيل طلب الإرجاع',
            message: input.phase === 'delivery'
              ? `تم تأكيد استلام ${equipment.name} للطلب #${rental.orderNum}. الحالة أصبحت بانتظار الإرجاع.`
              : `تم تسجيل إرجاع ${equipment.name} للطلب #${rental.orderNum} وبانتظار تأكيد المؤجر.`,
            referenceType: 'handover',
            referenceId: report.id,
            action: {
              label: input.phase === 'delivery' ? 'عرض الطلب' : 'متابعة الإرجاع',
              href: `/dashboard/order/${rental.id}`,
            },
          });
          addOwnerNotification({
            type: input.phase === 'delivery' ? 'order' : 'return',
            emoji: input.phase === 'delivery' ? '📦' : '🔄',
            title: input.phase === 'delivery' ? 'تقرير استلام من المستأجر' : 'تقرير إرجاع من المستأجر',
            message: input.phase === 'delivery'
              ? `المستأجر أكّد استلام ${equipment.name} #${rental.orderNum}.`
              : `المستأجر أرسل طلب إرجاع ${equipment.name} #${rental.orderNum}. ارفع صورة وفعّل تأكيد الإرجاع.`,
            referenceType: 'handover',
            referenceId: report.id,
            action: { label: 'مراجعة التقرير', href: '/owner/delivery' },
          });
        } else {
          // Owner submitted → notify tenant
          addNotification({
            type: input.phase === 'delivery' ? 'order' : 'return',
            emoji: input.phase === 'delivery' ? '✅' : '🔄',
            title: input.phase === 'delivery' ? 'المؤجر سلّم المعدة' : 'المؤجر أكّد الإرجاع',
            message: input.phase === 'delivery'
              ? `قام المؤجر بتسليم ${equipment.name} للطلب #${rental.orderNum} مع صورة توثيق. يرجى تأكيد الاستلام.`
              : `تم تأكيد إرجاع ${equipment.name} للطلب #${rental.orderNum} واكتمال العملية.`,
            referenceType: 'handover',
            referenceId: report.id,
            action: { label: input.phase === 'delivery' ? 'تأكيد الاستلام' : 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
          });
        }

        return report;
      },
      confirmHandoverReport: (handoverId, ownerId) => {
        setHandoverReports((existing) =>
          existing.map((report) =>
            report.id === handoverId
              ? { ...report, confirmedById: ownerId, confirmedByRole: 'owner', confirmedAt: new Date().toISOString() }
              : report,
          ),
        );
        const report = handoverReports.find((r) => r.id === handoverId);
        if (!report) return;
        
        const rental = getRentalByIdFromState(report.rentalOpId);
        if (!rental) return;
        
        // UPDATE RENTAL STATUS BASED ON PHASE
        setRentals((existing) =>
          existing.map((item) => {
            if (item.id === rental.id) {
              if (report.phase === 'delivery') {
                return { ...item, status: 'in_use' };
              } else if (report.phase === 'return') {
                return { ...item, status: 'completed', escrowStatus: 'released' };
              }
            }
            return item;
          })
        );

        const equipment = getEquipmentSnapshot(rental.equipmentId);
        addNotification({
          type: 'order',
          emoji: '✅',
          title: 'المؤجر أكّد تقرير التسليم',
          message: `وافق المؤجر على تقرير ${report.phase === 'delivery' ? 'الاستلام' : 'الإرجاع'} للطلب #${rental.orderNum}.`,
          referenceType: 'handover',
          referenceId: handoverId,
          action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
        });
      },
      updateDisputeOwnerNotes: (disputeId, ownerNotes, proposedSolution) => {
        setDisputes((existing) =>
          existing.map((d) =>
            d.id === disputeId ? { ...d, ownerNotes, proposedSolution } : d,
          ),
        );
        const dispute = disputes.find((d) => d.id === disputeId);
        if (!dispute) return;
        const rental = getRentalByIdFromState(dispute.rentalOpId);
        if (!rental) return;
        addNotification({
          type: 'dispute',
          emoji: '📝',
          title: 'المؤجر رد على النزاع',
          message: `أضاف المؤجر رداً على النزاع للطلب #${rental.orderNum}. يرجى المراجعة.`,
          referenceType: 'dispute',
          referenceId: disputeId,
          action: { label: 'عرض النزاع', href: `/dashboard/order/${rental.id}/delivery` },
        });
      },
      createDispute: (input) => {
        const rental = getRentalByIdFromState(input.rentalOpId);
        if (!rental) return null;

        const openedByRole = input.openedByRole ?? 'tenant';
        const dispute: Dispute = {
          id: numericId('dispute'),
          rentalOpId: input.rentalOpId,
          equipmentHandoverId: input.equipmentHandoverId,
          openedById: openedByRole === 'owner' ? rental.ownerId : DEFAULT_TENANT_ID,
          openedByRole,
          reason: input.reason,
          details: input.details,
          tenantClaim: input.tenantClaim,
          requestedAmount: input.requestedAmount,
          status: 'open',
          createdAt: new Date().toISOString(),
        };

        setDisputes((existing) => [dispute, ...existing]);
        setRentals((existing) =>
          existing.map((item) => (item.id === input.rentalOpId ? { ...item, status: 'disputed' } : item)),
        );
        if (openedByRole === 'owner') {
          addNotification({
            type: 'dispute',
            emoji: '⚠️',
            title: 'نزاع من المؤجر',
            message: `أبلغ المؤجر عن نزاع على الطلب #${rental.orderNum}. راجع التفاصيل وقدّم ردك أو اعتراضك من صفحة التسليم والإرجاع.`,
            referenceType: 'dispute',
            referenceId: dispute.id,
            action: { label: 'الرد على النزاع', href: `/dashboard/order/${rental.id}/delivery` },
          });
          addOwnerNotification({
            type: 'dispute',
            emoji: '⚠️',
            title: 'تم تسجيل النزاع',
            message: `تم تسجيل نزاعك على الطلب #${rental.orderNum}.`,
            referenceType: 'dispute',
            referenceId: dispute.id,
            action: { label: 'متابعة', href: '/owner/delivery' },
          });
        } else {
          addNotification({
            type: 'dispute',
            emoji: '⚠️',
            title: 'تم فتح نزاع',
            message: `تم فتح نزاع على الطلب #${rental.orderNum}. سيتم مراجعته من قبل الإدارة.`,
            referenceType: 'dispute',
            referenceId: dispute.id,
            action: { label: 'عرض النزاع', href: `/dashboard/order/${rental.id}/delivery` },
          });
          addOwnerNotification({
            type: 'dispute',
            emoji: '⚠️',
            title: 'مطالبة من مستأجر',
            message: `تم فتح نزاع على الطلب #${rental.orderNum} من قِبل المستأجر. يرجى الرد على المطالبة.`,
            referenceType: 'dispute',
            referenceId: dispute.id,
            action: { label: 'عرض النزاع', href: '/owner/requests' },
          });
        }

        return dispute;
      },
      submitTenantDisputeResponse: (disputeId, tenantResponse) => {
        const before = disputes.find((x) => x.id === disputeId);
        setDisputes((existing) =>
          existing.map((d) =>
            d.id === disputeId
              ? { ...d, tenantClaim: tenantResponse, status: d.status === 'resolved' ? d.status : 'under_review' }
              : d,
          ),
        );
        const rental = before ? getRentalByIdFromState(before.rentalOpId) : undefined;
        if (!rental || !before) return;
        addOwnerNotification({
          type: 'dispute',
          emoji: '💬',
          title: 'رد المستأجر على النزاع',
          message: `قدّم المستأجر رداً على النزاع للطلب #${rental.orderNum}.`,
          referenceType: 'dispute',
          referenceId: disputeId,
          action: { label: 'مراجعة', href: '/owner/delivery' },
        });
      },
      resolveDispute: (disputeId) => {
        setDisputes((existing) =>
          existing.map((d) =>
            d.id === disputeId ? { ...d, status: 'resolved', resolvedAt: new Date().toISOString() } : d
          )
        );
        const dispute = disputes.find((d) => d.id === disputeId);
        if (dispute) {
          setRentals((existing) =>
            existing.map((item) =>
              item.id === dispute.rentalOpId ? { ...item, status: 'completed', escrowStatus: 'released' } : item
            )
          );
          addOwnerNotification({
            type: 'dispute',
            emoji: '✅',
            title: 'نزاع تم حله',
            message: `وافق المستأجر على التسوية للنزاع المتعلق بالطلب. تم إغلاق النزاع.`,
            referenceType: 'dispute',
            referenceId: disputeId,
          });
        }
      },
      escalateDispute: (disputeId) => {
        setDisputes((existing) =>
          existing.map((d) =>
            d.id === disputeId ? { ...d, status: 'under_review' } : d
          )
        );
        addOwnerNotification({
          type: 'dispute',
          emoji: '⏳',
          title: 'تصعيد النزاع',
          message: `رفض المستأجر التسوية المقترحة للنزاع. تم رفع الأمر للإدارة.`,
          referenceType: 'dispute',
          referenceId: disputeId,
        });
      },
      submitReview: (input) => {
        const rental = getRentalByIdFromState(input.rentalOpId);
        if (!rental) return null;

        const review: Review = {
          id: numericId('review'),
          reviewerId: DEFAULT_TENANT_ID,
          targetType: input.targetType,
          targetId: input.targetId,
          rentalOpId: input.rentalOpId,
          rating: input.rating,
          reviewText: input.reviewText,
          createdAt: new Date().toISOString(),
        };

        setReviews((existing) => [review, ...existing]);
        addNotification({
          type: 'review',
          emoji: '⭐',
          title: 'تم إرسال التقييم',
          message: `تم حفظ تقييمك للطلب #${rental.orderNum}.`,
          action: { label: 'عرض الطلب', href: `/dashboard/order/${rental.id}` },
        });
        return review;
      },
      markNotificationRead: (id) =>
        setNotifications((existing) =>
          existing.map((n) => (n.id === id ? { ...n, read: true } : n)),
        ),
      markAllNotificationsRead: () =>
        setNotifications((existing) => existing.map((n) => ({ ...n, read: true }))),
      markOwnerNotificationRead: (id) =>
        setOwnerNotifications((existing) =>
          existing.map((n) => (n.id === id ? { ...n, read: true } : n)),
        ),
      markAllOwnerNotificationsRead: () =>
        setOwnerNotifications((existing) => existing.map((n) => ({ ...n, read: true }))),
      getRentalById: getRentalByIdFromState,
      getHandoverReportsForRental,
      getDisputesForRental,
      getReviewsForRental,
    };
  }, [cartItems, disputes, handoverReports, notifications, ownerNotifications, rentals, reviews]);

  return <RentalPlatformContext.Provider value={value}>{children}</RentalPlatformContext.Provider>;
}

export function useRentalPlatform() {
  const context = useContext(RentalPlatformContext);
  if (!context) {
    throw new Error('useRentalPlatform must be used inside RentalPlatformProvider');
  }
  return context;
}

export function useTenantRentals() {
  const { user } = useAuth();
  const { rentals } = useRentalPlatform();

  if (!user) return rentals;
  if (user.type !== 'tenant') return rentals;

  return rentals.filter((r) => r.tenantId === user.id);
}

export function useRentalById(id?: string) {
  return useRentalPlatform().getRentalById(id);
}
