import { CartItem } from './CartItem';

interface CartListProps {
  cartItems: any[];
  onDelete: (id: number) => void;
}

export function CartList({ cartItems, onDelete }: CartListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">سلة المعدات</h2>
      {cartItems.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">السلة فارغة</p>
      ) : (
        cartItems.map(item => (
          <CartItem key={item.id} item={item} onDelete={onDelete} />
        ))
      )}
    </div>
  );
}
