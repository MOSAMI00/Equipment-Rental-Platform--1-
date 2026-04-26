import { FileText, Eye, Download } from 'lucide-react';
import { Contract, STATUS_CONFIG } from './ContractTypes';

interface ContractTableProps {
  contracts: Contract[];
}

export function ContractTable({ contracts }: ContractTableProps) {
  return (
    <div className="hidden md:block bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden">
      <table className="w-full" style={{ direction: 'rtl' }}>
        <thead>
          <tr className="bg-[#F4F6F9] border-b border-[#E0E0E0]">
            {['رقم العقد', 'المؤجر', 'المعدة', 'التاريخ', 'المبلغ', 'الحالة', 'الإجراء'].map(col => (
              <th key={col} className="px-4 py-3 text-right text-xs font-bold text-[#888888] uppercase tracking-wide">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#E0E0E0]">
          {contracts.map(contract => {
            const st = STATUS_CONFIG[contract.status];
            return (
              <tr key={contract.id} className="hover:bg-[#F4F6F9] transition-colors">
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#EAF3E9] flex items-center justify-center">
                      <FileText className="w-4 h-4 text-[#2D5A27]" />
                    </div>
                    <span className="font-mono font-semibold text-[#222222] text-sm">{contract.contractNum}</span>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-[#222222]">{contract.lessor}</td>
                <td className="px-4 py-4 text-sm text-[#222222]">{contract.equipment}</td>
                <td className="px-4 py-4 text-sm text-[#888888]">{contract.date}</td>
                <td className="px-4 py-4 text-sm font-semibold text-[#222222]">{contract.amount} ر.ي</td>
                <td className="px-4 py-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ color: st.color, backgroundColor: st.bg }}>
                    {st.label}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <div className="flex items-center gap-2">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#2D5A27] text-[#2D5A27] text-xs font-semibold hover:bg-[#EAF3E9] transition-colors">
                      <Eye className="w-3.5 h-3.5" />
                      عرض
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#E0E0E0] text-[#888888] text-xs font-semibold hover:border-[#2D5A27] hover:text-[#2D5A27] transition-colors">
                      <Download className="w-3.5 h-3.5" />
                      تحميل
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {contracts.length === 0 && (
        <div className="py-16 text-center">
          <span className="text-4xl">📄</span>
          <p className="text-[#888888] mt-3 text-sm">لا توجد عقود مطابقة</p>
        </div>
      )}
    </div>
  );
}
