import { Search, X } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';

export default function OrdersSearchToolbar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  loading,
  error,
}) {
  return (
    <div className="w-full max-w-xl space-y-2">
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Поиск заказов..."
            className="pl-9 pr-9"
          />

          {searchQuery && (
            <Button
              variant="ghost"
              type="button"
              onClick={onClear}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
              aria-label="Clear search"
              title="Clear"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {error ? (
        <p className="text-sm text-destructive">{error}</p>
      ) : null}
    </div>
  );
}