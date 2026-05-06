import React, { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { formatCurrency, formatRentalDateRange } from '../../../../utils/formatters';
import { STATUS_CONFIG } from '../../../tenant/Dashboard/shared/OrderTypes';
import EmptyState from '../../shared/EmptyState';
import type { RentalListItem } from '../../../../types/owner';
import type { HandoverReport } from '../../../../data/mock-api';
import { RentalsTabs, TABS } from './RentalsTabs';
import { RentalsTable } from './RentalsTable';
import { RentalDetailPanel } from './RentalDetailPanel';

interface RentalsContentProps {
  rentals: RentalListItem[];
  handoverReports: HandoverReport[];
  isLoading?: boolean;
}

export function RentalsContent({ rentals, handoverReports, isLoading }: RentalsContentProps) {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState<string | number | null>(null);

  const filteredRentals = useMemo(() => {
    let filtered = rentals;
    if (activeTab !== 'all') {
      filtered = filtered.filter((r) => r.status === activeTab);
    }
    if (search.trim() !== '') {
      const q = search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.orderNum?.toLowerCase().includes(q) ||
          r.equipment?.name?.toLowerCase().includes(q) ||
          r.tenant?.name?.toLowerCase().includes(q)
      );
    }
    return filtered.sort((a, b) => new Date(b.createdAt ?? 0).getTime() - new Date(a.createdAt ?? 0).getTime());
  }, [rentals, activeTab, search]);

  const selectedRental = useMemo(() => rentals.find((r) => r.id === selectedRentalId), [rentals, selectedRentalId]);
  const selectedHandovers = useMemo(() => {
    if (!selectedRentalId) return [];
    return handoverReports.filter((h) => h.rentalOpId === selectedRentalId);
  }, [handoverReports, selectedRentalId]);

  return (
    <div>
      <div className="flex-between mb-8">
        <h2 style={{ margin: 0 }}>عمليات التأجير</h2>
        <div className="flex-center gap-4">
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="owner-input"
              placeholder="بحث..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ paddingRight: 36, width: 200 }}
            />
          </div>
        </div>
      </div>

      <RentalsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

      <div className="owner-table-container owner-card mb-8">
        <RentalsTable
          filteredRentals={filteredRentals}
          isLoading={isLoading}
          selectedRentalId={selectedRentalId}
          setSelectedRentalId={setSelectedRentalId}
        />
      </div>

      {selectedRental && (
        <RentalDetailPanel
          selectedRental={selectedRental}
          selectedHandovers={selectedHandovers}
          onClose={() => setSelectedRentalId(null)}
        />
      )}
    </div>
  );
}
