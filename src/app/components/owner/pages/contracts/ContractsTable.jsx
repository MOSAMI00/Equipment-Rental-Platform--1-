import React from 'react';
import { Download, Eye } from 'lucide-react';
import { AppButton, DataTable } from '../../../shared';

const ContractsTable = ({ contracts, onViewContract }) => {
  const columns = [
    { key: 'number', header: 'رقم العقد', cell: (contract) => contract.number },
    { key: 'tenant', header: 'المستأجر', cell: (contract) => contract.tenant },
    { key: 'equipment', header: 'المعدة', cell: (contract) => contract.equipment },
    { key: 'createdAt', header: 'تاريخ الإنشاء', cell: (contract) => contract.createdAt },
    { key: 'total', header: 'المبلغ', cell: (contract) => contract.total },
    {
      key: 'actions',
      header: 'إجراء',
      cell: (contract) => (
        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
          <AppButton variant="outline" size="sm" onClick={() => onViewContract(contract)}><Eye size={16} /> عرض</AppButton>
          <AppButton variant="outline" size="sm"><Download size={16} /> تحميل</AppButton>
        </div>
      ),
    },
  ];

  return (
    <div className="owner-card mb-8">
      <DataTable
        columns={columns}
        data={contracts}
        getRowKey={(contract) => contract.id}
        emptyState={{ icon: '📄', title: 'لا توجد عقود مطابقة' }}
      />
    </div>
  );
};

export default ContractsTable;
