import { AlertCircle } from 'lucide-react';

export function OrderActionBanner() {
  return (
    <div className="bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-2xl p-4 mb-5">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-[#2D5A27] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
          <AlertCircle className="w-4 h-4" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#2D5A27] text-sm">لديك إجراء مطلوب الآن</p>
          <p className="text-xs text-[#3D7A35] mt-0.5">لديك طلب مؤكد ينتظر الدفع وطلب آخر ينتظر المراجعة</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 mt-3">
        <button className="px-4 py-2 bg-[#2D5A27] text-white text-sm font-semibold rounded-xl hover:bg-[#3D7A35] transition-colors">
          ادفع الآن
        </button>
        <button className="px-4 py-2 bg-white border border-[#2D5A27] text-[#2D5A27] text-sm font-semibold rounded-xl hover:bg-[#F4F6F9] transition-colors">
          أكد الاستلام
        </button>
      </div>
    </div>
  );
}
