import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { useRentalPlatform, TenantRental, Review, Dispute, HandoverReport, OwnerNotification } from '../data/mock-api';

export function useOwnerPageProps() {
  let page: any = null;
  try {
    page = usePage();
  } catch {
    page = null;
  }
  const context = useRentalPlatform();

  return useMemo(() => {
    const props = (page?.props as any) ?? {};
    return {
      rentals: (props.rentals as TenantRental[]) ?? context.rentals,
      reviews: (props.reviews as Review[]) ?? context.reviews,
      disputes: (props.disputes as Dispute[]) ?? context.disputes,
      handoverReports: (props.handoverReports as HandoverReport[]) ?? context.handoverReports,
      ownerNotifications: (props.ownerNotifications as OwnerNotification[]) ?? context.ownerNotifications,
      stats: props.stats ?? null,
      paymentMethods: props.paymentMethods ?? [],
    };
  }, [context.disputes, context.handoverReports, context.ownerNotifications, context.rentals, context.reviews, page?.props]);
}

