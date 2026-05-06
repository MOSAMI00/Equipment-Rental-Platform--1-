import React from 'react';
import type { Dispute } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import EmptyState from '../../../shared/EmptyState';
import { DisputeCard } from './DisputeCard';
import type { OwnerDecision } from './helpers';

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
  ownerDecision: OwnerDecision;
  proposedDeduction: string;
  setEditingDisputeId: (id: string) => void;
  setDisputeNotes: (value: string) => void;
  setOwnerDecision: (value: OwnerDecision) => void;
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
