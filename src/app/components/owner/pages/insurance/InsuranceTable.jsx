import React from 'react';
import { Eye, Shield } from 'lucide-react';
import { AppButton, DataTable, StatusBadge } from '../../../shared';

const InsuranceTable = ({ rows, onOpenClaim }) => {
  const columns = [
    { key: 'order', header: 'الطلب', cell: (row) => row.order },
    { key: 'tenant', header: 'المستأجر', cell: (row) => row.tenant },
    { key: 'amount', header: 'مبلغ التأمين', cell: (row) => row.amount },
    {
      key: 'status',
      header: 'الحالة',
      cell: (row) => <StatusBadge status={row.status} label={row.statusLabel} meta={row.statusMeta} />,
    },
    {
      key: 'deduction',
      header: 'خصم مطلوب',
      cell: (row) => (
        <span className={row.isDeductionHighlighted ? '' : 'text-muted'} style={row.isDeductionHighlighted ? { fontWeight: 700, color: 'var(--color-disputed)' } : undefined}>
          {row.deduction}
        </span>
      ),
    },
    {
      key: 'action',
      header: 'إجراء',
      cell: (row) => {
        if (row.action === 'details') {
          return <AppButton variant="outline" size="sm"><Eye size={14} /> تفاصيل</AppButton>;
        }

        if (row.action === 'claim') {
          return <AppButton variant="outline" size="sm" onClick={() => onOpenClaim(row)}><Shield size={14} /> مطالبة</AppButton>;
        }

        return '—';
      },
    },
  ];

  return (
    <div className="owner-card">
      <h4 className="mb-6">جدول التأمينات</h4>
      <DataTable
        columns={columns}
        data={rows}
        getRowKey={(row) => row.id}
        emptyState={{ icon: '🛡️', title: 'لا توجد تأمينات حالياً' }}
      />
    </div>
  );
};

export default InsuranceTable;
