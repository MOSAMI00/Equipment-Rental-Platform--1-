import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './components/main/home/HomePage';
import { LoginPage } from './components/pages/LoginPage';
import { RegisterPage } from './components/pages/RegisterPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { CartPage } from './components/pages/CartPage';
import { TenantLayout } from './components/tenant/layout/TenantLayout';
import { MyOrdersPage } from './components/tenant/orders/MyOrdersPage';
import { OrderDetailPage } from './components/tenant/orders/OrderDetailPage';
import { DeliveryPage } from './components/tenant/orders/DeliveryPage';
import { ContractsPage } from './components/tenant/contracts/ContractsPage';
import { NotificationsPage } from './components/tenant/notifications/NotificationsPage';
import { RatingsPage } from './components/tenant/ratings/RatingsPage';
import { SettingsPage } from './components/tenant/settings/SettingsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/product" element={<ProductDetailPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />

        {/* Tenant Dashboard Routes */}
        <Route path="/dashboard" element={<TenantLayout />}>
          <Route index element={<MyOrdersPage />} />
          <Route path="order/:id" element={<OrderDetailPage />} />
          <Route path="delivery" element={<DeliveryPage />} />
          <Route path="contracts" element={<ContractsPage />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="ratings" element={<RatingsPage />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
      <Toaster position="top-center" richColors />
    </BrowserRouter>
  );
}