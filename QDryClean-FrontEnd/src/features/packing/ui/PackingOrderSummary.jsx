import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';

export default function PackingOrderSummary({
  receiptNumber,
  totalItems,
  hasSelection,
  submitting,
  onSubmit,
}) {

  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-xs text-muted-foreground">Receipt Number</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {receiptNumber ?? '—'}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Total Items</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {totalItems ?? 0}
            </p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground">Status</p>
            <p className="mt-1 text-sm font-medium text-foreground">
              {hasSelection ? 'Item selected' : 'No item selected'}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
          <Button 
            type="button" 
            onClick={onSubmit} 
            disabled={submitting || !hasSelection}
            className="w-full sm:w-auto"
          >
            {submitting ? 'Packing...' : 'Mark as Packed'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}