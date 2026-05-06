import { useMemo, useState } from 'react';
import { FileText, Eye, Download } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import {
  AppButton,
  AppInput,
  DataTable,
  EmptyState,
  PageHeader,
  StatusBadge,
  type DataTableColumn,
} from '../../shared';
import { CONTRACTS, STATUS_CONFIG, type Contract } from '../../tenant/Dashboard/Contracts/ContractTypes';
import { contractRows } from '../../owner/pages/contracts/contractsData';
import ContractViewerModal from '../../owner/pages/contracts/ContractViewerModal';

export interface UnifiedContractRow {
  id: string;
  number: string;
  counterparty: string;
  equipment: string;
  dateLabel: string;
  amountLabel: string;
  status?: Contract['status'];
  ownerSource?: (typeof contractRows)[number];
}

function buildTenantRows(): UnifiedContractRow[] {
  return CONTRACTS.map((c) => ({
    id: c.id,
    number: c.contractNum,
    counterparty: c.lessor,
    equipment: c.equipment,
    dateLabel: c.date,
    amountLabel: `${c.amount} ر.ي`,
    status: c.status,
  }));
}

function buildOwnerRows(): UnifiedContractRow[] {
  return contractRows.map((c) => ({
    id: c.id,
    number: c.number,
    counterparty: c.tenant,
    equipment: c.equipment,
    dateLabel: c.createdAt,
    amountLabel: c.total,
    status: 'active',
    ownerSource: c,
  }));
}

export function UnifiedContractsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [selectedOwnerContract, setSelectedOwnerContract] = useState<(typeof contractRows)[number] | null>(null);

  const isOwner = user?.type === 'owner';
  const counterpartyHeader = isOwner ? 'المستأجر' : 'المؤجر';

  const rows = useMemo(() => (isOwner ? buildOwnerRows() : buildTenantRows()), [isOwner]);

  const filtered = useMemo(() => {
    const q = search.trim();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        r.number.includes(q)
        || r.counterparty.includes(q)
        || r.equipment.includes(q),
    );
  }, [rows, search]);

  const columns: DataTableColumn<UnifiedContractRow>[] = useMemo(() => {
    const base: DataTableColumn<UnifiedContractRow>[] = [
      {
        key: 'number',
        header: 'رقم العقد',
        cell: (r) => (
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#EAF3E9]">
              <FileText className="h-4 w-4 text-[#2D5A27]" />
            </div>
            <span className="font-mono text-sm font-semibold text-[#222222]">{r.number}</span>
          </div>
        ),
      },
      { key: 'counterparty', header: counterpartyHeader, cell: (r) => r.counterparty },
      { key: 'equipment', header: 'المعدة', cell: (r) => r.equipment },
      { key: 'dateLabel', header: isOwner ? 'تاريخ الإنشاء' : 'التاريخ', cell: (r) => <span className="text-[#888888]">{r.dateLabel}</span> },
      { key: 'amountLabel', header: 'المبلغ', cell: (r) => <span className="font-semibold text-[#222222]">{r.amountLabel}</span> },
    ];

    if (!isOwner) {
      base.push({
        key: 'status',
        header: 'الحالة',
        cell: (r) => (r.status ? <StatusBadge status={r.status} /> : null),
      });
    }

    base.push({
      key: 'actions',
      header: 'الإجراء',
      cell: (r) => (
        <div className="flex items-center gap-2">
          <AppButton
            variant="outline"
            size="sm"
            className="border-[#2D5A27] text-[#2D5A27]"
            onClick={() => {
              if (isOwner && r.ownerSource) setSelectedOwnerContract(r.ownerSource);
            }}
          >
            <Eye className="h-3.5 w-3.5" />
            عرض
          </AppButton>
          <AppButton variant="outline" size="sm" className="text-[#888888]">
            <Download className="h-3.5 w-3.5" />
            تحميل
          </AppButton>
        </div>
      ),
    });

    return base;
  }, [counterpartyHeader, isOwner]);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title="العقود"
        description={`${rows.length} عقد محفوظ`}
        actions={(
          <AppInput
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`بحث برقم العقد أو ${counterpartyHeader} أو المعدة...`}
            className="w-full md:w-80"
          />
        )}
      />

      <DataTable
        className="hidden md:block"
        columns={columns}
        data={filtered}
        getRowKey={(r) => r.id}
        emptyState={{
          icon: '📄',
          title: 'لا توجد عقود مطابقة',
          description: 'جرّب تعديل البحث أو العودة لاحقًا عند توفر عقود جديدة.',
        }}
      />

      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((r) => {
          const st = r.status ? STATUS_CONFIG[r.status] : null;
          return (
            <div key={r.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF3E9] flex items-center justify-center">
                    <FileText className="w-5 h-5 text-[#2D5A27]" />
                  </div>
                  <div>
                    <p className="font-mono font-bold text-[#222222]">{r.number}</p>
                    <p className="text-xs text-[#888888]">{r.dateLabel}</p>
                  </div>
                </div>
                {st ? (
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, backgroundColor: st.bg }}>
                    {st.label}
                  </span>
                ) : null}
              </div>
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="p-2 bg-[#F4F6F9] rounded-lg">
                  <p className="text-[10px] text-[#888888]">{counterpartyHeader}</p>
                  <p className="text-sm font-medium text-[#222222]">{r.counterparty}</p>
                </div>
                <div className="p-2 bg-[#F4F6F9] rounded-lg">
                  <p className="text-[10px] text-[#888888]">المعدة</p>
                  <p className="text-sm font-medium text-[#222222]">{r.equipment}</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2D5A27]">{r.amountLabel}</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2D5A27] text-[#2D5A27] text-xs font-semibold hover:bg-[#EAF3E9]"
                    onClick={() => {
                      if (isOwner && r.ownerSource) setSelectedOwnerContract(r.ownerSource);
                    }}
                  >
                    <Eye className="w-3.5 h-3.5" /> عرض
                  </button>
                  <button type="button" className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E0E0E0] text-[#888888] text-xs font-semibold">
                    <Download className="w-3.5 h-3.5" /> تحميل
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        {filtered.length === 0 ? (
          <EmptyState
            compact
            icon="📄"
            title="لا توجد عقود مطابقة"
            description="جرّب تعديل البحث أو العودة لاحقًا عند توفر عقود جديدة."
          />
        ) : null}
      </div>

      {isOwner ? (
        <ContractViewerModal contract={selectedOwnerContract} onClose={() => setSelectedOwnerContract(null)} />
      ) : null}
    </div>
  );
}
