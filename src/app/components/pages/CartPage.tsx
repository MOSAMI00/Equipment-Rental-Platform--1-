import { useState } from 'react';
import { useNavigate } from 'react-router';
import { CartHeader } from './Cart/CartHeader';
import { Stepper } from './Cart/Stepper';
import { ReviewItems } from './Cart/ReviewItems';
import { DeliveryForm } from './Cart/DeliveryForm';
import { PaymentMethods } from './Cart/PaymentMethods';
import { SummarySidebar } from './Cart/SummarySidebar';

type Step = 1 | 2 | 3;
type PaymentMethod = 'card' | 'wallet' | 'cash' | null;
type TimeSlot = 'morning' | 'afternoon' | 'evening' | null;

export function CartPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>(1);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [timeSlot, setTimeSlot] = useState<TimeSlot>(null);
  const [agreeToContract, setAgreeToContract] = useState(false);
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: 'مولد كهرباء 10KVA',
      image: 'https://images.unsplash.com/photo-1759692071712-adc78a8516c8?w=150&h=150&fit=crop',
      owner: 'أحمد علي',
      location: 'صنعاء',
      startDate: '01/02/2025',
      endDate: '04/02/2025',
      days: 3,
      dailyRate: 15000,
      deposit: 50000,
    },
  ]);
  const [deliveryInfo, setDeliveryInfo] = useState({
    governorate: 'صنعاء',
    district: '',
    address: '',
    phone: '',
  });

  const rentalCost = cartItems.reduce((acc, item) => acc + item.dailyRate * item.days, 0);
  const deposit = cartItems.reduce((acc, item) => acc + item.deposit, 0);
  const serviceFee = rentalCost * 0.05;
  const total = rentalCost + deposit + serviceFee;

  const handleDelete = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
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
                  onConfirm={() => navigate('/')}
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
