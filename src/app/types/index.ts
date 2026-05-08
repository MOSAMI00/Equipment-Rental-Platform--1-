/**
 * @deprecated — Prefer importing from `entities/rental`, `entities/equipment`,
 * or `entities/user` for runtime values. This barrel re-exports TS interfaces
 * from mock-api and owner for backwards-compatibility.
 */
export type {
  CartRentalItem,
  DeliveryInfo,
  Dispute,
  DisputeStatus,
  EquipmentSnapshot,
  EscrowStatus,
  HandoverPhase,
  HandoverReport,
  NotificationType,
  OwnerNotification,
  PaymentMethod,
  PaymentStatus,
  Review,
  ReviewTargetType,
  TenantNotification,
  TenantProfile,
  TenantRental,
  TimeSlot,
} from '../data/mock-api';
export type * from './owner';
