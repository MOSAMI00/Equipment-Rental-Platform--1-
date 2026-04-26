import { useState } from 'react';
import { SAMPLE_RENTALS, Status } from './OrderTypes';
import { OrderHeader } from './OrderHeader';
import { OrderTabs } from './OrderTabs';
import { OrderCard } from './OrderCard';
import { OrderActionBanner } from './OrderActionBanner';

export function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState<Status | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const hasActions = SAMPLE_RENTALS.some(r => r.status === 'confirmed' || r.status === 'pending');

  const filtered = SAMPLE_RENTALS.filter(r => {
    const matchTab = activeTab === 'all' || r.status === activeTab;
    const matchSearch = r.equipment.includes(searchQuery) || r.orderNum.includes(searchQuery) || r.lessor.includes(searchQuery);
    return matchTab && matchSearch;
  });

  return (
    <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif" }}>
      <OrderHeader 
        count={SAMPLE_RENTALS.length} 
        search={searchQuery} 
        onSearchChange={setSearchQuery} 
      />

      {/* Smart Action Banner */}
      {hasActions && <OrderActionBanner />}

      <OrderTabs 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
        rentals={SAMPLE_RENTALS} 
      />

      {/* Rental Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filtered.map(rental => (
            <OrderCard key={rental.id} rental={rental} />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 bg-[#F4F6F9] rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl">📋</span>
          </div>
          <h3 className="font-bold text-[#222222] text-lg mb-2">لا توجد طلبات</h3>
          <p className="text-[#888888] text-sm max-w-xs">لم تقم بأي طلبات إيجار بعد. ابدأ بتصفح المعدات المتاحة.</p>
          <button
            onClick={() => window.location.href = '/'}
            className="mt-4 px-6 py-2.5 bg-[#2D5A27] text-white rounded-xl text-sm font-semibold hover:bg-[#3D7A35] transition-colors"
          >
            تصفح المعدات
          </button>
        </div>
      )}
    </div>
  );
}
