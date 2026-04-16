import { useState } from 'react';
import DashboardTabs from '../features/dashboard/ui/DashboardTabs';
import OrdersReportsDashboard from '../features/dashboard/orders-reports/ui/OrdersReportsDashboard';
import InventoryUtilitiesDashboard from '../features/inventory-utilities/ui/InventoryUtilitiesDashboard';

export default function DashboardPage() {
  const [activeDashboard, setActiveDashboard] = useState('orders');

  return (

    
    <div className="min-h-screen bg-[#f5f6f8] p-4 md:p-6">
      <div className="space-y-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Dashboard
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Overview of orders, performance and operations
          </p>
        </div>
        <DashboardTabs
          activeDashboard={activeDashboard}
          onChange={setActiveDashboard}
        />

        {activeDashboard === 'orders' && <OrdersReportsDashboard />}
        {activeDashboard === 'inventory' && <InventoryUtilitiesDashboard />}
      </div>
    </div>
  );
}