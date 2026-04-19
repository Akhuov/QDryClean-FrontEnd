import { Plus } from 'lucide-react';
import { Card, CardContent } from '../../../../components/ui/card';

export default function PackingEfficiencyCard() {
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-none">
      <CardContent className="p-5 md:p-6">
        <div className="mb-5 flex items-center justify-between">
          <h3 className="text-2xl font-semibold tracking-tight">Packing Efficiency</h3>

          <button className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-700 text-white shadow-md transition hover:scale-105">
            <Plus className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Items Packed</span>
              <span className="font-medium">75%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div className="h-2 w-[75%] rounded-full bg-blue-700" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>In Progress</span>
              <span className="font-medium">20%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div className="h-2 w-[20%] rounded-full bg-slate-400" />
            </div>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-sm">
              <span>Reprocessing</span>
              <span className="font-medium">5%</span>
            </div>
            <div className="h-2 rounded-full bg-gray-200">
              <div className="h-2 w-[5%] rounded-full bg-orange-700" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}