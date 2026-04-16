import WorkflowPipelineCard from './WorkflowPipelineCard';
import EfficiencyInsightCard from './EfficiencyInsightCard';
import PriorityAlertsCard from './PriorityAlertsCard';
import RevenueTrendCard from './RevenueTrendCard';
import PackingEfficiencyCard from './PackingEfficiencyCard';
import StatusDistributionCard from './StatusDistributionCard';
import RecentOrdersCard from './RecentOrdersCard';
import KPIBox from '../../ui/KPIBox';

export default function OrdersReportsDashboard() {
  return (
    <>
      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-4">
          <KPIBox
            title="Total Revenue (MTD)"
            value="$14,250"
            subtitle="+8.4% vs last month"
            accent
          />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 xl:col-span-8">
          <KPIBox title="Total Orders" value="342" subtitle="+12% growth" />
          <KPIBox title="Active Orders" value="85" subtitle="Processing now" />
          <KPIBox title="Ready for Pickup" value="24" subtitle="Waiting for customer" />
          <KPIBox title="Completed" value="233" subtitle="Past 30 days" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8 space-y-4">
          <WorkflowPipelineCard />
          <EfficiencyInsightCard />
        </div>

        <div className="xl:col-span-4">
          <PriorityAlertsCard />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        <div className="xl:col-span-8">
          <RevenueTrendCard />
        </div>

        <div className="grid gap-4 xl:col-span-4">
          <PackingEfficiencyCard />
          <StatusDistributionCard />
        </div>
      </div>

      <RecentOrdersCard />
    </>
  );
}