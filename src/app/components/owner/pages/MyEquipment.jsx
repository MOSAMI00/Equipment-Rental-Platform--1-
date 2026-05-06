import React, { useEffect, useMemo, useState } from 'react';
import { Search, Plus, MapPin, Edit2, Trash2, EyeOff, Star } from 'lucide-react';
import { useAuth } from '../../../auth/AuthContext';
import { formatCurrency, getOwnerEquipmentSnapshots } from '../../../data/mock-api';
import EmptyState from '../shared/EmptyState';
import StatusBadge from '../shared/StatusBadge';
import { EquipmentCardSkeleton } from '../shared/OwnerSkeletons';
import { visit } from '../../../inertia/navigation';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';

const MyEquipment = () => {
  const { user } = useAuth();
  const { rentals, isLoading: propIsLoading } = useOwnerPageProps();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');

  const isLoading = propIsLoading ?? false;

  const ownerEquipment = useMemo(
    () => getOwnerEquipmentSnapshots(user?.id),
    [user?.id],
  );

  const latestRentalByEquipmentId = useMemo(() => {
    const map = {};
    rentals.forEach((rental) => {
      const existing = map[rental.equipmentId];
      if (!existing || new Date(rental.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        map[rental.equipmentId] = rental;
      }
    });
    return map;
  }, [rentals]);

  const equipmentWithMeta = useMemo(() => ownerEquipment.map((equipment) => {
    const latestRental = latestRentalByEquipmentId[equipment.equipmentId];
    let displayStatus = 'available';
    if (latestRental?.status === 'confirmed') displayStatus = 'confirmed';
    if (latestRental?.status === 'in_use') displayStatus = 'in_use';
    if (latestRental?.status === 'cancelled') displayStatus = 'hidden';
    return {
      ...equipment,
      displayStatus,
      rentalCount: rentals.filter((item) => item.equipmentId === equipment.equipmentId).length,
    };
  }), [latestRentalByEquipmentId, ownerEquipment, rentals]);

  const filteredEquipment = useMemo(() => equipmentWithMeta
    .filter((equipment) => category === 'all' || equipment.category === category)
    .filter((equipment) => status === 'all' || equipment.displayStatus === status)
    .filter((equipment) => equipment.name.toLowerCase().includes(search.toLowerCase())), [category, equipmentWithMeta, search, status]);

  return (
    <div>
      {/* Header */}
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0 }}>معداتي</h2>
        <div className="flex-center gap-4" style={{ flexWrap: 'wrap' }}>
          <div style={{ position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', right: 12, top: 12, color: 'var(--color-text-muted)' }} />
            <input
              type="text"
              className="owner-input"
              placeholder="🔍 بحث..."
              style={{ paddingRight: 36, width: 180 }}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select className="owner-input" style={{ width: 130 }} value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">الفئة ▼</option>
            {Array.from(new Set(ownerEquipment.map((equipment) => equipment.category))).map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
          <select className="owner-input" style={{ width: 130 }} value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">الحالة ▼</option>
            <option value="available">متاح</option>
            <option value="confirmed">محجوز</option>
            <option value="in_use">قيد الاستخدام</option>
            <option value="hidden">مخفي</option>
          </select>
          <button className="owner-btn owner-btn-primary" onClick={() => visit('/owner/equipment/add')}>
            <Plus size={18} /> إضافة معدة جديدة
          </button>
        </div>
      </div>

      {/* Grid */}
      {isLoading ? (
        <div className="owner-grid-3">
          <EquipmentCardSkeleton />
          <EquipmentCardSkeleton />
          <EquipmentCardSkeleton />
        </div>
      ) : filteredEquipment.length === 0 ? (
        <EmptyState
          icon="📦"
          title="لا توجد معدات مطابقة"
          description="جرّب تغيير البحث أو الفلاتر، أو أضف معدة جديدة."
          action={(
            <button className="owner-btn owner-btn-primary" onClick={() => visit('/owner/equipment/add')}>
              <Plus size={18} /> إضافة أول معدة
            </button>
          )}
        />
      ) : (
        <div className="owner-grid-3">
          {filteredEquipment.map((equipment) => (
            <div key={equipment.equipmentId} className="owner-card equipment-card" style={{ opacity: equipment.displayStatus === 'hidden' ? 0.6 : 1 }}>
              <img src={equipment.image} alt={equipment.name} className="equipment-image" />
              <div className="equipment-details">
                <div className="flex-between mb-2">
                  <h3 className="equipment-title" style={{ margin: 0 }}>{equipment.name}</h3>
                  <StatusBadge status={equipment.displayStatus} />
                </div>
                <div className="equipment-info-row"><MapPin size={14} /> {equipment.location}</div>
                <div className="equipment-info-row">💰 {formatCurrency(equipment.dailyRate)} ر.ي / اليوم</div>
                <div className="equipment-info-row">⭐ {equipment.rating} | {equipment.rentalCount} تأجير</div>
                <div className="equipment-actions">
                  <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12 }}><Edit2 size={14} /> تعديل</button>
                  <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: 'var(--color-disputed)' }}><Trash2 size={14} /> حذف</button>
                  <button className="owner-btn owner-btn-outline" style={{ flex: 1, padding: '6px 0', fontSize: 12, color: equipment.displayStatus === 'hidden' ? 'var(--color-completed)' : undefined }}>
                    {equipment.displayStatus === 'hidden' ? <Star size={14} /> : <EyeOff size={14} />}
                    {equipment.displayStatus === 'hidden' ? ' إظهار' : ' إخفاء'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyEquipment;
