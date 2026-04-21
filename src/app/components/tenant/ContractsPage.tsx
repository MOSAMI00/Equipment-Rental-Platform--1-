import { useState } from 'react';
import { Download, Eye, Search, FileText } from 'lucide-react';

interface Contract {
  id: string;
  contractNum: string;
  lessor: string;
  equipment: string;
  date: string;
  amount: string;
  status: 'active' | 'completed' | 'expired';
}

const STATUS_CONFIG = {
  active:    { label: 'نشط', color: '#27AE60', bg: '#EAFAF1' },
  completed: { label: 'مكتمل', color: '#3498DB', bg: '#EBF5FB' },
  expired:   { label: 'منتهي', color: '#95A5A6', bg: '#F2F3F4' },
};

const CONTRACTS: Contract[] = [
  { id: '1', contractNum: 'CT-2047', lessor: 'محمد سالم', equipment: 'حفارة صغيرة', date: '05 فبراير 2025', amount: '120,000', status: 'active' },
  { id: '2', contractNum: 'CT-2048', lessor: 'أحمد علي', equipment: 'مولد كهرباء', date: '01 فبراير 2025', amount: '45,000', status: 'active' },
  { id: '3', contractNum: 'CT-2041', lessor: 'علي حسن', equipment: 'رافعة شوكية', date: '20 يناير 2025', amount: '200,000', status: 'completed' },
  { id: '4', contractNum: 'CT-2038', lessor: 'خالد يوسف', equipment: 'كاميرا تصوير', date: '12 يناير 2025', amount: '15,000', status: 'completed' },
  { id: '5', contractNum: 'CT-2031', lessor: 'عمر ناصر', equipment: 'ضاغط هواء', date: '05 يناير 2025', amount: '30,000', status: 'expired' },
  { id: '6', contractNum: 'CT-2028', lessor: 'حسام فارس', equipment: 'خلاط خرسانة', date: '28 ديسمبر 2024', amount: '60,000', status: 'expired' },
];

export function ContractsPage() {
  const [search, setSearch] = useState('');

  const filtered = CONTRACTS.filter(c =>
    c.contractNum.includes(search) ||
    c.lessor.includes(search) ||
    c.equipment.includes(search)
  );

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#222222]">عقودي</h2>
          <p className="text-sm text-[#888888] mt-0.5">{CONTRACTS.length} عقد إجمالاً</p>
        </div>
        <div className="relative w-full sm:w-64">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
          <input
            type="text"
            placeholder="بحث في العقود..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#E0E0E0] bg-white text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
          />
        </div>
      </div>

      {/* Desktop Table */}
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
            {filtered.map(contract => {
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
        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <span className="text-4xl">📄</span>
            <p className="text-[#888888] mt-3 text-sm">لا توجد عقود مطابقة</p>
          </div>
        )}
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map(contract => {
          const st = STATUS_CONFIG[contract.status];
          return (
            <div key={contract.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
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
        })}
      </div>
    </div>
  );
}
