import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CartHeader } from './Header';
import { Stepper } from './Stepper';
import { ReviewItems } from './StepContent/ReviewItems';
import { DeliveryForm } from './StepContent/DeliveryForm';
import { PaymentMethods } from './StepContent/PaymentMethods';
import { SummarySidebar } from './SummarySidebar/SummarySidebar';
import { useRentalPlatform, type PaymentMethod, type TimeSlot } from '../../../data/mock-api';
import { useAuth } from '../../../auth/AuthContext';

type Step = 1 | 2 | 3;
type SelectedPaymentMethod = PaymentMethod | null;

export function CartPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cartItems, removeCartItem, createRentalFromCart } = useRentalPlatform();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<SelectedPaymentMethod>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(null);
  const [agreeToContract, setAgreeToContract] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    governorate: 'صنعاء',
    district: '',
    address: '',
    phone: '',
  });

  const rentalCost = cartItems.reduce((acc, item) => acc + item.dailyRate * item.days, 0);
  const deposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const serviceFee = cartItems.reduce((acc, item) => acc + item.serviceFee, 0);
  const total = cartItems.reduce((acc, item) => acc + item.totalAmount, 0);

  const handleDelete = (id: number) => {
    removeCartItem(id);
  };

  const handleConfirm = () => {
    const rental = createRentalFromCart({ deliveryInfo, timeSlot, tenantId: user?.id });
    if (rental) navigate(`/dashboard/order/${rental.id}`);
  };

  return (
    <div className="min-h-screen bg-white">
      <CartHeader />
      <Stepper currentStep={currentStep} />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-8">
            <section className="lg:col-span-8">
              {currentStep === 1 && (
                <ReviewItems
                  cartItems={cartItems}
                  onDelete={handleDelete}
                  onNext={() => setCurrentStep(2)}
                />
              )}
              {currentStep === 2 && (
                <DeliveryForm
                  deliveryInfo={deliveryInfo}
                  setDeliveryInfo={setDeliveryInfo}
                  timeSlot={timeSlot}
                  setTimeSlot={setTimeSlot}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 3 && (
                <PaymentMethods
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  agreeToContract={agreeToContract}
                  setAgreeToContract={setAgreeToContract}
                  onBack={() => setCurrentStep(2)}
                  onConfirm={handleConfirm}
                  requestOnly
                />
              )}
            </section>

            <aside className="lg:col-span-4">
              <SummarySidebar
                cartItems={cartItems}
                rentalCost={rentalCost}
                deposit={deposit}
                serviceFee={serviceFee}
                total={total}
              />
            </aside>
          </div>
        </div>
      </main>
    </div>
  );
}
