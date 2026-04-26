import { FileText, Eye, Download } from 'lucide-react';
import { Contract, STATUS_CONFIG } from './ContractTypes';

interface ContractCardProps {
  contract: Contract;
}

export function ContractCard({ contract }: ContractCardProps) {
  const st = STATUS_CONFIG[contract.status];
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-[#EAF3E9] flex items-center justify-center">
            <FileText className="w-5 h-5 text-[#2D5A27]" />
          </div>
          <div>
            <p className="font-mono font-bold text-[#222222]">{contract.contractNum}</p>
            <p className="text-xs text-[#888888]">{contract.date}</p>
          </div>
        </div>
        <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, backgroundColor: st.bg }}>
          {st.label}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="p-2 bg-[#F4F6F9] rounded-lg">
          <p className="text-[10px] text-[#888888]">المؤجر</p>
          <p className="text-sm font-medium text-[#222222]">{contract.lessor}</p>
        </div>
        <div className="p-2 bg-[#F4F6F9] rounded-lg">
          <p className="text-[10px] text-[#888888]">المعدة</p>
          <p className="text-sm font-medium text-[#222222]">{contract.equipment}</p>
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="font-bold text-[#2D5A27]">{contract.amount} ر.ي</span>
        <div className="flex gap-2">
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#2D5A27] text-[#2D5A27] text-xs font-semibold hover:bg-[#EAF3E9]">
            <Eye className="w-3.5 h-3.5" /> عرض
          </button>
          <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#E0E0E0] text-[#888888] text-xs font-semibold">
            <Download className="w-3.5 h-3.5" /> تحميل
          </button>
        </div>
      </div>
    </div>
  );
}
