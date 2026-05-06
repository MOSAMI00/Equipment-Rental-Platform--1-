import { AppButton, DataTable, StatusBadge } from '../../components/shared';

export function ContractsTable({ contracts, config }) {
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
      key: 'actions',
      header: 'الإجراءات',
      cell: () => (
        <div className="flex flex-wrap items-center gap-2">
          {config.actions.canConfirmReceipt ? (
            <AppButton variant="outline" size="sm">
              {config.actionLabels.confirmReceipt}
            </AppButton>
          ) : null}
          {config.actions.canConfirmDelivery ? (
            <AppButton variant="outline" size="sm">
              {config.actionLabels.confirmDelivery}
            </AppButton>
          ) : null}
          {config.actions.canDispute ? (
            <AppButton variant="outline" size="sm" className="text-[#E67E22] border-[#E6B77D]">
              {config.actionLabels.dispute}
            </AppButton>
          ) : null}
        </div>
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
