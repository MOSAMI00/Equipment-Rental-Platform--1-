import React, { useMemo } from 'react';
import { Download } from 'lucide-react';
import { formatCurrency } from '../../../../utils/formatters';
import EmptyState from '../../shared/EmptyState';
import type { RentalListItem } from '../../../../types/owner';

interface PaymentHistoryTableProps {
  rentals: RentalListItem[];
  isLoading?: boolean;
}

export function PaymentHistoryTable({ rentals, isLoading }: PaymentHistoryTableProps) {
  const paymentsRows = useMemo(() => {
    return rentals
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 8);
  }, [rentals]);

  return (
    <div className="owner-card">
      <div className="flex-between mb-6">
        <h4 style={{ margin: 0 }}>سجل المدفوعات</h4>
        <button className="owner-btn owner-btn-outline"><Download size={16} /> تحميل كشف</button>
      </div>
      <div className="owner-table-container">
        <table className="owner-table">
          <thead>
            <tr>
              <th>الطلب</th>
              <th>المستأجر</th>
              <th>مبلغ الإيجار</th>
              <th>عمولة المنصة</th>
              <th>صافي الأرباح</th>
              <th>حالة التحويل</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                  جاري تحميل السجل...
                </td>
              </tr>
            ) : paymentsRows.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <EmptyState compact type="empty" title="لا توجد مدفوعات حتى الآن" />
                </td>
              </tr>
            ) : (
              paymentsRows.map((rental) => {
                const amount = rental.rentalAmount ?? 0;
                const fee = Math.round(amount * 0.05);
                const net = amount - fee;
                const tenant = rental.tenant ?? { name: '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641' };
                return (
                  <tr key={rental.id}>
                    <td>{rental.orderNum ?? '—'}</td>
                    <td>{tenant.name ?? '—'}</td>
                    <td>{formatCurrency(amount)} ر.ي</td>
                    <td className="text-muted">{formatCurrency(fee)} ر.ي</td>
                    <td style={{ fontWeight: 700 }}>{formatCurrency(net)} ر.ي</td>
                    <td>
                      {rental.escrowStatus === 'released' ? (
                        <span style={{ color: 'var(--color-completed)', fontWeight: 600 }}>Paid ✅</span>
                      ) : rental.escrowStatus === 'held' ? (
                        <span style={{ color: 'var(--color-pending)', fontWeight: 600 }}>Processing ⏳</span>
                      ) : (
                        <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
