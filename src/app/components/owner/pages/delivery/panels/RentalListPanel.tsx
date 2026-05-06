import React from 'react';
import { formatRentalDateRange, type HandoverReport } from '../../../../../data/mock-api';
import type { RentalListItem } from '../../../../../types/owner';
import EmptyState from '../../../shared/EmptyState';
import { equipmentOf, statusConfig, tenantOf, UNKNOWN_EQUIPMENT, UNKNOWN_STATUS, UNKNOWN_USER } from './helpers';

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
