import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AppInput, EmptyState, FilterTabs, PageHeader } from '../../components/shared';
import { CONTRACTS } from '../../components/tenant/Dashboard/Contracts/ContractTypes';
import { getContractConfig } from './contractsConfig';
import { ContractsTable } from './ContractsTable';
import { ownerContractRows } from './contractsSeed';

function normalizeTenantContracts() {
  return CONTRACTS.map((item) => ({
    id: item.id,
    number: item.contractNum,
    partnerName: item.lessor,
    equipment: item.equipment,
    amount: `${item.amount} ر.ي`,
    status: item.status,
    statusLabel: undefined,
  }));
}

function normalizeOwnerContracts() {
  return ownerContractRows.map((item) => ({
    id: item.id,
    number: item.number,
    partnerName: item.tenant,
    equipment: item.equipment,
    amount: item.total,
    // owner sample data has no status yet, so we keep it active.
    status: 'active',
    statusLabel: 'نشط',
  }));
}

export default function ContractsPage({ contracts: contractsProp }) {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getContractConfig(role);
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState(config.tabs[0]);
  const [selectedContract, setSelectedContract] = useState(null);

  const contracts = useMemo(() => {
    if (Array.isArray(contractsProp)) return contractsProp;
    return role === 'owner' ? normalizeOwnerContracts() : normalizeTenantContracts();
  }, [contractsProp, role]);

  const filtered = useMemo(() => {
    const allowedStatuses = config.statusesByTab[activeTab] || [];
    const lowered = search.trim();

    return contracts.filter((contract) => {
      const matchesTab = allowedStatuses.length === 0 || allowedStatuses.includes(contract.status);
      const matchesSearch =
        lowered.length === 0 ||
        contract.number.includes(lowered) ||
        contract.partnerName.includes(lowered) ||
        contract.equipment.includes(lowered);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, config.statusesByTab, contracts, search]);

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={`${contracts.length} عقد`}
        actions={(
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={config.searchPlaceholder}
            className="w-full md:w-80"
          />
        )}
      />

      <FilterTabs
        tabs={config.tabs.map((tab) => ({
          id: tab,
          label: tab,
          count: contracts.filter((contract) => {
            const allowedStatuses = config.statusesByTab[tab] || [];
            return allowedStatuses.length === 0 || allowedStatuses.includes(contract.status);
          }).length,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {filtered.length > 0 ? (
        <ContractsTable contracts={filtered} config={config} onViewContract={setSelectedContract} />
      ) : (
        <EmptyState
          compact
          icon="📄"
          title="لا توجد عقود مطابقة"
          description="جرّب تعديل البحث أو اختيار تبويب مختلف."
        />
      )}

      {selectedContract ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="m-0 text-xl font-bold text-[#222222]">عقد التأجير</h2>
                <p className="m-0 mt-1 text-sm text-[#888888]">{selectedContract.number}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedContract(null)}
                className="rounded-full border border-[#E0E0E0] px-3 py-1 text-sm font-bold text-[#555555] hover:bg-[#F4F6F9]"
              >
                إغلاق
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">{config.partnerColumnHeader}</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">{selectedContract.partnerName}</p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">المعدة</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">{selectedContract.equipment}</p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">{config.amountColumnHeader}</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">{selectedContract.amount}</p>
              </div>
              <div className="rounded-xl bg-[#F8FAFC] p-4">
                <p className="m-0 text-[#888888]">{config.statusColumnHeader}</p>
                <p className="m-0 mt-1 font-bold text-[#222222]">{selectedContract.statusLabel || selectedContract.status}</p>
              </div>
            </div>

            <div className="mt-5 rounded-xl border border-[#E0E0E0] bg-white p-4 text-sm leading-7 text-[#555555]">
              هذه معاينة قراءة فقط لبيانات العقد الحالية. إجراءات التسليم والإرجاع والنزاعات تبقى داخل صفحات workflow الخاصة بها.
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
