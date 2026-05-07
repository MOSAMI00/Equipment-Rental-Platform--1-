import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import {
  formatCurrency,
  formatRentalDate,
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
} from '../../data/mock-api';
import {
  EmptyState,
  FilterTabs,
  PageHeader,
  StatusBadge,
} from '../../components/shared';
import { getDeliveryConfig } from './deliveryConfig';
import { DeliveryRentalList } from './components/DeliveryRentalList';
import { DeliveryStageForm } from './components/DeliveryStageForm';
import { OwnerCompensationCard } from './components/OwnerCompensationCard';
import { CompensationResponseCard } from './components/CompensationResponseCard';
import { DeliveryReportModal } from './components/DeliveryReportModal';
import { PostRentalRating } from './components/PostRentalRating';

// ─── Constants ───────────────────────────────────────────────────────────────

const STAGE_META = {
  delivery: { label: 'بانتظار التسليم', status: 'confirmed' },
  handover: { label: 'قيد التسليم', status: 'confirmed' },
  in_use: { label: 'قيد الاستخدام', status: 'in_use' },
  return: { label: 'بانتظار الإرجاع', status: 'in_use' },
  disputes: { label: 'نزاع مفتوح', status: 'disputed' },
  completed: { label: 'مكتمل', status: 'completed' },
};

const STATUS_META = {
  confirmed: { label: 'بانتظار التسليم', color: '#2D5A27', bg: '#EAF3E9' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: 'rgba(230,126,34,0.12)' },
  disputed: { label: 'نزاع مفتوح', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
};

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

// ─── Detail Panel ────────────────────────────────────────────────────────────

function DeliveryDetailPanel({
  rental,
  stage,
  reports,
  disputes,
  compensation,
  role,
  formSpec,
  activeForm,
  activeCompensationForm,
  stageFeedback,
  onUpdateForm,
  onSubmitStage,
  onUpdateCompensationForm,
  onRequestCompensation,
  onRespondCompensation,
  onOpenCompensationDispute,
  onSelectReport,
  onSubmitRating,
}) {
  const ownerReturnReport = reports.find((report) => report.phase === 'return' && report.submittedByRole === 'owner');

  return (
    <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="m-0 text-xl font-bold text-[#222222]">{rental.equipment.name}</h2>
          <p className="m-0 mt-1 text-sm text-[#888888]">
            {rental.orderNum} • {rental.partnerLabel}: {rental.partnerName}
          </p>
        </div>
        <StatusBadge status={STAGE_META[stage]?.status} meta={{
          ...STATUS_META[STAGE_META[stage]?.status],
          label: STAGE_META[stage]?.label,
        }} />
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">تاريخ البداية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.startDate)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">تاريخ النهاية</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(rental.endDate)}</p>
        </div>
        <div className="rounded-xl bg-[#F8FAFC] p-4">
          <p className="m-0 text-[#888888]">موقع التسليم</p>
          <p className="m-0 mt-1 font-bold text-[#222222]">{rental.deliveryInfo?.address || rental.equipment.location}</p>
        </div>
      </div>

      {/* Reports Log */}
      <div className="mt-5 rounded-2xl border border-[#E8ECEF] p-4">
        <h3 className="m-0 mb-3 text-base font-bold text-[#222222]">سجل التسليم والإرجاع</h3>
        {reports.length > 0 ? (
          <div className="flex flex-col gap-2">
            {reports.map((report) => (
              <button
                key={report.id}
                type="button"
                onClick={() => onSelectReport(report)}
                className="flex items-center justify-between gap-3 rounded-xl bg-[#F8FAFC] p-3 text-right text-sm transition-colors hover:bg-[#EEF3F0]"
              >
                <span className="font-semibold text-[#222222]">
                  {report.phase === 'delivery' ? 'تقرير التسليم' : 'تقرير الإرجاع'}
                </span>
                <span className="text-[#888888]">{formatRentalDate(report.createdAt)}</span>
              </button>
            ))}
          </div>
        ) : (
          <p className="m-0 text-sm text-[#888888]">لا توجد تقارير موثقة بعد.</p>
        )}
      </div>

      {/* Stage Feedback */}
      <div className="mt-4 rounded-2xl border border-[#DDE8DA] bg-[#F5FAF4] p-4 text-sm leading-7 text-[#2D5A27]">
        {stageFeedback}
      </div>

      {/* Owner Compensation */}
      {role === 'owner' && ownerReturnReport ? (
        <OwnerCompensationCard
          compensation={compensation}
          form={activeCompensationForm}
          onChange={onUpdateCompensationForm}
          onSubmit={onRequestCompensation}
        />
      ) : null}

      {/* Tenant Compensation Response */}
      {role === 'tenant' && compensation ? (
        <div className="mt-4">
          <CompensationResponseCard
            compensation={compensation}
            onAccept={() => onRespondCompensation(compensation.id, 'accepted')}
            onReject={() => onRespondCompensation(compensation.id, 'rejected')}
            onOpenDispute={(claim, amount) => onOpenCompensationDispute(compensation.id, claim, amount)}
          />
        </div>
      ) : null}

      {/* Disputes Notice */}
      {disputes.length > 0 ? (
        <div className="mt-4 rounded-2xl border border-[#F5B7B1] bg-[#FDEDEC] p-4 text-sm text-[#C0392B]">
          يوجد نزاع مفتوح على هذه العملية. تابع تفاصيله من نفس السجل عند ربط backend النزاعات.
        </div>
      ) : null}

      {/* Stage Form or Idle */}
      {formSpec ? (
        <DeliveryStageForm
          form={activeForm}
          spec={formSpec}
          onChange={onUpdateForm}
          onSubmit={onSubmitStage}
        />
      ) : (
        stage !== 'completed' && (
          <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#888888]">
            لا يوجد إجراء مطلوب منك في هذه المرحلة.
          </div>
        )
      )}

      {/* Post-Rental Rating (shown after completion) */}
      {stage === 'completed' ? (
        <PostRentalRating
          rental={rental}
          onSubmit={({ rating, comment }) => onSubmitRating({ rental, rating, comment })}
          onSkip={() => {}}
        />
      ) : null}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function DeliveryPage() {
  const { user } = useAuth();
  const { id: routeRentalId } = useParams();
  const role = user?.type || 'tenant';
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
  const tenantReturnReport = reports.find((report) => report.phase === 'return' && report.submittedByRole === 'tenant');
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
      handoverId: ownerReturnReport.id || tenantReturnReport?.id,
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
            <DeliveryDetailPanel
              rental={selectedRental}
              stage={selectedStage}
              reports={reports}
              disputes={disputes}
              compensation={compensation}
              role={role}
              formSpec={formSpec}
              activeForm={activeForm}
              activeCompensationForm={activeCompensationForm}
              stageFeedback={stageFeedback}
              onUpdateForm={updateForm}
              onSubmitStage={handleSubmitStage}
              onUpdateCompensationForm={updateCompensationForm}
              onRequestCompensation={handleRequestCompensation}
              onRespondCompensation={respondToCompensation}
              onOpenCompensationDispute={openCompensationDispute}
              onSelectReport={setSelectedReport}
              onSubmitRating={handleSubmitRating}
            />
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
