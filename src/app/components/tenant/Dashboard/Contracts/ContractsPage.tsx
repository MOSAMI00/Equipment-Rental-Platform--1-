

// TODO: Delete this file after migrating to the new design in src/app/features/contracts/ContractsPage.jsx
import { useState } from 'react';
import { CONTRACTS } from './ContractTypes';
import { ContractTable } from './Main/ContractTable';
import { ContractCard } from './Main/ContractCards/ContractCard';
import { AppInput, EmptyState, PageHeader } from '../../../shared';

export function ContractsPage() {
  const [search, setSearch] = useState('');

  const filtered = CONTRACTS.filter(c =>
    c.contractNum.includes(search) ||
    c.owner.includes(search) ||
    c.equipment.includes(search)
  );

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title="العقود"
        description={`${CONTRACTS.length} عقد محفوظ`}
        actions={(
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث برقم العقد أو المؤجر أو المعدة..."
            className="w-full md:w-80"
          />
        )}
      />

      {/* Desktop Table */}
      <ContractTable contracts={filtered} />

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map(contract => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
        {filtered.length === 0 ? (
          <EmptyState
            compact
            icon="📄"
            title="لا توجد عقود مطابقة"
            description="جرّب تعديل البحث أو العودة لاحقًا عند توفر عقود جديدة."
          />
        ) : null}
      </div>
    </div>
  );
}
