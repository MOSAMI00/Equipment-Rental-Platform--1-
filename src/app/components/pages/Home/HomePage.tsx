import { useState } from 'react';
import { Header } from './Header/Header';
import { Footer } from './Footer/Footer';
import { HeroSection } from './Main/HeroSection/HeroSection';
import { TrustStrip } from './Main/HeroSection/TrustStrip';
import { EquipmentSection } from './Main/EquipmentSection/EquipmentSection';
import { HowItWorks } from './Main/HowItWorks/HowItWorks';
import { JoinCTA } from './Main/JoinCTA/JoinCTA';
import { ReviewsSection } from './Main/ReviewsSection/ReviewsSection';
import { ProductDetailsModal } from './ProductDetailsModal/ProductDetailsModal';

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
