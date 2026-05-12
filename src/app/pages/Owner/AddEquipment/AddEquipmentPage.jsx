import React from 'react';
import { useForm, usePage } from '@inertiajs/react';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import { visit } from '../../../inertia/navigation';
import BasicInfoStep from './components/BasicInfoStep';
import PhotosStep from './components/PhotosStep';
import PricingStep from './components/PricingStep';
import ReviewStep from './components/ReviewStep';
import { EQUIPMENT_STEPS } from './useEquipmentDraft';
import OwnerLayout from '../../../layouts/owner/OwnerLayout';
import { useState } from 'react';

export default function AddEquipmentPage() {
  const [step, setStep] = useState(0);

  const form = useForm({
    name: '',
    category: '',
    governorate: '',
    address: '',
    description: '',
    condition: 'excellent',
    delivery_method: 'both',
    daily_rate: '',
    weekly_rate: '',
    monthly_rate: '',
    insurance_amount: '',
    min_rental: 'يوم واحد',
    max_rental: '',
    discount: '',
    specs: [{ key: '', value: '' }],
    images: [],
  });

  const addSpec = () => {
    form.setData('specs', [...form.data.specs, { key: '', value: '' }]);
  };

  const removeSpec = (index) => {
    form.setData('specs', form.data.specs.filter((_, i) => i !== index));
  };

  const updateSpec = (index, key) => (event) => {
    form.setData('specs', form.data.specs.map((spec, i) =>
      i === index ? { ...spec, [key]: event.target.value } : spec
    ));
  };

  const updateDraft = (key) => (event) => {
    form.setData(key, event.target.value);
  };

  const goNext = () => setStep((s) => Math.min(s + 1, EQUIPMENT_STEPS.length - 1));
  const goBack = () => setStep((s) => Math.max(s - 1, 0));

  const handleSubmit = () => {
    form.post('/owner/equipment', {
      onSuccess: () => visit('/owner/equipment'),
    });
  };

  const renderStep = () => {
    if (step === 0) {
      return (
        <BasicInfoStep
          draft={form.data}
          specs={form.data.specs}
          addSpec={addSpec}
          removeSpec={removeSpec}
          updateDraft={updateDraft}
          updateSpec={updateSpec}
        />
      );
    }
    if (step === 1) return <PhotosStep />;
    if (step === 2) return <PricingStep draft={form.data} updateDraft={updateDraft} />;
    return <ReviewStep draft={form.data} images={form.data.images} />;
  };

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
        {EQUIPMENT_STEPS.map((label, i) => (
          <div key={i} className={`stepper-step ${i <= step ? 'active' : ''} ${i < step ? 'completed' : ''}`}>
            <div className="stepper-circle">
              {i < step ? <Check size={14} /> : i + 1}
            </div>
            <span className="stepper-label">{label}</span>
            {i < EQUIPMENT_STEPS.length - 1 && <div className="stepper-line" />}
          </div>
        ))}
      </div>

      <div className="owner-card">
        {renderStep()}

        {form.errors && Object.keys(form.errors).length > 0 && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600">
            {Object.values(form.errors).map((error, i) => (
              <p key={i}>{error}</p>
            ))}
          </div>
        )}

        {/* Navigation */}
        <div className="flex-between mt-8" style={{ borderTop: '1px solid var(--color-border)', paddingTop: 24 }}>
          <button
            className="owner-btn owner-btn-outline"
            onClick={() => (step === 0 ? visit('/owner/equipment') : goBack())}
          >
            <ArrowRight size={16} /> {step === 0 ? 'إلغاء' : 'السابق'}
          </button>

          {step < 3 ? (
            <button className="owner-btn owner-btn-primary" onClick={goNext}>
              التالي <ArrowLeft size={16} />
            </button>
          ) : (
            <button
              className="owner-btn owner-btn-primary"
              onClick={handleSubmit}
              disabled={form.processing}
            >
              <Check size={16} /> {form.processing ? 'جاري النشر...' : 'نشر المعدة'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

AddEquipmentPage.layout = (page) => <OwnerLayout>{page}</OwnerLayout>;
