export function EscrowStatus() {
  return (
    <div className="bg-[#EAF3E9] border border-[#2D5A27]/20 rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-full bg-[#27AE60] text-white flex items-center justify-center text-sm">🔒</div>
        <h3 className="font-bold text-[#2D5A27]">حالة الضمان</h3>
      </div>
      <p className="text-sm text-[#3D7A35]">المبلغ محفوظ في حساب الضمان</p>
      <p className="text-xs text-[#888888] mt-2">سيتم تحرير المبلغ للمؤجر بعد تأكيد الإرجاع</p>
      <div className="mt-3 flex items-center gap-2">
        <div className="flex-1 h-2 bg-white rounded-full overflow-hidden">
          <div className="h-full w-4/5 bg-[#27AE60] rounded-full" />
        </div>
        <span className="text-xs font-bold text-[#27AE60]">80%</span>
      </div>
    </div>
  );
}
