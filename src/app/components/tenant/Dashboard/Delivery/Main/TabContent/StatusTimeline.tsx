import { formatRentalDate, type TenantRental } from '../../../../../../data/mock-api';

interface StatusTimelineProps {
  rental: TenantRental;
}

export function StatusTimeline({ rental }: StatusTimelineProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <div className="rounded-xl border border-[#27AE60]/25 bg-[#EAF3E9]/80 p-4 mb-5 text-center">
        <p className="text-sm font-bold text-[#2D5A27]">تم تأكيد الاستلام</p>
        <p className="text-xs text-[#555555] mt-1">المعدة قيد الاستخدام وفق فترة الإيجار.</p>
      </div>
      <div className="text-center py-4">
        <div className="text-5xl mb-4">🔧</div>
        <h3 className="font-bold text-[#222222] text-lg mb-2">قيد الاستخدام</h3>
        <p className="text-[#888888] text-sm">يمكنك تسجيل الإرجاع من تبويب «إرجاع» بعد انتهاء الفترة أو عند الجاهزية.</p>
        <div className="mt-5 p-4 bg-[#F4F6F9] rounded-xl">
          <p className="text-sm text-[#888888]">تاريخ الإرجاع المتوقع</p>
          <p className="font-bold text-[#222222] text-lg mt-1">{formatRentalDate(rental.endDate)}</p>
        </div>
      </div>
    </div>
  );
}
