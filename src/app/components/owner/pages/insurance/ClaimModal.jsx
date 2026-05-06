import React from 'react';
import { AlertTriangle, Camera, X } from 'lucide-react';

const ClaimModal = ({ claimRow, onClose }) => {
  if (!claimRow) return null;

  return (
    <div className="owner-modal-overlay">
      <div className="owner-modal" style={{ maxWidth: 550 }}>
        <div className="owner-modal-header">
          <h3 className="owner-modal-title">تقديم مطالبة بخصم من التأمين</h3>
          <X className="owner-modal-close" onClick={onClose} />
        </div>
        <div className="owner-modal-body">
          <div className="owner-card mb-6" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
            <div className="flex-between">
              <span className="text-muted">الطلب:</span>
              <strong>{claimRow.order} | {claimRow.tenant}</strong>
            </div>
            <div className="flex-between mt-2">
              <span className="text-muted">مبلغ التأمين الكلي:</span>
              <strong>{claimRow.amount}</strong>
            </div>
          </div>

          <div className="mb-4">
            <label className="owner-label">مبلغ الخصم المطلوب (ر.ي) *</label>
            <input type="number" className="owner-input" placeholder="مثال: 15000" />
          </div>
          <div className="mb-4">
            <label className="owner-label">وصف الضرر *</label>
            <textarea className="owner-input" rows={4} placeholder="وصف تفصيلي للأضرار الموجودة على المعدة..." />
          </div>
          <div className="mb-6">
            <label className="owner-label">أدلة (صور) *</label>
            <button className="owner-btn owner-btn-outline" type="button"><Camera size={16} /> رفع صور</button>
          </div>

          <div className="owner-card" style={{ backgroundColor: 'rgba(243, 156, 18, 0.05)', boxShadow: 'none', borderRight: '4px solid var(--color-pending)' }}>
            <p className="flex-center gap-2 text-warning mb-0" style={{ justifyContent: 'flex-start', fontSize: 13 }}>
              <AlertTriangle size={16} /> سيراجع الـ Admin مطالبتك وسيتم تعليق Escrow حتى صدور القرار
            </p>
          </div>
        </div>
        <div className="owner-modal-footer">
          <button className="owner-btn owner-btn-outline" onClick={onClose} type="button">إلغاء</button>
          <button className="owner-btn owner-btn-primary" onClick={onClose} type="button">تقديم المطالبة</button>
        </div>
      </div>
    </div>
  );
};

export default ClaimModal;
