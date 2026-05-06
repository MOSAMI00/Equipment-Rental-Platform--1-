import { useAuth } from '../../../auth/AuthContext';
import { RatingsPage } from '../../tenant/Dashboard/Ratings/RatingsPage';
import OwnerReviews from '../../owner/pages/reviews/Reviews';

export function UnifiedRatingsPage() {
  const { user } = useAuth();
  if (user?.type === 'owner') {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
        <OwnerReviews />
      </div>
    );
  }
  return <RatingsPage />;
}
