import { AlertTriangle, ClipboardList, Package } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';
import AlertItem from '../../ui/AlertItem';

export default function PriorityAlertsCard() {
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-none">
      <CardContent className="p-5 md:p-6">
        <h3 className="mb-4 text-2xl font-semibold tracking-tight">Приоритетные оповещения</h3>

        <div className="space-y-3">
          <AlertItem
            tone="red"
            icon={<AlertTriangle className="h-4 w-4" />}
            title="3 задержанных заказа"
            subtitle="Требуется действие: Связаться с клиентами"
          />
          <AlertItem
            tone="orange"
            icon={<Package className="h-4 w-4" />}
            title="Низкий запас: Моющее средство"
            subtitle="Уровень запаса ниже 15%"
          />
          <AlertItem
            tone="blue"
            icon={<ClipboardList className="h-4 w-4" />}
            title="2 неоплаченных заказа"
            subtitle="Ожидание с вчера"
          />
        </div>
      </CardContent>
    </Card>
  );
}