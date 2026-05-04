import React, { useState } from 'react';
import { User, Lock, CreditCard, Bell, Camera, Save, MapPin } from 'lucide-react';

const Profile = () => {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', name: 'ملفي الشخصي', icon: <User size={18} /> },
    { id: 'security', name: 'الأمان وكلمة المرور', icon: <Lock size={18} /> },
    { id: 'payment', name: 'وسائل استلام الأرباح', icon: <CreditCard size={18} /> },
    { id: 'notifications', name: 'الإشعارات والتفضيلات', icon: <Bell size={18} /> },
  ];

  return (
    <div>
      <h2 className="mb-8" style={{ margin: '0 0 32px' }}>ملفي الشخصي</h2>

      <div className="settings-container">
        <div className="settings-sidebar">
          {tabs.map((tab) => (
            <div
              key={tab.id}
              className={`settings-sidebar-item flex-center gap-2 ${activeTab === tab.id ? 'active' : ''}`}
              style={{ justifyContent: 'flex-start' }}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.name}
            </div>
          ))}
        </div>

        <div className="settings-content">
          <div className="owner-card">
            {activeTab === 'profile' && (
              <div>
                <h3 className="mb-6">المعلومات الشخصية</h3>
                <div className="flex-center gap-6 mb-8" style={{ justifyContent: 'flex-start' }}>
                  <div style={{ position: 'relative' }}>
                    <img src="https://i.pravatar.cc/150?img=11" alt="Profile" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--color-active-sidebar-bg)' }} />
                    <button style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--color-primary-green)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h4 style={{ margin: '0 0 4px' }}>أحمد المؤجر</h4>
                    <span className="badge badge-available">مؤجر معتمد ✅</span>
                  </div>
                </div>

                <div className="owner-grid-2">
                  <div className="mb-4">
                    <label className="owner-label">الاسم الكامل</label>
                    <input type="text" className="owner-input" defaultValue="أحمد عبدالله المؤجر" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">اسم المتجر/النشاط</label>
                    <input type="text" className="owner-input" defaultValue="متجر المعدات" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">البريد الإلكتروني</label>
                    <input type="email" className="owner-input" defaultValue="ahmed@example.com" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">رقم الهاتف</label>
                    <input type="text" className="owner-input" defaultValue="+967 771234567" style={{ direction: 'ltr', textAlign: 'right' }} />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">تاريخ الميلاد</label>
                    <input type="date" className="owner-input" defaultValue="1985-06-15" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">المحافظة</label>
                    <select className="owner-input">
                      <option>صنعاء</option>
                      <option>عدن</option>
                      <option>تعز</option>
                      <option>إب</option>
                      <option>الحديدة</option>
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">العنوان التفصيلي</label>
                    <input type="text" className="owner-input" defaultValue="صنعاء - شارع الستين" />
                  </div>
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
                <div className="flex-center gap-4" style={{ justifyContent: 'flex-end' }}>
                  <button className="owner-btn owner-btn-outline">إلغاء</button>
                  <button className="owner-btn owner-btn-primary"><Save size={16} /> حفظ التغييرات</button>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div>
                <h3 className="mb-6">تغيير كلمة المرور</h3>
                <div style={{ maxWidth: 400 }}>
                  <div className="mb-4">
                    <label className="owner-label">كلمة المرور الحالية</label>
                    <input type="password" className="owner-input" placeholder="••••••••" />
                  </div>
                  <div className="mb-4">
                    <label className="owner-label">كلمة المرور الجديدة</label>
                    <input type="password" className="owner-input" placeholder="••••••••" />
                    <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }}></div>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }}></div>
                      <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-border)', borderRadius: 2 }}></div>
                    </div>
                    <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>قوة كلمة المرور: جيدة</span>
                  </div>
                  <div className="mb-6">
                    <label className="owner-label">تأكيد كلمة المرور الجديدة</label>
                    <input type="password" className="owner-input" placeholder="••••••••" />
                  </div>
                  <button className="owner-btn owner-btn-primary"><Save size={16} /> تحديث كلمة المرور</button>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div>
                <h3 className="mb-6">وسائل استلام الأرباح</h3>
                <div className="owner-card mb-4" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ margin: '0 0 4px', fontWeight: 600 }}>البنك الأهلي اليمني</p>
                    <p className="text-muted" style={{ margin: 0, direction: 'ltr', display: 'inline-block' }}>**** 4521</p>
                  </div>
                  <span className="badge badge-completed">✅ الافتراضية</span>
                </div>
                <button className="owner-btn owner-btn-outline">+ إضافة وسيلة جديدة</button>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div>
                <h3 className="mb-6">تفضيلات الإشعارات</h3>
                {['طلبات الحجز الجديدة', 'تأكيد الدفع', 'تذكيرات التسليم', 'النزاعات والمطالبات', 'تحويل الأرباح'].map((item) => (
                  <div key={item} className="flex-between mb-4" style={{ padding: '12px 0', borderBottom: '1px solid var(--color-border)' }}>
                    <span style={{ fontWeight: 600 }}>{item}</span>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
