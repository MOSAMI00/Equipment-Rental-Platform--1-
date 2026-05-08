import React, { useCallback, useEffect, useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import {
  useRentalPlatform,
} from '../../../data/mock-api';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import {
  AppInput,
  FilterTabs,
  PageHeader,
} from '../../../components/shared';
import RentalSelectionDetails from './components/RentalSelectionDetails';
import RentalsTable from './components/RentalsTable';
import { RENTAL_TABS } from './rentalHelpers';
import { useOwnerRentals } from './useOwnerRentals';

const Rentals = () => {
  const { user } = useAuth();
  const { getHandoverReportsForRental } = useRentalPlatform();
  const { rentals } = useOwnerPageProps();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const {
    selectedEquipment,
    selectedHandovers,
    selectedRental,
    selectedTenant,
    timeline,
    visibleRentals,
  } = useOwnerRentals({
    rentals,
    ownerId: user?.id,
    activeTab,
    search,
    selectedRentalId,
    getHandoversForRental: getHandoverReportsForRental,
  });

  const toggleRental = useCallback((rentalId) => {
    setSelectedRentalId((current) => (current === rentalId ? null : rentalId));
  }, []);

  return (
    <div>
      <PageHeader
        title="عمليات التأجير"
        actions={(
          <AppInput
            type="text"
            placeholder="بحث..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-[220px]"
          />
        )}
      />

      <FilterTabs tabs={RENTAL_TABS} activeTab={activeTab} onTabChange={setActiveTab} />

      <RentalsTable
        rentals={visibleRentals}
        isLoading={isLoading}
        selectedRentalId={selectedRentalId}
        onToggleRental={toggleRental}
      />

      <RentalSelectionDetails
        rental={selectedRental}
        equipment={selectedEquipment}
        tenant={selectedTenant}
        handovers={selectedHandovers}
        timeline={timeline}
        onClose={() => setSelectedRentalId(null)}
      />
    </div>
  );
};

export default Rentals;
