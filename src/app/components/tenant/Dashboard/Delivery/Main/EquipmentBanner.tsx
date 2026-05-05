import { STATUS_CONFIG } from '../../shared/OrderTypes';
import { getEquipmentSnapshot, type TenantRental } from '../../../../../data/mock-api';

export function EquipmentBanner({ rental, isActive }: { rental: TenantRental; isActive?: boolean }) {
  const equipment = getEquipmentSnapshot(rental.equipmentId);
  const status = STATUS_CONFIG[rental.status];

  return (
    <div 
      className={`bg-white rounded-2xl border p-4 flex items-center gap-4 transition-all duration-300 cursor-pointer ${
        isActive 
          ? 'border-[#2D5A27] ring-1 ring-[#2D5A27]/20 shadow-md translate-x-1' 
          : 'border-[#E0E0E0] hover:border-[#CCCCCC]'
      }`}
    >
      <div className="w-14 h-14 rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] overflow-hidden flex-shrink-0">
        <img src={equipment.image} alt={equipment.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex-1">
        <p className="font-bold text-[#222222] line-clamp-1">{equipment.name}</p>
        <p className="text-sm text-[#888888]">#{rental.orderNum} · {equipment.ownerName}</p>
      </div>
      <div className="mr-auto text-left">
        <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style={{ color: status.color, backgroundColor: status.bg }}>
          {status.label}
        </span>
      </div>
    </div>
  );
}
