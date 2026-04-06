import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import StatusBadge from '../../../components/StatusBadge';
import CustomerCard from './CustomerCard';
import { formatCurrency } from '../lib/currency';
import { formatPhoneDisplay } from '../lib/phone';

const getValue = (value, fallback = '—') => {
  if (value === null || value === undefined || value === '') return fallback;
  return value;
};

const formatDate = (value) => {
  if (!value) return '—';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return '—';

  return date.toLocaleDateString('ru-RU');
};

function ViewItemCard({ item }) {
  const typeName = item.itemType?.name ?? '';
  const color = item.colour ?? '';
  const brand = item.brandName ?? '';
  const defects = item.description ?? '';
  const price = item.itemType?.cost ?? 0;

  const title = brand?.trim()
    ? `${brand.trim()} ${typeName}`.trim()
    : typeName || 'Item';

  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs text-muted-foreground">
          Тип: {getValue(typeName)}
        </p>

        <p className="text-lg font-semibold text-foreground break-words">
          {getValue(title)}
        </p>

        <div className="pt-1 space-y-1">
          <p className="text-sm text-muted-foreground break-words">
            Цвет: {getValue(color, 'Не указан')}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            Бренд: {getValue(brand, 'Не указан')}
          </p>
          <p className="text-sm text-muted-foreground break-words">
            Дефекты: {getValue(defects, 'Нет заметок')}
          </p>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-3">
        <p className="text-2xl font-semibold text-foreground">
          {formatCurrency(price)}
        </p>
      </div>
    </div>
  );
}

export default function OrderViewDialog({
  open,
  onOpenChange,
  order,
  loading = false,
}) {
  const items = order?.items || [];
  const notes = order?.notes || [];

  const total = items.reduce((sum, item) => {
    const price = item.itemType?.cost ?? 0;
    return sum + price;
  }, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white p-0 sm:max-w-[960px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle className="text-[20px] font-semibold text-foreground">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex-1 overflow-y-auto px-6 py-10 text-center text-muted-foreground">
              Loading order details...
            </div>
          ) : !order ? (
            <div className="flex-1 overflow-y-auto px-6 py-10 text-center text-muted-foreground">
              No order data
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Receipt Number</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {getValue(order.receiptNumber)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Status</p>
                        <div className="mt-1">
                          <StatusBadge status={order.status} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Created At</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Expected Completion</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(order.expectedCompletionDate)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground">Notes</p>

                      {notes.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {notes.map((note, index) => (
                            <p key={index} className="text-sm text-foreground break-words">
                              • {note}
                            </p>
                          ))}
                        </div>
                      ) : (
                        <p className="mt-1 text-sm text-foreground">Нет заметок</p>
                      )}
                    </div>
                  </div>

                  {order.customer && (
                    <CustomerCard
                      customer={order.customer}
                      formatPhoneDisplay={formatPhoneDisplay}
                    />
                  )}

                  <div className="space-y-3">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                      <h3 className="text-lg font-semibold text-foreground">Items</h3>
                      <span className="text-sm text-muted-foreground">
                        {items.length} item(s)
                      </span>
                    </div>

                    {items.length > 0 ? (
                      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {items.map((item) => (
                          <ViewItemCard key={item.id} item={item} />
                        ))}
                      </div>
                    ) : (
                      <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                        No items found
                      </div>
                    )}
                  </div>

                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-sm text-muted-foreground">Total</span>
                      <span className="text-2xl font-semibold text-foreground">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="shrink-0 border-t px-6 py-4">
                <div className="flex justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onOpenChange(false)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}