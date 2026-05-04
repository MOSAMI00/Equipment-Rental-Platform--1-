import React, { useState } from 'react';
import { Shield, Lock, CheckCircle, AlertTriangle, Camera, X, Eye } from 'lucide-react';

const Insurance = () => {
  const [isClaimOpen, setIsClaimOpen] = useState(false);

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>إدارة التأمين</h2>

      {/* 3 Summary Cards */}
      <div className="owner-grid-3">
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>🔒 محتجز</h4>
            <p className="kpi-value">50,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-confirmed)', backgroundColor: 'rgba(52, 152, 219, 0.1)' }}>
            <Lock />
          </div>
        </div>
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>✅ مُسترَد</h4>
            <p className="kpi-value text-success">320,000 ر.ي</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-completed)', backgroundColor: 'rgba(39, 174, 96, 0.1)' }}>
            <CheckCircle />
          </div>
        </div>
        <div className="owner-card owner-kpi-card">
          <div className="owner-kpi-info">
            <h4>⚠️ متنازع عليه</h4>
            <p className="kpi-value text-danger">2 حالات</p>
          </div>
          <div className="owner-kpi-icon" style={{ color: 'var(--color-disputed)', backgroundColor: 'rgba(231, 76, 60, 0.1)' }}>
            <AlertTriangle />
          </div>
        </div>
      </div>

      {/* Insurance Table */}
      <div className="owner-card">
        <h4 className="mb-6">جدول التأمينات</h4>
        <div className="owner-table-container">
          <table className="owner-table">
            <thead>
              <tr>
                <th>الطلب</th>
                <th>المستأجر</th>
                <th>مبلغ التأمين</th>
                <th>الحالة</th>
                <th>خصم مطلوب</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#OP-1047</td>
                <td>أحمد محمد</td>
                <td>50,000 ر.ي</td>
                <td>
                  <span className="badge badge-confirmed">🔒 محتجز</span>
                </td>
                <td className="text-muted">لا</td>
                <td>—</td>
              </tr>
              <tr>
                <td>#OP-1041</td>
                <td>سارة أحمد</td>
                <td>30,000 ر.ي</td>
                <td>
                  <span className="badge badge-disputed">⚠️ متنازع</span>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--color-disputed)' }}>15,000 ر.ي</td>
                <td>
                  <button className="owner-btn owner-btn-outline" style={{ padding: '4px 10px', fontSize: 12 }}>
                    <Eye size={14} /> تفاصيل
                  </button>
                </td>
              </tr>
              <tr>
                <td>#OP-1039</td>
                <td>خالد ناصر</td>
                <td>50,000 ر.ي</td>
                <td>
                  <span className="badge badge-completed">✅ مُسترد</span>
                </td>
                <td className="text-muted">لا</td>
                <td>—</td>
              </tr>
              <tr>
                <td>#OP-1035</td>
                <td>ياسر علي</td>
                <td>20,000 ر.ي</td>
                <td>
                  <span className="badge badge-completed">✅ مُسترد</span>
                </td>
                <td className="text-muted">لا</td>
                <td>
                  <button className="owner-btn owner-btn-outline" onClick={() => setIsClaimOpen(true)} style={{ padding: '4px 10px', fontSize: 12 }}>
                    🛡️ مطالبة
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Claim Modal */}
      {isClaimOpen && (
        <div className="owner-modal-overlay">
          <div className="owner-modal" style={{ maxWidth: 550 }}>
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">🛡️ تقديم مطالبة بخصم من التأمين</h3>
              <X className="owner-modal-close" onClick={() => setIsClaimOpen(false)} />
            </div>
            <div className="owner-modal-body">
              <div className="owner-card mb-6" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
                <div className="flex-between">
                  <span className="text-muted">الطلب:</span>
                  <strong>#OP-1047 | أحمد محمد</strong>
                </div>
                <div className="flex-between mt-2">
                  <span className="text-muted">مبلغ التأمين الكلي:</span>
                  <strong>50,000 ر.ي</strong>
                </div>
              </div>

              <div className="mb-4">
                <label className="owner-label">مبلغ الخصم المطلوب (ر.ي) *</label>
                <input type="number" className="owner-input" placeholder="مثال: 15000" />
              </div>
              <div className="mb-4">
                <label className="owner-label">وصف الضرر *</label>
                <textarea className="owner-input" rows={4} placeholder="وصف تفصيلي للأضرار الموجودة على المعدة..."></textarea>
              </div>
              <div className="mb-6">
                <label className="owner-label">أدلة (صور) *</label>
                <button className="owner-btn owner-btn-outline"><Camera size={16} /> رفع صور</button>
              </div>

              <div className="owner-card" style={{ backgroundColor: 'rgba(243, 156, 18, 0.05)', boxShadow: 'none', borderRight: '4px solid var(--color-pending)' }}>
                <p className="flex-center gap-2 text-warning mb-0" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
                  <AlertTriangle size={16} /> سيراجع الـ Admin مطالبتك وسيتم تعليق Escrow حتى صدور القرار
                </p>
              </div>
            </div>
            <div className="owner-modal-footer">
              <button className="owner-btn owner-btn-outline" onClick={() => setIsClaimOpen(false)}>إلغاء</button>
              <button className="owner-btn owner-btn-primary" onClick={() => setIsClaimOpen(false)}>تقديم المطالبة</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insurance;
