import type {
  Dispute,
  EquipmentSnapshot,
  HandoverReport,
  OwnerNotification,
  Review,
  TenantProfile,
  TenantRental,
} from '../data/mock-api';

export type EquipmentSummary = Partial<EquipmentSnapshot> & {
  equipmentId?: number;
  id?: number | string;
  name?: string;
  image?: string;
  location?: string;
  category?: string;
};

export type TenantSummary = Partial<TenantProfile> & {
  id?: string;
  name?: string;
  phone?: string;
  avatarUrl?: string;
  rating?: number;
  completedRentalsCount?: number;
};

export type RentalListItem = TenantRental & {
  equipment?: EquipmentSummary | null;
  tenant?: TenantSummary | null;
};

export type ReviewSummary = Review & {
  tenant?: TenantSummary | null;
  equipment?: EquipmentSummary | null;
};

export type DisputeSummary = Dispute & {
  rental?: RentalListItem | null;
  equipment?: EquipmentSummary | null;
  tenant?: TenantSummary | null;
};

export interface OwnerPageProps {
  rentals: RentalListItem[];
  reviews: ReviewSummary[];
  disputes: DisputeSummary[];
  handoverReports: HandoverReport[];
  ownerNotifications: OwnerNotification[];
  stats: Record<string, unknown> | null;
  paymentMethods: unknown[];
}

