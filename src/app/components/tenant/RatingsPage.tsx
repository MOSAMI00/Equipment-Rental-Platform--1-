import { useState } from 'react';
import { Star, Send } from 'lucide-react';

type RatingTab = 'received' | 'sent' | 'pending';

interface Rating {
  id: string;
  equipment: string;
  person: string;
  stars: number;
  comment: string;
  date: string;
  image: string;
}

const RECEIVED: Rating[] = [
  { id: '1', equipment: 'مولد كهرباء', person: 'محمد سالم (مؤجر)', stars: 5, comment: 'مستأجر ممتاز، يحترم المواعيد ويعامل المعدة بعناية. أنصح بالتعامل معه.', date: '04 فبراير 2025', image: '👤' },
  { id: '2', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 4, comment: 'مستأجر جيد، أعاد المعدة بحالة ممتازة. بعض التأخير في التواصل.', date: '25 يناير 2025', image: '👤' },
];

const SENT: Rating[] = [
  { id: '3', equipment: 'مولد كهرباء', person: 'أحمد علي (مؤجر)', stars: 5, comment: 'مؤجر رائع! المعدة بحالة ممتازة والتسليم كان في الوقت المحدد.', date: '04 فبراير 2025', image: '⚡' },
  { id: '4', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 3, comment: 'المعدة جيدة لكن التواصل كان بطيئاً. يحتاج تحسين.', date: '25 يناير 2025', image: '🏗️' },
];

const PENDING = [
  { id: '5', orderNum: 'OP-1048', equipment: 'حفارة صغيرة', lessor: 'محمد سالم', image: '🚧', date: '10 فبراير 2025' },
];

function StarRating({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type="button"
          onClick={() => onChange?.(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(0)}
          className={`text-2xl transition-all ${onChange ? 'cursor-pointer hover:scale-110' : 'cursor-default'}`}
        >
          <Star
            className="w-6 h-6 transition-colors"
            fill={(hover || value) >= star ? '#F39C12' : 'none'}
            stroke={(hover || value) >= star ? '#F39C12' : '#E0E0E0'}
          />
        </button>
      ))}
    </div>
  );
}

function RatingCard({ rating, type }: { rating: Rating; type: 'received' | 'sent' }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E0E0E0] p-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-2xl flex-shrink-0">
          {rating.image}
        </div>
        <div className="flex-1">
          <p className="font-bold text-[#222222] text-sm">{rating.equipment}</p>
          <p className="text-xs text-[#888888]">{rating.person}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <StarRating value={rating.stars} />
            <span className="font-bold text-[#F39C12] text-sm">{rating.stars}.0</span>
          </div>
        </div>
        <span className="text-xs text-[#888888]">{rating.date}</span>
      </div>
      <p className="text-sm text-[#888888] bg-[#F4F6F9] rounded-xl p-3 leading-relaxed">
        "{rating.comment}"
      </p>
    </div>
  );
}

export function RatingsPage() {
  const [activeTab, setActiveTab] = useState<RatingTab>('pending');
  const [pendingRatings, setPendingRatings] = useState(PENDING);
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const avgRating = [...RECEIVED, ...SENT].reduce((s, r) => s + r.stars, 0) / (RECEIVED.length + SENT.length);

  const tabs = [
    { key: 'received' as RatingTab, label: 'مستلمة', count: RECEIVED.length },
    { key: 'sent' as RatingTab, label: 'مرسلة', count: SENT.length },
    { key: 'pending' as RatingTab, label: 'بانتظار التقييم', count: pendingRatings.length },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      {/* Rating Summary */}
      <div className="bg-gradient-to-br from-[#2D5A27] to-[#3D7A35] rounded-2xl p-5 mb-5 text-white">
        <h2 className="font-bold text-lg mb-3">تقييماتي</h2>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-5xl font-bold">{avgRating.toFixed(1)}</p>
            <div className="flex justify-center gap-0.5 mt-1">
              {[1,2,3,4,5].map(s => (
                <Star key={s} className="w-4 h-4" fill={avgRating >= s ? '#F39C12' : 'rgba(255,255,255,0.3)'} stroke="none" />
              ))}
            </div>
            <p className="text-xs opacity-75 mt-1">متوسط التقييم</p>
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            {[5,4,3,2,1].map(star => {
              const count = [...RECEIVED, ...SENT].filter(r => r.stars === star).length;
              const total = RECEIVED.length + SENT.length;
              const pct = total > 0 ? (count / total) * 100 : 0;
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-3 text-center opacity-75">{star}</span>
                  <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <div className="h-full bg-[#F39C12] rounded-full transition-all" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-4 text-center opacity-75">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-5 overflow-x-auto scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-4 h-9 rounded-full whitespace-nowrap text-sm font-semibold transition-all flex-shrink-0 ${
              activeTab === tab.key
                ? 'bg-[#2D5A27] text-white'
                : 'bg-white border border-[#E0E0E0] text-[#888888] hover:border-[#2D5A27]'
            }`}
          >
            {tab.label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-[#F4F6F9] text-[#888888]'}`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'received' && (
        <div className="flex flex-col gap-3">
          {RECEIVED.map(r => <RatingCard key={r.id} rating={r} type="received" />)}
        </div>
      )}

      {activeTab === 'sent' && (
        <div className="flex flex-col gap-3">
          {SENT.map(r => <RatingCard key={r.id} rating={r} type="sent" />)}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="flex flex-col gap-4">
          {pendingRatings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-4xl mb-4">⭐</span>
              <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد تقييمات معلقة</h3>
              <p className="text-[#888888] text-sm">أنجزت جميع تقييماتك!</p>
            </div>
          ) : (
            pendingRatings.map(item => (
              <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
                {/* Order Info */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E0E0E0]">
                  <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-2xl">{item.image}</div>
                  <div>
                    <p className="font-bold text-[#222222]">{item.equipment}</p>
                    <p className="text-xs text-[#888888]">#{item.orderNum} · {item.lessor} · {item.date}</p>
                  </div>
                </div>

                {/* Rating Form */}
                <div className="flex flex-col gap-4">
                  <div>
                    <p className="text-sm font-semibold text-[#222222] mb-2">تقييمك</p>
                    <StarRating
                      value={ratingValues[item.id] || 0}
                      onChange={v => setRatingValues(rv => ({ ...rv, [item.id]: v }))}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#222222] mb-2">تعليقك</p>
                    <textarea
                      value={comments[item.id] || ''}
                      onChange={e => setComments(c => ({ ...c, [item.id]: e.target.value }))}
                      placeholder="شاركنا تجربتك مع هذه المعدة..."
                      rows={3}
                      className="w-full p-3 rounded-xl border border-[#E0E0E0] text-sm focus:outline-none focus:border-[#2D5A27] resize-none transition-colors"
                    />
                  </div>
                  <button
                    disabled={!ratingValues[item.id]}
                    onClick={() => setPendingRatings(p => p.filter(r => r.id !== item.id))}
                    className="w-full h-12 bg-[#2D5A27] text-white rounded-xl font-bold text-sm hover:bg-[#3D7A35] transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-4 h-4" />
                    إرسال التقييم
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
