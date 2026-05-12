import { useState } from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { CartHeader } from './ui/Header';
import { Stepper } from './ui/Stepper';
import { ReviewItems } from './StepContent/ReviewItems';
import { DeliveryForm } from './StepContent/DeliveryForm';
import { PaymentMethods } from './StepContent/PaymentMethods';
import { SummarySidebar } from './SummarySidebar/SummarySidebar';

export default function CartPage() {
  const { props } = usePage();
  const cartItems = props.cart_items ?? [];
  const [currentStep, setCurrentStep] = useState(1);

  const form = useForm({
    cart_item_ids: cartItems.map((item) => item.id),
    payment_method: null,
    time_slot: null,
    agree_to_contract: false,
    delivery_info: {
      governorate: 'صنعاء',
      district: '',
      address: '',
      phone: '',
    },
  });

  const rentalCost = cartItems.reduce((acc, item) => acc + (item.daily_rate ?? item.dailyRate ?? 0) * (item.days ?? 0), 0);
  const deposit = cartItems.reduce((acc, item) => acc + (item.deposit ?? 0), 0);
  const serviceFee = cartItems.reduce((acc, item) => acc + (item.service_fee ?? item.serviceFee ?? 0), 0);
  const total = cartItems.reduce((acc, item) => acc + (item.total_amount ?? item.totalAmount ?? 0), 0);

  const handleDelete = (id) => {
    // Backend handles cart item removal
    form.delete(`/cart/${id}`);
  };

  const handleConfirm = () => {
    form.post('/rentals');
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
                  deliveryInfo={form.data.delivery_info}
                  setDeliveryInfo={(info) => form.setData('delivery_info', typeof info === 'function' ? info(form.data.delivery_info) : info)}
                  timeSlot={form.data.time_slot}
                  setTimeSlot={(slot) => form.setData('time_slot', slot)}
                  onBack={() => setCurrentStep(1)}
                  onNext={() => setCurrentStep(3)}
                />
              )}
              {currentStep === 3 && (
                <PaymentMethods
                  paymentMethod={form.data.payment_method}
                  setPaymentMethod={(method) => form.setData('payment_method', method)}
                  agreeToContract={form.data.agree_to_contract}
                  setAgreeToContract={(agree) => form.setData('agree_to_contract', agree)}
                  onBack={() => setCurrentStep(2)}
                  onConfirm={handleConfirm}
                  requestOnly
                  processing={form.processing}
                  errors={form.errors}
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
