import { Card, CardContent } from '../../../components/ui/card';
import { Package, ClipboardList, AlertTriangle } from 'lucide-react';
import KPIBox from '../../dashboard/ui/KPIBox';
import AlertItem from '../../dashboard/ui/AlertItem';

export default function InventoryUtilitiesDashboard() {
  return (
    <>
      {/* KPI */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-3">
          <KPIBox title="Low Stock Items" value="8" subtitle="Need replenishment" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Detergent Usage" value="124L" subtitle="Current month" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Water Consumption" value="18.4m³" subtitle="+6.2% vs last month" />
        </div>

        <div className="xl:col-span-3">
          <KPIBox title="Electricity Usage" value="426 kWh" subtitle="+3.1% vs last month" />
        </div>
      </div>

      {/* Main */}
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <Card className="rounded-3xl border-0 bg-white shadow-none">
            <CardContent className="p-5 md:p-6">
              <div className="mb-4">
                <h3 className="text-2xl font-semibold tracking-tight">
                  Inventory & Utilities Overview
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Stock, расходники и коммунальные показатели.
                </p>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* Consumables */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-medium">Consumables</div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Detergent</span>
                      <span className="font-medium text-red-600">12% left</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Soap</span>
                      <span className="font-medium">18 units</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Receipt paper</span>
                      <span className="font-medium">34 rolls</span>
                    </div>
                  </div>
                </div>

                {/* Utilities */}
                <div className="rounded-2xl bg-gray-50 p-4">
                  <div className="text-sm font-medium">Utilities</div>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Water</span>
                      <span className="font-medium">18.4 m³</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Electricity</span>
                      <span className="font-medium">426 kWh</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Gas / Steam</span>
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
                Inventory Alerts
              </h3>

              <div className="space-y-3">
                <AlertItem
                  tone="orange"
                  icon={<Package className="h-4 w-4" />}
                  title="Detergent below threshold"
                  subtitle="Reorder recommended today"
                />

                <AlertItem
                  tone="blue"
                  icon={<ClipboardList className="h-4 w-4" />}
                  title="Water usage increased"
                  subtitle="Check against previous week"
                />

                <AlertItem
                  tone="red"
                  icon={<AlertTriangle className="h-4 w-4" />}
                  title="Inventory check required"
                  subtitle="2 items have inconsistent balance"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}