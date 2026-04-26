import { useState } from 'react';
import { Clock, AlertTriangle, CheckCircle } from 'lucide-react';
import { PhotoUploader } from './PhotoUploader';
import { SignatureBox } from './SignatureBox';

type Tab = 'receive' | 'in_use' | 'return';

const CONDITION_OPTIONS = [
  { value: 'excellent', label: '✅ ممتاز – بحالة مثالية' },
  { value: 'good', label: '👍 جيد – يعمل بشكل صحيح' },
  { value: 'fair', label: '⚠️ مقبول – يوجد تلف طفيف' },
  { value: 'damaged', label: '❌ تالف – يوجد ضرر واضح' },
];

export function DeliveryPage() {
  const [activeTab, setActiveTab] = useState<Tab>('receive');
  const [condition, setCondition] = useState('');
  const [hasDamage, setHasDamage] = useState<boolean | null>(null);
  const [objectionText, setObjectionText] = useState('');
  const [submitted, setSubmitted] = useState<Partial<Record<Tab, boolean>>>({});

  const tabs: { key: Tab; label: string; emoji: string }[] = [
    { key: 'receive', label: 'استلام', emoji: '📦' },
    { key: 'in_use', label: 'قيد الاستخدام', emoji: '🔧' },
    { key: 'return', label: 'إرجاع', emoji: '🔄' },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <h2 className="text-xl font-bold text-[#222222] mb-5">التسليم والإرجاع</h2>

      {/* Equipment Banner */}
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

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-[#F4F6F9] p-1 rounded-xl">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab.key ? 'bg-white text-[#222222] shadow-sm' : 'text-[#888888] hover:text-[#222222]'
            }`}
          >
            <span>{tab.emoji}</span>
            {tab.label}
            {submitted[tab.key] && <CheckCircle className="w-3.5 h-3.5 text-[#27AE60]" />}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'receive' && (
        <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">1</div>
              <h3 className="font-bold text-[#222222]">رفع صور المعدة</h3>
            </div>
            <PhotoUploader label="صور حالة المعدة عند الاستلام" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">2</div>
              <h3 className="font-bold text-[#222222]">تقييم الحالة</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {CONDITION_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setCondition(opt.value)}
                  className={`p-3 rounded-xl border text-sm text-right transition-all ${
                    condition === opt.value
                      ? 'border-[#2D5A27] bg-[#EAF3E9] font-semibold text-[#2D5A27]'
                      : 'border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">3</div>
              <h3 className="font-bold text-[#222222]">التوقيع</h3>
            </div>
            <SignatureBox />
          </div>
          <button
            onClick={() => setSubmitted(s => ({ ...s, receive: true }))}
            className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            تأكيد الاستلام
          </button>
        </div>
      )}

      {activeTab === 'in_use' && (
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
      )}

      {activeTab === 'return' && (
        <div className="flex flex-col gap-4">
          <div className="bg-white rounded-2xl border border-[#E0E0E0] p-5 flex flex-col gap-5">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">1</div>
                <h3 className="font-bold text-[#222222]">صور الإرجاع</h3>
              </div>
              <PhotoUploader label="صور حالة المعدة عند الإرجاع" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-[#EAF3E9] flex items-center justify-center text-[#2D5A27] text-sm font-bold">2</div>
                <h3 className="font-bold text-[#222222]">هل يوجد ضرر؟</h3>
              </div>
              <div className="flex gap-3">
                {[{ v: false, label: '✅ لا يوجد ضرر' }, { v: true, label: '⚠️ يوجد ضرر' }].map(opt => (
                  <button
                    key={String(opt.v)}
                    onClick={() => setHasDamage(opt.v)}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${
                      hasDamage === opt.v
                        ? opt.v ? 'border-[#E74C3C] bg-[#FDEDEC] text-[#E74C3C]' : 'border-[#27AE60] bg-[#EAFAF1] text-[#27AE60]'
                        : 'border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => setSubmitted(s => ({ ...s, return: true }))}
              className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              تأكيد الإرجاع
            </button>
          </div>

          {/* Objection Section */}
          <div className="bg-white rounded-2xl border border-[#E74C3C]/30 p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="w-5 h-5 text-[#E74C3C]" />
              <h3 className="font-bold text-[#E74C3C]">تقديم اعتراض</h3>
            </div>
            <div className="p-3 bg-[#FDEDEC] rounded-xl mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E74C3C]" />
                <span className="text-sm text-[#E74C3C] font-medium">مهلة الاعتراض</span>
              </div>
              <span className="font-bold text-[#E74C3C] font-mono">47:23:10</span>
            </div>
            <textarea
              value={objectionText}
              onChange={e => setObjectionText(e.target.value)}
              placeholder="اكتب وصف الاعتراض هنا..."
              rows={3}
              className="w-full p-3 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#E74C3C] resize-none transition-colors"
            />
            <PhotoUploader label="صور الاعتراض" />
            <button className="mt-4 w-full h-12 bg-[#E74C3C] text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              تقديم اعتراض
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
