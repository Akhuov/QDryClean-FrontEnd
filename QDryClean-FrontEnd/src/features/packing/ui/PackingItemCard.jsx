import { Check } from 'lucide-react';
import { cn } from '../../../components/ui/utils';

const ITEM_STATUS = {
  Accepted: 0,
  Packed: 1,
  Issued: 2,
  Reprocessing: 3,
  Damaged: 4,
  Lost: 5,
};

const getItemStatusConfig = (status) => {
  switch (Number(status)) {
    case ITEM_STATUS.Accepted:
      return {
        label: 'Принято',
        wrapperClass: 'border-l-4 border-l-sky-500 bg-sky-50',
        badgeClass: 'border-sky-200 bg-sky-100 text-sky-800',
      };

    case ITEM_STATUS.Packed:
      return {
        label: 'Упаковано',
        wrapperClass: 'border-l-4 border-l-emerald-500 bg-emerald-50',
        badgeClass: 'border-emerald-200 bg-emerald-100 text-emerald-800',
      };

    case ITEM_STATUS.Issued:
      return {
        label: 'Выдано',
        wrapperClass: 'border-l-4 border-l-slate-500 bg-slate-50',
        badgeClass: 'border-slate-200 bg-slate-100 text-slate-800',
      };

    case ITEM_STATUS.Reprocessing:
      return {
        label: 'Переработка',
        wrapperClass: 'border-l-4 border-l-amber-500 bg-amber-50',
        badgeClass: 'border-amber-200 bg-amber-100 text-amber-800',
      };

    case ITEM_STATUS.Damaged:
      return {
        label: 'Повреждено',
        wrapperClass: 'border-l-4 border-l-red-500 bg-red-50',
        badgeClass: 'border-red-200 bg-red-100 text-red-800',
      };

    case ITEM_STATUS.Lost:
      return {
        label: 'Потеряно',
        wrapperClass: 'border-l-4 border-l-rose-600 bg-rose-50',
        badgeClass: 'border-rose-200 bg-rose-100 text-rose-800',
      };

    default:
      return {
        label: 'Неизвестно',
        wrapperClass: 'border-l-4 border-l-border bg-card',
        badgeClass: 'border-border bg-muted text-muted-foreground',
      };
  }
};

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

export default function PackingItemCard({
  item,
  selected,
  disabled,
  onSelect,
  formatCurrency,
}) {
  const typeName = item.itemType?.name ?? item.typeName ?? 'Item';
  const color = item.colour ?? item.color ?? '';
  const brand = item.brandName ?? item.brand ?? '';
  const defects = item.description ?? item.defects ?? '';
  const price = item.itemType?.cost ?? item.price ?? 0;

  const statusConfig = getItemStatusConfig(item.status);

  return (
    <div
      className={cn(
        'rounded-2xl border border-border p-4 shadow-sm transition-all',
        statusConfig.wrapperClass,
        !disabled && 'cursor-pointer hover:shadow-md',
        disabled && 'cursor-not-allowed opacity-60',
        selected && 'ring-2 ring-emerald-200 ring-offset-2'
      )}
      onClick={() => !disabled && onSelect(item.id)}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="break-words text-lg font-semibold text-foreground">
            {typeName}
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              'rounded-full border px-2.5 py-1 text-xs font-medium',
              statusConfig.badgeClass
            )}
          >
            {statusConfig.label}
          </span>

          {selected && !disabled && (
            <div className="flex h-6 w-6 items-center justify-center rounded-full border border-emerald-500 bg-emerald-500 text-white">
              <Check className="h-4 w-4" />
            </div>
          )}
        </div>
      </div>

      <div className="pt-3 space-y-1">
        <p className="break-words text-sm text-muted-foreground">
          Цвет: {getValue(color, 'Не указан')}
        </p>
        <p className="break-words text-sm text-muted-foreground">
          Бренд: {getValue(brand, 'Не указан')}
        </p>
        <p className="break-words text-sm text-muted-foreground">
          Дефекты: {getValue(defects, 'Нет заметок')}
        </p>
      </div>
    </div>
  );
}