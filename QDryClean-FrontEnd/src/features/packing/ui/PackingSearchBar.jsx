import { Search } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function PackingSearchBar({
  receiptNumber,
  loading,
  error,
  onChange,
  onSearch,
}) {
  return (
    <Card className="border-border shadow-sm">
      <CardContent className="p-6">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-foreground">
              Прцесс упаковки
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Поиск заказа по номеру чека и обновление статуса упаковки предметов.
            </p>
          </div>

          <div className="w-full xl:w-auto">
            <Label
              htmlFor="receiptNumber"
              className="text-sm font-medium text-foreground"
            >
              Номер чека
            </Label>

            <div className="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-[260px] md:w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  id="receiptNumber"
                  value={receiptNumber}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch();
                  }}
                  placeholder="Введите номер чека"
                  className="pl-10"
                />
              </div>

              <Button
                type="button"
                onClick={onSearch}
                disabled={loading}
                className="sm:min-w-[110px]"
              >
                {loading ? 'Поиск...' : 'Поиск'}
              </Button>
            </div>

            {error && (
              <p className="mt-2 text-sm text-destructive">{error}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}