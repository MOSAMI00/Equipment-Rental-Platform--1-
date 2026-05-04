import React, { useState } from 'react';
import { DollarSign, CreditCard, Plus, Edit2, Download, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const dataEarnings = [
  { name: 'مايو', amount: 45000 }, { name: 'يونيو', amount: 60000 },
  { name: 'يوليو', amount: 72000 }, { name: 'أغسطس', amount: 55000 },
  { name: 'سبتمبر', amount: 68000 }, { name: 'أكتوبر', amount: 80000 },
  { name: 'نوفمبر', amount: 90000 }, { name: 'ديسمبر', amount: 75000 },
  { name: 'يناير', amount: 85000 }, { name: 'فبراير', amount: 70000 },
  { name: 'مارس', amount: 88000 }, { name: 'أبريل', amount: 85000 },
];

const Earnings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>الأرباح والمدفوعات</h2>

      {/* 4 KPI Cards */}
      <div className="owner-grid-4">
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>💰 هذا الشهر</h4>
            <p className="kpi-value">85,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
            <DollarSign />
          </div>
        </div>
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>📊 الإجمالي</h4>
            <p className="kpi-value">750,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
            <TrendingUp />
          </div>
        </div>
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>⏳ قيد التحويل</h4>
            <p className="kpi-value text-warning">45,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-pending)', backgroundColor: 'rgba(243, 156, 18, 0.1)' }}>
            <DollarSign />
          </div>
        </div>
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>✅ محوّل</h4>
            <p className="kpi-value text-success">705,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
            <DollarSign />
          </div>
        </div>
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
        <div className="owner-card">
          <h4 className="mb-6">📊 الأرباح — آخر 12 شهراً</h4>
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={dataEarnings}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip formatter={(v) => `${v.toLocaleString()} ر.ي`} />
                <Bar dataKey="amount" fill="#2D5A27" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
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
              <tr>
                <td>#OP-1047</td>
                <td>أحمد محمد</td>
                <td>45,000 ر.ي</td>
                <td className="text-muted">2,250 ر.ي</td>
                <td style={{ fontWeight: 700 }}>42,750 ر.ي</td>
                <td><span style={{ color: 'var(--color-completed)', fontWeight: 600 }}>Paid ✅</span></td>
              </tr>
              <tr>
                <td>#OP-1048</td>
                <td>سارة أحمد</td>
                <td>24,000 ر.ي</td>
                <td className="text-muted">1,200 ر.ي</td>
                <td style={{ fontWeight: 700 }}>22,800 ر.ي</td>
                <td><span style={{ color: 'var(--color-pending)', fontWeight: 600 }}>Processing ⏳</span></td>
              </tr>
              <tr>
                <td>#OP-1045</td>
                <td>خالد ناصر</td>
                <td>30,000 ر.ي</td>
                <td className="text-muted">1,500 ر.ي</td>
                <td style={{ fontWeight: 700 }}>28,500 ر.ي</td>
                <td><span style={{ color: 'var(--color-text-muted)', fontWeight: 600 }}>Pending</span></td>
              </tr>
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
