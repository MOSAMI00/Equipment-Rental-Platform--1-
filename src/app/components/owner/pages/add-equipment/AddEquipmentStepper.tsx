import React from 'react';

const steps = ['المعلومات الأساسية', 'الصور', 'التسعير', 'المراجعة والنشر'];

export function AddEquipmentStepper({ step }: { step: number }) {
  return (
    <div className="stepper mb-8" style={{ maxWidth: 600, margin: '0 auto 32px' }}>
      <div className="flex-between" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 16, left: 0, right: 0, height: 2, backgroundColor: 'var(--color-border)', zIndex: 0 }}></div>
        <div style={{ position: 'absolute', top: 16, right: 0, height: 2, backgroundColor: 'var(--color-primary-green)', zIndex: 0, width: `${(step / (steps.length - 1)) * 100}%`, transition: 'width 0.3s ease' }}></div>

        {steps.map((label, i) => (
          <div key={i} className="step-indicator" style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 600,
              backgroundColor: i <= step ? 'var(--color-primary-green)' : 'white',
              color: i <= step ? 'white' : 'var(--color-text-muted)',
              border: `2px solid ${i <= step ? 'var(--color-primary-green)' : 'var(--color-border)'}`,
              transition: 'all 0.3s ease'
            }}>
              {i < step ? '✓' : i + 1}
            </div>
            <span style={{ fontSize: 13, fontWeight: i <= step ? 600 : 400, color: i <= step ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
