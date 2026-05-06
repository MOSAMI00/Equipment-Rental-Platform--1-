import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './components/pages/Home/HomePage';
import { LoginPage } from './components/pages/Login/LoginPage';
import { RegisterPage } from './components/pages/Register/RegisterPage';
import { ProductDetailPage } from './components/pages/ProductDetails/ProductDetailPage';
import { CartPage } from './components/pages/Cart/CartPage';
import { TenantLayout } from './components/tenant/Dashboard/TenantLayout';
import { MyOrdersPage } from './components/tenant/Dashboard/MyOrders/MyOrdersPage';
import { OrderDetailPage } from './components/tenant/Dashboard/OrderDetails/OrderDetailPage';
import { DeliveryPage } from './features/delivery';
import { NotificationsPage } from './features/notifications';
import { SettingsPage } from './features/settings';
import { ReviewsPage } from './features/reviews';
import OwnerLayout from './components/owner/OwnerLayout';
import OwnerOverview from './components/owner/pages/overview/Overview';
import OwnerMyEquipment from './components/owner/pages/equipment/MyEquipment';
import OwnerAddEquipment from './components/owner/pages/add-equipment/AddEquipment';
import OwnerRequests from './components/owner/pages/requests/Requests';
import OwnerRentals from './components/owner/pages/rentals/Rentals';
import OwnerEarnings from './components/owner/pages/earnings/Earnings';
import ContractsPage from './features/contracts/ContractsPage';
import { InsurancePage } from './features/insurance';
import { RentalPlatformProvider } from './data/mock-api';
import { AuthProvider, RequireOwner, RequireTenant } from './auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RentalPlatformProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/product" element={<ProductDetailPage />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />

            {/* Tenant Dashboard Routes */}
            <Route
              path="/dashboard"
              element={(
                <RequireTenant>
                  <TenantLayout />
                </RequireTenant>
              )}
            >
              <Route index element={<MyOrdersPage />} />
              <Route path="order/:id" element={<OrderDetailPage />} />
              <Route path="order/:id/delivery" element={<DeliveryPage />} />
              <Route path="delivery" element={<DeliveryPage />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="ratings" element={<ReviewsPage />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="settings" element={<SettingsPage />} />
            </Route>
            {/* Owner Dashboard Routes */}
            <Route
              path="/owner"
              element={(
                <RequireOwner>
                  <OwnerLayout />
                </RequireOwner>
              )}
            >
              <Route index element={<Navigate to="/owner/overview" replace />} />
              <Route path="overview" element={<OwnerOverview />} />
              <Route path="equipment" element={<OwnerMyEquipment />} />
              <Route path="equipment/add" element={<OwnerAddEquipment />} />
              <Route path="requests" element={<OwnerRequests />} />
              <Route path="rentals" element={<OwnerRentals />} />
              <Route path="delivery" element={<DeliveryPage />} />
              <Route path="insurance" element={<InsurancePage />} />
              <Route path="earnings" element={<OwnerEarnings />} />
              <Route path="contracts" element={<ContractsPage />} />
              <Route path="notifications" element={<NotificationsPage />} />
              <Route path="reviews" element={<ReviewsPage />} />
              <Route path="profile" element={<SettingsPage />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </RentalPlatformProvider>
    </AuthProvider>
  );
}
