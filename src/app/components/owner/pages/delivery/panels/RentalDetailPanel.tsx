import React from 'react';
import { Package } from 'lucide-react';
import { formatCurrency, formatRentalDateRange, type CompensationRequest, type HandoverReport } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import EmptyState from '../../../shared/EmptyState';
import { DeliveryLifecycleCard } from './DeliveryLifecycleCard';
import { HandoverEvidenceForm } from './HandoverEvidenceForm';
import { ReturnReportCard } from './ReturnReportCard';
import { equipmentOf, tenantOf, UNKNOWN_EQUIPMENT, UNKNOWN_USER, type OwnerDecision } from './helpers';

export function RentalDetailPanel(props: {
  selectedRental?: RentalListItem | null;
  ownerDeliveryReport?: HandoverReport;
  tenantDeliveryReport?: HandoverReport;
  returnReport?: HandoverReport;
  compensationRequest?: CompensationRequest | null;
  deliveryEvidence: string[];
  returnEvidence: string[];
  deliveryExtraDescription: string;
  returnExtraDescription: string;
  ownerDecision: OwnerDecision;
  proposedDeduction: string;
  setDeliveryEvidence: (files: string[]) => void;
  setReturnEvidence: (files: string[]) => void;
  setDeliveryExtraDescription: (value: string) => void;
  setReturnExtraDescription: (value: string) => void;
  setOwnerDecision: (value: OwnerDecision) => void;
  setProposedDeduction: (value: string) => void;
  onConfirmDelivery: () => void;
  onConfirmReturn: () => void;
  onOpenDispute: () => void;
  onRequestCompensation: (amount: number, notes: string, photos: string[]) => void;
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
        compensationRequest={props.compensationRequest}
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
        onRequestCompensation={props.onRequestCompensation}
      />
      {!props.ownerDeliveryReport && !props.returnReport ? <EmptyState compact icon="📦" title="بانتظار بدء عملية التسليم" /> : null}
    </div>
  );
}
