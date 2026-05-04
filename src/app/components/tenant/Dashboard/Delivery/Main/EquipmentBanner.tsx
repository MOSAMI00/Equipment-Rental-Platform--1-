import { STATUS_CONFIG } from '../../shared/OrderTypes';
import { getEquipmentSnapshot, type TenantRental } from '../../../../../data/mock-api';

export function EquipmentBanner({ rental }: { rental: TenantRental }) {
  const equipment = getEquipmentSnapshot(rental.equipmentId);
  const status = STATUS_CONFIG[rental.status];

  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 mb-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] overflow-hidden flex-shrink-0">
        <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="font-bold text-[#222222]">{equipment.name}</p>
        <p className="text-sm text-[#888888]">#{rental.orderNum} · {equipment.ownerName}</p>
      </div>
      <div className="mr-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: status.color, backgroundColor: status.bg }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
