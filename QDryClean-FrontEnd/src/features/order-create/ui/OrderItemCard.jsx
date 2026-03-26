import { forwardRef } from 'react';
import { Trash2 } from 'lucide-react';
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

const OrderItemCard = forwardRef(({ item, onDelete, formatCurrency }, ref) => {
  return (
    <div ref={ref} className="rounded-xl border border-border bg-card p-4 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-muted-foreground">
            Тип: {item.typeName}
          </p>

          <p className="mt-1 text-lg font-semibold text-foreground">
            {item.title}
          </p>

          <p className="mt-2 text-sm text-muted-foreground">
            Цвет: {item.color}
          </p>
          <p className="text-sm text-muted-foreground">
            Бренд: {item.brand}
          </p>
          <p className="text-sm text-muted-foreground">
            Дефекты: {item.defects}
          </p>

          {item.photoPreview && (
            <img
              src={item.photoPreview}
              alt={item.title}
              className="mt-3 h-20 w-20 rounded-md border object-cover"
            />
          )}
        </div>

        <div className="flex shrink-0 items-start gap-3">
          <div className="text-right">
            <p className="text-xl font-semibold text-foreground">
              {formatCurrency(item.price)}
            </p>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button
                type="button"
                variant="delete"
                size="icon"
                className="text-muted-foreground hover:text-destructive"
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
    </div>
  );
});

OrderItemCard.displayName = 'OrderItemCard';

export default OrderItemCard;