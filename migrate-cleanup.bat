@echo off
REM ============================================================
REM Migration Cleanup Script
REM Run this from the project root directory
REM ============================================================

echo Running batch TSX to JSX conversion...
node src\migrate-tsx-to-jsx.cjs

echo.
echo Fixing auto-conversion artifacts...
node src\fix-auto-conversion.cjs

echo.
echo Rewriting imports (mock-api, AuthContext, react-router)...
node src\rewrite-imports.cjs

echo.
echo Deleting old TypeScript source files...

REM Core files already converted
del /f /q "src\main.tsx" 2>nul
del /f /q "src\app\App.tsx" 2>nul
del /f /q "vite.config.ts" 2>nul

REM Auth context (replaced by Inertia props)
del /f /q "src\app\auth\AuthContext.tsx" 2>nul

REM Mock data (replaced by Inertia props)  
del /f /q "src\app\data\mock-api.tsx" 2>nul
del /f /q "src\app\data\products.ts" 2>nul
del /f /q "src\app\data\mock\index.ts" 2>nul

REM Type files (type-only, deleted)
del /f /q "src\app\types\index.ts" 2>nul
del /f /q "src\app\types\owner.ts" 2>nul
del /f /q "src\app\types\orderTypes.ts" 2>nul

REM Inertia module
del /f /q "src\app\inertia\owner-page-props.ts" 2>nul

REM Utils
del /f /q "src\app\utils\formatters.ts" 2>nul

REM UI utilities
del /f /q "src\app\components\ui\utils.ts" 2>nul
del /f /q "src\app\components\ui\use-mobile.ts" 2>nul
del /f /q "src\app\components\shared\index.ts" 2>nul

REM Feature barrel exports
del /f /q "src\app\features\auth\index.ts" 2>nul
del /f /q "src\app\features\home\index.ts" 2>nul
del /f /q "src\app\features\product-details\index.ts" 2>nul
del /f /q "src\app\features\cart\index.ts" 2>nul

REM Tenant layouts
del /f /q "src\app\layouts\tenant\TenantLayout.tsx" 2>nul
del /f /q "src\app\layouts\tenant\Sidebar.tsx" 2>nul
del /f /q "src\app\layouts\tenant\Topbar.tsx" 2>nul
del /f /q "src\app\layouts\tenant\MobileBottomNav.tsx" 2>nul

REM Auth pages
del /f /q "src\app\features\auth\login\LoginPage.tsx" 2>nul
del /f /q "src\app\features\auth\register\RegisterPage.tsx" 2>nul

REM Feature pages (replaced with .jsx)
del /f /q "src\app\features\home\HomePage.tsx" 2>nul
del /f /q "src\app\features\product-details\ProductDetailPage.tsx" 2>nul
del /f /q "src\app\features\cart\CartPage.tsx" 2>nul

REM Tenant pages
del /f /q "src\app\pages\Tenant\Orders\MyOrders\MyOrdersPage.tsx" 2>nul
del /f /q "src\app\pages\Tenant\Orders\OrderDetails\OrderDetailsPage.tsx" 2>nul

REM Mock store (replaced by Inertia props)
del /f /q "src\app\features\rentals\store.jsx" 2>nul
del /f /q "src\app\features\notifications\store.jsx" 2>nul
del /f /q "src\app\features\cart\store.jsx" 2>nul

echo.
echo Now deleting ALL remaining .tsx files that have been converted to .jsx...
for /r src %%f in (*.tsx) do (
  if exist "%%~dpnf.jsx" (
    echo Deleting %%f
    del /f /q "%%f"
  )
)

echo.
echo Deleting ALL remaining .ts files that have been converted to .js...
for /r src %%f in (*.ts) do (
  if exist "%%~dpnf.js" (
    echo Deleting %%f
    del /f /q "%%f"
  )
)

echo.
echo Removing react-router from package.json dependencies...
echo NOTE: Run "npm uninstall react-router react-hook-form" manually
echo NOTE: Run "npm install @inertiajs/react" if not already installed

echo.
echo Cleanup script for tsconfig files...
del /f /q "tsconfig.json" 2>nul
del /f /q "tsconfig.app.json" 2>nul
del /f /q "tsconfig.node.json" 2>nul

echo.
echo Migration cleanup complete!
echo.
echo REMAINING MANUAL STEPS:
echo 1. Update index.html to reference src/main.jsx instead of src/main.tsx
echo 2. Run: npm uninstall react-router react-hook-form
echo 3. Run: npm install @inertiajs/react
echo 4. Review all converted files for manual fixes
echo 5. Delete src\migrate-tsx-to-jsx.cjs after migration
