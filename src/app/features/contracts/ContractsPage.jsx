import { useMemo, useState } from "react";
import { useAuth } from "../../auth/AuthContext";
import {
  AppInput,
  EmptyState,
  FilterTabs,
  PageHeader,
} from "../../components/shared";
import { CONTRACTS } from "./contractTypes";
import { getContractConfig } from "./contractsConfig";
import { ContractsTable } from "./components/ContractsTable";
import { ContractDetailModal } from "./components/ContractDetailModal";
import { ownerContractRows } from "./contractsSeed";

function normalizeTenantContracts() {
  return CONTRACTS.map((item) => ({
    id: item.id,
    number: item.contractNum,
    partnerName: item.owner,
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
    status: "active",
    statusLabel: "نشط",
  }));
}

export default function ContractsPage({ contracts: contractsProp }) {
  const { user } = useAuth();
  const role = user?.type || "tenant";
  const config = getContractConfig(role);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState(config.tabs[0]);
  const [selectedContract, setSelectedContract] = useState(null);

  const contracts = useMemo(() => {
    if (Array.isArray(contractsProp)) return contractsProp;
    return role === "owner"
      ? normalizeOwnerContracts()
      : normalizeTenantContracts();
  }, [contractsProp, role]);

  const filtered = useMemo(() => {
    const allowedStatuses = config.statusesByTab[activeTab] || [];
    const lowered = search.trim();

    return contracts.filter((contract) => {
      const matchesTab =
        allowedStatuses.length === 0 ||
        allowedStatuses.includes(contract.status);
      const matchesSearch =
        lowered.length === 0 ||
        contract.number.includes(lowered) ||
        contract.partnerName.includes(lowered) ||
        contract.equipment.includes(lowered);
      return matchesTab && matchesSearch;
    });
  }, [activeTab, config.statusesByTab, contracts, search]);

  return (
    <div
      className="p-4 md:p-6 pb-24 md:pb-6"
      dir="rtl"
      style={{ fontFamily: "'Cairo', sans-serif" }}
    >
      <PageHeader
        title={config.pageTitle}
        description={`${contracts.length} عقد`}
        actions={
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder={config.searchPlaceholder}
            className="w-full md:w-80"
          />
        }
      />

      <FilterTabs
        tabs={config.tabs.map((tab) => ({
          id: tab,
          label: tab,
          count: contracts.filter((contract) => {
            const allowedStatuses = config.statusesByTab[tab] || [];
            return (
              allowedStatuses.length === 0 ||
              allowedStatuses.includes(contract.status)
            );
          }).length,
        }))}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {filtered.length > 0 ? (
        <ContractsTable
          contracts={filtered}
          config={config}
          onViewContract={setSelectedContract}
        />
      ) : (
        <EmptyState
          compact
          icon="📄"
          title="لا توجد عقود مطابقة"
          description="جرّب تعديل البحث أو اختيار تبويب مختلف."
        />
      )}

      <ContractDetailModal
        contract={selectedContract}
        config={config}
        onClose={() => setSelectedContract(null)}
      />
    </div>
  );
}
