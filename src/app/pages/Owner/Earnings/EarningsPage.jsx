import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../../auth/AuthContext';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import { PageHeader } from '../../../components/shared';
import EarningsKpis from './components/EarningsKpis';
import EarningsChart from './components/EarningsChart';
import PayoutMethodCard from './PayoutMethodCard';
import PaymentsTable from './components/PaymentsTable';
import PayoutMethodModal from './PayoutMethodModal';

const Earnings = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { rentals } = useOwnerPageProps();

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const ownerRentals = useMemo(
    () => rentals.filter((rental) => rental.ownerId === user?.id),
    [rentals, user?.id],
  );

  const dataEarnings = useMemo(() => {
    const formatter = new Intl.DateTimeFormat('ar-YE', { month: 'short' });
    const now = new Date();
    const rows = [];
    for (let i = 11; i >= 0; i -= 1) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const month = date.getMonth();
      const year = date.getFullYear();
      const amount = ownerRentals
        .filter((rental) => {
          const created = new Date(rental.createdAt);
          return created.getMonth() === month && created.getFullYear() === year;
        })
        .reduce((total, rental) => total + rental.rentalAmount, 0);
      rows.push({ name: formatter.format(date), amount });
    }
    return rows;
  }, [ownerRentals]);

  const thisMonth = dataEarnings[dataEarnings.length - 1]?.amount ?? 0;
  const total = ownerRentals.reduce((sum, rental) => sum + rental.rentalAmount, 0);
  const pendingTransfer = ownerRentals
    .filter((rental) => rental.paymentStatus === 'paid' && rental.escrowStatus === 'held')
    .reduce((sum, rental) => sum + rental.rentalAmount, 0);
  const transferred = Math.max(0, total - pendingTransfer);
  const paymentsRows = ownerRentals
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 8);

  return (
    <div>
      <PageHeader title="الأرباح والمدفوعات" />

      <EarningsKpis
        isLoading={isLoading}
        thisMonth={thisMonth}
        total={total}
        pendingTransfer={pendingTransfer}
        transferred={transferred}
      />

      <div className="owner-grid-2">
        <PayoutMethodCard onAddMethod={() => setIsModalOpen(true)} />
        <EarningsChart data={dataEarnings} isLoading={isLoading} />
      </div>

      <PaymentsTable rows={paymentsRows} isLoading={isLoading} />

      <PayoutMethodModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Earnings;
