import { AppButton, StatusBadge } from '../../components/shared';

export function ContractsTable({ contracts, config }) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#E0E0E0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right text-sm" style={{ direction: 'rtl' }}>
          <thead>
            <tr className="border-b border-[#E0E0E0] bg-[#F4F6F9]">
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">رقم العقد</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">{config.partnerColumnHeader}</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">المعدة</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">{config.amountColumnHeader}</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">{config.statusColumnHeader}</th>
              <th className="px-4 py-3 text-xs font-bold uppercase text-[#888888]">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#E0E0E0]">
            {contracts.map((contract) => (
              <tr key={contract.id} className="transition-colors hover:bg-[#F4F6F9]">
                <td className="px-4 py-4 font-mono font-semibold text-[#222222]">{contract.number}</td>
                <td className="px-4 py-4 text-[#222222]">{contract.partnerName}</td>
                <td className="px-4 py-4 text-[#222222]">{contract.equipment}</td>
                <td className="px-4 py-4 font-semibold text-[#222222]">{contract.amount}</td>
                <td className="px-4 py-4">
                  <StatusBadge status={contract.status} label={contract.statusLabel} />
                </td>
                <td className="px-4 py-4">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
