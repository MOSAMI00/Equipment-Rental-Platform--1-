import React from 'react';
import { Eye, Filter, Search } from 'lucide-react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import { STATUS_CONFIG } from '../../../tenant/Dashboard/shared/OrderTypes';
import DetailsModal from '../../shared/DetailsModal';

const UNKNOWN_EQUIPMENT = '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629';
const UNKNOWN_USER = '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641';
const UNKNOWN_STATUS = '\u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641';

const statusConfig = (status) => STATUS_CONFIG[status] ?? { label: status ?? UNKNOWN_STATUS, color: '#95A5A6' };
const equipmentOf = (rental) => rental?.equipment ?? {};
const tenantOf = (rental) => rental?.tenant ?? {};

export const RequestFilters = ({ search, onSearchChange }) => (
  <div className="flex-center gap-4">
    <div style={{ position: 'relative' }}>
      <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
      <input
        type="text"
        className="owner-input"
        placeholder="بحث..."
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        style={{ paddingRight: 36, width: 220 }}
      />
    </div>
    <button className="owner-btn owner-btn-outline"><Filter size={16} /> فلتر</button>
  </div>
);

export const RequestDecisionActions = ({ rental, onOpenModal }) => {
  if (rental?.status !== 'pending') {
    return (
      <button className="owner-btn owner-btn-outline w-full" onClick={() => onOpenModal('detail', rental?.id)}>
        <Eye size={16} /> عرض التفاصيل
      </button>
    );
  }

  return (
    <div className="flex-center gap-4">
      <button className="owner-btn owner-btn-danger" style={{ flex: 1 }} onClick={() => onOpenModal('reject', rental.id)}>
        ❌ رفض
      </button>
      <button className="owner-btn owner-btn-success" style={{ flex: 1 }} onClick={() => onOpenModal('accept', rental.id)}>
        ✅ قبول الطلب
      </button>
    </div>
  );
};

export const RequestCard = ({ rental, onOpenModal }) => {
  const equipment = equipmentOf(rental);
  const tenant = tenantOf(rental);
  const status = statusConfig(rental?.status);
  const completedCount = tenant.completedRentalsCount;
  const tenantRating = tenant.rating;

  return (
    <div className="owner-card" style={{ borderTop: `3px solid ${status.color}` }}>
      <div className="flex-between mb-4">
        <div className="flex-center gap-4" style={{ justifyContent: 'flex-start' }}>
          {tenant.avatarUrl ? (
            <img src={tenant.avatarUrl} alt={tenant.name ?? ''} style={{ width: 48, height: 48, borderRadius: '50%' }} />
          ) : (
            <div className="flex-center" style={{ width: 48, height: 48, borderRadius: '50%', backgroundColor: 'var(--color-page-bg)', fontWeight: 700 }}>
              {(tenant.name ?? '?').charAt(0)}
            </div>
          )}
          <div>
            <h4 style={{ margin: '0 0 2px' }}>{tenant.name ?? UNKNOWN_USER}</h4>
            <span className="text-muted" style={{ fontSize: 13, direction: 'ltr', display: 'inline-block' }}>
              📞 {tenant.phone ?? '—'}
            </span>
            {(tenantRating != null || completedCount != null) && (
              <div className="flex-center gap-2 mt-2" style={{ justifyContent: 'flex-start' }}>
                {tenantRating != null ? <span className="text-muted" style={{ fontSize: 12 }}>⭐ {tenantRating}</span> : null}
                {tenantRating != null && completedCount != null ? <span className="text-muted" style={{ fontSize: 12 }}>|</span> : null}
                {completedCount != null ? <span className="text-muted" style={{ fontSize: 12 }}>{completedCount} عمليات سابقة</span> : null}
              </div>
            )}
          </div>
        </div>
        <span className={`badge badge-${(rental?.status ?? 'unknown').replace('_', '-')}`}>
          {status.label ?? UNKNOWN_STATUS}
        </span>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

      <div className="mb-4">
        <p style={{ fontWeight: 600, margin: '0 0 8px' }}>#{rental?.orderNum ?? '—'} · {equipment.name ?? UNKNOWN_EQUIPMENT}</p>
        <p className="text-muted mb-2" style={{ fontSize: 14 }}>
          📅 {formatRentalDateRange(rental?.startDate ?? '', rental?.endDate ?? '')} | ⏱️ {rental?.durationDays ?? '—'} أيام
        </p>
        <p className="text-muted mb-2" style={{ fontSize: 14 }}>📍 {equipment.location ?? '—'}</p>
        <p style={{ fontSize: 14, margin: 0 }}>
          💰 الإيجار: <strong>{formatCurrency(rental?.rentalAmount ?? 0)} ر.ي</strong> | التأمين: <strong>{formatCurrency(rental?.insuranceAmount ?? 0)} ر.ي</strong>
        </p>
      </div>

      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
      <RequestDecisionActions rental={rental} onOpenModal={onOpenModal} />
    </div>
  );
};

export const RequestDetailsModal = ({ isOpen, rental, onClose }) => {
  const equipment = equipmentOf(rental);
  const tenant = tenantOf(rental);
  const status = statusConfig(rental?.status);

  return (
    <DetailsModal
      isOpen={isOpen}
      title={`تفاصيل الطلب #${rental?.orderNum ?? '—'}`}
      onClose={onClose}
      footer={<button className="owner-btn owner-btn-outline" onClick={onClose}>إغلاق</button>}
    >
      <div className="owner-grid-2 mb-6">
        <div><span className="text-muted">المستأجر:</span><br /><strong>{tenant.name ?? UNKNOWN_USER}</strong></div>
        <div><span className="text-muted">الهاتف:</span><br /><strong style={{ direction: 'ltr', display: 'inline-block' }}>{tenant.phone ?? '—'}</strong></div>
        <div><span className="text-muted">الحالة:</span><br /><strong>{status.label ?? UNKNOWN_STATUS}</strong></div>
        <div><span className="text-muted">الدفع:</span><br /><strong>{rental?.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}</strong></div>
      </div>
      <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
      <div className="mb-4">
        <span className="text-muted">المعدة:</span> <strong>{equipment.name ?? UNKNOWN_EQUIPMENT}</strong>
      </div>
      <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
        <div className="flex-between mb-2"><span>الإيجار</span><span>{formatCurrency(rental?.rentalAmount ?? 0)} ر.ي</span></div>
        <div className="flex-between mb-2"><span>رسوم الخدمة</span><span>{formatCurrency(rental?.serviceFee ?? 0)} ر.ي</span></div>
        <div className="flex-between mb-2"><span>مبلغ التأمين</span><span>{formatCurrency(rental?.insuranceAmount ?? 0)} ر.ي</span></div>
        <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
        <div className="flex-between" style={{ fontWeight: 700 }}><span>الإجمالي</span><span>{formatCurrency(rental?.totalAmount ?? 0)} ر.ي</span></div>
      </div>
    </DetailsModal>
  );
};

