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
  onPreviewPhoto,
}) {
  return (
    <div className="max-h-[50vh] space-y-3 overflow-y-auto pr-2">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <OrderItemCard
            key={item.id}
            item={item}
            onDelete={onDeleteItem}
            onPreviewPhoto={onPreviewPhoto}
            formatCurrency={formatCurrency}
          />
        ))}
      </div>

      {!isAddingItem ? (
        <button
          type="button"
          onClick={onStartAddItem}
          className="
            flex w-full items-center justify-center gap-2
            rounded-xl border border-dashed border-slate-300
            bg-white px-4 py-5 text-base font-medium text-slate-700
            transition-all duration-200

            hover:border-blue-400
            hover:bg-blue-50
            hover:text-blue-700
            hover:shadow-md
            active:scale-[0.98]
          "
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