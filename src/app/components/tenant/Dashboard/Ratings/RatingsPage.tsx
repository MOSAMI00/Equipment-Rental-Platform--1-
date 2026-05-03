import { useState } from 'react';
import { SummaryCard } from './Main/SummaryCard/SummaryCard';
import { FilterTabs } from './Main/FilterTabs';
import { RatingsList } from './Main/RatingsList/RatingsList';
import { PendingForms } from './Main/PendingForms/PendingForms';

export type RatingTab = 'received' | 'sent' | 'pending';

export interface Rating {
  id: string;
  equipment: string;
  person: string;
  stars: number;
  comment: string;
  date: string;
  image: string;
}

const RECEIVED: Rating[] = [
  { id: '1', equipment: 'مولد كهرباء', person: 'محمد سالم (مؤجر)', stars: 5, comment: 'مستأجر ممتاز، يحترم المواعيد ويعامل المعدة بعناية.', date: '04 فبراير 2025', image: '👤' },
  { id: '2', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 4, comment: 'مستأجر جيد، أعاد المعدة بحالة ممتازة.', date: '25 يناير 2025', image: '👤' },
];

const SENT: Rating[] = [
  { id: '3', equipment: 'مولد كهرباء', person: 'أحمد علي (مؤجر)', stars: 5, comment: 'مؤجر رائع، المعدة بحالة ممتازة والتسليم كان في الوقت المحدد.', date: '04 فبراير 2025', image: '⚡' },
  { id: '4', equipment: 'رافعة شوكية', person: 'علي حسن (مؤجر)', stars: 3, comment: 'المعدة جيدة لكن التواصل كان بطيئا.', date: '25 يناير 2025', image: '🏗️' },
];

const PENDING = [
  { id: '5', orderNum: 'OP-1048', equipment: 'حفارة صغيرة', lessor: 'محمد سالم', image: '🚧', date: '10 فبراير 2025' },
];

export function RatingsPage() {
  const [activeTab, setActiveTab] = useState<RatingTab>('pending');
  const [pendingRatings, setPendingRatings] = useState(PENDING);
  const [ratingValues, setRatingValues] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});

  const avgRating = [...RECEIVED, ...SENT].reduce((sum, rating) => sum + rating.stars, 0) / (RECEIVED.length + SENT.length);
  const tabs = [
    { key: 'received' as RatingTab, label: 'مستلمة', count: RECEIVED.length },
    { key: 'sent' as RatingTab, label: 'مرسلة', count: SENT.length },
    { key: 'pending' as RatingTab, label: 'بانتظار التقييم', count: pendingRatings.length },
  ];

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6 max-w-2xl mx-auto" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <SummaryCard received={RECEIVED} sent={SENT} avgRating={avgRating} />
      <FilterTabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
      {activeTab === 'received' && <RatingsList ratings={RECEIVED} />}
      {activeTab === 'sent' && <RatingsList ratings={SENT} />}
      {activeTab === 'pending' && (
        <PendingForms
          pendingRatings={pendingRatings}
          ratingValues={ratingValues}
          setRatingValues={setRatingValues}
          comments={comments}
          setComments={setComments}
          setPendingRatings={setPendingRatings}
        />
      )}
    </div>
  );
}
