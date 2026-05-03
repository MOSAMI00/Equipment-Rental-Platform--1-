import { PriceSummary } from './PriceSummary';
import { PaymentMethods } from './PaymentMethods';
import { SecureCheckoutCTA } from './SecureCheckoutCTA';

interface CheckoutSidebarProps {
  rentalCost: number;
  deposit: number;
  serviceFee: number;
  total: number;
  paymentMethod: string | null;
  setPaymentMethod: (method: any) => void;
  onConfirm: () => void;
}

export function CheckoutSidebar({
  rentalCost,
  deposit,
  serviceFee,
  total,
  paymentMethod,
  setPaymentMethod,
  onConfirm
}: CheckoutSidebarProps) {
  return (
    <div className="bg-white border border-border rounded-xl p-6">
      <PriceSummary 
        rentalCost={rentalCost} 
        deposit={deposit} 
        serviceFee={serviceFee} 
        total={total} 
      />
      
      <PaymentMethods 
        paymentMethod={paymentMethod} 
        setPaymentMethod={setPaymentMethod} 
      />

      <SecureCheckoutCTA 
        onConfirm={onConfirm} 
        disabled={!paymentMethod} 
      />
    </div>
  );
}
