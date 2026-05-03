import { useState } from 'react';
import { useNavigate } from 'react-router';
import { PriceCard } from './BookingSidebar/PriceCard';
import { DatePickers } from './BookingSidebar/DatePickers';
import { BookingButton } from './BookingSidebar/BookingButton';
import { TrustBadges } from './BookingSidebar/TrustBadges';

interface BookingSidebarProps {
  product: any;
}

export function BookingSidebar({ product }: BookingSidebarProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();

  const calculateDays = () => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays || 0;
  };

  const days = calculateDays();
  const dailyRate = product.price;
  const deposit = product.insurance;
  const serviceFee = days * dailyRate * 0.05;
  const totalRental = days * dailyRate;
  const grandTotal = totalRental + deposit + serviceFee;

  return (
    <div className="bg-white border border-border rounded-xl p-6 space-y-4">
      <PriceCard product={product} dailyRate={dailyRate} deposit={deposit} />
      
      <DatePickers 
        startDate={startDate} 
        setStartDate={setStartDate} 
        endDate={endDate} 
        setEndDate={setEndDate} 
        days={days} 
        notes={notes} 
        setNotes={setNotes} 
      />

      <BookingButton 
        days={days} 
        dailyRate={dailyRate} 
        totalRental={totalRental} 
        deposit={deposit} 
        serviceFee={serviceFee} 
        grandTotal={grandTotal} 
        startDate={startDate} 
        endDate={endDate} 
        onBook={() => navigate('/cart')} 
      />

      <TrustBadges />
    </div>
  );
}

