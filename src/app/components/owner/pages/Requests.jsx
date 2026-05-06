import React, { useEffect, useMemo, useState } from 'react';
import { X as XIcon } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '../../../auth/AuthContext';
import { useRentalPlatform } from '../../../data/mock-api';
import { useOwnerPageProps } from '../../../inertia/owner-page-props';
import EmptyState from '../shared/EmptyState';
import { EquipmentCardSkeleton } from '../shared/OwnerSkeletons';
import ConfirmModal from '../shared/ConfirmModal';
import DetailsModal from '../shared/DetailsModal';
import {
  RequestCard,
  RequestDetailsModal,
  RequestFilters,
} from './requests/RequestComponents';

const tabs = [
  { id: 'all', label: 'الكل', icon: '' },
  { id: 'pending', label: 'بانتظار الموافقة', icon: '⏳' },
  { id: 'confirmed', label: 'مقبولة', icon: '✅' },
  { id: 'in_use', label: 'قيد الاستخدام', icon: '🔧' },
  { id: 'completed', label: 'مكتملة', icon: '🎉' },
  { id: 'cancelled', label: 'ملغية', icon: '❌' },
];

const equipmentOf = (rental) => rental?.equipment ?? {};
const tenantOf = (rental) => rental?.tenant ?? {};

const Requests = () => {
  const { user } = useAuth();
  const {
    approveRentalRequest,
    rejectRentalRequest,
  } = useRentalPlatform();
  const { rentals, isLoading: propIsLoading } = useOwnerPageProps();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [modal, setModal] = useState(null);

  const isLoading = propIsLoading ?? false;

  const ownerRentals = useMemo(() => (
    rentals
      .filter((rental) => rental.ownerId === user?.id)
      .filter((rental) => activeTab === 'all' || rental.status === activeTab)
      .filter((rental) => {
        const equipment = equipmentOf(rental);
        const tenant = tenantOf(rental);
        const term = search.toLowerCase();
        return (
          (equipment.name ?? '').toLowerCase().includes(term) ||
          (rental.orderNum ?? '').toLowerCase().includes(term) ||
          (tenant.name ?? '').toLowerCase().includes(term)
        );
      })
  ), [activeTab, rentals, search, user?.id]);

  const selectedRental = ownerRentals.find((rental) => rental.id === selectedRentalId)
    ?? rentals.find((rental) => rental.id === selectedRentalId);

  const openModal = (type, rentalId) => {
    if (!rentalId) return;
    setSelectedRentalId(rentalId);
    setModal(type);
  };

  const closeModal = () => setModal(null);

  const confirmApprove = () => {
    if (!selectedRental?.id) return;
    approveRentalRequest(selectedRental.id);
    toast.success('تم قبول الطلب وإشعار المستأجر لإتمام الدفع');
    closeModal();
  };

  const confirmReject = () => {
    if (!selectedRental?.id) return;
    rejectRentalRequest(selectedRental.id);
    toast.success('تم رفض الطلب وإشعار المستأجر');
    closeModal();
  };

  return (
    <div>
      <div className="flex-between mb-8" style={{ flexWrap: 'wrap', gap: 16 }}>
        <h2 style={{ margin: 0 }}>الطلبات الواردة</h2>
        <RequestFilters search={search} onSearchChange={setSearch} />
      </div>

      <div className="owner-tabs">
        {tabs.map((tab) => {
          const count = tab.id === 'all'
            ? rentals.filter((rental) => rental.ownerId === user?.id).length
            : rentals.filter((rental) => rental.ownerId === user?.id && rental.status === tab.id).length;

          return (
            <div
              key={tab.id}
              className={`owner-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} {tab.label} {count > 0 ? `(${count})` : ''}
            </div>
          );
        })}
      </div>

      {isLoading ? (
        <div className="owner-grid-2">
          <EquipmentCardSkeleton />
          <EquipmentCardSkeleton />
        </div>
      ) : ownerRentals.length === 0 ? (
        <EmptyState
          type={search ? 'noResults' : 'empty'}
          icon="📭"
          title="لا توجد طلبات مطابقة"
          description="ستظهر هنا طلبات الحجز الجديدة عند إرسالها من المستأجرين."
        />
      ) : (
        <div className="owner-grid-2">
          {ownerRentals.map((rental) => (
            <RequestCard key={rental.id} rental={rental} onOpenModal={openModal} />
          ))}
        </div>
      )}

      <ConfirmModal
        isOpen={modal === 'accept' && Boolean(selectedRental)}
        title="تأكيد قبول الطلب؟"
        description="سيتم إشعار المستأجر لإتمام الدفع، ثم حفظ المبلغ في الضمان بعد الدفع."
        confirmLabel="تأكيد القبول"
        variant="success"
        onClose={closeModal}
        onConfirm={confirmApprove}
      />

      <DetailsModal
        isOpen={modal === 'reject' && Boolean(selectedRental)}
        title="رفض الطلب"
        onClose={closeModal}
        maxWidth={450}
        footer={(
          <>
            <button className="owner-btn owner-btn-outline" onClick={closeModal}>إلغاء</button>
            <button className="owner-btn owner-btn-danger" onClick={confirmReject}>تأكيد الرفض</button>
          </>
        )}
      >
        <div className="mb-4">
          <label className="owner-label">سبب الرفض</label>
          <select className="owner-input mb-4">
            <option>المعدة غير متاحة في هذا التاريخ</option>
            <option>الموقع بعيد جداً</option>
            <option>تقييم المستأجر منخفض</option>
            <option>سبب آخر</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="owner-label">ملاحظات إضافية</label>
          <textarea className="owner-input" rows={3} placeholder="سبب إضافي..." />
        </div>
      </DetailsModal>

      <RequestDetailsModal
        isOpen={modal === 'detail' && Boolean(selectedRental)}
        rental={selectedRental}
        onClose={closeModal}
      />
    </div>
  );
};

export default Requests;
