import React from 'react';
import { ArrowRight, ArrowLeft, X, Check } from 'lucide-react';
import { visit } from '../../../inertia/navigation';
import BasicInfoStep from './components/BasicInfoStep';
import PhotosStep from './components/PhotosStep';
import PricingStep from './components/PricingStep';
import ReviewStep from './components/ReviewStep';
import { EQUIPMENT_STEPS, useEquipmentDraft } from './useEquipmentDraft';

const AddEquipment = () => {
  const {
    step,
    specs,
    images,
    draft,
    addSpec,
    removeSpec,
    updateSpec,
    updateDraft,
    goNext,
    goBack,
  } = useEquipmentDraft();

  const renderStep = () => {
    if (step === 0) {
      return (
        <BasicInfoStep
          draft={draft}
          specs={specs}
          addSpec={addSpec}
          removeSpec={removeSpec}
          updateDraft={updateDraft}
          updateSpec={updateSpec}
        />
      );
    }

    if (step === 1) {
      return <PhotosStep />;
    }

    if (step === 2) {
      return <PricingStep draft={draft} updateDraft={updateDraft} />;
    }

    return <ReviewStep draft={draft} images={images} />;
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
