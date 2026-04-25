import { Search } from 'lucide-react';
import { useRef } from 'react';
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
  const inputRef = useRef(null);

  const handleFocus = (e) => {
    const input = e.target;

    requestAnimationFrame(() => {
      const length = input.value.length;
      input.focus();
      input.setSelectionRange(length, length);
    });
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="customer-phone">Номер телефона *</Label>

      <div className="space-y-3">
        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="group flex flex-1 items-center rounded-2xl border border-slate-200 bg-white px-3 shadow-sm transition-all duration-200 focus-within:border-blue-400 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]">
            <Search className="h-4 w-4 shrink-0 text-slate-400 transition-colors group-focus-within:text-blue-500" />

            <Input
              ref={inputRef}
              id="customer-phone"
              value={phone}
              onChange={(e) => onPhoneChange(e.target.value)}
              onKeyDown={onKeyDown}
              onFocus={handleFocus}
              placeholder="+998 99 999 99 99"
              className="h-12 border-0 bg-transparent pl-3 pr-1 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>

          <Button
            type="button"
            onClick={onSearch}
            disabled={isSearchDisabled || searchingCustomer}
            className="h-12 min-w-[120px] rounded-2xl"
          >
            {searchingCustomer ? 'Поиск...' : 'Поиск'}
          </Button>
        </div>

        {customerError && (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-destructive">{customerError}</p>

            {canCreateCustomer && (
              <Button
                type="button"
                variant="outline"
                onClick={onOpenCreateCustomer}
                className="rounded-xl"
              >
                Создать клиента
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}