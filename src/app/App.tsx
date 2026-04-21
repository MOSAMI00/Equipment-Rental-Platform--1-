import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './components/HomePage';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { ProductDetailPage } from './components/ProductDetailPage';
import { CartPage } from './components/CartPage';
import { TenantLayout } from './components/tenant/TenantLayout';
import { MyOrdersPage } from './components/tenant/MyOrdersPage';
import { OrderDetailPage } from './components/tenant/OrderDetailPage';
import { DeliveryPage } from './components/tenant/DeliveryPage';
import { ContractsPage } from './components/tenant/ContractsPage';
import { NotificationsPage } from './components/tenant/NotificationsPage';
import { RatingsPage } from './components/tenant/RatingsPage';
import { SettingsPage } from './components/tenant/SettingsPage';

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