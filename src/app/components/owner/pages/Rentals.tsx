import React from 'react';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import { RentalsContent } from './rentals/RentalsContent';

export default function Rentals() {
  const { rentals, handoverReports, isLoading } = useOwnerPageProps();

  return (
    <RentalsContent
      rentals={rentals}
      handoverReports={handoverReports}
      isLoading={isLoading}
    />
  );
}
