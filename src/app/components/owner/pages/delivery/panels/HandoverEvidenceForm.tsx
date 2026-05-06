import React from 'react';
import { CheckCircle } from 'lucide-react';

export function HandoverEvidenceForm({
  evidence,
  description,
  setEvidence,
  setDescription,
  onSubmit,
  submitLabel,
  children,
}: {
  evidence: string[];
  description: string;
  setEvidence: (files: string[]) => void;
  setDescription: (value: string) => void;
  onSubmit: () => void;
  submitLabel: string;
  children?: React.ReactNode;
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <input
        type="file"
        accept="image/*"
        multiple
        className="owner-input"
        onChange={(event) => setEvidence(Array.from(event.target.files || []).map((file) => file.name))}
      />
      <label className="text-muted" style={{ fontSize: 12 }}>وصف إضافي (اختياري)</label>
      <textarea
        className="owner-input"
        rows={3}
        placeholder="مثال: ملاحظات على حالة المعدة، الموقع، أو الصور."
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      {children}
      <button className="owner-btn owner-btn-success w-full" style={{ width: '100%' }} onClick={onSubmit} disabled={evidence.length === 0}>
        <CheckCircle size={16} /> {submitLabel}
      </button>
    </div>
  );
}
