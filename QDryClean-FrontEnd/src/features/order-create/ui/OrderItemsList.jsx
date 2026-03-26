import { Plus } from 'lucide-react';
import OrderItemCard from './OrderItemCard';

export default function OrderItemsList({
  items,
  onDeleteItem,
  onStartAddItem,
  isAddingItem,
  children,
  itemsEndRef,
  formatCurrency,
}) {
  return (
    <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-2">
      {items.map((item) => (
        <OrderItemCard
          key={item.id}
          item={item}
          onDelete={onDeleteItem}
          formatCurrency={formatCurrency}
        />
      ))}

      {!isAddingItem ? (
        <button
          type="button"
          onClick={onStartAddItem}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-input bg-background px-4 py-4 text-base font-medium text-primary transition hover:bg-accent"
        >
          <Plus className="h-5 w-5" />
          Add New Item
        </button>
      ) : (
        children
      )}

      <div ref={itemsEndRef} />
    </div>
  );
}