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
      {pendingRatings.map((item) => (
        <div key={item.id} className="bg-white rounded-2xl border border-[#E0E0E0] p-5">
          <OrderInfo item={item} />
          <div className="flex flex-col gap-4">
            <StarPicker
              id={item.id}
              value={ratingValues[item.id] || 0}
              onChange={(value) => setRatingValues((ratings) => ({ ...ratings, [item.id]: value }))}
            />
            <CommentArea
              id={item.id}
              value={comments[item.id] || ''}
              onChange={(value) => setComments((existing) => ({ ...existing, [item.id]: value }))}
            />
            <SubmitButton
              disabled={!ratingValues[item.id]}
              onSubmit={() => setPendingRatings((pending) => pending.filter((rating) => rating.id !== item.id))}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
