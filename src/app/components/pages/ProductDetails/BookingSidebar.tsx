import { useState } from 'react';
import { useNavigate } from 'react-router';
import type { ProductCardProps } from '../Home/Main/EquipmentSection/ProductCard';
import { calculateRentalDays, useRentalPlatform } from '../../../data/mock-api';
import { PriceCard } from './BookingSidebar/PriceCard';
import { DatePickers } from './BookingSidebar/DatePickers';
import { BookingButton } from './BookingSidebar/BookingButton';
import { TrustBadges } from './BookingSidebar/TrustBadges';

interface BookingSidebarProps {
  product: ProductCardProps;
}

export function BookingSidebar({ product }: BookingSidebarProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [notes, setNotes] = useState('');
  const navigate = useNavigate();
  const { addToCartFromProduct } = useRentalPlatform();

  const days = calculateRentalDays(startDate, endDate);
  const dailyRate = product.price;
  const deposit = product.insurance;
  const serviceFee = days * dailyRate * 0.05;
  const totalRental = days * dailyRate;
  const grandTotal = totalRental + deposit + serviceFee;
  const handleBook = () => {
    const item = addToCartFromProduct({ product, startDate, endDate, notes });
    if (item) navigate('/cart');
  };

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
        onBook={handleBook}
      />

      <TrustBadges />
    </div>
  );
}
