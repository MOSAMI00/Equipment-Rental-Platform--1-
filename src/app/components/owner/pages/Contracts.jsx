import React, { useState } from 'react';
import { Search, Eye, Download, Printer } from 'lucide-react';

const Contracts = () => {
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>العقود الإلكترونية</h2>
        <div className="flex-center gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input type="text" className="owner-input" placeholder="بحث برقم العقد..." style={{ paddingRight: 36, width: 200 }} />
          </div>
          <select className="owner-input">
            <option>فلتر التاريخ ▼</option>
            <option>هذا الشهر</option>
          </select>
        </div>
      </div>

      <div className="owner-card mb-8">
        <div className="owner-table-container">
          <table className="owner-table">
            <thead>
              <tr>
                <th>رقم العقد</th>
                <th>المستأجر</th>
                <th>المعدة</th>
                <th>تاريخ الإنشاء</th>
                <th>المبلغ</th>
                <th>إجراء</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>عقد-1042</td>
                <td>محمد علي</td>
                <td>كاميرا Sony</td>
                <td>22/4/2026</td>
                <td>7,550 ر.ي</td>
                <td>
                  <div className="flex-center gap-2" style={{justifyContent: 'flex-start'}}>
                    <button className="owner-btn owner-btn-outline" style={{padding: '4px 8px'}} onClick={() => setIsViewerOpen(true)}><Eye size={16}/> عرض</button>
                    <button className="owner-btn owner-btn-outline" style={{padding: '4px 8px'}}><Download size={16}/> تحميل</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {isViewerOpen && (
        <div className="owner-modal-overlay">
          <div className="owner-modal" style={{ maxWidth: 800 }}>
            <div className="owner-modal-header">
              <h3 className="owner-modal-title">عقد الإيجار رقم 1042</h3>
              <div className="owner-modal-close" onClick={() => setIsViewerOpen(false)}>✕</div>
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
                    <h4>أحمد المؤجر</h4>
                  </div>
                  <div style={{ fontSize: 24, color: '#ccc' }}>←→</div>
                  <div style={{ textAlign: 'left' }}>
                    <h5 className="text-muted mb-2">المستأجر (الطرف الثاني):</h5>
                    <h4>محمد علي</h4>
                  </div>
                </div>

                <div className="mb-8">
                  <h4 className="mb-4" style={{ borderBottom: '1px solid #eee', paddingBottom: 8 }}>تفاصيل المعدة والإيجار</h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      <tr>
                        <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>المعدة:</td>
                        <td style={{ padding: '8px 0', fontWeight: 600 }}>كاميرا Sony A7 III مع عدسة 50mm</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مدة الإيجار:</td>
                        <td style={{ padding: '8px 0', fontWeight: 600 }}>من 22/04/2026 إلى 25/04/2026 (3 أيام)</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مبلغ الإيجار:</td>
                        <td style={{ padding: '8px 0', fontWeight: 600 }}>2,550 ر.ي</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 0', color: 'var(--color-text-muted)' }}>مبلغ التأمين:</td>
                        <td style={{ padding: '8px 0', fontWeight: 600 }}>5,000 ر.ي</td>
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
      )}
    </div>
  );
};

export default Contracts;
