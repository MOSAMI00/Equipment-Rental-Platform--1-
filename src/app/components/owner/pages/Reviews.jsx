import React from 'react';
import { Star, Send } from 'lucide-react';

const Reviews = () => {
  const ratings = [
    { stars: 5, count: 77, percent: 75 },
    { stars: 4, count: 18, percent: 18 },
    { stars: 3, count: 5, percent: 5 },
    { stars: 2, count: 1, percent: 1 },
    { stars: 1, count: 1, percent: 1 },
  ];

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>تقييماتي</h2>

      {/* Rating Summary */}
      <div className="owner-card mb-8">
        <div style={{ display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center', minWidth: 140 }}>
            <h2 style={{ fontSize: 56, margin: 0, lineHeight: 1 }}>4.8</h2>
            <div className="flex-center gap-1 mb-2" style={{ color: '#F39C12' }}>
              {[1,2,3,4].map(i => <Star key={i} size={20} fill="currentColor" />)}
              <Star size={20} fill="currentColor" style={{ opacity: 0.4 }} />
            </div>
            <p className="text-muted" style={{ margin: 0, fontSize: 14 }}>102 تقييم</p>
          </div>

          <div style={{ flex: 1, minWidth: 250 }}>
            {ratings.map((item) => (
              <div key={item.stars} className="flex-center gap-4 mb-2" style={{ justifyContent: 'flex-start' }}>
                <span style={{ width: 24, fontSize: 13, fontWeight: 600 }}>{item.stars}⭐</span>
                <div style={{ flex: 1, height: 10, backgroundColor: 'var(--color-page-bg)', borderRadius: 5, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${item.percent}%`, backgroundColor: '#F39C12', borderRadius: 5, transition: 'width 0.5s ease' }}></div>
                </div>
                <span className="text-muted" style={{ width: 40, fontSize: 13, textAlign: 'left' }}>{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="owner-card mb-8">
        <h4 className="mb-6">التقييمات المُستلمة</h4>
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
              <tr>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=12" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    أحمد محمد
                  </div>
                </td>
                <td><span style={{ color: '#F39C12' }}>⭐⭐⭐⭐⭐</span></td>
                <td>"خدمة ممتازة والمعدة بحالة رائعة"</td>
                <td>مولد 10KVA</td>
                <td>05/02/2025</td>
              </tr>
              <tr>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=33" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    سارة أحمد
                  </div>
                </td>
                <td><span style={{ color: '#F39C12' }}>⭐⭐⭐⭐⭐</span></td>
                <td>"تعامل راقي وسرعة في التسليم"</td>
                <td>كاميرا Sony</td>
                <td>01/02/2025</td>
              </tr>
              <tr>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=15" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    خالد ناصر
                  </div>
                </td>
                <td><span style={{ color: '#F39C12' }}>⭐⭐⭐⭐</span></td>
                <td>"المعدة جيدة لكن التوصيل تأخر قليلاً"</td>
                <td>مولد 5KVA</td>
                <td>28/01/2025</td>
              </tr>
              <tr>
                <td>
                  <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/32?img=20" alt="" style={{ borderRadius: '50%', width: 28, height: 28 }} />
                    ياسر علي
                  </div>
                </td>
                <td><span style={{ color: '#F39C12' }}>⭐⭐⭐⭐⭐</span></td>
                <td>"ممتاز وأنصح الجميع بالتعامل معه"</td>
                <td>دريل بوش</td>
                <td>22/01/2025</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reviews;
