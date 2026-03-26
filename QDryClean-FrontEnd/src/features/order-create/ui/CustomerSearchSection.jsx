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
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor="phone">Phone Number *</Label>

      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            id="phone"
            value={phone}
            onChange={onPhoneChange}
            onKeyDown={onKeyDown}
            className="bg-input-background border-input w-full pl-10"
            placeholder="+998 90 999 99 99"
            maxLength={17}
          />
        </div>

        <Button
          type="button"
          onClick={onSearch}
          disabled={searchingCustomer || isSearchDisabled}
        >
          {searchingCustomer ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {customerError && (
        <p className="text-sm text-destructive">{customerError}</p>
      )}
    </div>
  );
}