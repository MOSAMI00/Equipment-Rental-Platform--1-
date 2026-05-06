import { useMemo, useState } from 'react';
import { useAuth } from '../../../../auth/AuthContext';
import {
  useRentalPlatform,
  type HandoverReport,
} from '../../../../data/mock-api';
import { useOwnerPageProps } from '../../../../inertia/owner-page-props';
import type { OwnerDecision } from './panels/helpers';
import {
  buildDeliveryBuckets,
  buildDeliveryTabs,
  getCurrentDeliveryList,
  getOpenOwnerDisputes,
  getOwnerRentals,
  getRentalHandoverReports,
  getReturnDisputeAmount,
} from './deliverySelectors';

export const useOwnerDeliveryWorkflow = () => {
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
  const [proposedDeduction, setProposedDeduction] = useState('');
  const [ownerDecision, setOwnerDecision] = useState<OwnerDecision>('full_refund');
  const [disputeNotes, setDisputeNotes] = useState('');
  const [deliveryEvidence, setDeliveryEvidence] = useState<string[]>([]);
  const [returnEvidence, setReturnEvidence] = useState<string[]>([]);
  const [deliveryExtraDescription, setDeliveryExtraDescription] = useState('');
  const [returnExtraDescription, setReturnExtraDescription] = useState('');

  const ownerRentals = useMemo(
    () => getOwnerRentals(rentals, user?.id),
    [rentals, user?.id],
  );

  const deliveryBuckets = useMemo(
    () => buildDeliveryBuckets(ownerRentals, handoverReports as HandoverReport[]),
    [ownerRentals, handoverReports],
  );

  const openDisputes = useMemo(
    () => getOpenOwnerDisputes(disputes, ownerRentals),
    [disputes, ownerRentals],
  );

  const tabList = useMemo(
    () => buildDeliveryTabs(deliveryBuckets, openDisputes),
    [deliveryBuckets, openDisputes],
  );

  const selectedRental = useMemo(
    () => rentals.find((rental) => rental.id === selectedRentalId),
    [rentals, selectedRentalId],
  );

  const rentalHandovers = useMemo(
    () => handoverReports.filter((handover) => handover.rentalOpId === selectedRentalId),
    [handoverReports, selectedRentalId],
  );

  const {
    ownerDeliveryReport,
    tenantDeliveryReport,
    returnReport,
  } = getRentalHandoverReports(rentalHandovers as HandoverReport[]);

  const currentList = useMemo(
    () => getCurrentDeliveryList(activeTab, deliveryBuckets),
    [activeTab, deliveryBuckets],
  );

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    setSelectedRentalId(null);
  };

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
    const deduction = getReturnDisputeAmount(ownerDecision, proposedDeduction, selectedRental.insuranceAmount);
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
    updateDisputeOwnerNotes(disputeId, disputeNotes, `اقتراح حل: خصم ${proposedDeduction || 0} ر.ي`);
    setDisputeNotes('');
    setEditingDisputeId(null);
  };

  return {
    activeTab,
    currentList,
    deliveryEvidence,
    deliveryExtraDescription,
    disputeNotes,
    editingDisputeId,
    handoverReports,
    openDisputes,
    ownerDecision,
    ownerDeliveryReport,
    ownerRentals,
    proposedDeduction,
    returnEvidence,
    returnExtraDescription,
    returnReport,
    selectedRental,
    selectedRentalId,
    tabList,
    tenantDeliveryReport,
    handleConfirmDelivery,
    handleConfirmReturn,
    handleOpenReturnDispute,
    handleSaveDisputeNotes,
    handleTabChange,
    setDeliveryEvidence,
    setDeliveryExtraDescription,
    setDisputeNotes,
    setEditingDisputeId,
    setOwnerDecision,
    setProposedDeduction,
    setReturnEvidence,
    setReturnExtraDescription,
    setSelectedRentalId,
  };
};
