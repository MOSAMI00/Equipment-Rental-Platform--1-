import React, { useMemo } from 'react';
import { DollarSign, TrendingUp } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import KPICard from '../../shared/KPICard';
import { KPICardSkeleton } from '../../shared/OwnerSkeletons';
import type { RentalListItem } from '../../../../types/owner';

interface EarningsKPISectionProps {
  rentals: RentalListItem[];
  isLoading?: boolean;
}

export function EarningsKPISection({ rentals, isLoading }: EarningsKPISectionProps) {
  const { thisMonth, total, pendingTransfer, transferred } = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let thisMonthCalc = 0;
    let totalCalc = 0;
    let pendingTransferCalc = 0;

    rentals.forEach((rental) => {
      const amount = rental.rentalAmount ?? 0;
      totalCalc += amount;

      if (rental.createdAt) {
        const created = new Date(rental.createdAt);
        if (created.getMonth() === currentMonth && created.getFullYear() === currentYear) {
          thisMonthCalc += amount;
        }
      }

      if (rental.paymentStatus === 'paid' && rental.escrowStatus === 'held') {
        pendingTransferCalc += amount;
      }
    });

    const transferredCalc = Math.max(0, totalCalc - pendingTransferCalc);

    return {
      thisMonth: thisMonthCalc,
      total: totalCalc,
      pendingTransfer: pendingTransferCalc,
      transferred: transferredCalc,
    };
  }, [rentals]);

  if (isLoading) {
    return (
      <div className="owner-grid-4">
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
        <KPICardSkeleton />
      </div>
    );
  }

  return (
    <div className="owner-grid-4">
      <KPICard
        title="💰 هذا الشهر"
        value={`${formatCurrency(thisMonth)} ر.ي`}
        icon={<DollarSign />}
        iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
      />
      <KPICard
        title="📊 الإجمالي"
        value={`${formatCurrency(total)} ر.ي`}
        icon={<TrendingUp />}
        iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
      />
      <KPICard
        title="⏳ قيد التحويل"
        value={`${formatCurrency(pendingTransfer)} ر.ي`}
        valueClassName="text-warning"
        icon={<DollarSign />}
        iconStyle={{ color: 'var(--color-pending)', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
      />
      <KPICard
        title="✅ محوّل"
        value={`${formatCurrency(transferred)} ر.ي`}
        valueClassName="text-success"
        icon={<DollarSign />}
        iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
      />
    </div>
  );
}
