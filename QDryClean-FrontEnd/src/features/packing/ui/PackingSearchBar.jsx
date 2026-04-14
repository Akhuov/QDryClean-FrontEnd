import { Search } from 'lucide-react';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
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
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="w-full lg:w-auto">
            <Label htmlFor="receiptNumber" className="text-sm font-medium">Receipt Number</Label>
            <div className="mt-2 flex gap-3">
              <div className="relative flex-1 lg:w-[300px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="receiptNumber"
                  value={receiptNumber}
                  onChange={(e) => onChange(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') onSearch();
                  }}
                  placeholder="Enter receipt number"
                  className="pl-10"
                />
              </div>

              <Button type="button" onClick={onSearch} disabled={loading}>
                {loading ? 'Searching...' : 'Search'}
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