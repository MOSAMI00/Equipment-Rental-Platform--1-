import { useState } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Phone, MapPin, ChevronRight, FileText, Clock, AlertTriangle } from 'lucide-react';

const STATUS_CONFIG = {
  pending:   { label: 'معلق', color: '#F39C12', bg: '#FEF9E7' },
  confirmed: { label: 'مؤكد', color: '#3498DB', bg: '#EBF5FB' },
  in_use:    { label: 'قيد الاستخدام', color: '#E67E22', bg: '#FEF5EC' },
  completed: { label: 'مكتمل', color: '#27AE60', bg: '#EAFAF1' },
  cancelled: { label: 'ملغي', color: '#95A5A6', bg: '#F2F3F4' },
  disputed:  { label: 'متنازع عليه', color: '#E74C3C', bg: '#FDEDEC' },
} as const;

type Status = keyof typeof STATUS_CONFIG;

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
        {/* ─── Main Content (8 cols) ─── */}
        <div className="lg:col-span-8 flex flex-col gap-5">

          {/* Order Info Card */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div>
                <p className="text-sm text-[#888888]">رقم الطلب</p>
                <h2 className="text-xl font-bold text-[#222222]">#OP-1048</h2>
              </div>
              <span
                className="px-4 py-1.5 rounded-full text-sm font-bold"
                style={{ color: st.color, backgroundColor: st.bg }}
              >
                {st.label}
              </span>
            </div>

            {/* Equipment */}
            <div className="flex items-center gap-4 p-4 bg-[#F4F6F9] rounded-xl">
              <div className="w-20 h-20 rounded-xl bg-white border border-[#E0E0E0] flex items-center justify-center text-4xl flex-shrink-0">
                🚧
              </div>
              <div>
                <h3 className="font-bold text-[#222222] text-lg">حفارة صغيرة</h3>
                <p className="text-sm text-[#888888] mt-0.5">معدة بناء وأعمال</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm text-[#888888]">👤 محمد سالم</span>
                  <span className="text-[#E0E0E0]">|</span>
                  <button className="flex items-center gap-1 text-sm text-[#2D5A27] hover:underline">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+967 77x xxx xxx</span>
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
                <p className="text-xs text-[#888888] mb-1">
                  <MapPin className="w-3 h-3 inline" /> الموقع
                </p>
                <p className="font-semibold text-[#222222]">صنعاء، المدينة</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <h3 className="font-bold text-[#222222] mb-5">مراحل الطلب</h3>
            <div className="flex items-center gap-0">
              {TIMELINE_STEPS.map((step, idx) => (
                <div key={step.key} className="flex items-center flex-1">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                      step.done
                        ? step.active
                          ? 'bg-[#E67E22] text-white ring-4 ring-[#E67E22]/20'
                          : 'bg-[#27AE60] text-white'
                        : 'bg-[#F4F6F9] border-2 border-[#E0E0E0] text-[#888888]'
                    }`}>
                      {step.done ? (step.active ? '🔧' : '✓') : '○'}
                    </div>
                    <p className={`text-[10px] mt-1.5 whitespace-nowrap font-medium ${step.done ? (step.active ? 'text-[#E67E22]' : 'text-[#27AE60]') : 'text-[#888888]'}`}>
                      {step.label}
                    </p>
                  </div>
                  {idx < TIMELINE_STEPS.length - 1 && (
                    <div className={`flex-1 h-0.5 mx-1 mb-4 ${step.done && !step.active ? 'bg-[#27AE60]' : 'bg-[#E0E0E0]'}`} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
            <h3 className="font-bold text-[#222222] mb-4">الإجراءات</h3>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => navigate('/dashboard/contracts')}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#2D5A27] text-[#2D5A27] rounded-xl text-sm font-semibold hover:bg-[#EAF3E9] transition-colors"
              >
                <FileText className="w-4 h-4" />
                عرض العقد
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#3498DB] text-[#3498DB] rounded-xl text-sm font-semibold hover:bg-[#EBF5FB] transition-colors">
                <Clock className="w-4 h-4" />
                تمديد الإيجار
              </button>
              <button className="flex items-center gap-2 px-5 py-2.5 border border-[#E74C3C] text-[#E74C3C] rounded-xl text-sm font-semibold hover:bg-[#FDEDEC] transition-colors">
                <AlertTriangle className="w-4 h-4" />
                تقرير مشكلة
              </button>
            </div>
          </div>
        </div>

        {/* ─── Summary Sidebar (4 cols) ─── */}
        <div className="lg:col-span-4">
          <div className="sticky top-6 flex flex-col gap-4">
            {/* Financial Summary */}
            <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
              <h3 className="font-bold text-[#222222] mb-4">ملخص المبالغ</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: 'الإيجار (5 أيام)', value: '100,000' },
                  { label: 'رسوم الخدمة', value: '10,000' },
                  { label: 'التأمين', value: '10,000' },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between text-sm">
                    <span className="text-[#888888]">{item.label}</span>
                    <span className="font-medium text-[#222222]">{item.value} ر.ي</span>
                  </div>
                ))}
                <div className="border-t border-[#E0E0E0] pt-3 flex items-center justify-between">
                  <span className="font-bold text-[#222222]">الإجمالي</span>
                  <span className="font-bold text-[#2D5A27] text-lg">120,000 ر.ي</span>
                </div>
              </div>
            </div>

            {/* Escrow Status */}
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
          </div>
        </div>
      </div>
    </div>
  );
}
