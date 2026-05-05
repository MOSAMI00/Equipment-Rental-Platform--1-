import React, { useEffect, useMemo, useState } from 'react';
import { DollarSign, CreditCard, Plus, Edit2, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../../../auth/AuthContext';
import { formatCurrency, getTenantProfile } from '../../../data/mock-api';
import KPICard from '../shared/KPICard';
import { ChartSkeleton, KPICardSkeleton } from '../shared/OwnerSkeletons';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';

const Earnings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { rentals } = useOwnerPageProps();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(
    () => rentals.filter((rental) => rental.ownerId === user?.id),
    [rentals, user?.id],
  );

  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = ownerRentals
        .filter((rental) => {
          const created = new Date(rental.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, rental) => total + rental.rentalAmount, 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [ownerRentals]);

  const thisMonth = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const total = ownerRentals.reduce((sum, rental) => sum + rental.rentalAmount, 0);
  const pendingTransfer = ownerRentals
    .filter((rental) => rental.paymentStatus === 'paid' && rental.escrowStatus === 'held')
    .reduce((sum, rental) => sum + rental.rentalAmount, 0);
  const transferred = Math.max(0, total - pendingTransfer);
  const paymentsRows = ownerRentals
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>الأرباح والمدفوعات</h2>

      {/* 4 KPI Cards */}
      <div className="owner-grid-4">
        {isLoading ? (
          <>
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
            <KPICardSkeleton />
          </>
        ) : (
          <>
            <KPICard
              title="💰 هذا الشهر"
              value={`${formatCurrency(thisMonth)} ر.ي`}
              icon={<DollarSign />}
              iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
            />
            <KPICard
              title="📊 الإجمالي"
              value={`${formatCurrency(total)} ر.ي`}
              icon={<TrendingUp />}
              iconStyle={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}
            />
            <KPICard
              title="⏳ قيد التحويل"
              value={`${formatCurrency(pendingTransfer)} ر.ي`}
              valueClassName="text-warning"
              icon={<DollarSign />}
              iconStyle={{ color: 'var(--color-pending)', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}
            />
            <KPICard
              title="✅ محوّل"
              value={`${formatCurrency(transferred)} ر.ي`}
              valueClassName="text-success"
              icon={<DollarSign />}
              iconStyle={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}
            />
          </>
        )}
      </div>

      <div className="owner-grid-2">
        {/* Payment Method */}
        <div className="owner-card">
          <div className="flex-between mb-6">
            <h4 className="flex-center gap-2" style={{ margin: 0 }}><CreditCard size={20} /> وسيلة استلام الأرباح</h4>
          </div>
          <div style={{ backgroundColor: 'var(--color-page-bg)', padding: 16, borderRadius: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <div>
              <p style={{ margin: '0 0 4px', fontWeight: 600 }}>البنك الأهلي اليمني</p>
              <p className="text-muted" style={{ margin: 0, direction: 'ltr', display: 'inline-block' }}>**** 4521</p>
            </div>
            <span className="badge badge-completed">✅ محددة</span>
          </div>
          <div className="flex-center gap-4">
            <button className="owner-btn owner-btn-outline" style={{ flex: 1 }}><Edit2 size={16} /> تعديل</button>
            <button className="owner-btn owner-btn-primary" style={{ flex: 1 }} onClick={() => setIsModalOpen(true)}><Plus size={16} /> إضافة وسيلة</button>
          </div>
        </div>

        {/* Bar Chart — 12 months */}
        {isLoading ? <ChartSkeleton height={220} /> : (
          <div className="owner-card">
            <h4 className="mb-6">📊 الأرباح — آخر 12 شهراً</h4>
            <div style={{ width: '100%', height: 220 }}>
              <ResponsiveContainer>
                <BarChart data={dataEarnings}>
                  <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                  <YAxis tick={{ fontSize: 10 }} />
                  <Tooltip formatter={(v) => `${Number(v).toLocaleString()} ر.ي`} />
                  <Bar dataKey="amount" fill="#2D5A27" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Payments Table */}
      <div className="owner-card">
        <div className="flex-between mb-6">
          <h4 style={{ margin: 0 }}>سجل المدفوعات</h4>
          <button className="owner-btn owner-btn-outline"><Download size={16} /> تحميل كشف</button>
        </div>
        <div className="owner-table-container">
          <table className="owner-table">
            <thead>
              <tr>
                <th>الطلب</th>
                <th>المستأجر</th>
                <th>مبلغ الإيجار</th>
                <th>عمولة المنصة</th>
                <th>صافي الأرباح</th>
                <th>حالة التحويل</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                    جاري تحميل السجل...
                  </td>
                </tr>
              ) : paymentsRows.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 24, color: 'var(--color-text-muted)' }}>
                    لا توجد مدفوعات حتى الآن
                  </td>
                </tr>
              ) : (
                paymentsRows.map((rental) => {
                  const fee = Math.round(rental.rentalAmount * 0.05);
                  const net = rental.rentalAmount - fee;
                  const tenant = getTenantProfile(rental.tenantId);
                  return (
                    <tr key={rental.id}>
                      <td>{rental.orderNum}</td>
                      <td>{tenant.name}</td>
                      <td>{formatCurrency(rental.rentalAmount)} ر.ي</td>
                      <td className="text-muted">{formatCurrency(fee)} ر.ي</td>
                      <td style={{ fontWeight: 700 }}>{formatCurrency(net)} ر.ي</td>
                      <td>
                        {rental.escrowStatus === 'released' ? (
                          <span style={{ color: 'var(--color-completed)', fontWeight: 600 }}>Paid ✅</span>
                        ) : rental.escrowStatus === 'held' ? (
                          <span style={{ color: 'var(--color-pending)', fontWeight: 600 }}>Processing ⏳</span>
                        ) : (
                          <span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="owner-modal-overlay">
          <div className="owner-modal" style={{ maxWidth: 500 }}>
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">إضافة وسيلة استلام</h3>
              <div className="owner-modal-close" onClick={() => setIsModalOpen(false)}>✕</div>
            </div>
            <div className="owner-modal-body">
              <div className="mb-4">
                <label className="owner-label">اختر النوع</label>
                <div className="radio-group">
                  <label className="radio-option"><input type="radio" name="methodType" defaultChecked /> حساب بنكي</label>
                  <label className="radio-option"><input type="radio" name="methodType" /> محفظة إلكترونية</label>
                </div>
              </div>
              <div className="mb-4">
                <label className="owner-label">اسم البنك / المحفظة *</label>
                <input type="text" className="owner-input" placeholder="مثال: بنك الكريمي" />
              </div>
              <div className="mb-4">
                <label className="owner-label">رقم الحساب / المحفظة *</label>
                <input type="text" className="owner-input" placeholder="123456789" style={{ direction: 'ltr' }} />
              </div>
              <div className="mb-4">
                <label className="owner-label">اسم صاحب الحساب *</label>
                <input type="text" className="owner-input" placeholder="كما هو في البنك" />
              </div>
            </div>
            <div className="owner-modal-footer">
              <button className="owner-btn owner-btn-outline" onClick={() => setIsModalOpen(false)}>إلغاء</button>
              <button className="owner-btn owner-btn-primary" onClick={() => setIsModalOpen(false)}>💾 حفظ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Earnings;
