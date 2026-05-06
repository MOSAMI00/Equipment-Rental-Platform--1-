import React, { useMemo } from 'react';
import { ClipboardList, DollarSign, Wrench, Star } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import KPICard from '../../shared/KPICard';
import { KPICardSkeleton } from '../../shared/OwnerSkeletons';
import type { RentalListItem, ReviewSummary } from '../../../../types/owner';

interface OverviewKPISectionProps {
  rentals: RentalListItem[];
  reviews: ReviewSummary[];
  monthEarnings: number;
  monthGrowth: number;
  isLoading?: boolean;
}

export function OverviewKPISection({ rentals, reviews, monthEarnings, monthGrowth, isLoading }: OverviewKPISectionProps) {
  const totalRating = useMemo(() => reviews.reduce((sum, item) => sum + (item.rating ?? 0), 0), [reviews]);
  const averageRating = reviews.length ? (totalRating / reviews.length).toFixed(1) : '0.0';

  const uniqueEquipments = useMemo(() => {
    const ids = new Set<string | number>();
    rentals.forEach(r => {
      if (r.equipment?.id) ids.add(r.equipment.id);
    });
    return ids.size;
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
        title="📋 الطلبات النشطة"
        value={`${rentals.filter((item) => ['pending', 'confirmed', 'in_use'].includes(item.status as string)).length} طلبات`}
        sub={<span className="text-success">▲ هذا الأسبوع</span>}
        icon={<ClipboardList />}
        iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
      />
      <KPICard
        title="💰 الأرباح هذا الشهر"
        value={`${formatCurrency(monthEarnings)} ر.ي`}
        sub={<span><span className="text-success">▲ {monthGrowth >= 0 ? `+${monthGrowth}%` : `${monthGrowth}%`}</span> مقارنة بالشهر الماضي</span>}
        icon={<DollarSign />}
        iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
      />
      <KPICard
        title="🔧 المعدات المتاحة"
        value={`${uniqueEquipments} / ${uniqueEquipments}`}
        sub={<span className="badge badge-available" style={{ fontSize: 11 }}>{uniqueEquipments} متاحة</span>}
        icon={<Wrench />}
      />
      <KPICard
        title="⭐ متوسط التقييم"
        value={`${averageRating} / 5`}
        sub={`${reviews.length} تقييم`}
        icon={<Star />}
        iconStyle={{ color: '#F39C12', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
      />
    </div>
  );
}
