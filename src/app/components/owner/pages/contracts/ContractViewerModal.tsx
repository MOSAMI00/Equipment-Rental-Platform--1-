import React from 'react';
import { Printer, Download } from 'lucide-react';
import type { RentalListItem } from '../../../../types/owner';
import { formatCurrency } from '../../../../utils/formatters';

interface ContractViewerModalProps {
  contract: RentalListItem;
  onClose: () => void;
}

export function ContractViewerModal({ contract, onClose }: ContractViewerModalProps) {
  const diffTime = Math.abs(new Date(contract.endDate ?? '').getTime() - new Date(contract.startDate ?? '').getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className="owner-modal-overlay">
      <div className="owner-modal" style={{ maxWidth: 800 }}>
        <div className="owner-modal-header">
          <h3 className="owner-modal-title">عقد الإيجار رقم {contract.orderNum ?? '—'}</h3>
          <div className="owner-modal-close" onClick={onClose}>✕</div>
        </div>
        <div className="owner-modal-body" style={{ backgroundColor: '#f9fafb' }}>
          <div style={{ backgroundColor: 'white', padding: 40, border: '1px solid #ddd', minHeight: 500, boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <div className="text-center mb-8">
              <h2 style={{ color: 'var(--color-primary-green)' }}>شعار المنصة</h2>
              <h3>عقد إيجار إلكتروني</h3>
              <hr style={{ border: 'none', borderTop: '2px solid var(--color-primary-green)', width: 100, margin: '16px auto' }} />
            </div>

            <div className="flex-between mb-8">
              <div>
                <h5 className="text-muted mb-2">المؤجر (الطرف الأول):</h5>
                <h4>{contract.equipment?.name ? 'مالك المعدة' : '—'}</h4>
              </div>
              <div style={{ fontSize: 24, color: '#ccc' }}>←→</div>
              <div style={{ textAlign: 'left' }}>
                <h5 className="text-muted mb-2">المستأجر (الطرف الثاني):</h5>
                <h4>{contract.tenant?.name ?? '—'}</h4>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="mb-4" style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>تفاصيل المعدة والإيجار</h4>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>المعدة:</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{contract.equipment?.name ?? '—'}</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مدة الإيجار:</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>من {contract.startDate ?? '—'} إلى {contract.endDate ?? '—'} ({diffDays} أيام)</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مبلغ الإيجار:</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{formatCurrency(contract.rentalAmount ?? 0)} ر.ي</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مبلغ التأمين:</td>
                    <td style={{ padding: '8px 0', fontWeight: 600 }}>{formatCurrency(contract.insuranceAmount ?? 0)} ر.ي</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mb-8">
              <h4 className="mb-4" style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>الشروط والأحكام</h4>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'var(--color-text-muted)' }}>
                1. يلتزم الطرف الثاني بإعادة المعدة في الوقت المحدد وبنفس الحالة التي استلمها بها.<br/>
                2. في حال وجود تلف أو ضرر، يحق للطرف الأول خصم قيمة الإصلاح من مبلغ التأمين.<br/>
                3. هذا العقد ملزم قانونياً بمجرد موافقة الطرفين عبر المنصة ولا يحتاج لتوقيع ورقي.
              </p>
            </div>
          </div>
        </div>
        <div className="owner-modal-footer">
          <p className="text-warning flex-center gap-2" style={{margin: 0, fontSize: 14, marginRight: 'auto'}}>
            ⚠️ ملاحظة: لا يمكن تعديل هذا العقد بعد التوقيع
          </p>
          <button className="owner-btn owner-btn-outline"><Printer size={16} /> طباعة</button>
          <button className="owner-btn owner-btn-primary"><Download size={16} /> تحميل PDF</button>
        </div>
      </div>
    </div>
  );
}
