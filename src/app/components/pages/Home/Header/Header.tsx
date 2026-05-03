import { useState } from 'react';
import { TopBar } from './TopBar/TopBar';
import { DesktopHeader } from './DesktopHeader/DesktopHeader';
import { MobileHeader } from './MobileHeader/MobileHeader';
import { MobileDrawer } from './MobileDrawer/MobileDrawer';
import { CategoryStrip } from './CategoryStrip/CategoryStrip';

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const notificationCount = 3;

  return (
    <>
      <TopBar />
      <header className="sticky top-0 z-50 bg-white border-b border-border shadow-sm">
        <DesktopHeader />
        <MobileHeader
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          notificationCount={notificationCount}
        />
        <MobileDrawer
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
        />
      </header>
      <CategoryStrip />
    </>
  );
}
