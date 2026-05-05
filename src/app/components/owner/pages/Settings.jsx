import React, { useState } from 'react';
import { User, Lock, CreditCard, Bell, Camera, Save } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const ownerInitial = (user?.fullName ?? '؟').charAt(0);

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>إعدادات الحساب</h2>

      <div className="settings-container">
        <div className="settings-sidebar">
          <div className={`settings-sidebar-item flex-center gap-2 ${activeTab === 'profile' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}} onClick={() => setActiveTab('profile')}>
            <User size={18} /> ملفي الشخصي
          </div>
          <div className={`settings-sidebar-item flex-center gap-2 ${activeTab === 'security' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}} onClick={() => setActiveTab('security')}>
            <Lock size={18} /> الأمان وكلمة المرور
          </div>
          <div className={`settings-sidebar-item flex-center gap-2 ${activeTab === 'payment' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}} onClick={() => setActiveTab('payment')}>
            <CreditCard size={18} /> وسائل استلام الأرباح
          </div>
          <div className={`settings-sidebar-item flex-center gap-2 ${activeTab === 'notifications' ? 'active' : ''}`} style={{justifyContent: 'flex-start'}} onClick={() => setActiveTab('notifications')}>
            <Bell size={18} /> الإشعارات والتفضيلات
          </div>
        </div>

        <div className="settings-content">
          <div className="owner-card">
            {activeTab === 'profile' && (
              <div>
                <h3 className="mb-6">الملف الشخصي</h3>
                <div className="flex-center gap-6 mb-8" style={{justifyContent: 'flex-start'}}>
                  <div className="flex-center" style={{ width: 80, height: 80, borderRadius: '50%', backgroundColor: 'var(--color-page-bg)', fontWeight: 700, fontSize: 24 }}>
                    {ownerInitial}
                  </div>
                  <button className="owner-btn owner-btn-outline"><Camera size={16} /> تغيير الصورة</button>
                </div>
                <div className="owner-grid-2">
                  <div className="mb-4">
                    <label className="owner-label">الاسم الكامل</label>
                    <input type="text" className="owner-input" defaultValue="أحمد المؤجر" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">البريد الإلكتروني</label>
                    <input type="email" className="owner-input" defaultValue="ahmed@example.com" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">رقم الهاتف</label>
                    <input type="text" className="owner-input" defaultValue="+967 771234567" style={{direction: 'ltr', textAlign: 'right'}} />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">تاريخ الميلاد</label>
                    <input type="date" className="owner-input" defaultValue="1985-06-15" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">الموقع/المدينة</label>
                    <select className="owner-input">
                      <option>صنعاء</option>
                      <option>عدن</option>
                      <option>تعز</option>
                      <option>إب</option>
                    </select>
                  </div>
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
                <div className="flex-center gap-4" style={{justifyContent: 'flex-end'}}>
                  <button className="owner-btn owner-btn-outline">إلغاء</button>
                  <button className="owner-btn owner-btn-primary"><Save size={16}/> حفظ التغييرات</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="mb-6">تغيير كلمة المرور</h3>
                <div style={{ maxWidth: 400 }}>
                  <div className="mb-4">
                    <label className="owner-label">كلمة المرور الحالية</label>
                    <input type="password" className="owner-input" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">كلمة المرور الجديدة</label>
                    <input type="password" className="owner-input" />
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }}></div>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }}></div>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-border)', borderRadius: 2 }}></div>
                    </div>
                    <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>قوة كلمة المرور: جيدة</span>
                  </div>
                  <div className="mb-6">
                    <label className="owner-label">تأكيد كلمة المرور</label>
                    <input type="password" className="owner-input" />
                  </div>
                  <button className="owner-btn owner-btn-primary"><Save size={16}/> تحديث كلمة المرور</button>
                </div>
              </div>
            )}
            
            {activeTab === 'payment' && (
              <div>
                <h3 className="mb-6">وسائل استلام الأرباح</h3>
                <p className="text-muted">الرجاء الانتقال إلى صفحة "الأرباح والمدفوعات" لإدارة وسائل الدفع.</p>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="mb-6">الإشعارات والتفضيلات</h3>
                <p className="text-muted">خيارات الإشعارات ستظهر هنا.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
