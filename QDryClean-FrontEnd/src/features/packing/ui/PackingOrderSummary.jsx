import { CheckCircle2, PackageCheck, ReceiptText } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Card, CardContent } from '../../../components/ui/card';
import { cn } from '../../../components/ui/utils';

export default function PackingOrderSummary({
  receiptNumber,
  totalItems,
  hasSelection,
  submitting,
  onSubmit,
}) {
  return (
    <Card className="overflow-hidden border-border shadow-sm">
      <CardContent className="p-0">
        <div className="px-6 py-5">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-border bg-background p-4">
              <div className="mb-3 flex items-center gap-2 text-muted-foreground">
                <ReceiptText className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Receipt Number
                </span>
              </div>

              <p className="text-3xl font-semibold leading-none text-foreground">
                {receiptNumber ?? '—'}
              </p>
            </div>

            <div className="rounded-2xl border border-blue-100 bg-blue-50/50 p-4">
              <div className="mb-3 flex items-center gap-2 text-blue-600">
                <PackageCheck className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Total Items
                </span>
              </div>

              <p className="text-3xl font-semibold leading-none text-foreground">
                {totalItems ?? 0}
              </p>
            </div>

            <div
              className={cn(
                'rounded-2xl border p-4',
                hasSelection
                  ? 'border-emerald-200 bg-emerald-50/60'
                  : 'border-border bg-muted/30'
              )}
            >
              <div
                className={cn(
                  'mb-3 flex items-center gap-2',
                  hasSelection ? 'text-emerald-700' : 'text-muted-foreground'
                )}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span className="text-xs font-medium uppercase tracking-wide">
                  Selection Status
                </span>
              </div>

              <p
                className={cn(
                  'text-xl font-semibold leading-none',
                  hasSelection ? 'text-emerald-700' : 'text-foreground'
                )}
              >
                {hasSelection ? 'Items selected' : 'No items selected'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">
            {hasSelection
              ? 'Selected items will be marked as Packed.'
              : 'Select one or more items to continue.'}
          </p>

          <Button
            type="button"
            onClick={onSubmit}
            disabled={submitting || !hasSelection}
            className={cn(
              'min-w-[180px]',
              hasSelection && 'bg-emerald-600 hover:bg-emerald-700'
            )}
          >
            {submitting ? 'Packing...' : 'Submit Packing'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}