import { MainBar } from './MainBar';
import { MobileSearchBar } from './MobileSearchBar';

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  notificationCount: number;
}

export function MobileHeader({ mobileMenuOpen, setMobileMenuOpen, notificationCount }: MobileHeaderProps) {
  return (
    <div className="md:hidden">
      <MainBar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        notificationCount={notificationCount} 
      />
      <MobileSearchBar />
    </div>
  );
}

