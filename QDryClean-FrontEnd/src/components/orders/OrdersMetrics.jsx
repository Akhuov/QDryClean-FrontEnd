import { Card, CardContent } from '../ui/card';

export default function OrdersMetrics() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Total</p>
          <p className="text-2xl font-semibold leading-none">120</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">New</p>
          <p className="text-2xl font-semibold leading-none">12</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">In progress</p>
          <p className="text-2xl font-semibold leading-none">7</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground">Overdue</p>
          <p className="text-2xl font-semibold leading-none">3</p>
        </CardContent>
      </Card>
    </div>
  );
}
