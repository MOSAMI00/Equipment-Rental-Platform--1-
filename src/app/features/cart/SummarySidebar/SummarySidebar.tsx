import { ItemsList } from './ItemsList';
import { PricingBreakdown } from './PricingBreakdown';
import { Total } from './Total';
import { TrustInfo } from './TrustInfo';
import type { CartRentalItem } from '../../../data/mock-api';

interface SummarySidebarProps {
  cartItems: CartRentalItem[];
  rentalCost: number;
  deposit: number;
  serviceFee: number;
  total: number;
}

export function SummarySidebar({ cartItems, rentalCost, deposit, serviceFee, total }: SummarySidebarProps) {
  return (
    <div className="sticky top-24 bg-white border border-border rounded-xl p-6 space-y-4">
      <h3 className="font-bold text-lg border-b border-border pb-3">ملخص الطلب</h3>
      <ItemsList cartItems={cartItems} />
      <PricingBreakdown rentalCost={rentalCost} deposit={deposit} serviceFee={serviceFee} />
      <Total total={total} />
      <TrustInfo />
    </div>
  );
}
