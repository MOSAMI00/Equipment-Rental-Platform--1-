import { BrowserRouter, Navigate, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { HomePage } from './components/pages/Home/HomePage';
import { LoginPage } from './components/pages/Login/LoginPage';
import { RegisterPage } from './components/pages/Register/RegisterPage';
import { ProductDetailPage } from './components/pages/ProductDetails/ProductDetailPage';
import { CartPage } from './components/pages/Cart/CartPage';
import { OrderDetailPage } from './components/tenant/Dashboard/OrderDetails/OrderDetailPage';
import OwnerOverview from './components/owner/pages/overview/Overview';
import OwnerMyEquipment from './components/owner/pages/equipment/MyEquipment';
import OwnerAddEquipment from './components/owner/pages/add-equipment/AddEquipment';
import OwnerRequests from './components/owner/pages/requests/Requests';
import OwnerRentals from './components/owner/pages/rentals/Rentals';
import OwnerEarnings from './components/owner/pages/earnings/Earnings';
import { DashboardShellLayout } from './components/dashboard/DashboardShellLayout';
import { DashboardHome } from './components/dashboard/DashboardHome';
import { OwnerLegacyRedirect } from './components/dashboard/OwnerLegacyRedirect';
import { UnifiedDeliveryPage } from './components/dashboard/pages/UnifiedDeliveryPage';
import { UnifiedContractsPage } from './components/dashboard/pages/UnifiedContractsPage';
import { UnifiedNotificationsPage } from './components/dashboard/pages/UnifiedNotificationsPage';
import { UnifiedRatingsPage } from './components/dashboard/pages/UnifiedRatingsPage';
import { UnifiedSettingsPage } from './components/dashboard/pages/UnifiedSettingsPage';
import { InsuranceDashboardPage } from './components/dashboard/pages/InsuranceDashboardPage';
import { RentalPlatformProvider } from './data/mock-api';
import { AuthProvider, RequireAuth, RequireOwnerOnly } from './auth/AuthContext';

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

            <Route
              path="/dashboard"
              element={(
                <RequireAuth>
                  <DashboardShellLayout />
                </RequireAuth>
              )}
            >
              <Route index element={<DashboardHome />} />
              <Route path="order/:id" element={<OrderDetailPage />} />
              <Route path="order/:id/delivery" element={<UnifiedDeliveryPage />} />
              <Route path="delivery" element={<UnifiedDeliveryPage />} />
              <Route path="contracts" element={<UnifiedContractsPage />} />
              <Route path="notifications" element={<UnifiedNotificationsPage />} />
              <Route path="ratings" element={<UnifiedRatingsPage />} />
              <Route path="settings" element={<UnifiedSettingsPage />} />
              <Route path="insurance" element={<InsuranceDashboardPage />} />

              <Route path="overview" element={<RequireOwnerOnly><OwnerOverview /></RequireOwnerOnly>} />
              <Route path="equipment" element={<RequireOwnerOnly><OwnerMyEquipment /></RequireOwnerOnly>} />
              <Route path="equipment/add" element={<RequireOwnerOnly><OwnerAddEquipment /></RequireOwnerOnly>} />
              <Route path="requests" element={<RequireOwnerOnly><OwnerRequests /></RequireOwnerOnly>} />
              <Route path="rentals" element={<RequireOwnerOnly><OwnerRentals /></RequireOwnerOnly>} />
              <Route path="earnings" element={<RequireOwnerOnly><OwnerEarnings /></RequireOwnerOnly>} />
            </Route>

            <Route path="/owner/*" element={<OwnerLegacyRedirect />} />
          </Routes>
          <Toaster position="top-center" richColors />
        </BrowserRouter>
      </RentalPlatformProvider>
    </AuthProvider>
  );
}
