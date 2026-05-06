import React from 'react';
import { AppButton, StatusBadge } from '../../../shared';

const PayoutMethodsTab = () => (
  <div>
    <h3 className="mb-6">وسائل استلام الأرباح</h3>
    <div className="owner-card mb-4" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <p style={{ margin: '0 0 4px', fontWeight: 600 }}>البنك الأهلي اليمني</p>
        <p className="text-muted" style={{ margin: 0, direction: 'ltr', display: 'inline-block' }}>**** 4521</p>
      </div>
      <StatusBadge status="completed" label="الافتراضية" />
    </div>
    <AppButton variant="outline">إضافة وسيلة جديدة</AppButton>
  </div>
);

export default PayoutMethodsTab;
