import React, { useState } from 'react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EmptyState from '../shared/EmptyState';
import { ContractsTable } from './contracts/ContractsTable';
import { ContractsToolbar } from './contracts/ContractsToolbar';
import { ContractViewerModal } from './contracts/ContractViewerModal';

export default function Contracts() {
  const { rentals, isLoading } = useOwnerPageProps();
  const [search, setSearch] = useState('');
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null);

  const contracts = rentals.filter(r =>
    ['confirmed', 'in_use', 'completed'].includes(r.status)
  );

  const filteredContracts = contracts.filter(c =>
    (c.orderNum?.includes(search) || c.tenant?.name?.includes(search) || c.equipment?.name?.includes(search))
  );

  const selectedContract = contracts.find(c => c.id === selectedContractId);

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>العقود الإلكترونية</h2>
        <ContractsToolbar search={search} setSearch={setSearch} />
      </div>

      {isLoading ? (
        <div className="owner-card mb-8 p-8 text-center text-muted">
          جاري تحميل العقود...
        </div>
      ) : filteredContracts.length === 0 ? (
        <EmptyState type="empty" title="لا توجد عقود بعد" />
      ) : (
        <div className="owner-card mb-8">
          <ContractsTable
            contracts={filteredContracts}
            onView={(id) => setSelectedContractId(id)}
          />
        </div>
      )}

      {selectedContract && (
        <ContractViewerModal
          contract={selectedContract}
          onClose={() => setSelectedContractId(null)}
        />
      )}
    </div>
  );
}
