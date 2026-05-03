import { Link, useParams } from 'react-router';
import { products } from '../../../data/products';
import { Header } from './Header';
import { Breadcrumb } from './Breadcrumb';
import { Gallery } from './Gallery';
import { Tabs } from './Tabs';
import { BookingSidebar } from './BookingSidebar';
import { OwnerCard } from './OwnerCard';
import { MobileBottomBar } from './MobileBottomBar';

export function ProductDetailPage() {
  const { id } = useParams();
  const product = id ? products.find((p) => p.id === Number(id)) : products[0];

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">المنتج غير موجود</h2>
          <Link to="/" className="text-primary hover:underline">
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <Breadcrumb category={product.category} name={product.name} />

      <main className="container mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-12 gap-8">
          <section className="lg:col-span-8 space-y-6">
            <Gallery
              images={images}
              status={product.status}
              discount={product.discount}
            />
            <Tabs product={product} />
          </section>

          <aside className="lg:col-span-4">
            <div className="sticky top-24">
              <BookingSidebar product={product} />
              <OwnerCard />
            </div>
          </aside>
        </div>
      </main>

      <MobileBottomBar dailyRate={product.price} />
    </div>
  );
}
