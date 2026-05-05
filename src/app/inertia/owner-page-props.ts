import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import {
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
  type Dispute,
  type HandoverReport,
  type OwnerNotification,
  type Review,
  type TenantRental,
} from '../data/mock-api';
import type { DisputeSummary, OwnerPageProps, RentalListItem, ReviewSummary } from '../types/owner';

function withRentalRelations(rental: TenantRental | RentalListItem): RentalListItem {
  const relationalRental = rental as RentalListItem;
  return {
    ...rental,
    equipment: relationalRental.equipment ?? getEquipmentSnapshot(rental.equipmentId),
    tenant: relationalRental.tenant ?? getTenantProfile(rental.tenantId),
  };
}

export function useOwnerPageProps(): OwnerPageProps {
  let page: any = null;
  try {
    page = usePage();
  } catch {
    page = null;
  }
  const context = useRentalPlatform();

  return useMemo(() => {
    const props = (page?.props as any) ?? {};
    const rentals = ((props.rentals as RentalListItem[] | undefined) ?? context.rentals).map(withRentalRelations);
    const rentalById = new Map(rentals.map((rental) => [rental.id, rental]));
    const reviews = (((props.reviews as ReviewSummary[] | undefined) ?? context.reviews) as (Review | ReviewSummary)[]).map((review) => {
      const relationalReview = review as ReviewSummary;
      const rental = rentalById.get(review.rentalOpId);
      return {
        ...review,
        equipment: relationalReview.equipment ?? rental?.equipment ?? null,
        tenant: relationalReview.tenant ?? rental?.tenant ?? null,
      };
    });
    const disputes = (((props.disputes as DisputeSummary[] | undefined) ?? context.disputes) as (Dispute | DisputeSummary)[]).map((dispute) => {
      const relationalDispute = dispute as DisputeSummary;
      const rental = rentalById.get(dispute.rentalOpId);
      return {
        ...dispute,
        rental: relationalDispute.rental ?? rental ?? null,
        equipment: relationalDispute.equipment ?? rental?.equipment ?? null,
        tenant: relationalDispute.tenant ?? rental?.tenant ?? null,
      };
    });

    return {
      rentals,
      reviews,
      disputes,
      handoverReports: (props.handoverReports as HandoverReport[]) ?? context.handoverReports,
      ownerNotifications: (props.ownerNotifications as OwnerNotification[]) ?? context.ownerNotifications,
      stats: props.stats ?? null,
      paymentMethods: props.paymentMethods ?? [],
    };
  }, [context.disputes, context.handoverReports, context.ownerNotifications, context.rentals, context.reviews, page?.props]);
}

