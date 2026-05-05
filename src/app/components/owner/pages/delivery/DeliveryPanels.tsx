import React from 'react';
import { AlertTriangle, CheckCircle, Package } from 'lucide-react';
import { formatCurrency, formatRentalDateRange, type Dispute, type HandoverReport } from '../../../../data/mock-api';
import type { RentalListItem } from '../../../../types/owner';
import { STATUS_CONFIG } from '../../../tenant/Dashboard/shared/OrderTypes';
import EmptyState from '../../shared/EmptyState';

const UNKNOWN_EQUIPMENT = '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629';
const UNKNOWN_USER = '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641';
const UNKNOWN_STATUS = '\u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641';

const CONDITION_LABELS: Record<string, string> = {
  excellent: '✨ ممتازة',
  good: '👍 جيدة',
  fair: '⚠️ مقبولة',
  poor: '❌ سيئة',
};

const statusConfig = (status?: string) => (status ? STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] : undefined) ?? { label: status ?? UNKNOWN_STATUS };
const equipmentOf = (rental?: RentalListItem | null) => rental?.equipment ?? {};
const tenantOf = (rental?: RentalListItem | null) => rental?.tenant ?? {};

export function HandoverEvidenceForm({
  evidence,
  description,
  setEvidence,
  setDescription,
  onSubmit,
  submitLabel,
  children,
}: {
  evidence: string[];
  description: string;
  setEvidence: (files: string[]) => void;
  setDescription: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        className="owner-input"
        onChange={(event) => setEvidence(Array.from(event.target.files || []).map((file) => file.name))}
      />
      <label className="text-muted" style={{ fontSize: 12 }}>وصف إضافي (اختياري)</label>
      <textarea
        className="owner-input"
        rows={3}
        placeholder="مثال: ملاحظات على حالة المعدة، الموقع، أو الصور."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {children}
      <button className="owner-btn owner-btn-success w-full" style={{ width: '100%' }} onClick={onSubmit} disabled={evidence.length === 0}>
        <CheckCircle size={16} /> {submitLabel}
      </button>
    </div>
  );
}

