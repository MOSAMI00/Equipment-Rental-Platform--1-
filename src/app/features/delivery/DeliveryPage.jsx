import React from 'react';
import { useAuth } from '../../auth/AuthContext';
import { DeliveryPage as TenantDelivery } from '../../components/tenant/Dashboard/Delivery/DeliveryPage';
import OwnerDelivery from '../../components/owner/pages/delivery/Delivery';

export default function DeliveryPage() {
  const { user } = useAuth();
  const role = user?.type || 'tenant';

  // For the delivery page, since it contains deeply complex and diverging workflows
  // (useOwnerDeliveryWorkflow vs Tenant state machine), we unify the routing 
  // entry point but render the role-specific complex component.
  // This allows future incremental refactoring of the sub-panels without breaking the app.
  
  if (role === 'owner') {
    return (
      <div className="p-4 md:p-6 pb-24 md:pb-6" dir="rtl" style={{ fontFamily: "'Cairo', sans-serif", backgroundColor: '#F8FAFC', minHeight: '100vh' }}>
         <OwnerDelivery />
      </div>
    );
  }

  return <TenantDelivery />;
}
