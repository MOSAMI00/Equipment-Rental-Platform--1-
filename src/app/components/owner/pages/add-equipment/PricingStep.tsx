import React from 'react';

interface PricingStepProps {
  draft: any;
  updateDraft: (key: string) => (e: any) => void;
}

export function PricingStep({ draft, updateDraft }: PricingStepProps) {
  return (
    <div>
      <h3 className="mb-6">التسعير</h3>
      <div className="owner-grid-2">
        <div className="mb-4">
          <label className="owner-label">💰 السعر اليومي * (ر.ي)</label>
          <input type="number" className="owner-input" placeholder="مثال: 15000" value={draft.dailyRate} onChange={updateDraft('dailyRate')} />
        </div>
        <div className="mb-4">
          <label className="owner-label">السعر الأسبوعي (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
          <input type="number" className="owner-input" placeholder="مثال: 90000" />
        </div>
        <div className="mb-4">
          <label className="owner-label">السعر الشهري (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
          <input type="number" className="owner-input" placeholder="مثال: 300000" />
        </div>
        <div className="mb-4">
          <label className="owner-label">🛡️ مبلغ التأمين * (ر.ي)</label>
          <input type="number" className="owner-input" placeholder="مثال: 50000" value={draft.insuranceAmount} onChange={updateDraft('insuranceAmount')} />
          <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
            يُحتجز من المستأجر عبر Escrow ويُرد بعد التسليم السليم
          </span>
        </div>
        <div className="mb-4">
          <label className="owner-label">الحد الأدنى للإيجار</label>
          <select className="owner-input">
            <option>يوم واحد</option>
            <option>يومان</option>
            <option>3 أيام</option>
            <option>أسبوع</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="owner-label">الحد الأقصى للإيجار (أيام)</label>
          <input type="number" className="owner-input" placeholder="مثال: 30" />
        </div>
        <div className="mb-4">
          <label className="owner-label">خصم % <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
          <input type="number" className="owner-input" placeholder="مثال: 10" min="0" max="100" />
        </div>
      </div>
    </div>
  );
}
