import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { formatCurrency, type HandoverReport } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import { HandoverEvidenceForm } from './HandoverEvidenceForm';
import type { OwnerDecision } from './helpers';

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
  ownerDecision: OwnerDecision;
  proposedDeduction: string;
  setEvidence: (files: string[]) => void;
  setDescription: (value: string) => void;
  setOwnerDecision: (value: OwnerDecision) => void;
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
  );
}
