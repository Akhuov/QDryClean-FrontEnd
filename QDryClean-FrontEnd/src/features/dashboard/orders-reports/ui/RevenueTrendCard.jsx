import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent } from '../../../../components/ui/card';
import { revenueData } from '../../model/ordersReportsData';

export default function RevenueTrendCard() {
  return (
    <Card className="h-full rounded-3xl border-0 bg-white shadow-none">
      <CardContent className="flex h-full flex-col p-5 md:p-6">
        <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
          <div>
            <h3 className="text-2xl font-semibold tracking-tight">Динамика доходов</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Ежедневные доходы по сравнению с прошлой неделей
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-700" />
              Текущая неделя
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-200" />
              Прошлая неделя
            </div>
          </div>
        </div>

        <div className="flex-1 min-h-[320px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={revenueData} barCategoryGap={18}>
              <CartesianGrid vertical={false} stroke="#eceef2" />
              <XAxis dataKey="day" tickLine={false} axisLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="previous" radius={[10, 10, 0, 0]} fill="#c7d7f3" />
              <Bar dataKey="current" radius={[10, 10, 0, 0]} fill="#1d4ed8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}