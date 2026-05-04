import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { toast } from 'sonner';
import { EquipmentBanner } from './Main/EquipmentBanner';
import { StatusTabs } from './Main/StatusTabs';
import { TabContent } from './Main/TabContent/TabContent';
import { DisputeResponsePanel } from './Main/DisputeResponsePanel';
import {
  formatRentalDate,
  getEquipmentSnapshot,
  useRentalPlatform,
  type TenantRental,
} from '../../../../data/mock-api';
import { STATUS_CONFIG } from '../shared/OrderTypes';

type Tab = 'receive' | 'in_use' | 'return';

function isDeliveryEligible(rental: TenantRental) {
  return (
    (rental.status === 'confirmed' && rental.paymentStatus === 'paid') ||
    rental.status === 'in_use'
  );
}

function DeliveryRentalList({
  rentals,
  selectedId,
  onSelect,
}: {
  rentals: TenantRental[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  if (rentals.length === 0) return null;

  return (
    <div>
      <h3 className="text-sm font-bold text-[#222222] mb-3">العمليات</h3>
      <ul className="flex flex-col gap-2">
        {rentals.map((r) => {
          const equipment = getEquipmentSnapshot(r.equipmentId);
          const status = STATUS_CONFIG[r.status];
          const active = r.id === selectedId;
          return (
            <li key={r.id}>
              <button
                type="button"
                onClick={() => onSelect(r.id)}
                className={`w-full text-right rounded-xl border p-3 flex items-center gap-3 transition-colors ${
                  active ? 'border-[#2D5A27] bg-[#EAF3E9]' : 'border-[#E0E0E0] bg-white hover:border-[#2D5A27]/40'
                }`}
              >
                <div className="w-12 h-12 rounded-lg overflow-hidden border border-[#E0E0E0] flex-shrink-0">
                  <img src={equipment.image} alt="" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#222222] truncate">{equipment.name}</p>
                  <p className="text-xs text-[#888888]">
                    #{r.orderNum} · {formatRentalDate(r.startDate)}
                  </p>
                </div>
                <span
                  className="text-xs font-bold px-2 py-1 rounded-full flex-shrink-0"
                  style={{ color: status.color, backgroundColor: status.bg }}
                >
                  {status.label}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export function DeliveryPage() {
  const { id: routeId } = useParams();
  const {
    rentals,
    disputes,
    getHandoverReportsForRental,
    createHandoverReport,
    createDispute,
    submitTenantDisputeResponse,
  } = useRentalPlatform();

  const eligible = useMemo(() => rentals.filter(isDeliveryEligible), [rentals]);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (eligible.length === 0) {
      setSelectedId(null);
      return;
    }
    const fromRoute = routeId ? eligible.find((r) => r.id === routeId) : undefined;
    if (fromRoute) {
      setSelectedId(fromRoute.id);
      return;
    }
    setSelectedId((prev) => {
      if (prev && eligible.some((r) => r.id === prev)) return prev;
      return eligible[0].id;
    });
  }, [eligible, routeId]);

  const rental = selectedId ? eligible.find((r) => r.id === selectedId) ?? null : null;

  const reports = rental ? getHandoverReportsForRental(rental.id) : [];
  const tenantReceiveDone = reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'tenant');
  const tenantReturnDone = reports.some((report) => report.phase === 'return' && report.submittedByRole === 'tenant');
  const ownerDeliveryDone = reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'owner');
  const latestReport = reports[0];

  const ownerDispute = useMemo(() => {
    if (!rental) return undefined;
    return disputes
      .filter((d) => d.rentalOpId === rental.id && d.openedByRole === 'owner' && d.status !== 'resolved')
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0];
  }, [rental, disputes]);

  const [activeTab, setActiveTab] = useState<Tab>('receive');
  const [condition, setCondition] = useState('');
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [receivePhotos, setReceivePhotos] = useState<string[]>([]);
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);

  useEffect(() => {
    if (!rental) return;
    setCondition('');
    setHasDamage(null);
    setObjectionText('');
    setReceivePhotos([]);
    setReturnPhotos([]);
  }, [rental?.id]);

  useEffect(() => {
    if (!rental) return;
    if (tenantReturnDone) setActiveTab('return');
    else if (tenantReceiveDone) setActiveTab('in_use');
    else setActiveTab('receive');
  }, [rental?.id, tenantReceiveDone, tenantReturnDone]);

  const submitted = {
    receive: tenantReceiveDone,
    return: tenantReturnDone,
  };

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
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-6xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-[#222222]">التسليم والإرجاع</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        <div className="order-2 lg:order-1">
          <DeliveryRentalList rentals={eligible} selectedId={rental.id} onSelect={(id) => setSelectedId(id)} />
        </div>

        <div className="order-1 lg:order-2 space-y-5 min-w-0">
          {ownerDispute && (
            <DisputeResponsePanel
              rental={rental}
              dispute={ownerDispute}
              onSubmitResponse={(text) => {
                submitTenantDisputeResponse(ownerDispute.id, text);
                toast.success('تم إرسال ردك على النزاع');
              }}
            />
          )}

          <EquipmentBanner rental={rental} />

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
              setCondition('');
              setReceivePhotos([]);
              setActiveTab('in_use');
            }}
            onConfirmReturn={() => {
              if (returnPhotos.length === 0 || hasDamage === null) return;
              createHandoverReport({
                rentalOpId: rental.id,
                phase: 'return',
                hasDamage: Boolean(hasDamage),
                hasIssues: Boolean(hasDamage),
                notes: `صور إرجاع المستأجر: ${returnPhotos.length}`,
              });
              setHasDamage(null);
              setReturnPhotos([]);
              setObjectionText('');
              setActiveTab('return');
            }}
            onSubmitObjection={() => {
              createDispute({
                rentalOpId: rental.id,
                equipmentHandoverId: latestReport?.id,
                reason: 'handover_objection',
                details: objectionText,
              });
              setObjectionText('');
            }}
          />
        </div>
      </div>
    </div>
  );
}
