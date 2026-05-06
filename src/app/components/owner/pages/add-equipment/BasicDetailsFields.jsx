import React from 'react';
import { categoryOptions } from './useEquipmentDraft';

const BasicDetailsFields = ({ draft, updateDraft }) => (
  <>
    <div className="owner-grid-2">
      <div className="mb-4">
        <label className="owner-label">اسم المعدة *</label>
        <input
          type="text"
          className="owner-input"
          placeholder="مثال: مولد كهرباء 10KVA"
          value={draft.name}
          onChange={updateDraft('name')}
        />
      </div>

      <div className="mb-4">
        <label className="owner-label">الفئة *</label>
        <select className="owner-input" value={draft.category} onChange={updateDraft('category')}>
          <option value="">اختر الفئة</option>
          {categoryOptions.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
    </div>

    <div className="mb-4">
      <label className="owner-label">الوصف *</label>
      <textarea
        className="owner-input"
        rows={4}
        placeholder="وصف تفصيلي للمعدة ومميزاتها..."
        value={draft.description}
        onChange={updateDraft('description')}
      />
    </div>
  </>
);

export default BasicDetailsFields;
