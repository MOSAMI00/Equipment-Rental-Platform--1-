import { useState } from 'react';
import { CONTRACTS } from './ContractTypes';
import { ContractHeader } from './ContractHeader';
import { ContractTable } from './ContractTable';
import { ContractCard } from './ContractCard';

export function ContractsPage() {
  const [search, setSearch] = useState('');

  const filtered = CONTRACTS.filter(c =>
    c.contractNum.includes(search) ||
    c.lessor.includes(search) ||
    c.equipment.includes(search)
  );

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <ContractHeader 
        count={CONTRACTS.length} 
        search={search} 
        onSearchChange={setSearch} 
      />

      {/* Desktop Table */}
      <ContractTable contracts={filtered} />

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map(contract => (
          <ContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </div>
  );
}
