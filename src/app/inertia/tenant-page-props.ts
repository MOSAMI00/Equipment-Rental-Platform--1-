import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';
import { useRentalPlatform } from '../data/mock-api';
import { useAuth } from '../auth/AuthContext';
import type { TenantRental } from '../data/mock-api';

export interface TenantPageProps {
  rentals: TenantRental[];
  notifications: any[];
  isLoading: boolean;
}

export function useTenantPageProps(): TenantPageProps {
  let page: any = null;
  try { page = usePage(); } catch { page = null; }
  const context = useRentalPlatform();
  const { user } = useAuth();

  return useMemo(() => {
    const props = (page?.props as any) ?? {};
    return {
      rentals: (props.rentals ?? context.rentals).filter(
        (r: any) => r.tenantId === user?.id
      ),
      notifications: props.notifications ?? context.notifications ?? [],
      isLoading: false,
    };
  }, [context.rentals, context.notifications, page?.props, user?.id]);
}
