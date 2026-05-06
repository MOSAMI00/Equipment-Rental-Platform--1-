import { Link } from 'react-router';
import { useAuth } from '../../../auth/AuthContext';
import {
  formatCurrency,
  formatRentalDateRange,
  getEquipmentSnapshot,
  useTenantRentals,
} from '../../../data/mock-api';
import OwnerInsurance from '../../owner/pages/insurance/Insurance';

export function InsuranceDashboardPage() {
  const { user } = useAuth();
  const tenantRentals = useTenantRentals();

  if (user?.type === 'owner') return <OwnerInsurance />;

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-3xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-2xl font-bold text-[#222222] mb-2">التأمينات والضمان</h2>
      <p className="text-sm text-[#888888] mb-6">
        ملخص مبالغ التأمين المرتبطة بطلباتك. يتم احتسابها ضمن إجمالي الطلب عند الدفع.
      </p>

      <div className="flex flex-col gap-3">
        {tenantRentals.map((rental) => {
          const equipment = getEquipmentSnapshot(rental.equipmentId);
          return (
            <div
              key={rental.id}
              className="bg-white rounded-2xl border border-[#E0E0E0] p-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-bold text-[#222222]">{equipment.name}</p>
                <p className="text-xs text-[#888888]">{rental.orderNum} · {formatRentalDateRange(rental.startDate, rental.endDate)}</p>
                <p className="text-xs text-[#888888] mt-1">المؤجر: {equipment.ownerName}</p>
              </div>
              <div className="flex flex-col items-start md:items-end gap-2">
                <div>
                  <span className="text-xs text-[#888888]">مبلغ التأمين </span>
                  <span className="font-bold text-[#2D5A27]">{formatCurrency(rental.insuranceAmount)} ر.ي</span>
                </div>
                <Link
                  to={`/dashboard/order/${rental.id}`}
                  className="text-xs font-bold text-[#2D5A27] hover:underline"
                >
                  عرض الطلب
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {tenantRentals.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-8 text-center text-[#888888] text-sm mt-4">
          لا توجد طلبات لعرض التأمين.
        </div>
      ) : null}
    </div>
  );
}
