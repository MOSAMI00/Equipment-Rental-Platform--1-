import { useState } from 'react';
import { ContractHeader } from './Main/ContractHeader';
import { ContractTable } from './Main/ContractTable';
import { ContractCard } from './Main/ContractCards/ContractCard';
import { useTenantPageProps } from '../../../../inertia/tenant-page-props';
import type { Contract } from './ContractTypes';
import type { TenantRental } from '../../../../data/mock-api';

export function ContractsPage() {
  const [search, setSearch] = useState('');
  const { rentals } = useTenantPageProps();

  const mappedContracts: Contract[] = rentals
    .filter((r: TenantRental) => ['confirmed', 'in_use', 'completed'].includes(r.status))
    .map((r: TenantRental) => ({
      id: r.id,
      contractNum: r.orderNum || '—',
      lessor: r.ownerId || '—', // Or owner name if populated
      equipment: (r as any).equipment?.name || `معدة #${r.equipmentId}`,
      date: new Date(r.createdAt).toLocaleDateString('ar-YE'),
      amount: String(r.rentalAmount),
      status: r.status === 'completed' ? 'completed' : r.status === 'confirmed' || r.status === 'in_use' ? 'active' : 'expired'
    }));

  const filtered = mappedContracts.filter(c =>
    c.contractNum.includes(search) ||
    c.lessor.includes(search) ||
    c.equipment.includes(search)
  );

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <ContractHeader 
        count={mappedContracts.length}
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
