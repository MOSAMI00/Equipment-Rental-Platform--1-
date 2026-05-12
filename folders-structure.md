src/app/
├── App.tsx
│
├── pages/
│   ├── Tenant/
│   │   ├── Orders/
│   │   │   ├── MyOrders/
│   │   │   │   ├── MyOrdersPage.tsx
│   │   │   │   └── components/
│   │   │   │       ├── ActionBanner.tsx
│   │   │   │       ├── FilterTabs.tsx
│   │   │   │       ├── OrderHeader.tsx
│   │   │   │       └── OrdersGrid.tsx
│   │   │   └── OrderDetails/
│   │   │       ├── OrderDetailsPage.tsx
│   │   │       └── components/
│   │   │           ├── ActionButtons.tsx
│   │   │           └── Breadcrumb.tsx
│   │   ├── shared/....
│   │   ├── Delivery/DeliveryPage.jsx        ← wrapper فقط
│   │   ├── Contracts/ContractsPage.jsx      ← wrapper فقط
│   │   ├── Reviews/ReviewsPage.jsx          ← wrapper فقط
│   │   ├── Insurance/InsurancePage.jsx      ← wrapper فقط
│   │   ├── Notifications/NotificationsPage.jsx ← wrapper فقط
│   │   └── Settings/SettingsPage.jsx        ← wrapper فقط
│   │
│   └── Owner/
│       ├── Overview/
│       │   ├── OverviewPage.jsx
│       │   ├── useOwnerOverview.js
│       │   └── components/
│       │       ├── EarningsChart.jsx
│       │       ├── OrderStatusChart.jsx
│       │       ├── OverviewKpis.jsx
│       │       └── RecentOrdersTable.jsx
│       ├── Equipment/
│       │   ├── EquipmentPage.jsx
│       │   ├── useOwnerEquipmentCatalog.js
│       │   └── components/
│       │       ├── EquipmentCard.jsx
│       │       ├── EquipmentGrid.jsx
│       │       └── EquipmentToolbar.jsx
│       ├── AddEquipment/
│       │   ├── AddEquipmentPage.jsx
│       │   └── components/
│       │       └── ...
│       ├── Requests/
│       │   ├── RequestsPage.jsx
│       │   └── components/
│       │       └── ... (9 files)
│       ├── Rentals/
│       │   ├── RentalsPage.jsx
│       │   └── components/
│       │       └── ... (7 files)
│       ├── Earnings/
│       │   ├── EarningsPage.jsx
│       │   └── components/
│       │       └── ... (5 files)
│       ├── shared/....
│       ├── Delivery/DeliveryPage.jsx        ← wrapper فقط
│       ├── Contracts/ContractsPage.jsx      ← wrapper فقط
│       ├── Reviews/ReviewsPage.jsx          ← wrapper فقط
│       ├── Insurance/InsurancePage.jsx      ← wrapper فقط
│       ├── Notifications/NotificationsPage.jsx ← wrapper فقط
│       └── Settings/SettingsPage.jsx        ← wrapper فقط
│
├── features/                               ← الصفحات المشتركة بين الدورين فقط
│   ├── delivery/
│   │   ├── DeliveryPage.jsx
│   │   ├── deliveryConfig.js
│   │   └── components/
│   │       ├── StepsTimeline.jsx
│   │       └── DeliverySummary.jsx
│   ├── contracts/
│   │   ├── ContractsPage.jsx
│   │   └── components/
│   │       └── ContractsTable.jsx
│   ├── reviews/
│   │   ├── ReviewsPage.jsx
│   │   ├── reviewsConfig.js
│   │   └── components/
│   │       └── ReviewCard.jsx
│   ├── insurance/
│   │   ├── InsurancePage.jsx
│   │   └── components/
│   │       └── InsuranceTable.jsx
│   ├── notifications/
│   │   ├── NotificationsPage.jsx
│   │   └── components/
│   │       └── NotificationsList.jsx
│   └── settings/
│       ├── SettingsPage.jsx
│       └── components/
│           ├── ProfileForm.jsx
│           ├── PasswordForm.jsx
│           └── KycUploader.jsx
│
├── layouts/
│   ├── TenantLayout.tsx
│   ├── OwnerLayout.jsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   └── MobileBottomNav.tsx
│
├── components/
│   ├── ui/                                 ← لا تعدّل
│   └── shared/
│       ├── StatusBadge.jsx
│       ├── EmptyState.jsx
│       ├── PageHeader.jsx
│       ├── DataTable.jsx
│       ├── SecurityForm.jsx
│       └── ConfirmDialog.jsx
│
├── auth/
├── data/
├── types/
├── utils/
└── context/