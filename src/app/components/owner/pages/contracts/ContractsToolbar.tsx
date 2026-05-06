import React from 'react';
import { Search } from 'lucide-react';

interface ContractsToolbarProps {
  search: string;
  setSearch: (value: string) => void;
}

export function ContractsToolbar({ search, setSearch }: ContractsToolbarProps) {
  return (
    <div className="flex-center gap-4">
      <div style={{ position: 'relative' }}>
        <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
        <input
          type="text"
          className="owner-input"
          placeholder="بحث برقم العقد..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ paddingRight: 36, width: 200 }}
        />
      </div>
      <select className="owner-input">
        <option>فلتر التاريخ ▼</option>
        <option>هذا الشهر</option>
      </select>
    </div>
  );
}
