import { useNavigate } from 'react-router';
import { Rental, STATUS_CONFIG, Status } from './OrderTypes';

function ActionButton({ status, id }: { status: Status; id: string }) {
  const navigate = useNavigate();
  const configs: Partial<Record<Status, { label: string; color: string; bg: string; onClick: () => void }>> = {
    pending:   { label: 'إلغاء', color: '#E74C3C', bg: 'transparent', onClick: () => {} },
    confirmed: { label: 'ادفع الآن', color: '#FFFFFF', bg: '#2D5A27', onClick: () => {} },
    in_use:    { label: 'عرض التفاصيل', color: '#FFFFFF', bg: '#3498DB', onClick: () => navigate(`/dashboard/order/${id}`) },
    completed: { label: 'قيّم', color: '#FFFFFF', bg: '#27AE60', onClick: () => navigate('/dashboard/ratings') },
    disputed:  { label: 'عرض النزاع', color: '#FFFFFF', bg: '#E74C3C', onClick: () => navigate(`/dashboard/order/${id}`) },
  };
  const config = configs[status];
  if (!config) return null;
  return (
    <button
      onClick={config.onClick}
      className="px-4 py-2 rounded-lg text-sm font-semibold transition-all hover:opacity-90 active:scale-95"
      style={{ color: config.color, backgroundColor: config.bg, border: config.bg === 'transparent' ? `1px solid ${config.color}` : 'none' }}
    >
      {config.label}
    </button>
  );
}

export function OrderCard({ rental }: { rental: Rental }) {
  const navigate = useNavigate();
  const st = STATUS_CONFIG[rental.status];
  return (
    <div
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={() => navigate(`/dashboard/order/${rental.id}`)}
    >
      <div className="flex items-start gap-4 p-4 pb-3">
        <div className="w-[72px] h-[72px] rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] flex items-center justify-center text-3xl flex-shrink-0">
          {rental.image}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-bold text-[#222222] text-base leading-tight">{rental.equipment}</h3>
            <span className="text-xs text-[#888888] font-mono whitespace-nowrap">#{rental.orderNum}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-[#888888]">👤 {rental.lessor}</span>
            <span className="text-[#E0E0E0]">|</span>
            <span className="text-sm text-[#F39C12]">⭐ {rental.rating}</span>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E0E0E0] mx-4" />
      <div className="px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-sm text-[#888888]">
          <span>📅</span>
          <span>{rental.dateFrom} ← {rental.dateTo}</span>
          <span className="text-[#2D5A27] font-medium">({rental.days} أيام)</span>
        </div>
        <div className="flex items-center gap-1 font-bold text-[#222222]">
          <span className="text-sm">💰</span>
          <span>{rental.amount} ر.ي</span>
        </div>
      </div>
      <div className="border-t border-[#E0E0E0] mx-4" />
      <div className="px-4 py-3 flex items-center justify-between" onClick={e => e.stopPropagation()}>
        <span
          className="px-3 py-1 rounded-full text-xs font-bold"
          style={{ color: st.color, backgroundColor: st.bg }}
        >
          {st.label}
        </span>
        <ActionButton status={rental.status} id={rental.id} />
      </div>
    </div>
  );
}
