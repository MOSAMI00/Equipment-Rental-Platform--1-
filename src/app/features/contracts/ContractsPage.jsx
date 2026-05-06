import { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import { AppInput, EmptyState, PageHeader } from '../../components/shared';
import { CONTRACTS } from '../../components/tenant/Dashboard/Contracts/ContractTypes';
import { contractRows } from '../../components/owner/pages/contracts/contractsData';
import { getContractConfig } from './contractsConfig';
import { ContractsTable } from './ContractsTable';

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
  return contractRows.map((item) => ({
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

      <div className="mb-4 flex flex-wrap gap-2">
        {config.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
              activeTab === tab ? 'bg-[#2D5A27] text-white' : 'bg-white border border-[#E0E0E0] text-[#222222]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {filtered.length > 0 ? (
        <ContractsTable contracts={filtered} config={config} />
      ) : (
        <EmptyState
          compact
          icon="📄"
          title="لا توجد عقود مطابقة"
          description="جرّب تعديل البحث أو اختيار تبويب مختلف."
        />
      )}
    </div>
  );
}
