import { Button } from '../../../components/u   i/button';

export default function OrderSummaryBar({
  total,
  loading,
  onCreateOrder,
  formatCurrency,
}) {
  return (
    <div className="flex flex-col gap-4 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-2xl font-semibold text-foreground">
        Total: {formatCurrency(total)}
      </p>

      <Button
        onClick={onCreateOrder}
        disabled={loading}
        className="min-w-[180px]"
      >
        {loading ? 'Creating...' : 'Create Order'}
      </Button>
    </div>
  );
}