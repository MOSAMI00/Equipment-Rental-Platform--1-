import { AppButton, DataTable, StatusBadge } from '../../components/shared';

export function ContractsTable({ contracts, config, onViewContract }) {
  // Contract actions are limited to read-only viewing; delivery/dispute actions live in their workflow pages.
  const columns = [
    { key: 'number', header: 'رقم العقد', cell: (contract) => contract.number },
    { key: 'partner', header: config.partnerColumnHeader, cell: (contract) => contract.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (contract) => contract.equipment },
    { key: 'amount', header: config.amountColumnHeader, cell: (contract) => contract.amount },
    {
      key: 'status',
      header: config.statusColumnHeader,
      cell: (contract) => <StatusBadge status={contract.status} label={contract.statusLabel} />,
    },
    {
      key: 'view',
      header: 'العقد',
      cell: (contract) => (
        <AppButton variant="outline" size="sm" onClick={() => onViewContract(contract)}>
          عرض العقد
        </AppButton>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={contracts}
      getRowKey={(contract) => contract.id}
    />
  );
}
