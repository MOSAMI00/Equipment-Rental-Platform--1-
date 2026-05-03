import { useParams } from 'react-router';
import { STATUS_CONFIG, Status } from './OrderTypes';
import { OrderTimeline } from './OrderTimeline';
import { OrderSummary } from './OrderSummary';
import { EscrowStatus } from './EscrowStatus';
import { Breadcrumb } from './OrderDetails/Breadcrumb';
import { OrderInfoCard } from './OrderDetails/OrderInfoCard';
import { RentalInfoCard } from './OrderDetails/RentalInfoCard';
import { ActionButtons } from './OrderDetails/ActionButtons';

const TIMELINE_STEPS = [
  { key: 'order', label: 'الطلب', done: true },
  { key: 'confirm', label: 'التأكيد', done: true },
  { key: 'pay', label: 'الدفع', done: true },
  { key: 'receive', label: 'الاستلام', done: true },
  { key: 'use', label: 'الاستخدام', done: true, active: true },
  { key: 'return', label: 'الإرجاع', done: false },
];

export function OrderDetailPage() {
  const { id } = useParams();
  const status: Status = 'in_use';
  const st = STATUS_CONFIG[status];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Breadcrumb id={id} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-8 flex flex-col gap-5">
          <OrderInfoCard
            statusLabel={st.label}
            statusColor={st.color}
            statusBg={st.bg}
          />
          <RentalInfoCard />
          <OrderTimeline steps={TIMELINE_STEPS} />
          <ActionButtons />
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <OrderSummary
              items={[
                { label: 'الإيجار (5 أيام)', value: '100,000' },
                { label: 'رسوم الخدمة', value: '10,000' },
                { label: 'التأمين', value: '10,000' },
              ]}
              total="120,000"
            />
            <EscrowStatus />
          </div>
        </aside>
      </div>
    </div>
  );
}
