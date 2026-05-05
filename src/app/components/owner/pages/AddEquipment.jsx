import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, Plus, X, Image as ImageIcon, Check } from 'lucide-react';
import { visit } from '../../../inertia/navigation';

const steps = ['المعلومات الأساسية', 'الصور', 'التسعير', 'المراجعة والنشر'];

const AddEquipment = () => {
  const [step, setStep] = useState(0);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState([]);

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i) => setSpecs(specs.filter((_, idx) => idx !== i));

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>إضافة معدة جديدة</h2>
        <button className="owner-btn owner-btn-outline" onClick={() => visit('/owner/equipment')}>
          <X size={16} /> إلغاء
        </button>
      </div>

      {/* Stepper */}
      <div className="stepper mb-8">
        {steps.map((label, i) => (
          <div key={i} className={`stepper-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="stepper-label">{label}</span>
            {i < steps.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <div className="owner-card">
        {/* Step 1: Basic Info */}
        {step === 0 && (
          <div>
            <h3 className="mb-6">المعلومات الأساسية</h3>
            <div className="owner-grid-2">
              <div className="mb-4">
                <label className="owner-label">اسم المعدة *</label>
                <input type="text" className="owner-input" placeholder="مثال: مولد كهرباء 10KVA" />
              </div>
              <div className="mb-4">
                <label className="owner-label">الفئة *</label>
                <select className="owner-input">
                  <option value="">اختر الفئة</option>
                  <option>مولدات كهربائية</option>
                  <option>معدات بناء</option>
                  <option>معدات زراعية</option>
                  <option>معدات تصوير</option>
                  <option>إلكترونيات</option>
                  <option>أخرى</option>
                </select>
              </div>
            </div>

            <div className="mb-4">
              <label className="owner-label">الوصف *</label>
              <textarea className="owner-input" rows={4} placeholder="وصف تفصيلي للمعدة ومميزاتها..."></textarea>
            </div>

            <div className="mb-6">
              <label className="owner-label">المواصفات التقنية</label>
              {specs.map((spec, i) => (
                <div key={i} className="flex-center gap-4 mb-2" style={{ justifyContent: 'flex-start' }}>
                  <input type="text" className="owner-input" placeholder="المواصفة (مثال: القدرة)" style={{ flex: 1 }} />
                  <input type="text" className="owner-input" placeholder="القيمة (مثال: 10KVA)" style={{ flex: 1 }} />
                  {specs.length > 1 && (
                    <button className="owner-btn owner-btn-outline" onClick={() => removeSpec(i)} style={{ padding: '8px', color: 'var(--color-disputed)' }}>
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button className="owner-btn owner-btn-outline mt-2" onClick={addSpec}>
                <Plus size={16} /> إضافة مواصفة
              </button>
            </div>

            <div className="owner-grid-2">
              <div className="mb-4">
                <label className="owner-label">المحافظة *</label>
                <select className="owner-input">
                  <option value="">اختر المحافظة</option>
                  <option>صنعاء</option>
                  <option>عدن</option>
                  <option>تعز</option>
                  <option>إب</option>
                  <option>الحديدة</option>
                  <option>ذمار</option>
                  <option>حجة</option>
                  <option>المكلا</option>
                  <option>سيئون</option>
                  <option>مأرب</option>
                  <option>صعدة</option>
                  <option>عمران</option>
                  <option>البيضاء</option>
                  <option>لحج</option>
                  <option>أبين</option>
                  <option>شبوة</option>
                  <option>المهرة</option>
                  <option>سقطرى</option>
                  <option>الجوف</option>
                  <option>الضالع</option>
                  <option>ريمة</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="owner-label">العنوان التفصيلي *</label>
                <input type="text" className="owner-input" placeholder="مثال: صنعاء - شارع الستين - بجوار..." />
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
        )}

        {/* Step 2: Photos */}
        {step === 1 && (
          <div>
            <h3 className="mb-2">صور المعدة</h3>
            <p className="text-muted mb-6">ارفع 5 صور على الأقل لعرض المعدة بشكل واضح</p>

            <div className="image-upload-grid mb-6">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="image-upload-slot">
                  {i === 0 ? (
                    <div className="image-upload-placeholder">
                      <ImageIcon size={32} />
                      <span>الصورة الرئيسية</span>
                    </div>
                  ) : (
                    <div className="image-upload-placeholder">
                      <Plus size={24} />
                      <span>صورة {i + 1}</span>
                    </div>
                  )}
                </div>
              ))}
              <div className="image-upload-slot" style={{ border: '2px dashed var(--color-primary-green)' }}>
                <div className="image-upload-placeholder" style={{ color: 'var(--color-primary-green)' }}>
                  <Plus size={32} />
                  <span>إضافة المزيد</span>
                </div>
              </div>
            </div>

            <div className="owner-card" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
              <p className="text-muted" style={{ margin: 0, fontSize: 13 }}>
                💡 نصائح للصور: التقط صوراً واضحة من زوايا مختلفة • أظهر أي عيوب موجودة • استخدم إضاءة جيدة • الحد الأدنى 5 صور
              </p>
            </div>
          </div>
        )}

        {/* Step 3: Pricing */}
        {step === 2 && (
          <div>
            <h3 className="mb-6">التسعير</h3>
            <div className="owner-grid-2">
              <div className="mb-4">
                <label className="owner-label">💰 السعر اليومي * (ر.ي)</label>
                <input type="number" className="owner-input" placeholder="مثال: 15000" />
              </div>
              <div className="mb-4">
                <label className="owner-label">السعر الأسبوعي (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
                <input type="number" className="owner-input" placeholder="مثال: 90000" />
              </div>
              <div className="mb-4">
                <label className="owner-label">السعر الشهري (ر.ي) <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
                <input type="number" className="owner-input" placeholder="مثال: 300000" />
              </div>
              <div className="mb-4">
                <label className="owner-label">🛡️ مبلغ التأمين * (ر.ي)</label>
                <input type="number" className="owner-input" placeholder="مثال: 50000" />
                <span className="text-muted" style={{ fontSize: 12, marginTop: 4, display: 'block' }}>
                  يُحتجز من المستأجر عبر Escrow ويُرد بعد التسليم السليم
                </span>
              </div>
              <div className="mb-4">
                <label className="owner-label">الحد الأدنى للإيجار</label>
                <select className="owner-input">
                  <option>يوم واحد</option>
                  <option>يومان</option>
                  <option>3 أيام</option>
                  <option>أسبوع</option>
                </select>
              </div>
              <div className="mb-4">
                <label className="owner-label">الحد الأقصى للإيجار (أيام)</label>
                <input type="number" className="owner-input" placeholder="مثال: 30" />
              </div>
              <div className="mb-4">
                <label className="owner-label">خصم % <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span></label>
                <input type="number" className="owner-input" placeholder="مثال: 10" min="0" max="100" />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 3 && (
          <div>
            <h3 className="mb-6">المراجعة والنشر</h3>

            <div className="review-preview mb-8">
              <div className="owner-card equipment-card" style={{ maxWidth: 380 }}>
                <div style={{ height: 200, backgroundColor: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-muted)' }}>
                  <ImageIcon size={48} />
                </div>
                <div className="equipment-details">
                  <div className="flex-between mb-2">
                    <h3 className="equipment-title" style={{ margin: 0 }}>مولد كهرباء 10KVA</h3>
                    <span className="badge badge-available">● متاح</span>
                  </div>
                  <div className="equipment-info-row">📍 صنعاء - الوحدة</div>
                  <div className="equipment-info-row">💰 15,000 ر.ي / اليوم</div>
                  <div className="equipment-info-row">🛡️ تأمين: 50,000 ر.ي</div>
                  <div className="equipment-info-row">⭐ جديدة | 0 تأجير</div>
                </div>
              </div>
            </div>

            <div className="owner-card mb-6" style={{ backgroundColor: 'var(--color-page-bg)', boxShadow: 'none' }}>
              <h4 className="mb-4">ملخص البيانات</h4>
              <div className="review-row"><span className="text-muted">الاسم:</span> مولد كهرباء 10KVA</div>
              <div className="review-row"><span className="text-muted">الفئة:</span> مولدات كهربائية</div>
              <div className="review-row"><span className="text-muted">الموقع:</span> صنعاء - الوحدة</div>
              <div className="review-row"><span className="text-muted">الحالة:</span> ممتاز</div>
              <div className="review-row"><span className="text-muted">التسليم:</span> كلاهما</div>
              <div className="review-row"><span className="text-muted">السعر اليومي:</span> 15,000 ر.ي</div>
              <div className="review-row"><span className="text-muted">التأمين:</span> 50,000 ر.ي</div>
              <div className="review-row"><span className="text-muted">الصور:</span> 6 صور مرفوعة</div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex-between mt-8" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
          <button
            className="owner-btn owner-btn-outline"
            onClick={() => step === 0 ? visit('/owner/equipment') : setStep(step - 1)}
          >
            <ArrowRight size={16} /> {step === 0 ? 'إلغاء' : 'السابق'}
          </button>

          {step < 3 ? (
            <button className="owner-btn owner-btn-primary" onClick={() => setStep(step + 1)}>
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button className="owner-btn owner-btn-primary" onClick={() => visit('/owner/equipment')}>
              <Check size={16} /> نشر المعدة
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEquipment;
