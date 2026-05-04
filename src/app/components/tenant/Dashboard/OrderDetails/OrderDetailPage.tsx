import { useState } from 'react';
import { Link, useParams } from 'react-router';
import { AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import { DisputeModal } from '../../../Modals/DisputeModal';
import { STATUS_CONFIG, type RentalStatus } from '../shared/OrderTypes';
import {
  formatCurrency,
  formatRentalDate,
  getEquipmentSnapshot,
  useRentalPlatform,
  type HandoverReport,
  type TenantRental,
} from '../../../../data/mock-api';
import { Breadcrumb } from './Main/Breadcrumb';
import { OrderInfoCard } from './Main/OrderInfoCard';
import { RentalInfoCard } from './Main/RentalInfoCard';
import { OrderTimeline } from './Main/OrderTimeline';
import { ActionButtons } from './Main/ActionButtons';
import { OrderSummary } from './Main/OrderSummary';
import { EscrowStatus } from './Main/EscrowStatus';

function buildTimeline(status: RentalStatus) {
  const steps = [
    { key: 'order', label: 'الطلب' },
    { key: 'confirm', label: 'التأكيد' },
    { key: 'pay', label: 'الدفع' },
    { key: 'receive', label: 'الاستلام' },
    { key: 'use', label: 'الاستخدام' },
    { key: 'return', label: 'الإرجاع' },
  ];

  const activeByStatus: Record<RentalStatus, string> = {
    pending: 'order',
    confirmed: 'receive',
    in_use: 'use',
    completed: 'return',
    cancelled: 'order',
    disputed: 'return',
  };
  const doneIndexByStatus: Record<RentalStatus, number> = {
    pending: 0,
    confirmed: 2,
    in_use: 4,
    completed: 5,
    cancelled: 0,
    disputed: 4,
  };

  const activeKey = activeByStatus[status];
  const doneIndex = doneIndexByStatus[status];

  return steps.map((step, index) => ({
    ...step,
    done: index <= doneIndex || step.key === activeKey,
    active: status !== 'completed' && status !== 'cancelled' && step.key === activeKey,
  }));
}

function HandoverSummary({ reports }: { reports: HandoverReport[] }) {
  const delivery = reports.find((report) => report.phase === 'delivery');
  const returnReport = reports.find((report) => report.phase === 'return');

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">ملخص التسليم</h3>
      <div className="grid sm:grid-cols-2 gap-3">
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">الاستلام</p>
          <p className="font-semibold text-[#222222]">
            {delivery ? `تم في ${formatRentalDate(delivery.createdAt)}` : 'لم يسجل بعد'}
          </p>
          {delivery?.conditionStatus && (
            <p className="text-xs text-[#888888] mt-1">الحالة: {delivery.conditionStatus}</p>
          )}
        </div>
        <div className="p-3 bg-[#F4F6F9] rounded-xl">
          <p className="text-xs text-[#888888] mb-1">الإرجاع</p>
          <p className="font-semibold text-[#222222]">
            {returnReport ? `تم في ${formatRentalDate(returnReport.createdAt)}` : 'لم يسجل بعد'}
          </p>
          {returnReport && (
            <p className="text-xs text-[#888888] mt-1">
              {returnReport.hasDamage ? 'يوجد تلفيات مسجلة' : 'لا توجد تلفيات'}
            </p>
          )}
        </div>
      </div>
      {reports.some((report) => report.notes) && (
        <p className="text-sm text-[#888888] mt-3">
          {reports.find((report) => report.notes)?.notes}
        </p>
      )}
    </div>
  );
}

