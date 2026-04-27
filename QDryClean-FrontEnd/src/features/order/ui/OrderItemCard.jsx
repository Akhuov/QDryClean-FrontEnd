import { forwardRef } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '../../../components/ui/AlertDialog';
import { cn } from '../../../components/ui/utils';

const getValue = (value, fallback = 'Не указан') => {
  if (value === null || value === undefined || String(value).trim() === '') {
    return fallback;
  }

  return value;
};

const ITEM_STATUS = {
  Accepted: 0,
  Packed: 1,
  Issued: 2,
  Reprocessing: 3,
  Damaged: 4,
  Lost: 5,
};

const getStatusConfig = (status) => {
  switch (Number(status)) {
    case ITEM_STATUS.Accepted:
      return {
        label: 'Принято',
        cardClass: 'border-l-4 border-l-sky-500 bg-card',
        badgeClass: 'bg-sky-100 text-sky-700 border-sky-200',
      };
    case ITEM_STATUS.Packed:
      return {
        label: 'Упаковано',
        cardClass: 'border-l-4 border-l-emerald-500 bg-card',
        badgeClass: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };
    case ITEM_STATUS.Issued:
      return {
        label: 'Выдано',
        cardClass: 'border-l-4 border-l-slate-500 bg-card',
        badgeClass: 'bg-slate-100 text-slate-700 border-slate-200',
      };
    case ITEM_STATUS.Reprocessing:
      return {
        label: 'Переработка',
        cardClass: 'border-l-4 border-l-amber-500 bg-card',
        badgeClass: 'bg-amber-100 text-amber-700 border-amber-200',
      };
    case ITEM_STATUS.Damaged:
      return {
        label: 'Повреждено',
        cardClass: 'border-l-4 border-l-red-500 bg-card',
        badgeClass: 'bg-red-100 text-red-700 border-red-200',
      };
    case ITEM_STATUS.Lost:
      return {
        label: 'Потеряно',
        cardClass: 'border-l-4 border-l-rose-600 bg-card',
        badgeClass: 'bg-rose-100 text-rose-700 border-rose-200',
      };
    default:
      return {
        label: 'Неизвестно',
        cardClass: 'border border-border bg-card',
        badgeClass: 'bg-muted text-muted-foreground border-border',
      };
  }
};

const OrderItemCard = forwardRef(
  ({ item, onDelete, formatCurrency, onPreviewPhoto }, ref) => {
    const title = item.itemTypeName ?? item.typeName ?? item.title ?? '';
    const colour = item.colour ?? '';
    const brandName = item.brandName ?? '';
    const description = item.description ?? '';
    const price = item.price ?? item.cost ?? 0;

    const hasPhoto =
      Boolean(item.photoPreview) ||
      (Array.isArray(item.photos) && item.photos.length > 0);

    const statusConfig = getStatusConfig(item.status ?? 0);

    return (
      <div
        ref={ref}
        className={cn(
          'w-full rounded-2xl border p-3 shadow-sm transition-all hover:shadow-md',
          statusConfig.cardClass
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="mt-1 truncate text-lg font-semibold leading-tight text-foreground">
                {getValue(title)}
              </p>

              <span
                className={cn(
                  'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
                  statusConfig.badgeClass
                )}
              >
                {statusConfig.label}
              </span>
            </div>

            <div className="mt-2 space-y-1">
              <p className="truncate text-sm text-muted-foreground">
                Цвет: {getValue(colour)}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                Бренд: {getValue(brandName)}
              </p>
              <p className="truncate text-sm text-muted-foreground">
                Дефекты: {getValue(description, 'Нет заметок')}
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-start gap-2">
            {hasPhoto && (
              <Button
                type="button"
                size="icon"
                className="h-9 w-9 rounded-xl"
                onClick={() => onPreviewPhoto?.(item)}
              >
                <ImageIcon className="h-4 w-4" />
              </Button>
            )}

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  variant="delete"
                  size="icon"
                  className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>

              <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                  <AlertDialogTitle>Удалить предмет?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Вы уверены? Введенные данные для этого предмета будут удалены.
                  </AlertDialogDescription>
                </AlertDialogHeader>

                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive hover:bg-destructive/90"
                    onClick={() => onDelete(item.id)}
                  >
                    Удалить
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="mt-3 border-t border-border/60 pt-2">
          <p className="text-2xl font-semibold leading-none text-foreground">
            {formatCurrency(price)}
          </p>
        </div>
      </div>
    );
  }
);

OrderItemCard.displayName = 'OrderItemCard';

export default OrderItemCard;