import { FileText, Eye, Download } from 'lucide-react';
import { AppButton, DataTable, StatusBadge, type DataTableColumn } from '../../../../shared';
import { Contract } from '../ContractTypes';

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  const columns: DataTableColumn<Contract>[] = [
    {
      key: 'contractNum',
      header: 'رقم العقد',
      cell: (contract) => (
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF3E9]">
            <FileText className="h-4 w-4 text-[#2D5A27]" />
          </div>
          <span className="font-mono text-sm font-semibold text-[#222222]">{contract.contractNum}</span>
        </div>
      ),
    },
    { key: 'lessor', header: 'المؤجر', cell: (contract) => contract.lessor },
    { key: 'equipment', header: 'المعدة', cell: (contract) => contract.equipment },
    { key: 'date', header: 'التاريخ', cell: (contract) => <span className="text-[#888888]">{contract.date}</span> },
    { key: 'amount', header: 'المبلغ', cell: (contract) => <span className="font-semibold text-[#222222]">{contract.amount} ر.ي</span> },
    { key: 'status', header: 'الحالة', cell: (contract) => <StatusBadge status={contract.status} /> },
    {
      key: 'actions',
      header: 'الإجراء',
      cell: () => (
        <div className="flex items-center gap-2">
          <AppButton variant="outline" size="sm" className="border-[#2D5A27] text-[#2D5A27]">
            <Eye className="h-3.5 w-3.5" />
            عرض
          </AppButton>
          <AppButton variant="outline" size="sm" className="text-[#888888]">
            <Download className="h-3.5 w-3.5" />
            تحميل
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      className="hidden md:block"
      columns={columns}
      data={contracts}
      getRowKey={(contract) => contract.id}
      emptyState={{
        icon: '📄',
        title: 'لا توجد عقود مطابقة',
        description: 'جرّب تعديل البحث أو العودة لاحقًا عند توفر عقود جديدة.',
      }}
    />
  );
}
