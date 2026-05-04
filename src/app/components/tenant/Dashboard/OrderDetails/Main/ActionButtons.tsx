import { FileText, Clock, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router';
import type { TenantRental } from '../../../../../data/mock-api';

interface ActionButtonsProps {
  rental: TenantRental;
  onOpenDispute: () => void;
}

export function ActionButtons({ rental, onOpenDispute }: ActionButtonsProps) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <h3 className="font-bold text-[#222222] mb-4">الإجراءات</h3>
      <div className="flex flex-wrap gap-3">
        <button onClick={() => navigate('/dashboard/contracts')} className="flex items-center gap-2 px-5 py-2.5 border border-[#2D5A27] text-[#2D5A27] rounded-xl text-sm font-semibold hover:bg-[#EAF3E9]">
          <FileText className="w-4 h-4" /> عرض العقد
        </button>
        <button onClick={() => navigate(`/dashboard/order/${rental.id}/delivery`)} className="flex items-center gap-2 px-5 py-2.5 border border-[#3498DB] text-[#3498DB] rounded-xl text-sm font-semibold hover:bg-[#EBF5FB]">
          <Clock className="w-4 h-4" /> التسليم والإرجاع
        </button>
        <button onClick={onOpenDispute} className="flex items-center gap-2 px-5 py-2.5 border border-[#E74C3C] text-[#E74C3C] rounded-xl text-sm font-semibold hover:bg-[#FDEDEC]">
          <AlertTriangle className="w-4 h-4" /> تقرير مشكلة
        </button>
      </div>
    </div>
  );
}
