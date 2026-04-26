import { Button } from '../../../components/ui/button';

export default function OrderSummaryBar({
  total,
  loading,
  onCreateOrder,
  formatCurrency,
  actionText = 'Создать заказ',
}) {
  return (
    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-2xl font-semibold text-foreground">
        Итого: {formatCurrency(total)}
      </p>

      <Button
        onClick={onCreateOrder}
        disabled={loading}
        className="min-w-[180px]"
      >
        {loading ? 'Сохранение...' : actionText}
      </Button>
    </div>
  );
}