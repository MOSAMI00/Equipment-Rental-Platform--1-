import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import {
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
} from '../../data/mock-api';
import {
  EmptyState,
  FilterTabs,
  PageHeader,
} from '../../components/shared';
import { getDeliveryConfig } from './lib/deliveryConfig';
import { DeliveryRentalList } from './ui/DeliveryRentalList';
import { TenantDeliveryDetails } from './ui/TenantDeliveryDetails';
import { OwnerDeliveryDetails } from './ui/OwnerDeliveryDetails';
import { DeliveryReportModal } from './ui/DeliveryReportModal';

// ─── Constants ───────────────────────────────────────────────────────────────

const DEFAULT_FORM = {
  conditionStatus: 'good',
  hasDamage: 'false',
  notes: '',
  evidencePhotos: [],
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStageFeedback({ role, stage }) {
  const isOwner = role === 'owner';
  const messages = {
    delivery: isOwner
      ? 'يرجى توثيق تسليم المعدة بالصور وتعبئة حالة المعدة حتى ينتقل الطلب إلى قيد التسليم.'
      : 'يرجى الانتظار حتى يقوم المؤجر بتسليم المعدة وتوثيقها أولًا.',
    handover: isOwner
      ? 'تم توثيق التسليم. يرجى الانتظار حتى يؤكد المستأجر استلام المعدة.'
      : 'المؤجر وثق التسليم. راجع التقرير ثم أكد الاستلام إذا كانت البيانات صحيحة.',
    in_use: isOwner
      ? 'المعدة الآن لدى المستأجر. يرجى الانتظار حتى يرسل المستأجر تقرير الإرجاع.'
      : 'المعدة قيد الاستخدام. عند انتهاء مدة الإيجار، ارفع صور الإرجاع وسجل التقرير.',
    return: isOwner
      ? 'المستأجر أرسل تقرير الإرجاع. راجع الصور والملاحظات ثم أكد الإرجاع.'
      : 'تم إرسال تقرير الإرجاع. يرجى الانتظار حتى يؤكد المؤجر استلام المعدة.',
    disputes: 'يوجد نزاع على هذه العملية. تابع التفاصيل والردود قبل إكمال أي إجراء.',
    completed: 'اكتملت عملية التسليم والإرجاع ولا توجد إجراءات مطلوبة.',
  };

  return messages[stage] || 'لا يوجد إجراء مطلوب منك في هذه المرحلة.';
}

function normalizeDeliveryRows({ rentals, role, userId }) {
  return rentals
    .filter((rental) => {
      if (role === 'owner') return rental.ownerId === userId;
      return rental.tenantId === userId;
    })
    .filter((rental) => ['confirmed', 'in_use', 'disputed', 'completed'].includes(rental.status))
    .map((rental) => {
      const equipment = getEquipmentSnapshot(rental.equipmentId);
      const tenant = getTenantProfile(rental.tenantId);

      return {
        ...rental,
        equipment,
        partnerName: role === 'owner' ? tenant.name : equipment.ownerName,
        partnerLabel: role === 'owner' ? 'المستأجر' : 'المؤجر',
      };
    });
}

function getWorkflowStage(rental, reports) {
  if (!rental) return 'delivery';
  if (rental.status === 'disputed') return 'disputes';
  if (rental.status === 'completed') return 'completed';

  const ownerDelivery = reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'owner');
  const tenantDelivery = reports.some((report) => report.phase === 'delivery' && report.submittedByRole === 'tenant');
  const tenantReturn = reports.some((report) => report.phase === 'return' && report.submittedByRole === 'tenant');
  const ownerReturn = reports.some((report) => report.phase === 'return' && report.submittedByRole === 'owner');

  if (rental.status === 'confirmed' && !ownerDelivery) return 'delivery';
  if (rental.status === 'confirmed' && ownerDelivery && !tenantDelivery) return 'handover';
  if (rental.status === 'in_use' && !tenantReturn) return 'in_use';
  if (rental.status === 'in_use' && tenantReturn && !ownerReturn) return 'return';

  return rental.status;
}

