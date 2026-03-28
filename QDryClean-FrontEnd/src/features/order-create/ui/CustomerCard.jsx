import { User } from 'lucide-react';

export default function CustomerCard({ customer, formatPhoneDisplay }) {
  if (!customer) return null;

  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full border bg-background">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-semibold text-foreground">
              {customer.fullName}
            </p>
            <p className="text-sm text-muted-foreground">
              {formatPhoneDisplay(customer.phoneNumber)}
            </p>
          </div>
        </div>

        <p className="text-sm text-muted-foreground">Customer</p>
      </div>
    </div>
  );
}