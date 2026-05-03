import { Trash2 } from 'lucide-react';

interface CartItemProps {
  item: any;
  onDelete: (id: number) => void;
}

export function CartItem({ item, onDelete }: CartItemProps) {
  return (
    <div className="flex gap-4 p-4 border border-border rounded-xl">
      <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-lg" />
      <div className="flex-1 flex flex-col justify-between">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-bold text-lg">{item.name}</h3>
            <p className="text-sm text-muted-foreground">{item.location} • المؤجر: {item.owner}</p>
          </div>
          <button onClick={() => onDelete(item.id)} className="text-[#E74C3C] p-2 hover:bg-red-50 rounded-lg">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
        <div className="flex justify-between items-end mt-4">
          <div className="text-sm">
            <p>من: {item.startDate}</p>
            <p>إلى: {item.endDate}</p>
            <p className="font-semibold text-primary mt-1">المدة: {item.days} أيام</p>
          </div>
          <div className="text-left">
            <p className="font-bold text-lg">{((item.dailyRate * item.days) + item.deposit).toLocaleString('ar-YE')} ر.ي</p>
            <p className="text-xs text-muted-foreground">يشمل التأمين</p>
          </div>
        </div>
      </div>
    </div>
  );
}
