import { products } from '../../../data/products';
import { ProductCard } from './ProductCard';
import { Link, useNavigate } from 'react-router';

interface EquipmentSectionProps {
  onDetailsClick: (product: any) => void;
}

export function EquipmentSection({ onDetailsClick }: EquipmentSectionProps) {
  const navigate = useNavigate();
  
  return (
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
                  onDetailsClick(product);
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
  );
}
