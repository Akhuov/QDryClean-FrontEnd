import { Card, CardContent } from '../../../components/ui/card';

export default function KPIBox({ title, value, subtitle, accent = false }) {
  return (
    <Card
      className={`rounded-3xl border-0 shadow-none ${
        accent ? 'bg-blue-600 text-white' : 'bg-white text-foreground'
      }`}
    >
      <CardContent className="p-5 md:p-6">
        <div
          className={`text-[11px] font-medium uppercase tracking-[0.18em] ${
            accent ? 'text-blue-100' : 'text-muted-foreground'
          }`}
        >
          {title}
        </div>

        <div className="mt-3 text-2xl font-semibold tracking-tight md:text-3xl">
          {value}
        </div>

        <div
          className={`mt-3 text-sm ${
            accent ? 'text-blue-100' : 'text-muted-foreground'
          }`}
        >
          {subtitle}
        </div>
      </CardContent>
    </Card>
  );
}