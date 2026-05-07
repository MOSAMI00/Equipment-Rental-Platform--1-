import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency, type CompensationRequest, type CompensationStatus, type HandoverReport } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import { HandoverEvidenceForm } from './HandoverEvidenceForm';
import type { OwnerDecision } from './helpers';

function CompensationStatusBadge({ status }: { status: CompensationStatus }) {
  const meta: Record<CompensationStatus, { label: string; className: string }> = {
    none: { label: 'لا يوجد', className: 'badge' },
    requested: { label: 'بانتظار رد المستأجر', className: 'badge badge-pending' },
    accepted: { label: 'مقبول', className: 'badge badge-completed' },
    rejected: { label: 'مرفوض', className: 'badge badge-cancelled' },
    disputed: { label: 'تحول إلى نزاع', className: 'badge badge-disputed' },
  };

  return <span className={meta[status].className}>{meta[status].label}</span>;
}

export function ReturnReportCard({
  returnReport,
  selectedRental,
  compensationRequest,
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
  onRequestCompensation,
}: {
  returnReport?: HandoverReport;
  selectedRental: RentalListItem;
  compensationRequest?: CompensationRequest | null;
  evidence: string[];
  description: string;
  ownerDecision: OwnerDecision;
  proposedDeduction: string;
  setEvidence: (files: string[]) => void;
  setDescription: (value: string) => void;
  setOwnerDecision: (value: OwnerDecision) => void;
  setProposedDeduction: (value: string) => void;
  onConfirmReturn: () => void;
  onOpenDispute: () => void;
  onRequestCompensation: (amount: number, notes: string, photos: string[]) => void;
}) {
  const [showCompForm, setShowCompForm] = useState(false);
  const [compAmount, setCompAmount] = useState('');
  const [compNotes, setCompNotes] = useState('');
  const [compPhotos, setCompPhotos] = useState<string[]>([]);

  if (!returnReport) return null;

  return (
    <>
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
            <select className="owner-input" value={ownerDecision} onChange={(event) => setOwnerDecision(event.target.value as OwnerDecision)}>
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

      {returnReport.confirmedAt && !compensationRequest ? (
        <div className="owner-card mt-4" style={{ borderTop: '2px solid #f39c12' }}>
          <div className="flex-between mb-3">
            <h4 style={{ margin: 0 }}>💰 طلب تعويض</h4>
            {!showCompForm ? (
              <button className="owner-btn owner-btn-warning" type="button" onClick={() => setShowCompForm(true)}>
                طلب تعويض
              </button>
            ) : null}
          </div>

          {showCompForm ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <input
                type="number"
                className="owner-input"
                placeholder="المبلغ المطالب به (ر.ي)"
                value={compAmount}
                onChange={(event) => setCompAmount(event.target.value)}
              />
              <textarea
                className="owner-input"
                placeholder="ملاحظات وتفاصيل التعويض..."
                rows={3}
                value={compNotes}
                onChange={(event) => setCompNotes(event.target.value)}
              />
              <HandoverEvidenceForm
                evidence={compPhotos}
                description=""
                setEvidence={setCompPhotos}
                setDescription={() => {}}
                submitLabel="إرسال طلب التعويض"
                showDescription={false}
                onSubmit={() => {
                  const amount = Number(compAmount);
                  if (!amount || !compNotes.trim()) return;
                  onRequestCompensation(amount, compNotes.trim(), compPhotos);
                  setCompAmount('');
                  setCompNotes('');
                  setCompPhotos([]);
                  setShowCompForm(false);
                }}
              />
              <button className="owner-btn owner-btn-outline" type="button" onClick={() => setShowCompForm(false)}>
                إلغاء
              </button>
            </div>
          ) : (
            <p className="text-muted mb-0" style={{ fontSize: 13 }}>
              يمكنك إرسال مطالبة منفصلة بعد تأكيد استلام المعدة عند وجود تلفيات أو تكاليف إضافية.
            </p>
          )}
        </div>
      ) : null}

      {compensationRequest ? (
        <div className="owner-card mt-4">
          <h4 style={{ marginTop: 0 }}>💰 حالة طلب التعويض</h4>
          <p>المبلغ المطالب به: <strong>{formatCurrency(compensationRequest.requestedAmount)} ر.ي</strong></p>
          <p>الحالة: <CompensationStatusBadge status={compensationRequest.status} /></p>
          {compensationRequest.tenantResponse ? (
            <p className="text-muted" style={{ fontSize: 13 }}>رد المستأجر: {compensationRequest.tenantResponse}</p>
          ) : null}
        </div>
      ) : null}
    </>
  );
}
