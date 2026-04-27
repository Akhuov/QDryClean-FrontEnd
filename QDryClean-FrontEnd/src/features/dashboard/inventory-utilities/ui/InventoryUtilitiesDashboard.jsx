import { Card, CardContent } from '../../../../components/ui/Card';
import { Package, ClipboardList, AlertTriangle } from 'lucide-react';
import KPIBox from '../../ui/KPIBox';
import AlertItem from '../../ui/AlertItem';

export default function InventoryUtilitiesDashboard() {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <KPIBox title="Минимальный запас" value="8" subtitle="Нужно дозаправить" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Расход расходных материалов" value="124L" subtitle="Текущий месяц" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Вода" value="18.4m³" subtitle="+6.2% vs last month" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Электричество" value="426 kWh" subtitle="+3.1% vs last month" />
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card className="rounded-3xl border-0 bg-white shadow-none">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Обзор инвентаря и коммунальных услуг
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Инвентарь, расходники и коммунальные показатели.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Consumables */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-medium">Расходные материалы</div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Порошок</span>
                      <span className="font-medium text-red-600">12% осталось</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Мыло</span>
                      <span className="font-medium">18 шт</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Бумага для чеков</span>
                      <span className="font-medium">34 рулонов</span>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-medium">Коммунальные услуги</div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Вода</span>
                      <span className="font-medium">18.4 m³</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Электричество</span>
                      <span className="font-medium">426 kWh</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Газ / Пар</span>
                      <span className="font-medium">—</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts */}
        <div className="xl:col-span-4">
          <Card className="rounded-3xl border-0 bg-white shadow-none">
            <CardContent className="p-5 md:p-6">
              <h3 className="mb-4 text-2xl font-semibold tracking-tight">
                Оповещения по инвентарю
              </h3>

              <div className="space-y-3">
                <AlertItem
                  tone="orange"
                  icon={<Package className="h-4 w-4" />}
                  title="Низкий уровень расходных материалов"
                  subtitle="Рекомендуется заказать сегодня"
                />

                <AlertItem
                  tone="blue"
                  icon={<ClipboardList className="h-4 w-4" />}
                  title="Повышенный расход воды"
                  subtitle="Проверьте показания на прошлой неделе"
                />

                <AlertItem
                  tone="red"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  title="Проверка инвентаря обязательна"
                  subtitle="2 позиции имеют несогласованный баланс"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}