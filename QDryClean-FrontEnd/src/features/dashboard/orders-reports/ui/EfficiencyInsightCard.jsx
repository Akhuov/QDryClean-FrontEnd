import { ArrowUpRight } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';

export default function EfficiencyInsightCard() {
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-none">
      <CardContent className="flex flex-col gap-5 p-5 md:flex-row md:items-center">
        <div className="h-24 w-full overflow-hidden rounded-2xl bg-gray-100 md:w-36" />

        <div className="flex-1">
          <h3 className="text-2xl font-semibold tracking-tight">Efficiency Insight</h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Your "Ready for Pickup" time has improved by 15% this week. Consider
            promoting the same-day service to capitalize on current throughput capacity.
          </p>

          <button className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:underline">
            Full Analytics Report
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>
      </CardContent>
    </Card>
  );
}