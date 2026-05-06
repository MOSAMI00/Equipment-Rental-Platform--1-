import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartSkeleton } from '../../shared/OwnerSkeletons';
import type { RentalListItem } from '../../../../types/owner';

interface EarningsChartProps {
  rentals: RentalListItem[];
  isLoading?: boolean;
}

export function EarningsChart({ rentals, isLoading }: EarningsChartProps) {
  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = rentals
        .filter((rental) => {
          if (!rental.createdAt) return false;
          const created = new Date(rental.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, rental) => total + (rental.rentalAmount ?? 0), 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [rentals]);

  if (isLoading) {
    return <ChartSkeleton height={220} />;
  }

  return (
    <div className="owner-card">
      <h4 className="mb-6">📊 الأرباح — آخر 12 شهراً</h4>
      <div style={{ width: '100%', height: 220 }}>
        <ResponsiveContainer>
          <BarChart data={dataEarnings}>
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 10 }} />
            <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ر.ي`} />
            <Bar dataKey="amount" fill="#2D5A27" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
