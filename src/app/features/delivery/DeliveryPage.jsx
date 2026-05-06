import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { DeliveryPage as TenantDelivery } from '../../components/tenant/Dashboard/Delivery/DeliveryPage';
import OwnerDelivery from '../../components/owner/pages/delivery/Delivery';
import { getDeliveryConfig } from './deliveryConfig';

const DELIVERY_WORKFLOWS = {
  tenant: TenantDelivery,
  owner: OwnerDelivery,
};

export default function DeliveryPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';
  const config = getDeliveryConfig(role);
  const Workflow = DELIVERY_WORKFLOWS[role] || DELIVERY_WORKFLOWS.tenant;

  if (role === 'owner') {
    return (
      <div className={config.containerClassName} dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
        <Workflow />
      </div>
    );
  }

  return <Workflow />;
}
