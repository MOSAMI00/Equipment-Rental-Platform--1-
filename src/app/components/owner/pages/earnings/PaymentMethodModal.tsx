import React from 'react';

interface PaymentMethodModalProps {
  onClose: () => void;
}

export function PaymentMethodModal({ onClose }: PaymentMethodModalProps) {
  return (
    <div className="owner-modal-overlay">
      <div className="owner-modal" style={{ maxWidth: 500 }}>
        <div className="owner-modal-header">
          <h3 className="owner-modal-title">إضافة وسيلة استلام</h3>
          <div className="owner-modal-close" onClick={onClose}>✕</div>
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
          <button className="owner-btn owner-btn-outline" onClick={onClose}>إلغاء</button>
          <button className="owner-btn owner-btn-primary" onClick={onClose}>💾 حفظ</button>
        </div>
      </div>
    </div>
  );
}
