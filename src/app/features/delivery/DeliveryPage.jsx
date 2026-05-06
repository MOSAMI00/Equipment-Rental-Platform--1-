import React, { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  formatRentalDate,
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
} from '../../data/mock-api';
import {
  AppButton,
  EmptyState,
  FilterTabs,
  PageHeader,
  StatusBadge,
} from '../../components/shared';
import { getDeliveryConfig } from './deliveryConfig';

const STATUS_META = {
  confirmed: { label: 'بانتظار التسليم', color: '#2D5A27', bg: '#EAF3E9' },
  in_use: { label: 'قيد الاستخدام', color: '#E67E22', bg: 'rgba(230,126,34,0.12)' },
  disputed: { label: 'نزاع مفتوح', color: '#E74C3C', bg: 'rgba(231,76,60,0.12)' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: 'rgba(39,174,96,0.12)' },
};

const STAGE_META = {
  delivery: { label: 'بانتظار التسليم', status: 'confirmed' },
  handover: { label: 'قيد التسليم', status: 'confirmed' },
  in_use: { label: 'قيد الاستخدام', status: 'in_use' },
  return: { label: 'بانتظار الإرجاع', status: 'in_use' },
  disputes: { label: 'نزاع مفتوح', status: 'disputed' },
  completed: { label: 'مكتمل', status: 'completed' },
};

const DEFAULT_FORM = {
  conditionStatus: 'good',
  hasDamage: 'false',
  notes: '',
  evidencePhotos: [],
};

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

function DeliveryStageForm({ form, onChange, onSubmit, spec }) {
  const isReturn = spec.phase === 'return';

  return (
    <div className="mt-5 rounded-2xl border border-[#E0E0E0] bg-[#FBFCFD] p-4">
      <h3 className="m-0 text-base font-bold text-[#222222]">{spec.title}</h3>
      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <label className="text-sm font-semibold text-[#222222]">
          {isReturn ? 'هل توجد تلفيات؟' : 'حالة المعدة'}
          <select
            value={isReturn ? form.hasDamage : form.conditionStatus}
            onChange={(event) => onChange(isReturn ? 'hasDamage' : 'conditionStatus', event.target.value)}
            className="mt-2 h-11 w-full rounded-xl border border-[#E0E0E0] bg-white px-3 text-sm focus:border-[#2D5A27] focus:outline-none"
          >
            {isReturn ? (
              <>
                <option value="false">لا توجد تلفيات</option>
                <option value="true">توجد تلفيات</option>
              </>
            ) : (
              <>
                <option value="excellent">ممتازة</option>
                <option value="good">جيدة</option>
                <option value="fair">متوسطة</option>
                <option value="damaged">تحتاج مراجعة</option>
              </>
            )}
          </select>
        </label>

        <label className="text-sm font-semibold text-[#222222]">
          صور التوثيق
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(event) => onChange('evidencePhotos', Array.from(event.target.files || []).map((file) => file.name))}
            className="mt-2 block w-full rounded-xl border border-dashed border-[#C8D6C5] bg-white px-3 py-2 text-sm"
          />
          <span className="mt-1 block text-xs font-normal text-[#888888]">
            {form.evidencePhotos.length > 0 ? `${form.evidencePhotos.length} صورة مختارة` : 'الصور مطلوبة لتوثيق المرحلة'}
          </span>
        </label>
      </div>

      <label className="mt-4 block text-sm font-semibold text-[#222222]">
        ملاحظات
        <textarea
          value={form.notes}
          onChange={(event) => onChange('notes', event.target.value)}
          rows={3}
          placeholder="أضف ملاحظات عن حالة المعدة أو التسليم..."
          className="mt-2 w-full resize-none rounded-xl border border-[#E0E0E0] bg-white p-3 text-sm focus:border-[#2D5A27] focus:outline-none"
        />
      </label>

      <AppButton
        className="mt-4"
        disabled={form.evidencePhotos.length === 0}
        onClick={onSubmit}
      >
        {spec.submitLabel}
      </AppButton>
    </div>
  );
}

