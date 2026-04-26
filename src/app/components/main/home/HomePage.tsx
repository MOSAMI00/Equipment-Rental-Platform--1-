import { Header } from '../../Header/Header';
import { HeroSection } from './hero/HeroSection';
import { TrustStrip } from './hero/TrustStrip';
import { HowItWorks } from './howItWorks/HowItWorks';
import { Footer } from '../../footer/Footer';
import { useState } from 'react';
import { ProductDetailsModal } from '../equipment/ProductDetailsModal';
import { EquipmentSection } from '../equipment/EquipmentSection';
import { ReviewsSection } from '../Reviews/ReviewsSection';
import { JoinCTA } from '../join/JoinCTA';

export function HomePage() {
  const [selectedProductForModal, setSelectedProductForModal] = useState<any>(null);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <TrustStrip />
        
        <EquipmentSection onDetailsClick={setSelectedProductForModal} />
        
        <HowItWorks />
        
        <JoinCTA />
        
        <ReviewsSection />
      </main>

      <Footer />

      <ProductDetailsModal
        isOpen={!!selectedProductForModal}
        onClose={() => setSelectedProductForModal(null)}
        product={selectedProductForModal}
      />
    </div>
  );
}
