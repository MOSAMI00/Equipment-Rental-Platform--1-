import React from 'react';
import { Save } from 'lucide-react';
import { AppButton, AppInput, FieldLabel } from '../../../shared';

const SecurityTab = () => (
  <div>
    <h3 className="mb-6">تغيير كلمة المرور</h3>
    <div style={{ maxWidth: 400 }}>
      <div className="mb-4">
        <FieldLabel>كلمة المرور الحالية</FieldLabel>
        <AppInput type="password" placeholder="••••••••" />
      </div>
      <div className="mb-4">
        <FieldLabel>كلمة المرور الجديدة</FieldLabel>
        <AppInput type="password" placeholder="••••••••" />
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
          <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }} />
          <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-completed)', borderRadius: 2 }} />
          <div style={{ height: 4, flex: 1, backgroundColor: 'var(--color-border)', borderRadius: 2 }} />
        </div>
        <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>قوة كلمة المرور: جيدة</span>
      </div>
      <div className="mb-6">
        <FieldLabel>تأكيد كلمة المرور الجديدة</FieldLabel>
        <AppInput type="password" placeholder="••••••••" />
      </div>
      <AppButton><Save size={16} /> تحديث كلمة المرور</AppButton>
    </div>
  </div>
);

export default SecurityTab;
