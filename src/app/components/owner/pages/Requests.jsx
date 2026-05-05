import React, { useEffect, useMemo, useState } from 'react';
import { Search, Eye, Check, X as XIcon, Filter } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../auth/AuthContext';
import {
  formatCurrency,
  formatRentalDateRange,
  getEquipmentSnapshot,
  getTenantProfile,
  useRentalPlatform,
} from '../../../data/mock-api';
import { STATUS_CONFIG } from '../../tenant/Dashboard/shared/OrderTypes';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EmptyState from '../shared/EmptyState';
import { EquipmentCardSkeleton } from '../shared/OwnerSkeletons';

const tabs = [
  { id: 'all', label: 'الكل', icon: '' },
  { id: 'pending', label: 'بانتظار الموافقة', icon: '⏳' },
  { id: 'confirmed', label: 'مقبولة', icon: '✅' },
  { id: 'in_use', label: 'قيد الاستخدام', icon: '🔧' },
  { id: 'completed', label: 'مكتملة', icon: '🎉' },
  { id: 'cancelled', label: 'ملغية', icon: '❌' },
];

const Requests = () => {
  const { user } = useAuth();
  const {
    approveRentalRequest,
    rejectRentalRequest,
  } = useRentalPlatform();
  const { rentals } = useOwnerPageProps();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(() => (
    rentals
      .filter((rental) => rental.ownerId === user?.id)
      .filter((rental) => activeTab === 'all' || rental.status === activeTab)
      .filter((rental) => {
        const equipment = getEquipmentSnapshot(rental.equipmentId);
        const tenant = getTenantProfile(rental.tenantId);
        return (
          equipment.name.includes(search) ||
          rental.orderNum.includes(search) ||
          tenant.name.includes(search)
        );
      })
  ), [activeTab, rentals, search, user?.id]);

  const selectedRental = ownerRentals.find((rental) => rental.id === selectedRentalId)
    ?? rentals.find((rental) => rental.id === selectedRentalId);

  const openModal = (type, rentalId) => {
    setSelectedRentalId(rentalId);
    setModal(type);
  };

  const confirmApprove = () => {
    if (!selectedRental) return;
    approveRentalRequest(selectedRental.id);
    toast.success('تم قبول الطلب وإشعار المستأجر لإتمام الدفع');
    setModal(null);
  };

  const confirmReject = () => {
    if (!selectedRental) return;
    rejectRentalRequest(selectedRental.id);
    toast.success('تم رفض الطلب وإشعار المستأجر');
    setModal(null);
  };

  return (
    <div>
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0 }}>الطلبات الواردة</h2>
        <div className="flex-center gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="owner-input"
              placeholder="بحث..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              style={{ paddingRight: 36, width: 220 }}
            />
          </div>
          <button className="owner-btn owner-btn-outline"><Filter size={16} /> فلتر</button>
        </div>
      </div>

      <div className="owner-tabs">
        {tabs.map((tab) => {
          const count = tab.id === 'all'
            ? rentals.filter((rental) => rental.ownerId === user?.id).length
            : rentals.filter((rental) => rental.ownerId === user?.id && rental.status === tab.id).length;

          return (
            <div
              key={tab.id}
              className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label} {count > 0 ? `(${count})` : ''}
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="owner-grid-2">
          <EquipmentCardSkeleton />
          <EquipmentCardSkeleton />
        </div>
      ) : ownerRentals.length === 0 ? (
        <EmptyState
          icon="📭"
          title="لا توجد طلبات مطابقة"
          description="ستظهر هنا طلبات الحجز الجديدة عند إرسالها من المستأجرين."
        />
      ) : (
        <div className="owner-grid-2">
          {ownerRentals.map((rental) => {
            const equipment = getEquipmentSnapshot(rental.equipmentId);
            const status = STATUS_CONFIG[rental.status];
            const tenant = getTenantProfile(rental.tenantId);

            return (
              <div key={rental.id} className="owner-card" style={{ borderTop: `3px solid ${status.color}` }}>
                <div className="flex-between mb-4">
                  <div className="flex-center gap-4" style={{ justifyContent: 'flex-start' }}>
                    <img src="https://i.pravatar.cc/150?img=12" alt={tenant.name} style={{ width: 48, height: 48, borderRadius: '50%' }} />
                    <div>
                      <h4 style={{ margin: '0 0 2px' }}>{tenant.name}</h4>
                      <span className="text-muted" style={{ fontSize: 13, direction: 'ltr', display: 'inline-block' }}>
                        📞 {tenant.phone}
                      </span>
                      <div className="flex-center gap-2 mt-2" style={{ justifyContent: 'flex-start' }}>
                        <span className="text-muted" style={{ fontSize: 12 }}>⭐ 4.6</span>
                        <span className="text-muted" style={{ fontSize: 12 }}>|</span>
                        <span className="text-muted" style={{ fontSize: 12 }}>8 عمليات سابقة</span>
                      </div>
                    </div>
                  </div>
                  <span className={`badge badge-${rental.status.replace('_', '-')}`}>
                    {status.label}
                  </span>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

                <div className="mb-4">
                  <p style={{ fontWeight: 600, margin: '0 0 8px' }}>#{rental.orderNum} · {equipment.name}</p>
                  <p className="text-muted mb-2" style={{ fontSize: 14 }}>
                    📅 {formatRentalDateRange(rental.startDate, rental.endDate)} | ⏱️ {rental.durationDays} أيام
                  </p>
                  <p className="text-muted mb-2" style={{ fontSize: 14 }}>📍 {equipment.location}</p>
                  <p style={{ fontSize: 14, margin: 0 }}>
                    💰 الإيجار: <strong>{formatCurrency(rental.rentalAmount)} ر.ي</strong> | التأمين: <strong>{formatCurrency(rental.insuranceAmount)} ر.ي</strong>
                  </p>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '12px 0' }} />

                {rental.status === 'pending' ? (
                  <div className="flex-center gap-4">
                    <button className="owner-btn owner-btn-danger" style={{ flex: 1 }} onClick={() => openModal('reject', rental.id)}>
                      ❌ رفض
                    </button>
                    <button className="owner-btn owner-btn-success" style={{ flex: 1 }} onClick={() => openModal('accept', rental.id)}>
                      ✅ قبول الطلب
                    </button>
                  </div>
                ) : (
                  <button className="owner-btn owner-btn-outline w-full" onClick={() => openModal('detail', rental.id)}>
                    <Eye size={16} /> عرض التفاصيل
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {modal === 'accept' && selectedRental && (
        <div className="owner-modal-overlay">
          <div className="owner-modal" style={{ maxWidth: 420 }}>
            <div className="owner-modal-body" style={{ textAlign: 'center', padding: '40px 32px' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', backgroundColor: 'rgba(39, 174, 96, 0.1)', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Check size={32} color="var(--color-completed)" />
              </div>
              <h3 style={{ margin: '0 0 12px' }}>تأكيد قبول الطلب؟</h3>
              <p className="text-muted mb-6">سيتم إشعار المستأجر لإتمام الدفع، ثم حفظ المبلغ في الضمان بعد الدفع.</p>
              <div className="flex-center gap-4">
                <button className="owner-btn owner-btn-outline" style={{ flex: 1 }} onClick={() => setModal(null)}>إلغاء</button>
                <button className="owner-btn owner-btn-success" style={{ flex: 1 }} onClick={confirmApprove}>تأكيد القبول</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {modal === 'reject' && selectedRental && (
        <div className="owner-modal-overlay">
          <div className="owner-modal" style={{ maxWidth: 450 }}>
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">رفض الطلب</h3>
              <XIcon className="owner-modal-close" onClick={() => setModal(null)} />
            </div>
            <div className="owner-modal-body">
              <div className="mb-4">
                <label className="owner-label">سبب الرفض</label>
                <select className="owner-input mb-4">
                  <option>المعدة غير متاحة في هذا التاريخ</option>
                  <option>الموقع بعيد جداً</option>
                  <option>تقييم المستأجر منخفض</option>
                  <option>سبب آخر</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="owner-label">ملاحظات إضافية</label>
                <textarea className="owner-input" rows={3} placeholder="سبب إضافي..."></textarea>
              </div>
            </div>
            <div className="owner-modal-footer">
              <button className="owner-btn owner-btn-outline" onClick={() => setModal(null)}>إلغاء</button>
              <button className="owner-btn owner-btn-danger" onClick={confirmReject}>تأكيد الرفض</button>
            </div>
          </div>
        </div>
      )}

      {modal === 'detail' && selectedRental && (
        <div className="owner-modal-overlay">
          <div className="owner-modal">
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">تفاصيل الطلب #{selectedRental.orderNum}</h3>
              <XIcon className="owner-modal-close" onClick={() => setModal(null)} />
            </div>
            <div className="owner-modal-body">
              <div className="owner-grid-2 mb-6">
                <div><span className="text-muted">المستأجر:</span><br /><strong>{getTenantProfile(selectedRental.tenantId).name}</strong></div>
                <div><span className="text-muted">الهاتف:</span><br /><strong style={{ direction: 'ltr', display: 'inline-block' }}>{getTenantProfile(selectedRental.tenantId).phone}</strong></div>
                <div><span className="text-muted">الحالة:</span><br /><strong>{STATUS_CONFIG[selectedRental.status].label}</strong></div>
                <div><span className="text-muted">الدفع:</span><br /><strong>{selectedRental.paymentStatus === 'paid' ? 'مدفوع' : 'غير مدفوع'}</strong></div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '16px 0' }} />
              <div className="mb-4">
                <span className="text-muted">المعدة:</span> <strong>{getEquipmentSnapshot(selectedRental.equipmentId).name}</strong>
              </div>
              <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
                <div className="flex-between mb-2"><span>الإيجار</span><span>{formatCurrency(selectedRental.rentalAmount)} ر.ي</span></div>
                <div className="flex-between mb-2"><span>رسوم الخدمة</span><span>{formatCurrency(selectedRental.serviceFee)} ر.ي</span></div>
                <div className="flex-between mb-2"><span>مبلغ التأمين</span><span>{formatCurrency(selectedRental.insuranceAmount)} ر.ي</span></div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '8px 0' }} />
                <div className="flex-between" style={{ fontWeight: 700 }}><span>الإجمالي</span><span>{formatCurrency(selectedRental.totalAmount)} ر.ي</span></div>
              </div>
            </div>
            <div className="owner-modal-footer">
              <button className="owner-btn owner-btn-outline" onClick={() => setModal(null)}>إغلاق</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
