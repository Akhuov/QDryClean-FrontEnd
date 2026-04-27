import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import PackingItemCard from '../features/packing/ui/PackingItemCard';
import PackingOrderSummary from '../features/packing/ui/PackingOrderSummary';
import PackingSearchBar from '../features/packing/ui/PackingSearchBar';
import { usePackingPage } from '../features/packing/model/usePackingPage';
import { formatCurrency } from '../features/order/lib/currency';

export default function PackingPage() {
  const vm = usePackingPage();

  const handleSubmit = async () => {
    await vm.handleSubmit();
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-foreground">Упаковка</h1>
          <p className="text-muted-foreground mt-1">Поиск заказа по номеру чека и отметка предметов как упакованных.</p>
        </div>
      </div>

      <PackingSearchBar
        receiptNumber={vm.receiptNumber}
        loading={vm.loading}
        error={vm.error}
        onChange={vm.handleReceiptChange}
        onSearch={vm.handleSearch}
      />

      {vm.items.length > 0 && (
        <>
          <PackingOrderSummary
            receiptNumber={vm.receiptNumber}
            totalItems={vm.items.length}
            hasSelection={!!vm.selectedItemId}
            submitting={vm.submitting}
            onSubmit={handleSubmit}
          />

          <Card className="border-border shadow-sm">
            <CardHeader>
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <CardTitle className="text-foreground">Вещи</CardTitle>
                <span className="text-sm text-muted-foreground">
                  {vm.items.length} item(s)
                </span>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {vm.items.map((item) => (
                  <PackingItemCard
                    key={item.id}
                    item={item}
                    selected={vm.selectedItemId === item.id}
                    disabled={item.status === 1}
                    onSelect={vm.selectItem}
                    formatCurrency={formatCurrency}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}