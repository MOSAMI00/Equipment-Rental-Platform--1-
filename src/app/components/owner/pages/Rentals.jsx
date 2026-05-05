import React, { useState, useMemo, useEffect } from 'react';
import { Search, Eye, User, Calendar } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import {
  useRentalPlatform,
  formatCurrency,
  formatRentalDateRange,
} from '../../../data/mock-api';
import { STATUS_CONFIG } from '../../tenant/Dashboard/shared/OrderTypes';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EmptyState from '../shared/EmptyState';

const TABS = [
  { id: 'all', label: 'الكل' },
  { id: 'pending', label: 'بانتظار الموافقة' },
  { id: 'confirmed', label: 'مؤكدة' },
  { id: 'in_use', label: 'قيد الاستخدام' },
  { id: 'completed', label: 'مكتملة' },
  { id: 'cancelled', label: 'ملغية' },
  { id: 'disputed', label: 'نزاعات' },
];

const getStatusConfig = (status) => STATUS_CONFIG[status] ?? { label: status ?? 'غير معروف' };
const fallbackEquipment = (rental) => rental?.equipment ?? { name: 'معدة غير معروفة', image: '', location: '—' };
const fallbackTenant = (rental) => rental?.tenant ?? { name: 'مستخدم غير معروف', phone: '—' };

const Rentals = () => {
  const { user } = useAuth();
  const { getHandoverReportsForRental } = useRentalPlatform();
  const { rentals } = useOwnerPageProps();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(() => (
    rentals
      .filter((r) => r.ownerId === user?.id)
      .filter((r) => activeTab === 'all' || r.status === activeTab)
      .filter((r) => {
        const eq = fallbackEquipment(r);
        const tenant = fallbackTenant(r);
        return (
          (eq.name ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (r.orderNum ?? '').toLowerCase().includes(search.toLowerCase()) ||
          (tenant.name ?? '').includes(search)
        );
      })
  ), [activeTab, rentals, search, user?.id]);

  const selectedRental = useMemo(() =>
    rentals.find((r) => r.id === selectedRentalId),
    [rentals, selectedRentalId]
  );

  const selectedEquipment = selectedRental ? fallbackEquipment(selectedRental) : null;
  const selectedTenant = selectedRental ? fallbackTenant(selectedRental) : null;

  const selectedHandovers = selectedRental
    ? getHandoverReportsForRental(selectedRental.id)
    : [];

  const timeline = selectedRental
    ? [
        { label: 'تم الحجز', done: true },
        { label: 'تأكيد المؤجر', done: !['pending', 'cancelled'].includes(selectedRental.status) },
        { label: 'الدفع وحجز الضمان', done: selectedRental.paymentStatus === 'paid' },
        { label: 'تسليم المعدة', done: ['in_use', 'completed', 'disputed'].includes(selectedRental.status) },
        { label: 'إرجاع المعدة', done: selectedRental.status === 'completed' },
        { label: 'اكتمال العملية', done: selectedRental.status === 'completed' },
      ]
    : [];

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>عمليات التأجير</h2>
        <div className="flex-center gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="owner-input"
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: 36, width: 200 }}
            />
          </div>
        </div>
      </div>

      <div className="owner-tabs">
        {TABS.map((tab) => (
          <div
            key={tab.id}
            className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </div>
        ))}
      </div>

      <div className="owner-table-container owner-card mb-8">
        <table className="owner-table">
          <thead>
            <tr>
              <th>#</th>
              <th>المستأجر</th>
              <th>المعدة</th>
              <th>الفترة</th>
              <th>الإجمالي</th>
              <th>الحالة</th>
              <th>إجراء</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                  جاري تحميل العمليات...
                </td>
              </tr>
            ) : ownerRentals.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: 'center', padding: '32px', color: 'var(--color-text-muted)' }}>
                  <EmptyState
                    icon="📄"
                    title="لا توجد عمليات مطابقة"
                    description="جرّب تغيير البحث أو تبويب الحالة."
                  />
                </td>
              </tr>
            ) : (
              ownerRentals.map((rental) => {
                const eq = fallbackEquipment(rental);
                const tenant = fallbackTenant(rental);
                const status = getStatusConfig(rental.status);
                return (
                  <tr key={rental.id} style={{ cursor: 'pointer', backgroundColor: selectedRentalId === rental.id ? 'rgba(45,90,39,0.04)' : '' }}>
                    <td>{rental.orderNum ?? '—'}</td>
                    <td>{tenant.name ?? '\u0645\u0633\u062a\u062e\u062f\u0645 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}</td>
                    <td>{eq.name ?? '\u0645\u0639\u062f\u0629 \u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641\u0629'}</td>
                    <td style={{ fontSize: 12 }}>{formatRentalDateRange(rental.startDate ?? '', rental.endDate ?? '')}</td>
                    <td>{formatCurrency(rental.totalAmount)} ر.ي</td>
                    <td>
                      <span className={`badge badge-${(rental.status ?? 'unknown').replace('_', '-')}`}>
                        {status.label ?? rental.status ?? '\u063a\u064a\u0631 \u0645\u0639\u0631\u0648\u0641'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="owner-btn owner-btn-outline"
                        style={{ padding: '4px 10px', fontSize: 12 }}
                        onClick={() => setSelectedRentalId(selectedRentalId === rental.id ? null : rental.id)}
                      >
                        <Eye size={14} /> عرض
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedRental && selectedEquipment && (
        <div>
          <div className="flex-between mb-4">
            <h3 style={{ margin: 0 }}>تفاصيل العملية #{selectedRental.orderNum}</h3>
            <button className="owner-btn owner-btn-outline" style={{ fontSize: 12 }} onClick={() => setSelectedRentalId(null)}>
              إغلاق
            </button>
          </div>
          <div className="owner-grid-2">
            {/* Left: Details */}
            <div className="owner-card">
              <h4 className="mb-4">معلومات العملية</h4>
              <div className="flex-center gap-4 mb-6" style={{ justifyContent: 'flex-start' }}>
                <img src={selectedEquipment.image} alt="" style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <h5 style={{ margin: '0 0 4px' }}>{selectedEquipment.name}</h5>
                  <p className="text-muted mb-0" style={{ fontSize: 13 }}>📍 {selectedEquipment.location}</p>
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
                  <p style={{ fontWeight: 600, margin: '2px 0', fontSize: 13 }}>{formatRentalDateRange(selectedRental.startDate, selectedRental.endDate)}</p>
                </div>
                <div>
                  <span className="text-muted" style={{ fontSize: 12 }}>الدفع</span>
                  <p style={{ fontWeight: 600, margin: '2px 0' }}>
                    {selectedRental.paymentStatus === 'paid' ? '✅ مدفوع' : '⏳ غير مدفوع'}
                  </p>
                </div>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />
              <div className="flex-between mb-2"><span className="text-muted">مبلغ الإيجار</span><span>{formatCurrency(selectedRental.rentalAmount)} ر.ي</span></div>
              <div className="flex-between mb-2"><span className="text-muted">مبلغ التأمين</span><span>{formatCurrency(selectedRental.insuranceAmount)} ر.ي</span></div>
              <div className="flex-between" style={{ fontWeight: 700 }}>
                <span>الإجمالي</span>
                <span style={{ color: 'var(--color-primary-green)' }}>{formatCurrency(selectedRental.totalAmount)} ر.ي</span>
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
      )}
    </div>
  );
};

export default Rentals;
