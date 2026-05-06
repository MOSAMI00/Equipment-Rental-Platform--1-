import { useAuth } from '../../../auth/AuthContext';
import OwnerDelivery from '../../owner/pages/delivery/Delivery';
import { DeliveryPage } from '../../tenant/Dashboard/Delivery/DeliveryPage';

export function UnifiedDeliveryPage() {
  const { user } = useAuth();
  if (user?.type === 'owner') return <OwnerDelivery />;
  return <DeliveryPage />;
}
