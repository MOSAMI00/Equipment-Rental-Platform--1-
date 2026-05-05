import React, { useMemo } from 'react';
import { Star } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EmptyState from '../shared/EmptyState';

const UNKNOWN_USER = '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641';
const UNKNOWN_EQUIPMENT = '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629';

const Reviews = () => {
  const { user } = useAuth();
  const { reviews } = useOwnerPageProps();

  const ownerReviews = useMemo(
    () => reviews.filter((review) => review.targetId === user?.id),
    [reviews, user?.id],
  );

  const average = ownerReviews.length
    ? ownerReviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / ownerReviews.length
    : 0;

  const ratings = [5, 4, 3, 2, 1].map((stars) => {
    const count = ownerReviews.filter((review) => review.rating === stars).length;
    const percent = ownerReviews.length ? Math.round((count / ownerReviews.length) * 100) : 0;
    return { stars, count, percent };
  });

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>تقييماتي</h2>

      <div className="owner-card mb-8">
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <h2 style={{ fontSize: 56, margin: 0, lineHeight: 1 }}>{average.toFixed(1)}</h2>
            <div className="flex-center gap-1 mb-2" style={{ color: '#F39C12' }}>
              {[1, 2, 3, 4, 5].map((item) => (
                <Star key={item} size={20} fill="currentColor" style={{ opacity: average >= item ? 1 : 0.4 }} />
              ))}
            </div>
            <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>{ownerReviews.length} تقييم</p>
          </div>

          <div style={{ flex: 1, minWidth: 250 }}>
            {ratings.map((item) => (
              <div key={item.stars} className="flex-center gap-4 mb-2" style={{ justifyContent: 'flex-start' }}>
                <span style={{ width: 24, fontSize: 13, fontWeight: 600 }}>{item.stars}⭐</span>
                <div style={{ flex: 1, height: 10, backgroundColor: 'var(--color-page-bg)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.percent}%`, backgroundColor: '#F39C12', borderRadius: 5, transition: 'width 0.5s ease' }} />
                </div>
                <span className="text-muted" style={{ width: 40, fontSize: 13, textAlign: 'left' }}>{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="owner-card mb-8">
        <h4 className="mb-6">التقييمات المُستلمة</h4>
        {ownerReviews.length === 0 ? (
          <EmptyState compact type="empty" title="لا توجد تقييمات حتى الآن" />
        ) : (
          <div className="owner-table-container">
            <table className="owner-table">
              <thead>
                <tr>
                  <th>المستأجر</th>
                  <th>التقييم</th>
                  <th>النص</th>
                  <th>المعدة</th>
                  <th>التاريخ</th>
                </tr>
              </thead>
              <tbody>
                {ownerReviews.map((review) => {
                  const tenant = review.tenant ?? {};
                  const equipment = review.equipment ?? {};
                  return (
                    <tr key={review.id}>
                      <td>
                        <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                          <div className="flex-center" style={{ borderRadius: '50%', width: 28, height: 28, backgroundColor: 'var(--color-page-bg)', fontSize: 12 }}>
                            {(tenant.name ?? '?').charAt(0)}
                          </div>
                          {tenant.name ?? UNKNOWN_USER}
                        </div>
                      </td>
                      <td><span style={{ color: '#F39C12' }}>{'⭐'.repeat(review.rating ?? 0)}</span></td>
                      <td>"{review.reviewText ?? '—'}"</td>
                      <td>{equipment.name ?? UNKNOWN_EQUIPMENT}</td>
                      <td>{review.createdAt?.slice(0, 10) ?? '—'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reviews;