export function RentalListPanel({
  rentals,
  handoverReports,
  selectedRentalId,
  onSelect,
}: {
  rentals: RentalListItem[];
  handoverReports: HandoverReport[];
  selectedRentalId: string | null;
  onSelect: (id: string | null) => void;
}) {
  if (rentals.length === 0) {
    return <EmptyState compact icon="📋" title="لا توجد عمليات في هذه الحالة" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {rentals.map((rental) => {
        const equipment = equipmentOf(rental);
        const tenant = tenantOf(rental);
        const status = statusConfig(rental.status);
        const waitingTenantReceive = handoverReports.some((h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'owner')
          && !handoverReports.some((h) => h.rentalOpId === rental.id && h.phase === 'delivery' && h.submittedByRole === 'tenant');
        const waitingOwnerReturnConfirm = handoverReports.some((h) => h.rentalOpId === rental.id && h.phase === 'return' && h.submittedByRole === 'tenant' && !h.confirmedAt);
        const isSelected = selectedRentalId === rental.id;

        return (
          <div
            key={rental.id}
            className="owner-card"
            style={{
              cursor: 'pointer',
              borderRight: isSelected ? '4px solid var(--color-primary-green)' : '4px solid transparent',
              transition: 'all 0.2s',
            }}
            onClick={() => onSelect(isSelected ? null : rental.id)}
          >
            <div className="flex-between mb-2">
              <strong>{equipment.name ?? UNKNOWN_EQUIPMENT}</strong>
              <span className={`badge badge-${(rental.status ?? 'unknown').replace('_', '-')}`}>{status.label ?? UNKNOWN_STATUS}</span>
            </div>
            <p className="text-muted mb-2" style={{ fontSize: 13 }}>
              {tenant.name ?? UNKNOWN_USER} — {formatRentalDateRange(rental.startDate ?? '', rental.endDate ?? '')}
            </p>
            {waitingTenantReceive ? <span className="badge badge-pending" style={{ fontSize: 11 }}>⏳ بانتظار تأكيد الاستلام من المستأجر</span> : null}
            {waitingOwnerReturnConfirm ? <span className="badge badge-pending" style={{ fontSize: 11 }}>⏳ طلب إرجاع بانتظار توثيقك</span> : null}
          </div>
        );
      })}
    </div>
  );
}

export function DeliveryLifecycleCard({ ownerDeliveryReport, tenantDeliveryReport }: {
  ownerDeliveryReport?: HandoverReport;
  tenantDeliveryReport?: HandoverReport;
}) {
  if (!ownerDeliveryReport) return null;

  return (
    <div className="owner-card mb-4">
      <div className="flex-between mb-4">
        <h4 style={{ margin: 0 }}>📦 دورة التسليم</h4>
        {tenantDeliveryReport ? <span className="badge badge-completed">✅ المستأجر استلم</span> : <span className="badge badge-pending">⏳ بانتظار تأكيد المستأجر</span>}
      </div>
      <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>
        تم تسليم المعدة من المؤجر بتاريخ {ownerDeliveryReport.createdAt?.slice(0, 10) ?? '—'}.
      </p>
      {ownerDeliveryReport.notes ? <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>{ownerDeliveryReport.notes}</p> : null}
      {!tenantDeliveryReport ? <p className="text-muted" style={{ fontSize: 12 }}>المستأجر لم يؤكد الاستلام بعد.</p> : null}
      {tenantDeliveryReport ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <div>
            <span className="text-muted" style={{ fontSize: 12 }}>حالة المعدة عند الاستلام</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>
              {tenantDeliveryReport.conditionStatus ? (CONDITION_LABELS[tenantDeliveryReport.conditionStatus] ?? tenantDeliveryReport.conditionStatus) : '—'}
            </p>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: 12 }}>مشاكل</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>{tenantDeliveryReport.hasIssues ? '⚠️ نعم' : '✅ لا'}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function ReturnReportCard({
  returnReport,
  selectedRental,
  evidence,
  description,
  ownerDecision,
  proposedDeduction,
  setEvidence,
  setDescription,
  setOwnerDecision,
  setProposedDeduction,
  onConfirmReturn,
  onOpenDispute,
}: {
  returnReport?: HandoverReport;
  selectedRental: RentalListItem;
  evidence: string[];
  description: string;
  ownerDecision: 'full_refund' | 'partial_refund' | 'no_refund';
  proposedDeduction: string;
  setEvidence: (files: string[]) => void;
  setDescription: (value: string) => void;
  setOwnerDecision: (value: 'full_refund' | 'partial_refund' | 'no_refund') => void;
  setProposedDeduction: (value: string) => void;
  onConfirmReturn: () => void;
  onOpenDispute: () => void;
}) {
  if (!returnReport) return null;

  return (
    <div className="owner-card mb-4">
      <div className="flex-between mb-4">
        <h4 style={{ margin: 0 }}>🔄 تقرير الإرجاع (من المستأجر)</h4>
        {returnReport.confirmedAt ? <span className="badge badge-completed">✅ مؤكد</span> : <span className="badge badge-pending">⏳ بانتظار قرارك</span>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
        <div>
          <span className="text-muted" style={{ fontSize: 12 }}>أضرار</span>
          <p style={{ fontWeight: 600, margin: '2px 0', color: returnReport.hasDamage ? '#E74C3C' : '#27AE60' }}>
            {returnReport.hasDamage ? '⚠️ يوجد أضرار' : '✅ لا أضرار'}
          </p>
        </div>
        <div>
          <span className="text-muted" style={{ fontSize: 12 }}>قرار التأمين</span>
          <p style={{ fontWeight: 600, margin: '2px 0' }}>
            {returnReport.ownerDecision === 'full_refund' ? '✅ استرداد كامل'
              : returnReport.ownerDecision === 'partial_refund' ? `⚠️ خصم ${formatCurrency(returnReport.proposedDeduction ?? 0)} ر.ي`
              : returnReport.ownerDecision === 'no_refund' ? '❌ لا استرداد'
              : '—'}
          </p>
        </div>
      </div>
      {returnReport.notes ? <p className="text-muted" style={{ fontSize: 13, marginBottom: 12 }}>{returnReport.notes}</p> : null}
      {!returnReport.confirmedAt ? (
        <HandoverEvidenceForm
          evidence={evidence}
          description={description}
          setEvidence={setEvidence}
          setDescription={setDescription}
          submitLabel="توثيق وتأكيد الإرجاع"
          onSubmit={onConfirmReturn}
        >
          <select className="owner-input" value={ownerDecision} onChange={(event) => setOwnerDecision(event.target.value as 'full_refund' | 'partial_refund' | 'no_refund')}>
            <option value="full_refund">استرداد كامل للتأمين</option>
            <option value="partial_refund">استرداد جزئي</option>
            <option value="no_refund">لا استرداد</option>
          </select>
          {ownerDecision === 'partial_refund' ? <input type="number" className="owner-input" placeholder="مبلغ الخصم بالريال" value={proposedDeduction} onChange={(event) => setProposedDeduction(event.target.value)} /> : null}
          <button className="owner-btn owner-btn-danger" type="button" onClick={onOpenDispute}>
            <AlertTriangle size={14} /> فتح نزاع
          </button>
        </HandoverEvidenceForm>
      ) : null}
    </div>
  );
}

export function RentalDetailPanel(props: {
  selectedRental?: RentalListItem | null;
  ownerDeliveryReport?: HandoverReport;
  tenantDeliveryReport?: HandoverReport;
  returnReport?: HandoverReport;
  deliveryEvidence: string[];
  returnEvidence: string[];
  deliveryExtraDescription: string;
  returnExtraDescription: string;
  ownerDecision: 'full_refund' | 'partial_refund' | 'no_refund';
  proposedDeduction: string;
  setDeliveryEvidence: (files: string[]) => void;
  setReturnEvidence: (files: string[]) => void;
  setDeliveryExtraDescription: (value: string) => void;
  setReturnExtraDescription: (value: string) => void;
  setOwnerDecision: (value: 'full_refund' | 'partial_refund' | 'no_refund') => void;
  setProposedDeduction: (value: string) => void;
  onConfirmDelivery: () => void;
  onConfirmReturn: () => void;
  onOpenDispute: () => void;
}) {
  const { selectedRental } = props;

  if (!selectedRental) {
    return (
      <EmptyState
        compact
        icon={<Package size={40} style={{ margin: '0 auto 12px' }} />}
        title="اختر عملية من القائمة"
        description="ستظهر تفاصيل التسليم والإرجاع هنا."
      />
    );
  }

  const equipment = equipmentOf(selectedRental);
  const tenant = tenantOf(selectedRental);

  return (
    <div>
      <div className="owner-card mb-4">
        <div className="flex-center gap-4 mb-4" style={{ justifyContent: 'flex-start' }}>
          <img src={equipment.image ?? ''} alt="" style={{ width: 72, height: 72, borderRadius: 10, objectFit: 'cover' }} />
          <div>
            <h4 style={{ margin: '0 0 4px' }}>{equipment.name ?? UNKNOWN_EQUIPMENT}</h4>
            <p className="text-muted mb-1" style={{ fontSize: 13 }}>#{selectedRental.orderNum ?? '—'} — {tenant.name ?? UNKNOWN_USER}</p>
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>📅 {formatRentalDateRange(selectedRental.startDate ?? '', selectedRental.endDate ?? '')}</p>
          </div>
        </div>
        <div className="flex-between">
          <span className="text-muted">إجمالي الإيجار</span>
          <strong style={{ color: 'var(--color-primary-green)' }}>{formatCurrency(selectedRental.totalAmount ?? 0)} ر.ي</strong>
        </div>
      </div>

      {!props.ownerDeliveryReport && selectedRental.status === 'confirmed' && selectedRental.paymentStatus === 'paid' ? (
        <div className="owner-card mb-4">
          <div className="flex-between mb-4">
            <h4 style={{ margin: 0 }}>📦 تسليم المعدة للمستأجر</h4>
            <span className="badge badge-pending">مطلوب</span>
          </div>
          <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>
            ارفع صورة توثيق واحدة على الأقل قبل تأكيد التسليم.
          </p>
          <HandoverEvidenceForm
            evidence={props.deliveryEvidence}
            description={props.deliveryExtraDescription}
            setEvidence={props.setDeliveryEvidence}
            setDescription={props.setDeliveryExtraDescription}
            submitLabel="توثيق وتسليم المعدة"
            onSubmit={props.onConfirmDelivery}
          />
        </div>
      ) : null}

      <DeliveryLifecycleCard ownerDeliveryReport={props.ownerDeliveryReport} tenantDeliveryReport={props.tenantDeliveryReport} />
      <ReturnReportCard
        returnReport={props.returnReport}
        selectedRental={selectedRental}
        evidence={props.returnEvidence}
        description={props.returnExtraDescription}
        ownerDecision={props.ownerDecision}
        proposedDeduction={props.proposedDeduction}
        setEvidence={props.setReturnEvidence}
        setDescription={props.setReturnExtraDescription}
        setOwnerDecision={props.setOwnerDecision}
        setProposedDeduction={props.setProposedDeduction}
        onConfirmReturn={props.onConfirmReturn}
        onOpenDispute={props.onOpenDispute}
      />
      {!props.ownerDeliveryReport && !props.returnReport ? <EmptyState compact icon="📦" title="بانتظار بدء عملية التسليم" /> : null}
    </div>
  );
}

export function DisputeCard({
  dispute,
  rental,
  isEditing,
  disputeNotes,
  ownerDecision,
  proposedDeduction,
  onStartEdit,
  onNotesChange,
  onOwnerDecisionChange,
  onProposedDeductionChange,
  onSave,
}: {
  dispute: Dispute;
  rental?: RentalListItem;
  isEditing: boolean;
  disputeNotes: string;
  ownerDecision: 'full_refund' | 'partial_refund' | 'no_refund';
  proposedDeduction: string;
  onStartEdit: () => void;
  onNotesChange: (value: string) => void;
  onOwnerDecisionChange: (value: 'full_refund' | 'partial_refund' | 'no_refund') => void;
  onProposedDeductionChange: (value: string) => void;
  onSave: () => void;
}) {
  const equipment = equipmentOf(rental);

  return (
    <div className="owner-card" style={{ borderRight: '4px solid #E74C3C' }}>
      <div className="flex-between mb-4">
        <div>
          <span className="badge badge-disputed" style={{ marginLeft: 8 }}>{dispute.status === 'open' ? '🔴 مفتوح' : '🟡 قيد المراجعة'}</span>
          <strong style={{ fontSize: 14 }}>{equipment.name ?? UNKNOWN_EQUIPMENT} — #{rental?.orderNum ?? '—'}</strong>
        </div>
        <span className="text-muted" style={{ fontSize: 12 }}>{dispute.createdAt?.slice(0, 10) ?? '—'}</span>
      </div>
      <div style={{ backgroundColor: 'rgba(231,76,60,0.06)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>مطالبة المستأجر:</p>
        <p style={{ margin: '4px 0 0', fontSize: 13 }}>{dispute.details ?? '—'}</p>
        {dispute.tenantClaim ? <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--color-text-muted)' }}>{dispute.tenantClaim}</p> : null}
      </div>
      {dispute.ownerNotes ? (
        <div style={{ backgroundColor: 'rgba(45,90,39,0.06)', borderRadius: 8, padding: 12, marginBottom: 12 }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 600 }}>ردك السابق:</p>
          <p style={{ margin: '4px 0 0', fontSize: 13 }}>{dispute.ownerNotes}</p>
        </div>
      ) : null}
      {!dispute.ownerNotes && dispute.openedByRole !== 'owner' ? (
        <div className="owner-grid-2" style={{ gap: 12 }}>
          <textarea
            className="owner-input"
            placeholder="أضف ملاحظاتك ووجهة نظرك..."
            rows={3}
            value={isEditing ? disputeNotes : ''}
            onChange={(event) => { onStartEdit(); onNotesChange(event.target.value); }}
            style={{ width: '100%', resize: 'vertical', fontFamily: 'Cairo, sans-serif' }}
          />
          <div>
            <select className="owner-input w-full mb-2" value={ownerDecision} onChange={(event) => onOwnerDecisionChange(event.target.value as 'full_refund' | 'partial_refund' | 'no_refund')} style={{ width: '100%' }}>
              <option value="full_refund">استرداد كامل للتأمين</option>
              <option value="partial_refund">استرداد جزئي</option>
              <option value="no_refund">لا استرداد</option>
            </select>
            {ownerDecision === 'partial_refund' ? <input type="number" className="owner-input w-full mb-2" placeholder="مبلغ الخصم بالريال" value={proposedDeduction} onChange={(event) => onProposedDeductionChange(event.target.value)} style={{ width: '100%' }} /> : null}
            <button className="owner-btn owner-btn-primary w-full" style={{ width: '100%' }} onClick={onSave}>حفظ الرد</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function DisputeList({
  disputes,
  ownerRentals,
  editingDisputeId,
  disputeNotes,
  ownerDecision,
  proposedDeduction,
  setEditingDisputeId,
  setDisputeNotes,
  setOwnerDecision,
  setProposedDeduction,
  onSave,
}: {
  disputes: Dispute[];
  ownerRentals: RentalListItem[];
  editingDisputeId: string | null;
  disputeNotes: string;
  ownerDecision: 'full_refund' | 'partial_refund' | 'no_refund';
  proposedDeduction: string;
  setEditingDisputeId: (id: string) => void;
  setDisputeNotes: (value: string) => void;
  setOwnerDecision: (value: 'full_refund' | 'partial_refund' | 'no_refund') => void;
  setProposedDeduction: (value: string) => void;
  onSave: (id: string) => void;
}) {
  if (disputes.length === 0) {
    return <EmptyState icon="✅" title="لا توجد نزاعات مفتوحة" />;
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {disputes.map((dispute) => (
        <DisputeCard
          key={dispute.id}
          dispute={dispute}
          rental={ownerRentals.find((rental) => rental.id === dispute.rentalOpId)}
          isEditing={editingDisputeId === dispute.id}
          disputeNotes={disputeNotes}
          ownerDecision={ownerDecision}
          proposedDeduction={proposedDeduction}
          onStartEdit={() => setEditingDisputeId(dispute.id)}
          onNotesChange={setDisputeNotes}
          onOwnerDecisionChange={setOwnerDecision}
          onProposedDeductionChange={setProposedDeduction}
          onSave={() => onSave(dispute.id)}
        />
      ))}
    </div>
  );
}

