import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../../../components/ui/dialog';
import { Button } from '../../../components/ui/button';
import OrderStatusBadge from '../../../components/OrderStatusBadge';
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

const ITEM_STATUS = {
  Accepted: 0,
  Packed: 1,
  Issued: 2,
  Reprocessing: 3,
  Damaged: 4,
  Lost: 5,
};

const PAYMENT_STATUS = {
  NotPaid: 0,
  PartiallyPaid: 1,
  Paid: 2,
};

const getPaymentStatusConfig = (status) => {
  switch (Number(status)) {
    case PAYMENT_STATUS.NotPaid:
      return {
        label: 'Не оплачено',
        className: 'bg-red-100 text-red-700 border-red-200',
      };
    case PAYMENT_STATUS.PartiallyPaid:
      return {
        label: 'Частично оплачено',
        className: 'bg-amber-100 text-amber-700 border-amber-200',
      };
    case PAYMENT_STATUS.Paid:
      return {
        label: 'Оплачено',
        className: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      };
    default:
      return {
        label: 'Неизвестно',
        className: 'bg-muted text-muted-foreground border-border',
      };
  }
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
        label: 'Собрано',
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
        label: 'Неизвестный',
        wrapperClass: 'border-l-4 border-l-border bg-card',
        badgeClass: 'border-border bg-muted text-muted-foreground',
      };
  }
};

function ViewItemCard({ item }) {
  const typeName = item.itemType?.name ?? '';
  const color = item.colour ?? '';
  const brand = item.brandName ?? '';
  const defects = item.description ?? '';
  const price = item.itemType?.cost ?? 0;
  const statusConfig = getItemStatusConfig(item.status);

  return (
    <div
      className={`rounded-2xl border border-border p-4 shadow-sm ${statusConfig.wrapperClass}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-1">
          <p className="break-words text-lg font-semibold text-foreground">
            {typeName}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2.5 py-1 text-xs font-medium ${statusConfig.badgeClass}`}
        >
          {statusConfig.label}
        </span>
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
  const invoice = order?.invoice;

  const paymentStatusConfig = getPaymentStatusConfig(invoice?.paymentStatus);

  const total = invoice?.totalCost ?? items.reduce((sum, item) => {
    const price = item.itemType?.cost ?? 0;
    return sum + price;
  }, 0);

  const debt = Math.max(0, (invoice?.totalCost ?? 0) - (invoice?.amountPaid ?? 0));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-white p-0 sm:max-w-[960px]"
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="flex max-h-[90vh] flex-col">
          <DialogHeader className="shrink-0 border-b px-6 py-4">
            <DialogTitle className="text-[20px] font-semibold text-foreground">
              Детали заказа
            </DialogTitle>
          </DialogHeader>

          {loading ? (
            <div className="flex-1 overflow-y-auto px-6 py-10 text-center text-muted-foreground">
              Загрузка...
            </div>
          ) : !order ? (
            <div className="flex-1 overflow-y-auto px-6 py-10 text-center text-muted-foreground">
              Нет данных о заказе
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto px-6 py-4">
                <div className="space-y-6">
                  <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Номер чека</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {getValue(order.receiptNumber)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Статус</p>
                        <div className="mt-1">
                          <OrderStatusBadge status={order.status} />
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Дата создания</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Предполагаемая дата завершения</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatDate(order.expectedCompletionDate)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Статус оплаты</p>
                        <span
                          className={`inline-block mt-1 rounded-full border px-2.5 py-1 text-xs font-medium ${paymentStatusConfig.className}`}
                        >
                          {paymentStatusConfig.label}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Сумма оплаты</p>
                        <p className="mt-1 text-sm font-medium text-foreground">
                          {formatCurrency(invoice?.amountPaid ?? 0)}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-muted-foreground">Долг</p>
                        <p className={`mt-1 text-sm font-medium ${debt > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
                          {formatCurrency(debt)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      <p className="text-xs text-muted-foreground">Заметки</p>

                      {notes.length > 0 ? (
                        <div className="mt-2 space-y-1">
                          {notes.map((note, index) => (
                            <p key={index} className="break-words text-sm text-foreground">
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
                      <h3 className="text-lg font-semibold text-foreground">Вещи</h3>
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
                        Вещи заказа отсутствуют
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
                    Закрыть
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
