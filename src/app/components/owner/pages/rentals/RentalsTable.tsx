import React from 'react';
import { Eye } from 'lucide-react';
import { STATUS_CONFIG } from '../../../tenant/Dashboard/shared/OrderTypes';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import EmptyState from '../../shared/EmptyState';
import type { RentalListItem } from '../../../../types/owner';

const getStatusConfig = (status: string | undefined) => STATUS_CONFIG[status as string] ?? { label: status ?? 'غير معروف' };
const fallbackEquipment = (rental: RentalListItem) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
const fallbackTenant = (rental: RentalListItem) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—' };

interface RentalsTableProps {
  filteredRentals: RentalListItem[];
  isLoading?: boolean;
  selectedRentalId: string | number | null;
  setSelectedRentalId: (id: string | number | null) => void;
}

export function RentalsTable({ filteredRentals, isLoading, selectedRentalId, setSelectedRentalId }: RentalsTableProps) {
  return (
    <table className="owner-table">
      <thead>
        <tr>
          <th>#</th>
          <th>المستأجر</th>
          <th>المعدة</th>
          <th>الفترة</th>
          <th>الإجمالي</th>
          <th>الحالة</th>
          <th>إجراء</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
              جاري تحميل العمليات...
            </td>
          </tr>
        ) : filteredRentals.length === 0 ? (
          <tr>
            <td colSpan={7} style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
              <EmptyState
                icon="📄"
                title="لا توجد عمليات مطابقة"
                description="جرّب تغيير البحث أو تبويب الحالة."
              />
            </td>
          </tr>
        ) : (
          filteredRentals.map((rental) => {
            const eq = fallbackEquipment(rental);
            const tenant = fallbackTenant(rental);
            const status = getStatusConfig(rental.status);
            return (
              <tr key={rental.id} style={{ cursor: 'pointer', backgroundColor: selectedRentalId === rental.id ? 'rgba(45,90,39,0.04)' : '' }}>
                <td>{rental.orderNum ?? '—'}</td>
                <td>{tenant.name ?? '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}</td>
                <td>{eq.name ?? '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629'}</td>
                <td style={{ fontSize: 12 }}>{formatRentalDateRange(rental.startDate ?? '', rental.endDate ?? '')}</td>
                <td>{formatCurrency(rental.totalAmount ?? 0)} ر.ي</td>
                <td>
                  <span className={`badge badge-${(rental.status ?? 'unknown').replace('_', '-')}`}>
                    {status.label ?? rental.status ?? '\u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}
                  </span>
                </td>
                <td>
                  <button
                    className="owner-btn owner-btn-outline"
                    style={{ padding: '4px 10px', fontSize: 12 }}
                    onClick={() => setSelectedRentalId(selectedRentalId === rental.id ? null : rental.id)}
                  >
                    <Eye size={14} /> عرض
                  </button>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
