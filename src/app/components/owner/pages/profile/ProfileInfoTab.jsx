import React from 'react';
import { Camera, Save } from 'lucide-react';
import { AppButton, AppInput, AppSelect, FieldLabel, StatusBadge } from '../../../shared';

const ProfileInfoTab = ({ user, ownerInitial }) => (
  <div>
    <h3 className="mb-6">المعلومات الشخصية</h3>
    <div className="flex-center gap-6 mb-8" style={{ justifyContent: 'flex-start' }}>
      <div style={{ position: 'relative' }}>
        <div className="flex-center" style={{ width: 80, height: 80, borderRadius: '50%', border: '3px solid var(--color-active-sidebar-bg)', backgroundColor: 'var(--color-page-bg)', fontWeight: 700, fontSize: 24 }}>
          {ownerInitial}
        </div>
        <button
          type="button"
          style={{ position: 'absolute', bottom: 0, left: 0, width: 28, height: 28, borderRadius: '50%', backgroundColor: 'var(--color-primary-green)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Camera size={14} />
        </button>
      </div>
      <div>
        <h4 style={{ margin: '0 0 4px' }}>{user?.fullName ?? 'أحمد المؤجر'}</h4>
        <StatusBadge status="available" label="مؤجر معتمد" />
      </div>
    </div>

    <div className="owner-grid-2">
      <div className="mb-4">
        <FieldLabel>الاسم الكامل</FieldLabel>
        <AppInput type="text" defaultValue={user?.fullName ?? 'أحمد عبدالله المؤجر'} />
      </div>
      <div className="mb-4">
        <FieldLabel>اسم المتجر/النشاط</FieldLabel>
        <AppInput type="text" defaultValue="متجر المعدات" />
      </div>
      <div className="mb-4">
        <FieldLabel>البريد الإلكتروني</FieldLabel>
        <AppInput type="email" defaultValue={user?.email ?? 'ahmed@example.com'} />
      </div>
      <div className="mb-4">
        <FieldLabel>رقم الهاتف</FieldLabel>
        <AppInput type="text" defaultValue="+967 771234567" style={{ direction: 'ltr', textAlign: 'right' }} />
      </div>
      <div className="mb-4">
        <FieldLabel>تاريخ الميلاد</FieldLabel>
        <AppInput type="date" defaultValue="1985-06-15" />
      </div>
      <div className="mb-4">
        <FieldLabel>المحافظة</FieldLabel>
        <AppSelect>
          <option>صنعاء</option>
          <option>عدن</option>
          <option>تعز</option>
          <option>إب</option>
          <option>الحديدة</option>
        </AppSelect>
      </div>
      <div className="mb-4">
        <FieldLabel>العنوان التفصيلي</FieldLabel>
        <AppInput type="text" defaultValue="صنعاء - شارع الستين" />
      </div>
    </div>

    <hr style={{ border: 'none', borderTop: '1px solid var(--color-border)', margin: '24px 0' }} />
    <div className="flex-center gap-4" style={{ justifyContent: 'flex-end' }}>
      <AppButton variant="outline">إلغاء</AppButton>
      <AppButton><Save size={16} /> حفظ التغييرات</AppButton>
    </div>
  </div>
);

export default ProfileInfoTab;
