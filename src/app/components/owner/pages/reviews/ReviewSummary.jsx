import React from 'react';
import { Star } from 'lucide-react';

const ReviewSummary = ({ average, reviewsCount, ratings }) => (
  <div className="owner-card mb-8">
    <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
      <div style={{ textAlign: 'center', minWidth: 140 }}>
        <h2 style={{ fontSize: 56, margin: 0, lineHeight: 1 }}>{average.toFixed(1)}</h2>
        <div className="flex-center gap-1 mb-2" style={{ color: '#F39C12' }}>
          {[1, 2, 3, 4, 5].map((item) => (
            <Star key={item} size={20} fill="currentColor" style={{ opacity: average >= item ? 1 : 0.4 }} />
          ))}
        </div>
        <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>{reviewsCount} تقييم</p>
      </div>

      <div style={{ flex: 1, minWidth: 250 }}>
        {ratings.map((item) => (
          <div key={item.stars} className="flex-center gap-4 mb-2" style={{ justifyContent: 'flex-start' }}>
            <span style={{ width: 24, fontSize: 13, fontWeight: 600 }}>{item.stars}★</span>
            <div style={{ flex: 1, height: 10, backgroundColor: 'var(--color-page-bg)', borderRadius: 5, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${item.percent}%`, backgroundColor: '#F39C12', borderRadius: 5, transition: 'width 0.5s ease' }} />
            </div>
            <span className="text-muted" style={{ width: 40, fontSize: 13, textAlign: 'left' }}>{item.percent}%</span>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export default ReviewSummary;
