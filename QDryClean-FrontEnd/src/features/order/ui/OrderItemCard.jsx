import { forwardRef } from 'react';
import { Image as ImageIcon, Trash2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
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
} from '../../../components/ui/alert-dialog';

const getValue = (value, fallback = 'Не указан') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

const OrderItemCard = forwardRef(({ item, onDelete, formatCurrency, onPreviewPhoto }, ref) => {
  const typeName = item.typeName ?? item.itemTypeName ?? '';
  const title = item.title ?? item.itemTypeName ?? item.typeName ?? '';
  const color = item.color ?? item.colour ?? '';
  const brand = item.brand ?? item.brandName ?? '';
  const defects = item.defects ?? item.description ?? '';
  const price = item.price ?? item.cost ?? 0;

  return (
    <div
      ref={ref}
      className="w-full rounded-2xl border border-border bg-card p-3 shadow-sm"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs text-muted-foreground">
            Тип: {getValue(typeName)}
          </p>

          <p className="mt-1 truncate text-lg font-semibold leading-tight text-foreground">
            {getValue(title)}
          </p>

          <div className="mt-2 space-y-1">
            <p className="truncate text-sm text-muted-foreground">
              Цвет: {getValue(color)}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Бренд: {getValue(brand)}
            </p>
            <p className="truncate text-sm text-muted-foreground">
              Дефекты: {getValue(defects, 'Нет заметок')}
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-start gap-2">
          {item.photoPreview && (
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

            <AlertDialogContent className="bg-white opacity-100">
              <AlertDialogHeader>
                <AlertDialogTitle>Delete item?</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure? Entered data for this item will be removed.
                </AlertDialogDescription>
              </AlertDialogHeader>

              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive hover:bg-destructive/90"
                  onClick={() => onDelete(item.id)}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-3 border-t border-border pt-2">
        <p className="text-2xl font-semibold leading-none text-foreground">
          {formatCurrency(price)}
        </p>
      </div>
    </div>
  );
});

OrderItemCard.displayName = 'OrderItemCard';

export default OrderItemCard;