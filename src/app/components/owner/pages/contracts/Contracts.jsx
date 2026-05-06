import React, { useMemo, useState } from 'react';
import ContractViewerModal from './ContractViewerModal';
import ContractsTable from './ContractsTable';
import ContractsToolbar from './ContractsToolbar';
import { contractRows } from './contractsData';

const Contracts = () => {
  const [selectedContract, setSelectedContract] = useState(null);
  const [search, setSearch] = useState('');

  const filteredContracts = useMemo(() => (
    contractRows.filter((contract) => (
      contract.number.includes(search)
      || contract.tenant.includes(search)
      || contract.equipment.includes(search)
    ))
  ), [search]);

  return (
    <div>
      <ContractsToolbar
        search={search}
        onSearchChange={setSearch}
      />

      <ContractsTable
        contracts={filteredContracts}
        onViewContract={setSelectedContract}
      />

      <ContractViewerModal
        contract={selectedContract}
        onClose={() => setSelectedContract(null)}
      />
    </div>
  );
};

export default Contracts;
