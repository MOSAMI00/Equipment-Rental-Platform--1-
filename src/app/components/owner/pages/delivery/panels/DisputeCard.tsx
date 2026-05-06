import React from 'react';
import type { Dispute } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import { equipmentOf, UNKNOWN_EQUIPMENT, type OwnerDecision } from './helpers';

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
  ownerDecision: OwnerDecision;
  proposedDeduction: string;
  onStartEdit: () => void;
  onNotesChange: (value: string) => void;
  onOwnerDecisionChange: (value: OwnerDecision) => void;
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
            <select className="owner-input w-full mb-2" value={ownerDecision} onChange={(event) => onOwnerDecisionChange(event.target.value as OwnerDecision)} style={{ width: '100%' }}>
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
