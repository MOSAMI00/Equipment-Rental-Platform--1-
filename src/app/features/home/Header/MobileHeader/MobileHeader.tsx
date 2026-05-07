import { MainBar } from './MainBar';
import { MobileSearchBar } from './MobileSearchBar';

interface MobileHeaderProps {
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  notificationCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

export function MobileHeader({ 
  mobileMenuOpen, 
  setMobileMenuOpen, 
  notificationCount,
  searchQuery,
  onSearchChange
}: MobileHeaderProps) {
  return (
    <div className="md:hidden">
      <MainBar 
        mobileMenuOpen={mobileMenuOpen} 
        setMobileMenuOpen={setMobileMenuOpen} 
        notificationCount={notificationCount} 
      />
      <MobileSearchBar value={searchQuery} onChange={onSearchChange} />
    </div>
  );
}

