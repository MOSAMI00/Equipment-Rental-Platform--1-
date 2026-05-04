import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { EquipmentBanner } from './Main/EquipmentBanner';
import { StatusTabs } from './Main/StatusTabs';
import { TabContent } from './Main/TabContent/TabContent';
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
  if (rentals.length <= 1) return null;

  return (
    <div className="mb-5">
      <h3 className="text-sm font-bold text-[#222222] mb-3">طلبات التسليم والإرجاع</h3>
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
  const { rentals, getHandoverReportsForRental, createHandoverReport, createDispute } = useRentalPlatform();

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
  const [activeTab, setActiveTab] = useState<Tab>('receive');
  const [condition, setCondition] = useState('');
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [receivePhotos, setReceivePhotos] = useState<string[]>([]);
  const [returnPhotos, setReturnPhotos] = useState<string[]>([]);

  useEffect(() => {
    setActiveTab('receive');
    setCondition('');
    setHasDamage(null);
    setObjectionText('');
    setReceivePhotos([]);
    setReturnPhotos([]);
  }, [rental?.id]);

  if (!rental) {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
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

  const submitted = {
    receive: reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'tenant'),
    return: reports.some((report) => report.phase === 'return'),
  };
  const ownerDeliveryDone = reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'owner');
  const latestReport = reports[0];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-xl font-bold text-[#222222] mb-5">التسليم والإرجاع</h2>

      <DeliveryRentalList rentals={eligible} selectedId={rental.id} onSelect={setSelectedId} />

      <EquipmentBanner rental={rental} />
      <StatusTabs activeTab={activeTab} setActiveTab={setActiveTab} submitted={submitted} />
      <TabContent
        activeTab={activeTab}
        condition={condition}
        setCondition={setCondition}
        hasDamage={hasDamage}
        setHasDamage={setHasDamage}
        objectionText={objectionText}
        setObjectionText={setObjectionText}
        ownerDeliveryDone={ownerDeliveryDone}
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
  );
}
