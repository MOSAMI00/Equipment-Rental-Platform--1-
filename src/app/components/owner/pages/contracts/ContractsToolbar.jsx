import React from 'react';
import { Search } from 'lucide-react';
import { AppInput, AppSelect, PageHeader } from '../../../shared';

const ContractsToolbar = ({ search, onSearchChange }) => (
  <PageHeader
    title="العقود الإلكترونية"
    actions={(
      <div className="flex-center gap-4">
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
          <AppInput
            type="text"
            placeholder="بحث برقم العقد..."
            style={{ paddingRight: 36, width: 200 }}
            value={search}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        <AppSelect>
          <option>فلتر التاريخ</option>
          <option>هذا الشهر</option>
        </AppSelect>
      </div>
    )}
  />
);

export default ContractsToolbar;
