import type { Dispute, HandoverReport, TenantRental } from '../../../../data/mock-api';
import type { RentalListItem } from '../../../../types/owner';

const hasHandover = (
  handovers: HandoverReport[],
  rentalId: string,
  phase: 'delivery' | 'return',
  role: 'owner' | 'tenant',
) => handovers.some((handover) => (
  handover.rentalOpId === rentalId
  && handover.phase === phase
  && handover.submittedByRole === role
));

const getHandover = (
  handovers: HandoverReport[],
  phase: 'delivery' | 'return',
  role: 'owner' | 'tenant',
) => handovers.find((handover) => handover.phase === phase && handover.submittedByRole === role);

export const getOwnerRentals = (rentals: RentalListItem[], ownerId?: string) => (
  rentals.filter((rental) => rental.ownerId === ownerId)
);

export const getOpenOwnerDisputes = (
  disputes: Dispute[],
  ownerRentals: TenantRental[],
) => disputes.filter((dispute) => {
  const rental = ownerRentals.find((item) => item.id === dispute.rentalOpId);
  return rental && dispute.status !== 'resolved';
});

export const buildDeliveryBuckets = (
  ownerRentals: RentalListItem[],
  handoverReports: HandoverReport[],
) => ({
  pendingDelivery: ownerRentals.filter((rental) => (
    rental.status === 'confirmed'
    && rental.paymentStatus === 'paid'
    && !hasHandover(handoverReports, rental.id, 'delivery', 'owner')
  )),
  inUse: ownerRentals.filter((rental) => (
    rental.status === 'in_use'
    && !hasHandover(handoverReports, rental.id, 'return', 'tenant')
  )),
  pendingTenantReceive: ownerRentals.filter((rental) => (
    rental.status === 'confirmed'
    && rental.paymentStatus === 'paid'
    && hasHandover(handoverReports, rental.id, 'delivery', 'owner')
    && !hasHandover(handoverReports, rental.id, 'delivery', 'tenant')
  )),
  pendingReturn: ownerRentals.filter((rental) => (
    rental.status === 'in_use'
    && hasHandover(handoverReports, rental.id, 'return', 'tenant')
  )),
});

export const buildDeliveryTabs = (buckets: ReturnType<typeof buildDeliveryBuckets>, openDisputes: Dispute[]) => [
  { id: 'pending_delivery', label: 'بانتظار التسليم', count: buckets.pendingDelivery.length },
  { id: 'pending_receive', label: 'بانتظار استلام المستأجر', count: buckets.pendingTenantReceive.length },
  { id: 'in_use', label: 'قيد الاستخدام', count: buckets.inUse.length },
  { id: 'pending_return', label: 'بانتظار الإرجاع', count: buckets.pendingReturn.length },
  { id: 'disputes', label: 'النزاعات', count: openDisputes.length },
];

export const getCurrentDeliveryList = (
  activeTab: string,
  buckets: ReturnType<typeof buildDeliveryBuckets>,
) => {
  if (activeTab === 'pending_delivery') return buckets.pendingDelivery;
  if (activeTab === 'pending_receive') return buckets.pendingTenantReceive;
  if (activeTab === 'in_use') return buckets.inUse;
  if (activeTab === 'pending_return') return buckets.pendingReturn;
  return [];
};

export const getRentalHandoverReports = (rentalHandovers: HandoverReport[]) => ({
  ownerDeliveryReport: getHandover(rentalHandovers, 'delivery', 'owner'),
  tenantDeliveryReport: getHandover(rentalHandovers, 'delivery', 'tenant'),
  returnReport: getHandover(rentalHandovers, 'return', 'tenant'),
});

export const getReturnDisputeAmount = (
  ownerDecision: 'full_refund' | 'partial_refund' | 'no_refund',
  proposedDeduction: string,
  insuranceAmount: number,
) => {
  if (ownerDecision === 'full_refund') return 0;
  if (ownerDecision === 'partial_refund') return Number(proposedDeduction || 0);
  return insuranceAmount;
};
