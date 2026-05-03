import { Phone } from 'lucide-react';

interface OrderInfoCardProps {
  statusLabel: string;
  statusColor: string;
  statusBg: string;
}

export function OrderInfoCard({ statusLabel, statusColor, statusBg }: OrderInfoCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div>
          <p className="text-sm text-[#888888]">رقم الطلب</p>
          <h2 className="text-xl font-bold text-[#222222]">#OP-1048</h2>
        </div>
        <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: statusColor, backgroundColor: statusBg }}>
          {statusLabel}
        </span>
      </div>
      <div className="flex items-center gap-4 p-4 bg-[#F4F6F9] rounded-xl">
        <div className="w-20 h-20 rounded-xl bg-white border border-[#E0E0E0] flex items-center justify-center text-4xl flex-shrink-0">🚧</div>
        <div>
          <h3 className="font-bold text-[#222222] text-lg">حفارة صغيرة</h3>
          <p className="text-sm text-[#888888] mt-0.5">معدة بناء وأعمال</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-sm text-[#888888]">👤 محمد سالم</span>
            <span className="text-[#E0E0E0]">|</span>
            <button className="flex items-center gap-1 text-sm text-[#2D5A27] hover:underline">
              <Phone className="w-3.5 h-3.5" /> <span>+967 77x xxx xxx</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
