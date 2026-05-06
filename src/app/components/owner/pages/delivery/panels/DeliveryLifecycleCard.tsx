import React from 'react';
import type { HandoverReport } from '../../../../../data/mock-api';
import { CONDITION_LABELS } from './helpers';

export function DeliveryLifecycleCard({ ownerDeliveryReport, tenantDeliveryReport }: {
  ownerDeliveryReport?: HandoverReport;
  tenantDeliveryReport?: HandoverReport;
}) {
  if (!ownerDeliveryReport) return null;

  return (
    <div className="owner-card mb-4">
      <div className="flex-between mb-4">
        <h4 style={{ margin: 0 }}>📦 دورة التسليم</h4>
        {tenantDeliveryReport ? <span className="badge badge-completed">✅ المستأجر استلم</span> : <span className="badge badge-pending">⏳ بانتظار تأكيد المستأجر</span>}
      </div>
      <p className="text-muted" style={{ fontSize: 13, marginBottom: 8 }}>
        تم تسليم المعدة من المؤجر بتاريخ {ownerDeliveryReport.createdAt?.slice(0, 10) ?? '—'}.
      </p>
      {ownerDeliveryReport.notes ? <p className="text-muted" style={{ fontSize: 13, marginBottom: 10 }}>{ownerDeliveryReport.notes}</p> : null}
      {!tenantDeliveryReport ? <p className="text-muted" style={{ fontSize: 12 }}>المستأجر لم يؤكد الاستلام بعد.</p> : null}
      {tenantDeliveryReport ? (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 8 }}>
          <div>
            <span className="text-muted" style={{ fontSize: 12 }}>حالة المعدة عند الاستلام</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>
              {tenantDeliveryReport.conditionStatus ? (CONDITION_LABELS[tenantDeliveryReport.conditionStatus] ?? tenantDeliveryReport.conditionStatus) : '—'}
            </p>
          </div>
          <div>
            <span className="text-muted" style={{ fontSize: 12 }}>مشاكل</span>
            <p style={{ fontWeight: 600, margin: '2px 0' }}>{tenantDeliveryReport.hasIssues ? '⚠️ نعم' : '✅ لا'}</p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
