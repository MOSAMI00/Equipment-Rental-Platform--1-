import React from 'react';
import { SpecsFieldArray } from './SpecsFieldArray';

interface BasicInfoStepProps {
  draft: any;
  updateDraft: (key: string) => (e: any) => void;
  specs: any[];
  addSpec: () => void;
  removeSpec: (index: number) => void;
  updateSpec: (index: number, key: 'key' | 'value', val: string) => void;
  categories: readonly string[];
  governorates: readonly string[];
}

export function BasicInfoStep({ draft, updateDraft, specs, addSpec, removeSpec, updateSpec, categories, governorates }: BasicInfoStepProps) {
  return (
    <div>
      <h3 className="mb-6">المعلومات الأساسية</h3>

      <div className="mb-4">
        <label className="owner-label">اسم المعدة *</label>
        <input type="text" className="owner-input" placeholder="مثال: مولد كهربائي كاتربيلر 5000 واط" value={draft.name} onChange={updateDraft('name')} />
      </div>

      <div className="owner-grid-2">
        <div className="mb-4">
          <label className="owner-label">الفئة *</label>
          <select className="owner-input" value={draft.category} onChange={updateDraft('category')}>
            <option value="">اختر الفئة</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="owner-label">الشركة المصنعة</label>
          <input type="text" className="owner-input" placeholder="مثال: Caterpillar" />
        </div>
      </div>

      <div className="mb-4">
        <label className="owner-label">وصف المعدة *</label>
        <textarea className="owner-input" rows={4} placeholder="اكتب وصفاً دقيقاً للمعدة، استخداماتها، وأي ملاحظات هامة للمستأجر..." value={draft.description} onChange={updateDraft('description')}></textarea>
      </div>

      <SpecsFieldArray specs={specs} addSpec={addSpec} removeSpec={removeSpec} updateSpec={updateSpec} />

      <h4 className="mt-8 mb-4">الموقع وحالة التسليم</h4>
      <div className="owner-grid-2">
        <div className="mb-4">
          <label className="owner-label">المحافظة *</label>
          <select className="owner-input" value={draft.governorate} onChange={updateDraft('governorate')}>
            <option value="">اختر المحافظة</option>
            {governorates.map((gov) => (
              <option key={gov} value={gov}>{gov}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label className="owner-label">العنوان التفصيلي *</label>
          <input type="text" className="owner-input" placeholder="مثال: صنعاء - شارع الستين - بجوار..." value={draft.address} onChange={updateDraft('address')} />
        </div>
      </div>

      <div className="owner-grid-2">
        <div className="mb-4">
          <label className="owner-label">حالة المعدة *</label>
          <div className="radio-group">
            <label className="radio-option"><input type="radio" name="condition" defaultChecked /> ممتاز</label>
            <label className="radio-option"><input type="radio" name="condition" /> جيد جداً</label>
            <label className="radio-option"><input type="radio" name="condition" /> جيد</label>
            <label className="radio-option"><input type="radio" name="condition" /> متوسط</label>
          </div>
        </div>
        <div className="mb-4">
          <label className="owner-label">وسيلة التسليم *</label>
          <div className="radio-group">
            <label className="radio-option"><input type="radio" name="delivery" defaultChecked /> المستأجر يأتي</label>
            <label className="radio-option"><input type="radio" name="delivery" /> أوصّل</label>
            <label className="radio-option"><input type="radio" name="delivery" /> كلاهما</label>
          </div>
        </div>
      </div>
    </div>
  );
}
