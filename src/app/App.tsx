import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './components/pages/Home/HomePage';
import { LoginPage } from './components/pages/Login/LoginPage';
import { RegisterPage } from './components/pages/Register/RegisterPage';
import { ProductDetailPage } from './components/pages/ProductDetails/ProductDetailPage';
import { CartPage } from './components/pages/Cart/CartPage';
import { TenantLayout } from './components/tenant/Dashboard/TenantLayout';
import { MyOrdersPage } from './components/tenant/Dashboard/MyOrders/MyOrdersPage';
import { OrderDetailPage } from './components/tenant/Dashboard/OrderDetails/OrderDetailPage';
import { DeliveryPage } from './components/tenant/Dashboard/Delivery/DeliveryPage';
import { ContractsPage } from './components/tenant/Dashboard/Contracts/ContractsPage';
import { NotificationsPage } from './components/tenant/Dashboard/Notifications/NotificationsPage';
import { RatingsPage } from './components/tenant/Dashboard/Ratings/RatingsPage';
import { SettingsPage } from './components/tenant/Dashboard/Settings/SettingsPage';

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
