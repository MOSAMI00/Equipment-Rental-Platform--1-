import { OrderInfo } from './OrderInfo';
import { StarPicker } from './StarPicker';
import { CommentArea } from './CommentArea';
import { SubmitButton } from './SubmitButton';

interface PendingFormsProps {
  pendingRatings: any[];
  ratingValues: Record<string, number>;
  setRatingValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  comments: Record<string, string>;
  setComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setPendingRatings: React.Dispatch<React.SetStateAction<any[]>>;
}

export function PendingForms({
  pendingRatings,
  ratingValues,
  setRatingValues,
  comments,
  setComments,
  setPendingRatings,
}: PendingFormsProps) {
  if (pendingRatings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-4">⭐</span>
        <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد تقييمات معلقة</h3>
        <p className="text-[#888888] text-sm">أنجزت جميع تقييماتك!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {pendingRatings.map(item => (
        <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
          <OrderInfo item={item} />
          <div className="flex flex-col gap-4">
            <StarPicker
              id={item.id}
              value={ratingValues[item.id] || 0}
              onChange={v => setRatingValues(rv => ({ ...rv, [item.id]: v }))}
            />
            <CommentArea
              id={item.id}
              value={comments[item.id] || ''}
              onChange={val => setComments(c => ({ ...c, [item.id]: val }))}
            />
            <SubmitButton
              disabled={!ratingValues[item.id]}
              onSubmit={() => setPendingRatings(p => p.filter(r => r.id !== item.id))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}


interface PendingFormsProps {
  pendingRatings: any[];
  ratingValues: Record<string, number>;
  setRatingValues: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  comments: Record<string, string>;
  setComments: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  setPendingRatings: React.Dispatch<React.SetStateAction<any[]>>;
}

export function PendingForms({
  pendingRatings,
  ratingValues,
  setRatingValues,
  comments,
  setComments,
  setPendingRatings,
}: PendingFormsProps) {
  if (pendingRatings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <span className="text-4xl mb-4">⭐</span>
        <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد تقييمات معلقة</h3>
        <p className="text-[#888888] text-sm">أنجزت جميع تقييماتك!</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {pendingRatings.map(item => (
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
      ))}
    </div>
  );
}
