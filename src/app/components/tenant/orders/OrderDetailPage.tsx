import { useParams, useNavigate } from 'react-router';
import { Phone, MapPin, ChevronRight, FileText, Clock, AlertTriangle } from 'lucide-react';
import { STATUS_CONFIG, Status } from './OrderTypes';
import { OrderTimeline } from './OrderTimeline';
import { OrderSummary } from './OrderSummary';
import { EscrowStatus } from './EscrowStatus';

const TIMELINE_STEPS = [
  { key: 'order', label: 'الطلب', done: true },
  { key: 'confirm', label: 'التأكيد', done: true },
  { key: 'pay', label: 'الدفع', done: true },
  { key: 'receive', label: 'الاستلام', done: true },
  { key: 'use', label: 'الاستخدام', done: true, active: true },
  { key: 'return', label: 'الإرجاع', done: false },
];

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const status: Status = 'in_use';
  const st = STATUS_CONFIG[status];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-sm text-[#888888] mb-5">
        <button onClick={() => navigate('/dashboard')} className="hover:text-[#2D5A27] transition-colors">طلباتي</button>
        <ChevronRight className="w-4 h-4 rotate-180" />
        <span className="text-[#222222] font-medium">تفاصيل الطلب #{id}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 flex flex-col gap-5">
          {/* Order Info Card */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-[#888888]">رقم الطلب</p>
                <h2 className="text-xl font-bold text-[#222222]">#OP-1048</h2>
              </div>
              <span className="px-4 py-1.5 rounded-full text-sm font-bold" style={{ color: st.color, backgroundColor: st.bg }}>
                {st.label}
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

          {/* Rental Info Card */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <h3 className="font-bold text-[#222222] mb-4">معلومات الإيجار</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-3 bg-[#F4F6F9] rounded-xl">
                <p className="text-xs text-[#888888] mb-1">📅 تاريخ الاستلام</p>
                <p className="font-semibold text-[#222222]">05 فبراير 2025</p>
              </div>
              <div className="p-3 bg-[#F4F6F9] rounded-xl">
                <p className="text-xs text-[#888888] mb-1">📅 تاريخ الإرجاع</p>
                <p className="font-semibold text-[#222222]">10 فبراير 2025</p>
              </div>
              <div className="p-3 bg-[#F4F6F9] rounded-xl">
                <p className="text-xs text-[#888888] mb-1"><MapPin className="w-3 h-3 inline" /> الموقع</p>
                <p className="font-semibold text-[#222222]">صنعاء، المدينة</p>
              </div>
            </div>
          </div>

          <OrderTimeline steps={TIMELINE_STEPS} />

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <h3 className="font-bold text-[#222222] mb-4">الإجراءات</h3>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => navigate('/dashboard/contracts')} className="flex items-center gap-2 px-5 py-2.5 border border-[#2D5A27] text-[#2D5A27] rounded-xl text-sm font-semibold hover:bg-[#EAF3E9]">
                <FileText className="w-4 h-4" /> عرض العقد
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#3498DB] text-[#3498DB] rounded-xl text-sm font-semibold hover:bg-[#EBF5FB]">
                <Clock className="w-4 h-4" /> تمديد الإيجار
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#E74C3C] text-[#E74C3C] rounded-xl text-sm font-semibold hover:bg-[#FDEDEC]">
                <AlertTriangle className="w-4 h-4" /> تقرير مشكلة
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            <OrderSummary 
              items={[
                { label: 'الإيجار (5 أيام)', value: '100,000' },
                { label: 'رسوم الخدمة', value: '10,000' },
                { label: 'التأمين', value: '10,000' },
              ]} 
              total="120,000" 
            />
            <EscrowStatus />
          </div>
        </div>
      </div>
    </div>
  );
}
