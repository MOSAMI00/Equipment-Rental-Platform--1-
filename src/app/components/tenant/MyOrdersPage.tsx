import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Search, Filter, AlertCircle, Clock, CheckCircle, Truck, Star, XCircle, MessageSquare } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'معلق', color: '#F39C12', bg: '#FEF9E7' },
  confirmed: { label: 'مؤكد', color: '#3498DB', bg: '#EBF5FB' },
  in_use:    { label: 'قيد الاستخدام', color: '#E67E22', bg: '#FEF5EC' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: '#EAFAF1' },
  cancelled: { label: 'ملغي', color: '#95A5A6', bg: '#F2F3F4' },
  disputed:  { label: 'متنازع عليه', color: '#E74C3C', bg: '#FDEDEC' },
} as const;

type Status = keyof typeof STATUS_CONFIG;

interface Rental {
  id: string;
  orderNum: string;
  equipment: string;
  image: string;
  lessor: string;
  rating: number;
  dateFrom: string;
  dateTo: string;
  days: number;
  amount: string;
  status: Status;
}

const SAMPLE_RENTALS: Rental[] = [
  { id: '1', orderNum: 'OP-1047', equipment: 'مولد كهرباء 5KVA', image: '⚡', lessor: 'أحمد علي', rating: 4.8, dateFrom: '01 فبراير', dateTo: '04 فبراير', days: 3, amount: '45,000', status: 'confirmed' },
  { id: '2', orderNum: 'OP-1048', equipment: 'حفارة صغيرة', image: '🚧', lessor: 'محمد سالم', rating: 4.5, dateFrom: '05 فبراير', dateTo: '10 فبراير', days: 5, amount: '120,000', status: 'in_use' },
  { id: '3', orderNum: 'OP-1049', equipment: 'كاميرا تصوير احترافية', image: '📷', lessor: 'خالد يوسف', rating: 4.9, dateFrom: '12 فبراير', dateTo: '13 فبراير', days: 1, amount: '15,000', status: 'pending' },
  { id: '4', orderNum: 'OP-1045', equipment: 'رافعة شوكية', image: '🏗️', lessor: 'علي حسن', rating: 4.2, dateFrom: '20 يناير', dateTo: '25 يناير', days: 5, amount: '200,000', status: 'completed' },
  { id: '5', orderNum: 'OP-1044', equipment: 'ضاغط هواء', image: '💨', lessor: 'عمر ناصر', rating: 4.6, dateFrom: '15 يناير', dateTo: '17 يناير', days: 2, amount: '30,000', status: 'cancelled' },
  { id: '6', orderNum: 'OP-1043', equipment: 'خلاط خرسانة', image: '🔩', lessor: 'حسام فارس', rating: 3.8, dateFrom: '10 يناير', dateTo: '14 يناير', days: 4, amount: '60,000', status: 'disputed' },
  { id: '7', orderNum: 'OP-1042', equipment: 'مضخة مياه', image: '💧', lessor: 'طارق محمود', rating: 4.7, dateFrom: '05 يناير', dateTo: '06 يناير', days: 1, amount: '12,000', status: 'completed' },
  { id: '8', orderNum: 'OP-1041', equipment: 'شاحنة نقل', image: '🚛', lessor: 'سامي عادل', rating: 4.4, dateFrom: '28 ديسمبر', dateTo: '30 ديسمبر', days: 2, amount: '80,000', status: 'completed' },
];

const TABS: { key: Status | 'all'; label: string }[] = [
  { key: 'all', label: 'الكل' },
  { key: 'pending', label: 'Pending' },
  { key: 'confirmed', label: 'Confirmed' },
  { key: 'in_use', label: 'In Use' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'disputed', label: 'Disputed' },
];

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

function RentalCard({ rental }: { rental: Rental }) {
  const navigate = useNavigate();
  const st = STATUS_CONFIG[rental.status];
  return (
    <div
      className="bg-white rounded-2xl border border-[#E0E0E0] overflow-hidden transition-all hover:shadow-md hover:-translate-y-0.5 cursor-pointer"
      onClick={() => navigate(`/dashboard/order/${rental.id}`)}
    >
      {/* Card Header */}
      <div className="flex items-start gap-4 p-4 pb-3">
        {/* Equipment Image */}
        <div className="w-[72px] h-[72px] rounded-xl bg-[#F4F6F9] border border-[#E0E0E0] flex items-center justify-center text-3xl flex-shrink-0">
          {rental.image}
        </div>
        {/* Info */}
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

      {/* Divider */}
      <div className="border-t border-[#E0E0E0] mx-4" />

      {/* Dates & Amount */}
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

      {/* Divider */}
      <div className="border-t border-[#E0E0E0] mx-4" />

      {/* Status + Action */}
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

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActions = SAMPLE_RENTALS.some(r => r.status === 'confirmed' || r.status === 'pending');

  const filtered = SAMPLE_RENTALS.filter(r => {
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchSearch = r.equipment.includes(searchQuery) || r.orderNum.includes(searchQuery) || r.lessor.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
        <div>
          <h2 className="text-2xl font-bold text-[#222222]">طلباتي</h2>
          <p className="text-sm text-[#888888] mt-0.5">{SAMPLE_RENTALS.length} طلب إجمالاً</p>
        </div>
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#888888]" />
            <input
              type="text"
              placeholder="بحث في الطلبات..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-10 pr-9 pl-3 rounded-xl border border-[#E0E0E0] bg-white text-sm focus:outline-none focus:border-[#2D5A27] transition-colors"
            />
          </div>
          {/* Filter */}
          <button className="h-10 px-4 rounded-xl border border-[#E0E0E0] bg-white flex items-center gap-2 text-sm text-[#888888] hover:border-[#2D5A27] transition-colors">
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">فلتر</span>
          </button>
        </div>
      </div>

      {/* Smart Action Banner */}
      {hasActions && (
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
      )}

      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 mb-5 scrollbar-hide">
        {TABS.map(tab => {
          const count = tab.key === 'all' ? SAMPLE_RENTALS.length : SAMPLE_RENTALS.filter(r => r.status === tab.key).length;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-4 h-9 rounded-full whitespace-nowrap text-sm font-medium transition-all flex-shrink-0 ${
                isActive
                  ? 'bg-[#2D5A27] text-white'
                  : 'bg-white border border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27] hover:text-[#2D5A27]'
              }`}
            >
              {tab.label}
              {count > 0 && (
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-[#F4F6F9] text-[#888888]'}`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Rental Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(rental => (
            <RentalCard key={rental.id} rental={rental} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#F4F6F9] rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد طلبات</h3>
          <p className="text-[#888888] text-sm max-w-xs">لم تقم بأي طلبات إيجار بعد. ابدأ بتصفح المعدات المتاحة.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2.5 bg-[#2D5A27] text-white rounded-xl text-sm font-semibold hover:bg-[#3D7A35] transition-colors"
          >
            تصفح المعدات
          </button>
        </div>
      )}
    </div>
  );
}
