import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

// ─── Layouts ────────────────────────────────────────────────────────────────
import { TenantLayout } from './layouts/tenant/TenantLayout';
import OwnerLayout from './layouts/owner/OwnerLayout';

// ─── Public Pages (from features) ───────────────────────────────────────────
import { HomePage } from './features/home';
import { LoginPage, RegisterPage } from './features/auth';
import { ProductDetailPage } from './features/product-details';
import { CartPage } from './features/cart';

// ─── Tenant Pages ───────────────────────────────────────────────────────────
import { MyOrdersPage } from './pages/Tenant/Orders/MyOrders/MyOrdersPage';
import { OrderDetailPage } from './pages/Tenant/Orders/OrderDetails/OrderDetailsPage';
import TenantDeliveryPage from './pages/Tenant/Delivery/DeliveryPage';
import TenantContractsPage from './pages/Tenant/Contracts/ContractsPage';
import TenantReviewsPage from './pages/Tenant/Reviews/ReviewsPage';
import TenantInsurancePage from './pages/Tenant/Insurance/InsurancePage';
import TenantNotificationsPage from './pages/Tenant/Notifications/NotificationsPage';
import TenantSettingsPage from './pages/Tenant/Settings/SettingsPage';

// ─── Owner Pages ────────────────────────────────────────────────────────────
import OwnerOverview from './pages/Owner/Overview/OverviewPage';
import OwnerMyEquipment from './pages/Owner/Equipment/EquipmentPage';
import OwnerAddEquipment from './pages/Owner/AddEquipment/AddEquipmentPage';
import OwnerRequests from './pages/Owner/Requests/RequestsPage';
import OwnerRentals from './pages/Owner/Rentals/RentalsPage';
import OwnerEarnings from './pages/Owner/Earnings/EarningsPage';
import OwnerDeliveryPage from './pages/Owner/Delivery/DeliveryPage';
import OwnerContractsPage from './pages/Owner/Contracts/ContractsPage';
import OwnerReviewsPage from './pages/Owner/Reviews/ReviewsPage';
import OwnerInsurancePage from './pages/Owner/Insurance/InsurancePage';
import OwnerNotificationsPage from './pages/Owner/Notifications/NotificationsPage';
import OwnerSettingsPage from './pages/Owner/Settings/SettingsPage';

// ─── Providers & Guards ─────────────────────────────────────────────────────
import { RentalPlatformProvider } from './data/mock-api';
import { AuthProvider, RequireOwner, RequireTenant } from './auth/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <RentalPlatformProvider>
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
              <Route path="order/:id/delivery" element={<TenantDeliveryPage />} />
              <Route path="delivery" element={<TenantDeliveryPage />} />
              <Route path="contracts" element={<TenantContractsPage />} />
              <Route path="notifications" element={<TenantNotificationsPage />} />
              <Route path="ratings" element={<TenantReviewsPage />} />
              <Route path="insurance" element={<TenantInsurancePage />} />
              <Route path="settings" element={<TenantSettingsPage />} />
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
              <Route path="delivery" element={<OwnerDeliveryPage />} />
              <Route path="insurance" element={<OwnerInsurancePage />} />
              <Route path="earnings" element={<OwnerEarnings />} />
              <Route path="contracts" element={<OwnerContractsPage />} />
              <Route path="notifications" element={<OwnerNotificationsPage />} />
              <Route path="reviews" element={<OwnerReviewsPage />} />
              <Route path="profile" element={<OwnerSettingsPage />} />
            </Route>
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </RentalPlatformProvider>
    </AuthProvider>
  );
}
