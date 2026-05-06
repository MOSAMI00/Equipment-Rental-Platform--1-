import React from 'react';
import { DataTable } from '../../../shared';
import { UNKNOWN_EQUIPMENT, UNKNOWN_USER } from './reviewHelpers';

const ReviewsTable = ({ reviews }) => {
  const columns = [
    {
      key: 'tenant',
      header: 'المستأجر',
      cell: (review) => {
        const tenant = review.tenant ?? {};
        return (
          <div className="flex-center gap-2" style={{ justifyContent: 'flex-start' }}>
            <div className="flex-center" style={{ borderRadius: '50%', width: 28, height: 28, backgroundColor: 'var(--color-page-bg)', fontSize: 12 }}>
              {(tenant.name ?? '?').charAt(0)}
            </div>
            {tenant.name ?? UNKNOWN_USER}
          </div>
        );
      },
    },
    {
      key: 'rating',
      header: 'التقييم',
      cell: (review) => <span style={{ color: '#F39C12' }}>{'★'.repeat(review.rating ?? 0)}</span>,
    },
    {
      key: 'text',
      header: 'النص',
      cell: (review) => review.reviewText ?? '—',
    },
    {
      key: 'equipment',
      header: 'المعدة',
      cell: (review) => review.equipment?.name ?? UNKNOWN_EQUIPMENT,
    },
    {
      key: 'createdAt',
      header: 'التاريخ',
      cell: (review) => review.createdAt?.slice(0, 10) ?? '—',
    },
  ];

  return (
    <div className="owner-card mb-8">
      <h4 className="mb-6">التقييمات المُستلمة</h4>
      <DataTable
        columns={columns}
        data={reviews}
        getRowKey={(review) => review.id}
        emptyState={{ icon: '★', title: 'لا توجد تقييمات حتى الآن' }}
      />
    </div>
  );
};

export default ReviewsTable;
