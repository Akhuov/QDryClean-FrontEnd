import { Search, Trash2 } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

export default function OrdersSearchToolbar({
  searchQuery,
  onSearchChange,
  onSearch,
  onClear,
  loading,
  error
}) {
  return (
    <>
      <Card className="w-full lg:w-[600px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 flex-wrap lg:flex-nowrap">
            {/* Search input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <Input
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearch()}
                className="pl-10 pr-10 h-10"
              />

              {searchQuery ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={onClear}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 shadow-none"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              ) : null}
            </div>

            {/* Search button */}
            <Button onClick={onSearch} className="h-10 px-4 border border-border" disabled={loading}>
              Search
            </Button>

            {/* Status */}
            <div className="w-[200px]">
              <Select>
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Status: All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="0">New</SelectItem>
                  <SelectItem value="1">In Progress</SelectItem>
                  <SelectItem value="2">Ready</SelectItem>
                  <SelectItem value="3">Completed</SelectItem>
                  <SelectItem value="4">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Reset */}
            <Button className="h-10 px-4 border border-border" onClick={onClear}>
              Reset
            </Button>
          </div>

          {error ? <p className="text-sm text-destructive mt-2">{error}</p> : null}
        </CardContent>
      </Card>

    </>
  );
}
