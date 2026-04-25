import { Card, CardContent } from '../../../../components/ui/card';
import { workflowStages } from '../../model/ordersReportsData';

export default function WorkflowPipelineCard() {
  return (
    <Card className="rounded-3xl border-0 bg-white shadow-none">
      <CardContent className="flex h-full flex-col p-5 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Дорожная карта
          </h2>

          <button className="text-sm font-medium text-blue-600 hover:underline">
            Управление стадиями
          </button>
        </div>

        <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {workflowStages.map((stage, index) => (
            <div key={stage.label} className="relative">
              <div className={`mb-3 h-2 w-16 rounded-full ${stage.color}`} />
              <div className="text-sm text-foreground">{stage.label}</div>
              <div className={`mt-1 text-2xl font-semibold ${stage.text}`}>
                {stage.value}
              </div>

              {index < workflowStages.length - 1 && (
                <div className="absolute right-[-8px] top-9 hidden text-gray-300 md:block">
                  ›
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}