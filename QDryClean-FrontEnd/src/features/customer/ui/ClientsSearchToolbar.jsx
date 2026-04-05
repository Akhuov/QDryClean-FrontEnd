import { Search, X } from 'lucide-react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

export default function ClientsSearchToolbar({
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
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearch();
              }
            }}
            placeholder="Search customers by name or phone..."
            className="pl-9 pr-9"
          />

          {searchQuery && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onClear}
              className="absolute right-2 top-1/2 h-7 w-7 -translate-y-1/2 rounded-full"
              aria-label="Clear search"
              title="Clear search"
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