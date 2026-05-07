
// TODO: delete this file

import React, { useMemo } from 'react';
import { useAuth } from '../../auth/AuthContext';
import {
  formatCurrency,
  getEquipmentSnapshot,
  useRentalPlatform,
} from '../../data/mock-api';
import { DataTable, EmptyState, StatusBadge } from '../../components/shared';
import { INSURANCE_STATUS_META } from '../insurance/insuranceConfig';

export default function TenantInsuranceTab() {
  const { user } = useAuth();
  const { rentals } = useRentalPlatform();
  const userId = user?.id || 'tenant-1';

  const rows = useMemo(() => rentals
    .filter((rental) => rental.tenantId === userId)
    .map((rental) => {
      const equipment = getEquipmentSnapshot(rental.equipmentId);
      const status = rental.status === 'disputed' ? 'disputed' : rental.escrowStatus;

      return {
        id: rental.id,
        orderNum: rental.orderNum,
        equipment: equipment.name,
        amount: rental.insuranceAmount,
        status,
      };
    }), [rentals, userId]);

  const columns = [
    { key: 'orderNum', header: 'رقم العقد/الطلب', cell: (row) => row.orderNum },
    { key: 'equipment', header: 'المعدة', cell: (row) => row.equipment },
    { key: 'amount', header: 'مبلغ التأمين', cell: (row) => `${formatCurrency(row.amount)} ر.ي` },
    {
      key: 'status',
      header: 'الحالة',
      cell: (row) => <StatusBadge status={row.status} meta={INSURANCE_STATUS_META[row.status]} />,
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="m-0 text-lg font-bold text-[#222222]">التأمينات</h2>
        <p className="m-0 mt-1 text-sm text-[#888888]">
          عرض مبالغ التأمين المرتبطة بطلبات الإيجار وحالتها الحالية.
        </p>
      </div>

      {rows.length > 0 ? (
        <DataTable
          columns={columns}
          data={rows}
          getRowKey={(row) => row.id}
        />
      ) : (
        <EmptyState
          icon="🛡️"
          title="لا توجد تأمينات بعد"
          description="ستظهر هنا مبالغ التأمين عند إنشاء طلبات إيجار."
        />
      )}
    </div>
  );
}
