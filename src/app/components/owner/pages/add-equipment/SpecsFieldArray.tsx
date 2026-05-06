import React from 'react';
import { Plus, X } from 'lucide-react';

interface SpecsFieldArrayProps {
  specs: { key: string; value: string }[];
  addSpec: () => void;
  removeSpec: (index: number) => void;
  updateSpec: (index: number, key: 'key' | 'value', val: string) => void;
}

export function SpecsFieldArray({ specs, addSpec, removeSpec, updateSpec }: SpecsFieldArrayProps) {
  return (
    <div className="mb-6">
      <label className="owner-label flex-between">
        المواصفات الفنية <span className="text-muted" style={{ fontWeight: 400 }}>— اختياري</span>
      </label>
      {specs.map((spec, i) => (
        <div key={i} className="flex-center gap-2 mb-2">
          <input type="text" className="owner-input" placeholder="اسم الخاصية (مثال: القوة)" value={spec.key} onChange={(e) => updateSpec(i, 'key', e.target.value)} style={{ flex: 1 }} />
          <input type="text" className="owner-input" placeholder="القيمة (مثال: 5000 واط)" value={spec.value} onChange={(e) => updateSpec(i, 'value', e.target.value)} style={{ flex: 2 }} />
          {specs.length > 1 && (
            <button className="owner-btn owner-btn-danger" style={{ padding: '0 12px', height: 42 }} onClick={() => removeSpec(i)}>
              <X size={16} />
            </button>
          )}
        </div>
      ))}
      <button className="owner-btn owner-btn-outline mt-2" onClick={addSpec} style={{ fontSize: 13, borderStyle: 'dashed' }}>
        <Plus size={16} /> إضافة خاصية أخرى
      </button>
    </div>
  );
}
