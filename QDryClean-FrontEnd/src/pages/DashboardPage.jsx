import { useMemo, useState } from 'react';
import DashboardTabs from '../features/dashboard/ui/DashboardTabs';
import OrdersReportsDashboard from '../features/dashboard/orders-reports/ui/OrdersReportsDashboard';
import InventoryUtilitiesDashboard from '../features/inventory-utilities/ui/InventoryUtilitiesDashboard';
import DateRangePicker from '../components/ui/DateRangePicker';

export default function DashboardPage() {
  const [activeDashboard, setActiveDashboard] = useState('orders');
  const [selectedPeriod, setSelectedPeriod] = useState({
    from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
    to: new Date(),
  });

  const currentTitle = useMemo(() => {
    if (activeDashboard === 'inventory') {
      return {
        title: 'Dashboard',
        description: 'Overview of inventory, utilities and stock alerts',
      };
    }

    return {
      title: 'Dashboard',
      description: 'Overview of orders, performance and operations',
    };
  }, [activeDashboard]);

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-4 md:p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            {currentTitle.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {currentTitle.description}
          </p>
        </div>

        <div className="rounded-3xl bg-white p-2">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto] md:items-center">
            <div className="min-w-0">
              <DashboardTabs
                activeDashboard={activeDashboard}
                onChange={setActiveDashboard}
              />
            </div>

            {activeDashboard === 'orders' && (
              <div className="justify-self-stretch md:justify-self-end">
                <div className="w-full md:w-[240px]">
                  <DateRangePicker
                    value={[selectedPeriod.from, selectedPeriod.to]}
                    onChange={([from, to]) =>
                      setSelectedPeriod({
                        from,
                        to,
                      })
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {activeDashboard === 'orders' && (
          <OrdersReportsDashboard selectedPeriod={selectedPeriod} />
        )}

        {activeDashboard === 'inventory' && <InventoryUtilitiesDashboard />}
      </div>
    </div>
  );
}