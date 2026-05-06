export const UNKNOWN_USER = 'مستخدم غير معروف';
export const UNKNOWN_EQUIPMENT = 'معدة غير معروفة';

export const getRatingsDistribution = (reviews) => (
  [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((review) => review.rating === stars).length;
    const percent = reviews.length ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percent };
  })
);

export const getAverageRating = (reviews) => (
  reviews.length
    ? reviews.reduce((sum, review) => sum + (review.rating ?? 0), 0) / reviews.length
    : 0
);
