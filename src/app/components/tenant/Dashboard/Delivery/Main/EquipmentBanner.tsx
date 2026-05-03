export function EquipmentBanner() {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4 mb-5 flex items-center gap-4">
      <div className="w-14 h-14 rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] flex items-center justify-center text-2xl flex-shrink-0">🚧</div>
      <div>
        <p className="font-bold text-[#222222]">حفارة صغيرة</p>
        <p className="text-sm text-[#888888]">#OP-1048 · محمد سالم</p>
      </div>
      <div className="mr-auto">
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF5EC] text-[#E67E22]">قيد الاستخدام</span>
      </div>
    </div>
  );
}
