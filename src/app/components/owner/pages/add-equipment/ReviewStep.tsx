import React from 'react';
import { Image as ImageIcon } from 'lucide-react';

interface ReviewStepProps {
  draft: any;
  images: any[];
}

export function ReviewStep({ draft, images }: ReviewStepProps) {
  const displayValue = (value: string | number) => value || '—';

  return (
    <div>
      <h3 className="mb-6">المراجعة والنشر</h3>

      <div className="review-preview mb-8">
        <div className="owner-card equipment-card" style={{ maxWidth: 380 }}>
          <div style={{ height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
            <ImageIcon size={48} />
          </div>
          <div className="equipment-details">
            <div className="flex-between mb-2">
              <h3 className="equipment-title" style={{ margin: 0 }}>{displayValue(draft.name)}</h3>
              <span className="badge badge-available">● متاح</span>
            </div>
            <div className="equipment-info-row">📍 {displayValue([draft.governorate, draft.address].filter(Boolean).join(' - '))}</div>
            <div className="equipment-info-row">💰 {displayValue(draft.dailyRate)} ر.ي / اليوم</div>
            <div className="equipment-info-row">🛡️ تأمين: {displayValue(draft.insuranceAmount)} ر.ي</div>
          </div>
        </div>
      </div>

      <div className="owner-card mb-6" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <h4 className="mb-4">ملخص البيانات</h4>
        <div className="review-row"><span className="text-muted">الاسم:</span> {displayValue(draft.name)}</div>
        <div className="review-row"><span className="text-muted">الفئة:</span> {displayValue(draft.category)}</div>
        <div className="review-row"><span className="text-muted">الموقع:</span> {displayValue([draft.governorate, draft.address].filter(Boolean).join(' - '))}</div>
        <div className="review-row"><span className="text-muted">الحالة:</span> ممتاز</div>
        <div className="review-row"><span className="text-muted">التسليم:</span> كلاهما</div>
        <div className="review-row"><span className="text-muted">السعر اليومي:</span> {displayValue(draft.dailyRate)} ر.ي</div>
        <div className="review-row"><span className="text-muted">التأمين:</span> {displayValue(draft.insuranceAmount)} ر.ي</div>
        <div className="review-row"><span className="text-muted">الصور:</span> {images.length || '—'}</div>
      </div>
    </div>
  );
}
