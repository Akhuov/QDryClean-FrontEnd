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
      <Card className="w-full lg:w-[420px]">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />

              <Input
                placeholder="Search by id / receipt / customer / note"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                className="pl-10 pr-10 h-10"
              />

              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={onClear}
                aria-hidden={!searchQuery}
                tabIndex={searchQuery ? 0 : -1}
                className={`
                  absolute right-2 inset-y-0 my-auto
                  h-8 w-8 p-0 shadow-none
                  transition-opacity
                  ${searchQuery ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                `}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            <Button onClick={onSearch} className="h-10 px-4" disabled={loading}>
              Search
            </Button>
          </div>

          {error && <p className="text-sm text-destructive mt-2">{error}</p>}
        </CardContent>
      </Card>

      <div className="w-full flex-1">
        <div className="mt-3 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="w-full sm:w-[220px]">
            <Select>
              <SelectTrigger className="h-10">
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

          <Button variant="outline" className="h-10 w-full sm:w-auto">
            Reset
          </Button>
        </div>
      </div>
    </>
  );
}
