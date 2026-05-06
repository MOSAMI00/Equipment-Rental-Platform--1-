import React from 'react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import type { RentalListItem } from '../../../../types/owner';
import type { HandoverReport } from '../../../../data/mock-api';

interface RentalDetailPanelProps {
  selectedRental: RentalListItem;
  selectedHandovers: HandoverReport[];
  onClose: () => void;
}

export function RentalDetailPanel({ selectedRental, selectedHandovers, onClose }: RentalDetailPanelProps) {
  const selectedEquipment = selectedRental.equipment;
  const selectedTenant = selectedRental.tenant;

  const timeline = selectedRental
    ? [
        { label: 'تأكيد الطلب', done: ['confirmed', 'in_use', 'completed', 'disputed'].includes(selectedRental.status as string) },
        { label: 'الدفع وحجز الضمان', done: selectedRental.paymentStatus === 'paid' },
        { label: 'تسليم المعدة', done: ['in_use', 'completed', 'disputed'].includes(selectedRental.status as string) },
        { label: 'إرجاع المعدة', done: selectedRental.status === 'completed' },
        { label: 'اكتمال العملية', done: selectedRental.status === 'completed' },
      ]
    : [];

  return (
    <div>
      <div className="flex-between mb-4">
        <h3 style={{ margin: 0 }}>تفاصيل العملية #{selectedRental.orderNum}</h3>
        <button className="owner-btn owner-btn-outline" style={{ fontSize: 12 }} onClick={onClose}>
          إغلاق
        </button>
      </div>
      <div className="owner-grid-2">
        {/* Left: Details */}
        <div className="owner-card">
          <h4 className="mb-4">معلومات العملية</h4>
          <div className="flex-center gap-4 mb-6" style={{ justifyContent: 'flex-start' }}>
            <img src={selectedEquipment?.image ?? ''} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
            <div>
              <h5 style={{ margin: '0 0 4px' }}>{selectedEquipment?.name ?? '—'}</h5>
              <p className="text-muted mb-0" style={{ fontSize: 13 }}>📍 {selectedEquipment?.location ?? '—'}</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
            <div>
              <span className="text-muted" style={{ fontSize: 12 }}>المستأجر</span>
              <p style={{ fontWeight: 600, margin: '2px 0' }}>{selectedTenant?.name ?? '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}</p>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: 12 }}>الهاتف</span>
              <p style={{ fontWeight: 600, margin: '2px 0', direction: 'ltr', textAlign: 'right' }}>
                {selectedTenant?.phone ?? '—'}
              </p>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: 12 }}>الفترة</span>
              <p style={{ fontWeight: 600, margin: '2px 0', fontSize: 13 }}>{formatRentalDateRange(selectedRental.startDate ?? '', selectedRental.endDate ?? '')}</p>
            </div>
            <div>
              <span className="text-muted" style={{ fontSize: 12 }}>الدفع</span>
              <p style={{ fontWeight: 600, margin: '2px 0' }}>
                {selectedRental.paymentStatus === 'paid' ? '✅ مدفوع' : '⏳ غير مدفوع'}
              </p>
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
          <div className="flex-between mb-2"><span className="text-muted">مبلغ الإيجار</span><span>{formatCurrency(selectedRental.rentalAmount ?? 0)} ر.ي</span></div>
          <div className="flex-between mb-2"><span className="text-muted">مبلغ التأمين</span><span>{formatCurrency(selectedRental.insuranceAmount ?? 0)} ر.ي</span></div>
          <div className="flex-between" style={{ fontWeight: 700 }}>
            <span>الإجمالي</span>
            <span style={{ color: 'var(--color-primary-green)' }}>{formatCurrency(selectedRental.totalAmount ?? 0)} ر.ي</span>
          </div>

          {selectedHandovers.length > 0 && (
            <>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
              <h5 className="mb-3">تقارير التسليم</h5>
              {selectedHandovers.map((h) => (
                <div key={h.id} className="owner-card" style={{ boxShadow: 'none', backgroundColor: 'var(--color-page-bg)', marginBottom: 8 }}>
                  <div className="flex-between mb-1">
                    <span style={{ fontWeight: 600, fontSize: 13 }}>
                      {h.phase === 'delivery' ? '📦 تسليم' : '🔄 إرجاع'}
                    </span>
                    <span className={`badge ${h.confirmedAt ? 'badge-completed' : 'badge-pending'}`} style={{ fontSize: 11 }}>
                      {h.confirmedAt ? '✅ مؤكد' : '⏳ بانتظار تأكيدك'}
                    </span>
                  </div>
                  <p className="text-muted mb-0" style={{ fontSize: 12 }}>
                    الحالة: {h.conditionStatus ?? '—'} | أضرار: {h.hasDamage ? 'نعم' : 'لا'}
                  </p>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Right: Timeline */}
        <div className="owner-card">
          <h4 className="mb-4">الجدول الزمني للعملية</h4>
          <div style={{ position: 'relative', paddingRight: 28 }}>
            <div style={{ position: 'absolute', right: 7, top: 10, bottom: 10, width: 2, backgroundColor: 'var(--color-border)' }}></div>
            {timeline.map((step, idx) => (
              <div key={idx} style={{ position: 'relative', marginBottom: 24 }}>
                <div style={{
                  position: 'absolute',
                  right: -28,
                  top: 2,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  backgroundColor: step.done ? 'var(--color-primary-green)' : 'white',
                  border: `2px solid ${step.done ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
                  zIndex: 1,
                }}></div>
                <span style={{
                  fontWeight: step.done ? 600 : 400,
                  color: step.done ? 'var(--color-text-primary)' : 'var(--color-text-muted)',
                }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