function getFormSpec({ role, stage }) {
  if (stage === 'delivery' && role === 'owner') {
    return { title: 'تسجيل تسليم المعدة', phase: 'delivery', submitter: 'owner', submitLabel: 'تأكيد التسليم' };
  }
  if (stage === 'handover' && role === 'tenant') {
    return { title: 'تأكيد استلام المعدة', phase: 'delivery', submitter: 'tenant', submitLabel: 'تأكيد الاستلام' };
  }
  if (stage === 'in_use' && role === 'tenant') {
    return { title: 'تسجيل إرجاع المعدة', phase: 'return', submitter: 'tenant', submitLabel: 'إرسال تقرير الإرجاع' };
  }
  if (stage === 'return' && role === 'owner') {
    return { title: 'تأكيد إرجاع المعدة', phase: 'return', submitter: 'owner', submitLabel: 'تأكيد الإرجاع' };
  }
  return null;
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DeliveryPage({ role: roleProp }) {
  const { user } = useAuth();
  const { id: routeRentalId } = useParams();
  const role = roleProp || user?.type || 'tenant';
  const config = getDeliveryConfig(role);
  const userId = user?.id || (role === 'owner' ? 'owner-1' : 'tenant-1');
  const {
    rentals,
    createHandoverReport,
    getHandoverReportsForRental,
    getDisputesForRental,
    getCompensationForRental,
    requestCompensation,
    respondToCompensation,
    openCompensationDispute,
    submitReview,
  } = useRentalPlatform();
  const [activeTab, setActiveTab] = useState(config.tabs[0].id);
  const [selectedRentalId, setSelectedRentalId] = useState(routeRentalId || null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [forms, setForms] = useState({});
  const [compensationForms, setCompensationForms] = useState({});

  useEffect(() => {
    if (routeRentalId) setSelectedRentalId(routeRentalId);
  }, [routeRentalId]);

  const rows = useMemo(() => normalizeDeliveryRows({
    rentals,
    role,
    userId,
  }).map((rental) => ({
    ...rental,
    workflowStage: getWorkflowStage(rental, getHandoverReportsForRental(rental.id)),
  })), [rentals, role, userId, getHandoverReportsForRental]);

  const filteredRows = useMemo(() => rows.filter((row) => {
    if (activeTab === 'all') return true;
    return row.workflowStage === activeTab;
  }), [activeTab, rows]);

  const selectedRental = useMemo(() => {
    if (selectedRentalId) return rows.find((row) => row.id === selectedRentalId) || filteredRows[0];
    return filteredRows[0];
  }, [filteredRows, rows, selectedRentalId]);

  const reports = selectedRental ? getHandoverReportsForRental(selectedRental.id) : [];
  const disputes = selectedRental ? getDisputesForRental(selectedRental.id) : [];
  const compensation = selectedRental ? getCompensationForRental(selectedRental.id) : undefined;
  const ownerReturnReport = reports.find((report) => report.phase === 'return' && report.submittedByRole === 'owner');
  const selectedStage = selectedRental?.workflowStage || 'delivery';
  const formSpec = getFormSpec({ role, stage: selectedStage });
  const activeForm = selectedRental ? { ...DEFAULT_FORM, ...(forms[selectedRental.id] || {}) } : DEFAULT_FORM;
  const activeCompensationForm = selectedRental
    ? { amount: '', notes: '', photos: [], ...(compensationForms[selectedRental.id] || {}) }
    : { amount: '', notes: '', photos: [] };
  const stageFeedback = getStageFeedback({ role, stage: selectedStage });

  const tabs = config.tabs.map((tab) => ({
    ...tab,
    count: rows.filter((row) => tab.id === 'all' || row.workflowStage === tab.id).length,
  }));

  const updateForm = (key, value) => {
    if (!selectedRental) return;
    setForms((current) => ({
      ...current,
      [selectedRental.id]: {
        ...DEFAULT_FORM,
        ...(current[selectedRental.id] || {}),
        [key]: value,
      },
    }));
  };

  const handleSubmitStage = () => {
    if (!selectedRental || !formSpec) return;

    createHandoverReport({
      rentalOpId: selectedRental.id,
      phase: formSpec.phase,
      submittedByRole: formSpec.submitter,
      conditionStatus: formSpec.phase === 'delivery' ? activeForm.conditionStatus : undefined,
      hasDamage: formSpec.phase === 'return' ? activeForm.hasDamage === 'true' : undefined,
      hasIssues: formSpec.phase === 'return' ? activeForm.hasDamage === 'true' : activeForm.conditionStatus === 'damaged',
      notes: activeForm.notes,
      evidencePhotos: activeForm.evidencePhotos,
    });

    setForms((current) => ({ ...current, [selectedRental.id]: DEFAULT_FORM }));
  };

  const updateCompensationForm = (key, value) => {
    if (!selectedRental) return;
    setCompensationForms((current) => ({
      ...current,
      [selectedRental.id]: {
        amount: '',
        notes: '',
        photos: [],
        ...(current[selectedRental.id] || {}),
        [key]: value,
      },
    }));
  };

  const handleRequestCompensation = () => {
    if (!selectedRental || !ownerReturnReport) return;
    const amount = Number(activeCompensationForm.amount || 0);
    if (!amount || !activeCompensationForm.notes.trim()) return;

    requestCompensation({
      rentalOpId: selectedRental.id,
      handoverId: ownerReturnReport.id,
      requestedAmount: amount,
      notes: activeCompensationForm.notes.trim(),
      evidencePhotos: activeCompensationForm.photos,
    });

    setCompensationForms((current) => ({
      ...current,
      [selectedRental.id]: { amount: '', notes: '', photos: [] },
    }));
  };

  const handleSubmitRating = ({ rental, rating, comment }) => {
    if (!rental || !submitReview) return;
    const equipment = rental.equipment;
    submitReview({
      rentalOpId: rental.id,
      targetType: 'user',
      targetId: role === 'owner' ? rental.tenantId : equipment?.ownerId,
      rating,
      reviewText: comment || '',
    });
  };

  return (
    <div className={config.containerClassName} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={config.description}
      />

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredRows.length === 0 ? (
        <EmptyState
          icon="📦"
          title="لا توجد عمليات في هذه الحالة"
          description="ستظهر عمليات التسليم والإرجاع هنا عند توفرها."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(320px,420px)_1fr]">
          <DeliveryRentalList
            rentals={filteredRows}
            selectedRental={selectedRental}
            onSelect={setSelectedRentalId}
          />

          {selectedRental ? (
            role === 'tenant' ? (
              <TenantDeliveryDetails
                rental={selectedRental}
                stage={selectedStage}
                reports={reports}
                disputes={disputes}
                compensation={compensation}
                formSpec={formSpec}
                activeForm={activeForm}
                stageFeedback={stageFeedback}
                onUpdateForm={updateForm}
                onSubmitStage={handleSubmitStage}
                onRespondCompensation={respondToCompensation}
                onOpenCompensationDispute={openCompensationDispute}
                onSelectReport={setSelectedReport}
                onSubmitRating={handleSubmitRating}
              />
            ) : (
              <OwnerDeliveryDetails
                rental={selectedRental}
                stage={selectedStage}
                reports={reports}
                disputes={disputes}
                compensation={compensation}
                formSpec={formSpec}
                activeForm={activeForm}
                activeCompensationForm={activeCompensationForm}
                stageFeedback={stageFeedback}
                onUpdateForm={updateForm}
                onSubmitStage={handleSubmitStage}
                onUpdateCompensationForm={updateCompensationForm}
                onRequestCompensation={handleRequestCompensation}
                onSelectReport={setSelectedReport}
                onSubmitRating={handleSubmitRating}
              />
            )
          ) : null}
        </div>
      )}

      <DeliveryReportModal
        report={selectedReport}
        onClose={() => setSelectedReport(null)}
      />
    </div>
  );
}
