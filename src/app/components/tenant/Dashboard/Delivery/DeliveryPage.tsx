import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { EquipmentBanner } from './Main/EquipmentBanner';
import { StatusTabs } from './Main/StatusTabs';
import { TabContent } from './Main/TabContent/TabContent';
import { DisputeResponsePanel } from './Main/DisputeResponsePanel';
import { useRentalPlatform } from '../../../../data/mock-api';

type Tab = 'receive' | 'in_use' | 'return';

export function DeliveryPage() {
  const { id } = useParams();
  const {
    rentals,
    getRentalById,
    getHandoverReportsForRental,
    createHandoverReport,
    createDispute,
    getDisputesForRental,
    resolveDispute,
    submitTenantDisputeResponse,
  } = useRentalPlatform();
  const fallbackRental = rentals.find((rental) => rental.status === 'in_use' || rental.status === 'confirmed');
  const rental = getRentalById(id) ?? fallbackRental;
  const reports = getHandoverReportsForRental(rental?.id);
  const disputes = getDisputesForRental(rental?.id);
  const activeDispute = disputes.find((d) => d.status !== 'resolved') ?? disputes[0];

  const [activeTab, setActiveTab] = useState<Tab>('receive');
  const [condition, setCondition] = useState('');
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [receivePhotos, setReceivePhotos] = useState<string[]>([]);
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);

  const ownerDeliveryDone = reports.some((r) => r.phase === 'delivery' && r.submittedByRole === 'owner');
  const tenantReceiveDone = reports.some((r) => r.phase === 'delivery' && r.submittedByRole === 'tenant');
  const tenantReturnDone = reports.some((r) => r.phase === 'return' && r.submittedByRole === 'tenant');
  const latestReport = reports[reports.length - 1];

  const submitted = {
    receive: tenantReceiveDone,
    in_use: rental?.status === 'in_use',
    return: tenantReturnDone,
  };

  useEffect(() => {
    if (tenantReceiveDone && activeTab === 'receive') {
      setActiveTab('in_use');
    }
  }, [tenantReceiveDone]);

  if (!rental) {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-6xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 text-center">
          <h2 className="text-xl font-bold text-[#222222] mb-2">لا يوجد طلب جاهز للتسليم</h2>
          <p className="text-sm text-[#888888] mb-5">
            ستظهر هنا جميع طلباتك المؤكدة والمدفوعة أو قيد الاستخدام عند توفرها.
          </p>
          <Link to="/dashboard" className="inline-flex h-11 px-5 items-center justify-center rounded-xl bg-[#2D5A27] text-white font-bold">
            العودة إلى طلباتي
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-xl font-bold text-[#222222] mb-5">التسليم والإرجاع</h2>
      <EquipmentBanner rental={rental} />
      
      {activeDispute && (
        <div className="mb-5">
          <DisputeResponsePanel
            rental={rental}
            dispute={activeDispute}
            onAcceptDispute={() => resolveDispute(activeDispute.id)}
            onRejectDispute={(text) => submitTenantDisputeResponse(activeDispute.id, text)}
          />
        </div>
      )}

      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} submitted={submitted} />
      <TabContent
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        rental={rental}
        condition={condition}
        setCondition={setCondition}
        hasDamage={hasDamage}
        setHasDamage={setHasDamage}
        objectionText={objectionText}
        setObjectionText={setObjectionText}
        ownerDeliveryDone={ownerDeliveryDone}
        tenantReceiveDone={tenantReceiveDone}
        tenantReturnDone={tenantReturnDone}
        receivePhotos={receivePhotos}
        setReceivePhotos={setReceivePhotos}
        returnPhotos={returnPhotos}
        setReturnPhotos={setReturnPhotos}
        onConfirmReceive={() => {
          if (!ownerDeliveryDone || receivePhotos.length === 0) return;
          createHandoverReport({
            rentalOpId: rental.id,
            phase: 'delivery',
            conditionStatus: condition,
            hasIssues: condition !== 'excellent' && condition !== 'good',
            notes: `صور استلام المستأجر: ${receivePhotos.length}`,
          });
          setActiveTab('in_use');
          toast.success('تم تأكيد الاستلام بنجاح');
        }}
        onConfirmReturn={() => {
          if (returnPhotos.length === 0) return;
          createHandoverReport({
            rentalOpId: rental.id,
            phase: 'return',
            hasDamage: Boolean(hasDamage),
            hasIssues: Boolean(hasDamage),
            notes: `صور إرجاع المستأجر: ${returnPhotos.length}`,
          });
          setActiveTab('return');
          toast.success('تم تقديم تقرير الإرجاع للمراجعة');
        }}
        onSubmitObjection={() => {
          createDispute({
            rentalOpId: rental.id,
            equipmentHandoverId: latestReport?.id,
            reason: 'handover_objection',
            details: objectionText,
          });
          setObjectionText('');
          toast.success('تم تسجيل الاعتراض');
        }}
      />
    </div>
  );
}
