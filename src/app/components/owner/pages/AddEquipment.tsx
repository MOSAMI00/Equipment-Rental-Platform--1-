import React, { useState } from 'react';
import { visit } from '../../../inertia/navigation';
import { EQUIPMENT_CATEGORIES, YEMEN_GOVERNORATES } from '../../../data/equipmentConfig';
import { ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { AddEquipmentStepper } from './add-equipment/AddEquipmentStepper';
import { BasicInfoStep } from './add-equipment/BasicInfoStep';
import { ImagesStep } from './add-equipment/ImagesStep';
import { PricingStep } from './add-equipment/PricingStep';
import { ReviewStep } from './add-equipment/ReviewStep';

export default function AddEquipment() {
  const [step, setStep] = useState(0);
  const [specs, setSpecs] = useState([{ key: '', value: '' }]);
  const [images, setImages] = useState([]);
  const [draft, setDraft] = useState({
    name: '',
    category: '',
    governorate: '',
    address: '',
    dailyRate: '',
    insuranceAmount: '',
  });

  const addSpec = () => setSpecs([...specs, { key: '', value: '' }]);
  const removeSpec = (i: number) => setSpecs(specs.filter((_, idx) => idx !== i));
  const updateSpec = (index: number, key: 'key' | 'value', val: string) => {
    setSpecs((currentSpecs) => currentSpecs.map((s, idx) => idx === index ? { ...s, [key]: val } : s));
  };
  const updateDraft = (key: keyof typeof draft) => (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setDraft((current) => ({ ...current, [key]: event.target.value }));

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>إضافة معدة جديدة</h2>
        <button className="owner-btn owner-btn-outline" onClick={() => visit('/owner/equipment')}>
          <X size={16} /> إلغاء
        </button>
      </div>

      <AddEquipmentStepper step={step} />

      <div className="owner-card" style={{ maxWidth: 800, margin: '0 auto' }}>
        {step === 0 && (
          <BasicInfoStep
            draft={draft}
            updateDraft={updateDraft}
            specs={specs}
            addSpec={addSpec}
            removeSpec={removeSpec}
            updateSpec={updateSpec}
            categories={EQUIPMENT_CATEGORIES}
            governorates={YEMEN_GOVERNORATES}
          />
        )}
        {step === 1 && <ImagesStep />}
        {step === 2 && <PricingStep draft={draft} updateDraft={updateDraft} />}
        {step === 3 && <ReviewStep draft={draft} images={images} />}

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
}
