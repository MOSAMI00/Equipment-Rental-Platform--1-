import { Navigate } from 'react-router';
import { useAuth } from '../../auth/AuthContext';
import { MyOrdersPage } from '../tenant/Dashboard/MyOrders/MyOrdersPage';

export function DashboardHome() {
  const { user } = useAuth();
  if (user?.type === 'owner') return <Navigate to="/dashboard/overview" replace />;
  return <MyOrdersPage />;
}
