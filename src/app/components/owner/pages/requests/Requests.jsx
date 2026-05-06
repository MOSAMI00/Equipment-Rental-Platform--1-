import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../../../auth/AuthContext';
import { useRentalPlatform } from '../../../../data/mock-api';
import { useOwnerPageProps } from '../../../../inertia/owner-page-props';
import { PageHeader } from '../../../shared';
import ConfirmModal from '../../shared/ConfirmModal';
import RequestDetailsModal from './RequestDetailsModal';
import RequestFilters from './RequestFilters';
import RequestGrid from './RequestGrid';
import RequestTabs from './RequestTabs';
import RejectRequestModal from './RejectRequestModal';
import { useOwnerRequests } from './useOwnerRequests';

const Requests = () => {
  const { user } = useAuth();
  const {
    approveRentalRequest,
    rejectRentalRequest,
  } = useRentalPlatform();
  const { rentals } = useOwnerPageProps();
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRentalId, setSelectedRentalId] = useState(null);
  const [modal, setModal] = useState(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsLoading(false), 350);
    return () => window.clearTimeout(timer);
  }, []);

  const { selectedRental, tabs, visibleRentals } = useOwnerRequests({
    rentals,
    ownerId: user?.id,
    activeTab,
    search,
    selectedRentalId,
  });

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
      <PageHeader
        title="الطلبات الواردة"
        actions={<RequestFilters search={search} onSearchChange={setSearch} />}
      />

      <RequestTabs tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

      <RequestGrid
        isLoading={isLoading}
        rentals={visibleRentals}
        search={search}
        onOpenModal={openModal}
      />

      <ConfirmModal
        isOpen={modal === 'accept' && Boolean(selectedRental)}
        title="تأكيد قبول الطلب؟"
        description="سيتم إشعار المستأجر لإتمام الدفع، ثم حفظ المبلغ في الضمان بعد الدفع."
        confirmLabel="تأكيد القبول"
        variant="success"
        onClose={closeModal}
        onConfirm={confirmApprove}
      />

      <RejectRequestModal
        isOpen={modal === 'reject' && Boolean(selectedRental)}
        onClose={closeModal}
        onConfirm={confirmReject}
      />

      <RequestDetailsModal
        isOpen={modal === 'detail' && Boolean(selectedRental)}
        rental={selectedRental}
        onClose={closeModal}
      />
    </div>
  );
};

export default Requests;
