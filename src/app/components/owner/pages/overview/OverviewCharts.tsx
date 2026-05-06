import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ChartSkeleton } from '../../shared/OwnerSkeletons';
import type { RentalListItem } from '../../../../types/owner';

const ORDER_COLORS: Record<string, string> = {
  pending: '#F39C12',
  confirmed: '#3498DB',
  in_use: '#E67E22',
  completed: '#27AE60',
  cancelled: '#95A5A6',
  disputed: '#E74C3C',
};

const dataOrdersLabels: Record<string, string> = {
  pending: 'بانتظار',
  confirmed: 'مؤكد',
  in_use: 'قيد الاستخدام',
  completed: 'مكتمل',
  cancelled: 'ملغي',
  disputed: 'نزاع',
};

interface OverviewChartsProps {
  rentals: RentalListItem[];
  dataEarnings: Array<{ name: string; amount: number }>;
  isLoading?: boolean;
}

export function OverviewCharts({ rentals, dataEarnings, isLoading }: OverviewChartsProps) {
  const dataOrders = useMemo(() => {
    const counters = rentals.reduce<Record<string, number>>((acc, rental) => {
      const key = rental.status as string;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    }, {});
    return Object.keys(counters).map((status) => ({
      name: status,
      value: counters[status],
      color: ORDER_COLORS[status] ?? '#95A5A6',
    }));
  }, [rentals]);

  return (
    <div className="owner-grid-2">
      {/* Bar Chart */}
      {isLoading ? <ChartSkeleton height={280} /> : (
        <div className="owner-card">
          <h4 className="mb-6">📊 الأرباح — آخر 6 أشهر</h4>
          <div style={{ width: '100%', height: 280 }}>
            <ResponsiveContainer>
              <BarChart data={dataEarnings}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ر.ي`} />
                <Bar dataKey="amount" fill="#2D5A27" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Donut Chart — Order Statuses */}
      {isLoading ? <ChartSkeleton height={220} /> : (
        <div className="owner-card">
          <h4 className="mb-6">📈 توزيع حالات الطلبات</h4>
          <div style={{ width: '100%', height: 220, display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={dataOrders} innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                  {dataOrders.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} طلب`, dataOrdersLabels[n as string] || n]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex-center gap-4 mt-2 w-full" style={{ flexWrap: 'wrap' }}>
            {dataOrders.map(item => (
              <div key={item.name} className="flex-center gap-2">
                <div style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: item.color }}></div>
                <span className="text-muted" style={{ fontSize: 12 }}>{dataOrdersLabels[item.name]}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
