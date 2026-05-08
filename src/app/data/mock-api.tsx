import React from 'react';
import { NotificationsProvider, useNotifications } from '../features/notifications/store';
import { CartProvider, useCart } from '../features/cart/store';
import { RentalsProvider, useRentals } from '../features/rentals/store';

export {
  getEquipmentSnapshot,
  calculateRentalDays,
  formatCurrency,
  formatRentalDate,
  formatRentalDateRange,
  isRentalStartingSoon,
  getTenantProfile,
  getOwnerEquipmentSnapshots,
  getTenantRentals,
  useTenantRentals,
  useRentalById,
  useDisputes,
} from '../features/rentals/store';

export function RentalPlatformProvider({ children }: { children: React.ReactNode }) {
  return (
    <NotificationsProvider>
      <CartProvider>
        <RentalsProvider>
          {children}
        </RentalsProvider>
      </CartProvider>
    </NotificationsProvider>
  );
}

export function useRentalPlatform() {
  const notifications = useNotifications() as any;
  const cart = useCart() as any;
  const rentals = useRentals() as any;

  return {
    ...notifications,
    ...cart,
    ...rentals,
  };
}
