import React, { useMemo, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import {
  useRentalPlatform,
  type Dispute,
  type HandoverReport,
  type TenantRental,
} from '../../../data/mock-api';
import type { RentalListItem } from '../../../types/owner';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import DeliveryTabs from './delivery/DeliveryTabs';
import {
  DisputeList,
  RentalDetailPanel,
  RentalListPanel,
} from './delivery/DeliveryPanels';

const Delivery = () => {
  const { user } = useAuth();
  const {
    createHandoverReport,
    confirmHandoverReport,
    updateDisputeOwnerNotes,
    createDispute,
  } = useRentalPlatform();
  const { rentals, handoverReports, disputes } = useOwnerPageProps();

  const [activeTab, setActiveTab] = useState('pending_delivery');
  const [selectedRentalId, setSelectedRentalId] = useState<string | null>(null);
  const [editingDisputeId, setEditingDisputeId] = useState<string | null>(null);
  const [ownerNotes, setOwnerNotes] = useState('');
  const [proposedDeduction, setProposedDeduction] = useState('');
  const [ownerDecision, setOwnerDecision] = useState<'full_refund' | 'partial_refund' | 'no_refund'>('full_refund');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [deliveryEvidence, setDeliveryEvidence] = useState<string[]>([]);
  const [returnEvidence, setReturnEvidence] = useState<string[]>([]);
  const [deliveryExtraDescription, setDeliveryExtraDescription] = useState('');
  const [returnExtraDescription, setReturnExtraDescription] = useState('');

  const ownerRentals = useMemo(
    () => rentals.filter((rental: RentalListItem) => rental.ownerId === user?.id),
    [rentals, user?.id],
  );

  const pendingDelivery = useMemo(
    () => ownerRentals.filter((rental: RentalListItem) => {
      const ownerDelivery = handoverReports.find((h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'owner');
      return rental.status === 'confirmed' && rental.paymentStatus === 'paid' && !ownerDelivery;
    }),
    [ownerRentals, handoverReports],
  );

  const inUse = useMemo(
    () => ownerRentals.filter((rental: RentalListItem) => {
      const returnRequest = handoverReports.find((h) => h.rentalOpId === rental.id && h.phase === 'return' && h.submittedByRole === 'tenant');
      return rental.status === 'in_use' && !returnRequest;
    }),
    [ownerRentals, handoverReports],
  );

  const pendingTenantReceive = useMemo(
    () => ownerRentals.filter((rental: RentalListItem) => {
      const ownerDelivery = handoverReports.find((h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'owner');
      const tenantReceive = handoverReports.find((h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'tenant');
      return rental.status === 'confirmed' && rental.paymentStatus === 'paid' && ownerDelivery && !tenantReceive;
    }),
    [ownerRentals, handoverReports],
  );

  const pendingReturn = useMemo(
    () => ownerRentals.filter((rental: RentalListItem) => {
      const returnReport = handoverReports.find((h) => h.rentalOpId === rental.id && h.phase === 'return' && h.submittedByRole === 'tenant');
      return rental.status === 'in_use' && returnReport;
    }),
    [ownerRentals, handoverReports],
  );

  const openDisputes = useMemo(
    () => disputes.filter((dispute: Dispute) => {
      const rental = ownerRentals.find((item: TenantRental) => item.id === dispute.rentalOpId);
      return rental && dispute.status !== 'resolved';
    }),
    [disputes, ownerRentals],
  );

  const tabList = [
    { id: 'pending_delivery', label: `📦 بانتظار التسليم (${pendingDelivery.length})` },
    { id: 'pending_receive', label: `🧾 بانتظار استلام المستأجر (${pendingTenantReceive.length})` },
    { id: 'in_use', label: `🔧 قيد الاستخدام (${inUse.length})` },
    { id: 'pending_return', label: `🔄 بانتظار الإرجاع (${pendingReturn.length})` },
    { id: 'disputes', label: `⚠️ النزاعات (${openDisputes.length})` },
  ];

  const selectedRental = useMemo(
    () => rentals.find((rental) => rental.id === selectedRentalId),
    [rentals, selectedRentalId],
  );

  const rentalHandovers = useMemo(
    () => handoverReports.filter((handover) => handover.rentalOpId === selectedRentalId),
    [handoverReports, selectedRentalId],
  );

  const ownerDeliveryReport = rentalHandovers.find((handover) => handover.phase === 'delivery' && handover.submittedByRole === 'owner');
  const tenantDeliveryReport = rentalHandovers.find((handover) => handover.phase === 'delivery' && handover.submittedByRole === 'tenant');
  const returnReport = rentalHandovers.find((handover) => handover.phase === 'return' && handover.submittedByRole === 'tenant');

  const currentList = useMemo(() => {
    if (activeTab === 'pending_delivery') return pendingDelivery;
    if (activeTab === 'pending_receive') return pendingTenantReceive;
    if (activeTab === 'in_use') return inUse;
    if (activeTab === 'pending_return') return pendingReturn;
    return [];
  }, [activeTab, pendingDelivery, pendingTenantReceive, inUse, pendingReturn]);

  const handleConfirmDelivery = () => {
    if (!selectedRental || deliveryEvidence.length === 0) return;
    const extra = deliveryExtraDescription.trim();
    createHandoverReport({
      rentalOpId: selectedRental.id,
      phase: 'delivery',
      submittedByRole: 'owner',
      hasIssues: false,
      notes: `صور توثيق تسليم المؤجر: ${deliveryEvidence.length}${extra ? ` — وصف إضافي: ${extra}` : ''}`,
      evidencePhotos: deliveryEvidence,
    });
    setDeliveryEvidence([]);
    setDeliveryExtraDescription('');
  };

  const handleConfirmReturn = () => {
    if (!selectedRental || !returnReport || returnEvidence.length === 0 || !user?.id) return;
    const extra = returnExtraDescription.trim();
    createHandoverReport({
      rentalOpId: selectedRental.id,
      phase: 'return',
      submittedByRole: 'owner',
      hasIssues: Boolean(returnReport.hasDamage),
      hasDamage: Boolean(returnReport.hasDamage),
      ownerDecision,
      proposedDeduction: ownerDecision === 'partial_refund' ? Number(proposedDeduction || 0) : 0,
      notes: `صور توثيق استلام المؤجر بعد الإرجاع: ${returnEvidence.length}${extra ? ` — وصف إضافي: ${extra}` : ''}`,
      evidencePhotos: returnEvidence,
    });
    confirmHandoverReport(returnReport.id, user.id);
    setReturnEvidence([]);
    setReturnExtraDescription('');
  };

  const handleOpenReturnDispute = () => {
    if (!selectedRental || !returnReport) return;
    const deduction = ownerDecision === 'full_refund' ? 0 : ownerDecision === 'partial_refund' ? Number(proposedDeduction || 0) : selectedRental.insuranceAmount;
    createDispute({
      rentalOpId: selectedRental.id,
      equipmentHandoverId: returnReport.id,
      reason: 'damage',
      details: returnExtraDescription || 'اعتراض المؤجر على حالة المعدة عند الإرجاع.',
      openedByRole: 'owner',
      requestedAmount: deduction,
    });
    setActiveTab('disputes');
  };

  const handleSaveDisputeNotes = (disputeId: string) => {
    updateDisputeOwnerNotes(disputeId, disputeNotes || ownerNotes, `اقتراح حل: خصم ${proposedDeduction || 0} ر.ي`);
    setDisputeNotes('');
    setOwnerNotes('');
    setEditingDisputeId(null);
  };

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>التسليم والإرجاع</h2>
        {selectedRentalId ? (
          <button className="owner-btn owner-btn-outline" style={{ fontSize: 12 }} onClick={() => setSelectedRentalId(null)}>
            <ChevronLeft size={14} /> عودة للقائمة
          </button>
        ) : null}
      </div>

      <DeliveryTabs
        tabs={tabList}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          setSelectedRentalId(null);
        }}
      />

      {activeTab === 'disputes' ? (
        <DisputeList
          disputes={openDisputes}
          ownerRentals={ownerRentals}
          editingDisputeId={editingDisputeId}
          disputeNotes={disputeNotes}
          ownerDecision={ownerDecision}
          proposedDeduction={proposedDeduction}
          setEditingDisputeId={setEditingDisputeId}
          setDisputeNotes={(value) => {
            setDisputeNotes(value);
            setOwnerNotes(value);
          }}
          setOwnerDecision={setOwnerDecision}
          setProposedDeduction={setProposedDeduction}
          onSave={handleSaveDisputeNotes}
        />
      ) : (
        <div className="owner-grid-2" style={{ alignItems: 'flex-start' }}>
          <RentalListPanel
            rentals={currentList}
            handoverReports={handoverReports as HandoverReport[]}
            selectedRentalId={selectedRentalId}
            onSelect={setSelectedRentalId}
          />
          <RentalDetailPanel
            selectedRental={selectedRental}
            ownerDeliveryReport={ownerDeliveryReport}
            tenantDeliveryReport={tenantDeliveryReport}
            returnReport={returnReport}
            deliveryEvidence={deliveryEvidence}
            returnEvidence={returnEvidence}
            deliveryExtraDescription={deliveryExtraDescription}
            returnExtraDescription={returnExtraDescription}
            ownerDecision={ownerDecision}
            proposedDeduction={proposedDeduction}
            setDeliveryEvidence={setDeliveryEvidence}
            setReturnEvidence={setReturnEvidence}
            setDeliveryExtraDescription={setDeliveryExtraDescription}
            setReturnExtraDescription={setReturnExtraDescription}
            setOwnerDecision={setOwnerDecision}
            setProposedDeduction={setProposedDeduction}
            onConfirmDelivery={handleConfirmDelivery}
            onConfirmReturn={handleConfirmReturn}
            onOpenDispute={handleOpenReturnDispute}
          />
        </div>
      )}
    </div>
  );
};

export default Delivery;