export default function DeliveryPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getDeliveryConfig(role);
  const userId = user?.id || (role === 'owner' ? 'owner-1' : 'tenant-1');
  const {
    rentals,
    createHandoverReport,
    getHandoverReportsForRental,
    getDisputesForRental,
  } = useRentalPlatform();
  const [activeTab, setActiveTab] = useState(config.tabs[0].id);
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [forms, setForms] = useState({});

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
  const selectedStage = selectedRental?.workflowStage || 'delivery';
  const formSpec = getFormSpec({
    role,
    stage: selectedStage,
  });
  const activeForm = selectedRental ? { ...DEFAULT_FORM, ...(forms[selectedRental.id] || {}) } : DEFAULT_FORM;
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
          <div className="flex flex-col gap-3">
            {filteredRows.map((rental) => (
              <button
                key={rental.id}
                type="button"
                onClick={() => setSelectedRentalId(rental.id)}
                className={`w-full rounded-2xl border bg-white p-4 text-right transition-all ${
                  selectedRental?.id === rental.id
                    ? 'border-[#2D5A27] shadow-md'
                    : 'border-[#E0E0E0] hover:border-[#B8CDB4]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={rental.equipment.image}
                    alt={rental.equipment.name}
                    className="h-16 w-16 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="m-0 truncate text-sm font-bold text-[#222222]">{rental.equipment.name}</p>
                    <p className="m-0 mt-1 text-xs text-[#888888]">{rental.orderNum} • {rental.partnerName}</p>
                  </div>
                  <StatusBadge status={STAGE_META[rental.workflowStage]?.status} meta={{
                    ...STATUS_META[STAGE_META[rental.workflowStage]?.status],
                    label: STAGE_META[rental.workflowStage]?.label,
                  }} />
                </div>
              </button>
            ))}
          </div>

          {selectedRental ? (
            <div className="rounded-2xl border border-[#E0E0E0] bg-white p-5 shadow-sm">
              <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="m-0 text-xl font-bold text-[#222222]">{selectedRental.equipment.name}</h2>
                  <p className="m-0 mt-1 text-sm text-[#888888]">
                    {selectedRental.orderNum} • {selectedRental.partnerLabel}: {selectedRental.partnerName}
                  </p>
                </div>
                <StatusBadge status={STAGE_META[selectedStage]?.status} meta={{
                  ...STATUS_META[STAGE_META[selectedStage]?.status],
                  label: STAGE_META[selectedStage]?.label,
                }} />
              </div>

              <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-3">
                <div className="rounded-xl bg-[#F8FAFC] p-4">
                  <p className="m-0 text-[#888888]">تاريخ البداية</p>
                  <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(selectedRental.startDate)}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] p-4">
                  <p className="m-0 text-[#888888]">تاريخ النهاية</p>
                  <p className="m-0 mt-1 font-bold text-[#222222]">{formatRentalDate(selectedRental.endDate)}</p>
                </div>
                <div className="rounded-xl bg-[#F8FAFC] p-4">
                  <p className="m-0 text-[#888888]">موقع التسليم</p>
                  <p className="m-0 mt-1 font-bold text-[#222222]">{selectedRental.deliveryInfo?.address || selectedRental.equipment.location}</p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-[#E8ECEF] p-4">
                <h3 className="m-0 mb-3 text-base font-bold text-[#222222]">سجل التسليم والإرجاع</h3>
                {reports.length > 0 ? (
                  <div className="flex flex-col gap-2">
                    {reports.map((report) => (
                      <button
                        key={report.id}
                        type="button"
                        onClick={() => setSelectedReport(report)}
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

              <div className="mt-4 rounded-2xl border border-[#DDE8DA] bg-[#F5FAF4] p-4 text-sm leading-7 text-[#2D5A27]">
                {stageFeedback}
              </div>

              {disputes.length > 0 ? (
                <div className="mt-4 rounded-2xl border border-[#F5B7B1] bg-[#FDEDEC] p-4 text-sm text-[#C0392B]">
                  يوجد نزاع مفتوح على هذه العملية. تابع تفاصيله من نفس السجل عند ربط backend النزاعات.
                </div>
              ) : null}

              {formSpec ? (
                <DeliveryStageForm
                  form={activeForm}
                  spec={formSpec}
                  onChange={updateForm}
                  onSubmit={handleSubmitStage}
                />
              ) : (
                <div className="mt-5 rounded-2xl bg-[#F8FAFC] p-4 text-sm text-[#888888]">
                  لا يوجد إجراء مطلوب منك في هذه المرحلة.
                </div>
              )}
            </div>
          ) : null}
        </div>
      )}

      {selectedReport ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-xl font-bold text-[#222222]">
                  {selectedReport.phase === 'delivery' ? 'تقرير التسليم' : 'تقرير الإرجاع'}
                </h2>
                <p className="m-0 mt-1 text-sm text-[#888888]">{formatRentalDate(selectedReport.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedReport(null)}
                className="rounded-full border border-[#E0E0E0] px-3 py-1 text-sm font-bold text-[#555555] hover:bg-[#F4F6F9]"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">تم بواسطة</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">
                  {selectedReport.submittedByRole === 'owner' ? 'المؤجر' : 'المستأجر'}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">حالة المعدة</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">
                  {selectedReport.conditionStatus || (selectedReport.hasDamage ? 'توجد تلفيات' : 'لا توجد تلفيات')}
                </p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
                <p className="m-0 text-[#888888]">الملاحظات</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">{selectedReport.notes || 'لا توجد ملاحظات'}</p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4 sm:col-span-2">
                <p className="m-0 text-[#888888]">الصور</p>
                {selectedReport.evidencePhotos?.length > 0 ? (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {selectedReport.evidencePhotos.map((photo) => (
                      <span key={photo} className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#555555]">
                        {photo}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="m-0 mt-1 font-bold text-[#222222]">لا توجد صور مرفقة</p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
