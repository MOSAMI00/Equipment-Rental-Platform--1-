interface OrderInfoProps {
  item: { image: string; equipment: string; orderNum: string; lessor: string; date: string; };
}

export function OrderInfo({ item }: OrderInfoProps) {
  return (
    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-[#E0E0E0]">
      <div className="w-12 h-12 rounded-xl bg-[#F4F6F9] flex items-center justify-center text-2xl">
        {item.image}
      </div>
      <div>
        <p className="font-bold text-[#222222]">{item.equipment}</p>
        <p className="text-xs text-[#888888]">#{item.orderNum} · {item.lessor} · {item.date}</p>
      </div>
    </div>
  );
}