function DisputeSection({
  rental,
  onOpen,
}: {
  rental: TenantRental;
  onOpen: () => void;
}) {
  const { getDisputesForRental } = useRentalPlatform();
  const disputes = getDisputesForRental(rental.id);
  const dispute = disputes[0];

  return (
    <div className="bg-white rounded-2xl border border-[#E74C3C]/25 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#FDEDEC] text-[#E74C3C] flex items-center justify-center flex-shrink-0">
          <AlertTriangle className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-[#222222]">النزاع المرتبط بالطلب</h3>
          <p className="text-sm text-[#888888] mt-1">
            {dispute
              ? `الحالة: ${dispute.status === 'under_review' ? 'قيد المراجعة' : dispute.status === 'resolved' ? 'محلول' : 'مفتوح'}`
              : 'لا يوجد نزاع حالي على هذا الطلب.'}
          </p>
          {dispute?.details && <p className="text-sm text-[#555555] mt-2">{dispute.details}</p>}
        </div>
      </div>
      <button
        onClick={onOpen}
        className="mt-4 w-full h-11 bg-[#E74C3C] text-white rounded-xl font-bold text-sm hover:bg-[#C0392B] transition-colors"
      >
        {dispute ? 'استعراض / تحديث النزاع' : 'فتح نزاع'}
      </button>
    </div>
  );
}

function PaymentDueCard({ onPay }: { onPay: () => void }) {
  return (
    <div className="bg-[#FEF9E7] border border-[#F39C12]/30 rounded-2xl p-5">
      <h3 className="font-bold text-[#222222] mb-2">الدفع مطلوب</h3>
      <p className="text-sm text-[#8A5A00] mb-4">
        وافق المؤجر على الطلب. أتم الدفع الآن ليتم حفظ المبلغ في الضمان.
      </p>
      <button
        onClick={onPay}
        className="w-full h-11 bg-[#F39C12] text-white rounded-xl font-bold text-sm hover:bg-[#D68910] transition-colors"
      >
        إتمام الدفع
      </button>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const {
    getRentalById,
    getHandoverReportsForRental,
    createDispute,
    payRental,
  } = useRentalPlatform();
  const [disputeOpen, setDisputeOpen] = useState(false);
  const rental = getRentalById(id);

  if (!rental) {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 text-center">
          <h2 className="text-xl font-bold text-[#222222] mb-2">الطلب غير موجود</h2>
          <p className="text-sm text-[#888888] mb-5">لم نتمكن من العثور على طلب بهذا الرقم.</p>
          <Link to="/dashboard" className="inline-flex h-11 px-5 items-center justify-center rounded-xl bg-[#2D5A27] text-white font-bold">
            العودة إلى طلباتي
          </Link>
        </div>
      </div>
    );
  }

  const st = STATUS_CONFIG[rental.status];
  const reports = getHandoverReportsForRental(rental.id);
  const equipment = getEquipmentSnapshot(rental.equipmentId);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <Breadcrumb id={rental.orderNum} />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <section className="lg:col-span-8 flex flex-col gap-5">
          <OrderInfoCard rental={rental} statusLabel={st.label} statusColor={st.color} statusBg={st.bg} />
          <RentalInfoCard rental={rental} />
          <OrderTimeline steps={buildTimeline(rental.status)} />
          <HandoverSummary reports={reports} />
          <ActionButtons rental={rental} onOpenDispute={() => setDisputeOpen(true)} />
          <DisputeSection rental={rental} onOpen={() => setDisputeOpen(true)} />
        </section>

        <aside className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <OrderSummary
              items={[
                { label: `الإيجار (${rental.durationDays} أيام)`, value: formatCurrency(rental.rentalAmount) },
                { label: 'رسوم الخدمة', value: formatCurrency(rental.serviceFee) },
                { label: 'التأمين', value: formatCurrency(rental.insuranceAmount) },
              ]}
              total={formatCurrency(rental.totalAmount)}
            />
            {rental.status === 'confirmed' && rental.paymentStatus === 'unpaid' && (
              <PaymentDueCard
                onPay={() => {
                  payRental(rental.id, 'card');
                  toast.success('تم الدفع وحفظ المبلغ في الضمان');
                }}
              />
            )}
            <EscrowStatus rental={rental} />
          </div>
        </aside>
      </div>

      <DisputeModal
        isOpen={disputeOpen}
        onClose={() => setDisputeOpen(false)}
        orderId={rental.orderNum}
        onSubmit={({ reason, details }) => {
          createDispute({
            rentalOpId: rental.id,
            equipmentHandoverId: reports[0]?.id,
            reason,
            details: `${equipment.name}: ${details}`,
          });
        }}
      />
    </div>
  );
}
