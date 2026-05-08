/**
 * @deprecated — Import from '@/app/entities/rental' instead.
 * This file re-exports for backwards compatibility and will be removed.
 */
export {
  STATUS_CONFIG,
  RENTAL_TABS as TABS,
} from '../entities/rental';

export { RENTAL_STATUSES } from '../entities/rental/status';

// ── Type aliases kept for TS consumers until full migration ──────────────
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

export type Status = RentalStatus;
