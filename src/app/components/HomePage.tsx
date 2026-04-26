import { Header } from './Header';
import { HeroSection } from './HeroSection';
import { TrustStrip } from './TrustStrip';
import { ProductCard, ProductCardProps } from './ProductCard';
import { HowItWorks } from './HowItWorks';
import { Footer } from './Footer';
import { Link, useNavigate } from 'react-router';
import { useState } from 'react';
import { ProductDetailsModal } from './ProductDetailsModal';
import { products } from '../data/products';

export function HomePage() {
  const [selectedProductForModal, setSelectedProductForModal] = useState<ProductCardProps | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />

      <main className="flex-1">
        <HeroSection />
        <TrustStrip />

        {/* Products Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl md:text-3xl font-bold">المعدات المتاحة</h2>
              <button className="text-primary hover:underline">عرض الكل ←</button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <Link key={product.id} to={`/product/${product.id}`} className="block">
                  <ProductCard
                    {...product}
                    onDetailsClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedProductForModal(product);
                    }}
                    onRentClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      navigate('/cart');
                    }}
                  />
                </Link>
              ))}
            </div>
          </div>
        </section>

        <HowItWorks />

        {/* Promotional Banner */}
        <section className="py-12 bg-muted">
          <div className="container mx-auto px-4">
            <div className="bg-primary rounded-2xl overflow-hidden">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="p-8 md:p-12 text-white space-y-4">
                  <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                    وفّر بالريال اليمني
                  </h2>
                  <p className="text-xl text-white/90">
                    استأجر بدل ما تشتري
                  </p>
                  <button className="px-8 h-12 bg-white text-primary rounded-lg font-semibold hover:bg-gray-100 transition-colors">
                    تصفح العروض
                  </button>
                </div>
                <div className="h-64 md:h-full relative">
                  <img
                    src="https://images.unsplash.com/photo-1581094271901-8022df4466f9?w=800&h=600&fit=crop"
                    alt="Equipment"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted Owners Section */}
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">مؤجرون موثوقون</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { name: 'أحمد محمد', rating: 4.9, equipmentCount: 12, location: 'صنعاء' },
                { name: 'سعيد علي', rating: 4.8, equipmentCount: 8, location: 'عدن' },
                { name: 'خالد حسين', rating: 5.0, equipmentCount: 15, location: 'تعز' },
                { name: 'محمد صالح', rating: 4.7, equipmentCount: 6, location: 'إب' },
              ].map((owner, index) => (
                <div key={index} className="bg-white rounded-xl p-6 border border-border hover:shadow-lg transition-shadow">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center text-3xl">
                    👤
                  </div>
                  <h3 className="font-bold text-center mb-2">{owner.name}</h3>
                  <div className="text-center space-y-1 text-sm text-muted-foreground mb-4">
                    <p>⭐ {owner.rating} / 5.0</p>
                    <p>{owner.equipmentCount} معدة</p>
                    <p>📍 {owner.location}</p>
                  </div>
                  <button className="w-full h-10 border border-primary text-primary rounded-lg hover:bg-primary hover:text-white transition-colors">
                    عرض المعدات
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
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
