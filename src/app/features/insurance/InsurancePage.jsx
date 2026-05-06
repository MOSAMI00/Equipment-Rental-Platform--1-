import React, { useMemo, useState } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  formatCurrency,
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
} from '../../data/mock-api';
import {
  AppInput,
  DataTable,
  EmptyState,
  FilterTabs,
  PageHeader,
  StatusBadge,
} from '../../components/shared';
import { getInsuranceConfig, INSURANCE_STATUS_META } from './insuranceConfig';

function normalizeInsuranceRows({ rentals, role, userId }) {
  return rentals
    .filter((rental) => {
      if (role === 'owner') return rental.ownerId === userId;
      return rental.tenantId === userId;
    })
    .map((rental) => {
      const equipment = getEquipmentSnapshot(rental.equipmentId);
      const tenant = getTenantProfile(rental.tenantId);
      const status = rental.status === 'disputed' ? 'disputed' : rental.escrowStatus;
      return {
        id: rental.id,
        orderNum: rental.orderNum,
        equipment: equipment.name,
        partnerName: role === 'owner' ? tenant.name : equipment.ownerName,
        amount: rental.insuranceAmount,
        deduction: status === 'disputed' ? 'قيد المراجعة' : 'لا',
        status,
      };
    });
}

export default function InsurancePage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getInsuranceConfig(role);
  const { rentals } = useRentalPlatform();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');

  const rows = useMemo(() => normalizeInsuranceRows({
    rentals,
    role,
    userId: user?.id,
  }), [rentals, role, user?.id]);

  const filteredRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows
      .filter((row) => activeTab === 'all' || row.status === activeTab)
      .filter((row) => (
        term.length === 0 ||
        row.orderNum.toLowerCase().includes(term) ||
        row.partnerName.toLowerCase().includes(term) ||
        row.equipment.toLowerCase().includes(term)
      ));
  }, [activeTab, rows, search]);

  const tabs = config.tabs.map((tab) => ({
    ...tab,
    count: tab.id === 'all' ? rows.length : rows.filter((row) => row.status === tab.id).length,
  }));

  const columns = [
    { key: 'orderNum', header: 'الطلب', cell: (row) => row.orderNum },
    { key: 'partnerName', header: config.partnerColumnHeader, cell: (row) => row.partnerName },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: config.amountColumnHeader, cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    {
      key: 'status',
      header: 'حالة الضمان',
      cell: (row) => <StatusBadge status={row.status} meta={INSURANCE_STATUS_META[row.status]} />,
    },
    { key: 'deduction', header: config.deductionColumnHeader, cell: (row) => row.deduction },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <PageHeader
        title={config.pageTitle}
        description={config.description}
        actions={(
          <AppInput
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="بحث بالطلب أو الطرف أو المعدة..."
            className="w-full md:w-80"
          />
        )}
      />

      <FilterTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      {filteredRows.length > 0 ? (
        <DataTable
          columns={columns}
          data={filteredRows}
          getRowKey={(row) => row.id}
        />
      ) : (
        <EmptyState
          icon="🛡️"
          title={config.emptyTitle}
          description={config.emptyDescription}
        />
      )}
    </div>
  );
}
