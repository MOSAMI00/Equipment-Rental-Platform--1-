export function StatusTimeline() {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <div className="text-center py-8">
        <div className="text-5xl mb-4">🔧</div>
        <h3 className="font-bold text-[#222222] text-lg mb-2">المعدة قيد الاستخدام</h3>
        <p className="text-[#888888] text-sm">يمكنك الإرجاع بعد انتهاء فترة الإيجار</p>
        <div className="mt-5 p-4 bg-[#F4F6F9] rounded-xl">
          <p className="text-sm text-[#888888]">تاريخ الإرجاع المتوقع</p>
          <p className="font-bold text-[#222222] text-lg mt-1">10 فبراير 2025</p>
        </div>
        <div className="mt-4 p-4 bg-[#FEF5EC] border border-[#E67E22]/20 rounded-xl">
          <p className="text-sm text-[#E67E22] font-semibold">الوقت المتبقي</p>
          <p className="font-bold text-[#E67E22] text-2xl mt-1">2 يوم : 14 ساعة</p>
        </div>
      </div>
    </div>
  );
}
