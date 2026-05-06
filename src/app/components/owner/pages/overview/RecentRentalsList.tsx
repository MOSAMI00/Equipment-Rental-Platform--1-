import React, { useMemo } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { STATUS_CONFIG } from '../../../tenant/Dashboard/shared/OrderTypes';
import { formatCurrency } from '../../../../utils/formatters';
import EmptyState from '../../shared/EmptyState';
import type { RentalListItem } from '../../../../types/owner';

const getStatusConfig = (status: string | undefined) => STATUS_CONFIG[status as string] ?? { label: status ?? 'غير معروف', color: '#95A5A6' };
const fallbackEquipment = (rental: RentalListItem) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
const fallbackTenant = (rental: RentalListItem) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—', avatarUrl: '' };

interface RecentRentalsListProps {
  rentals: RentalListItem[];
  isLoading?: boolean;
}

export function RecentRentalsList({ rentals, isLoading }: RecentRentalsListProps) {
  const recentRentals = useMemo(() => {
    return rentals
      .slice()
      .sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime())
      .slice(0, 5);
  }, [rentals]);

  return (
    <div className="owner-card">
      <div className="flex-between mb-6">
        <h4 style={{ margin: 0 }}>آخر 5 طلبات واردة</h4>
        <button className="owner-btn owner-btn-outline" style={{ fontSize: 13 }}>عرض الكل</button>
      </div>
      <div className="owner-table-container">
        <table className="owner-table">
          <thead>
            <tr>
              <th>#</th>
              <th>المستأجر</th>
              <th>المعدة</th>
              <th>الفترة</th>
              <th>المبلغ</th>
              <th>الحالة</th>
              <th>الإجراء</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                  جاري تحميل الطلبات...
                </td>
              </tr>
            ) : recentRentals.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <EmptyState compact type="empty" title="لا توجد طلبات حتى الآن" />
                </td>
              </tr>
            ) : (
              recentRentals.map((rental) => {
                const equipmentSnapshot = fallbackEquipment(rental);
                const tenant = fallbackTenant(rental);
                const status = getStatusConfig(rental.status);
                return (
                  <tr key={rental.id}>
                    <td>{rental.orderNum ?? '—'}</td>
                    <td>
                      <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                        {tenant.avatarUrl ? (
                          <img src={tenant.avatarUrl} alt={tenant.name ?? ''} style={{ borderRadius: '50%', width: 28, height: 28 }} />
                        ) : (
                          <div className="flex-center" style={{ borderRadius: '50%', width: 28, height: 28, backgroundColor: 'var(--color-page-bg)', fontSize: 12 }}>
                            {(tenant.name ?? '?').charAt(0)}
                          </div>
                        )}
                        {tenant.name ?? '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}
                      </div>
                    </td>
                    <td>{equipmentSnapshot.name ?? '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629'}</td>
                    <td>{`${rental.startDate ?? '—'} - ${rental.endDate ?? '—'}`}</td>
                    <td>{formatCurrency(rental.totalAmount ?? 0)} ر.ي</td>
                    <td><span className={`badge badge-${(rental.status ?? 'unknown').replace('_', '-')}`}>{status.label ?? rental.status ?? '\u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}</span></td>
                    <td>
                      {rental.status === 'pending' ? (
                        <div className="flex-center gap-2">
                          <button className="owner-btn owner-btn-success" style={{ padding: '4px 10px', fontSize: 12 }}><CheckCircle size={14} /> قبول</button>
                          <button className="owner-btn owner-btn-danger" style={{ padding: '4px 10px', fontSize: 12 }}><XCircle size={14} /></button>
                        </div>
                      ) : (
                        <button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}><Eye size={14} /> عرض</button>
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
