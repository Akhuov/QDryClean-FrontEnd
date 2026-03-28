import { Search } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';

export default function CustomerSearchSection({
  phone,
  searchingCustomer,
  customerError,
  onPhoneChange,
  onSearch,
  onKeyDown,
  isSearchDisabled,
  onOpenCreateCustomer,
  canCreateCustomer,
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="customer-phone">Phone Number *</Label>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="h-4 w-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <Input
            id="customer-phone"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="+998 99 999 99 99"
            className="pl-10"
          />
        </div>

        <Button
          type="button"
          onClick={onSearch}
          disabled={isSearchDisabled || searchingCustomer}
        >
          {searchingCustomer ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {customerError && (
        <div className="flex items-center justify-between gap-3">
          <p className="text-sm text-destructive">{customerError}</p>

          {canCreateCustomer && (
            <Button
              type="button"
              variant="ghost"
              className="h-auto p-0 text-sm"
              onClick={onOpenCreateCustomer}
            >
              Create customer
            </Button>
          )}
        </div>
      )}
    </div>
  );
}