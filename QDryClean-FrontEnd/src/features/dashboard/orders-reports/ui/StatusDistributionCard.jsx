import { useState } from 'react';
import {
  Pie,
  PieChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Sector,
} from 'recharts';
import { Card, CardContent } from '../../../../components/ui/card';

const statusData = [
  { name: 'Processing', value: 45, color: '#1D4ED8' }, // твой синий
  { name: 'Ready', value: 24, color: '#F8C59C' },
  { name: 'Created', value: 12, color: '#B9DCFF' },
  { name: 'Cancelled', value: 6, color: '#E3E7EE' },
];

function CustomTooltip({ active, payload, total }) {
  if (!active || !payload || !payload.length) return null;

  const item = payload[0].payload;
  const percent = total ? ((item.value / total) * 100).toFixed(1) : 0;

  return (
    <div className="rounded-2xl border border-slate-100 bg-white/95 px-3 py-2 shadow-[0_12px_30px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="text-sm font-semibold text-slate-800">{item.name}</div>
      <div className="mt-1 text-xs text-slate-500">
        {item.value} orders • {percent}%
      </div>
    </div>
  );
}

// 🔥 hover эффект (увеличение сектора)
function renderActiveShape(props) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props;

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
    </g>
  );
}

export default function StatusDistributionCard() {
  const [activeIndex, setActiveIndex] = useState(-1);

  const total = statusData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="rounded-[28px] border border-white/60 bg-white shadow-[0_10px_35px_rgba(15,23,42,0.04)]">
      <CardContent className="p-6">
        <div className="mb-5">
          <h3 className="text-[30px] font-semibold tracking-tight text-slate-800">
            Status Distribution
          </h3>
        </div>

        <div className="relative mx-auto h-[250px] max-w-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                innerRadius={66}
                outerRadius={92}
                paddingAngle={2}
                stroke="#ffffff"
                strokeWidth={5}
                activeIndex={activeIndex}
                activeShape={renderActiveShape}
                onMouseEnter={(_, index) => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(-1)}
              >
                {statusData.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-[42px] font-semibold leading-none text-slate-800">
              {total}
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-[0.28em] text-slate-500">
              Orders
            </div>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-5">
          {statusData.map((item, index) => (
            <div
              key={item.name}
              className={`flex items-center gap-3 rounded-lg px-2 py-1 transition ${
                activeIndex === index ? 'bg-slate-50' : ''
              }`}
              onMouseEnter={() => setActiveIndex(index)}
              onMouseLeave={() => setActiveIndex(-1)}
            >
              <span
                className="h-3 w-3 rounded-full ring-4 ring-white"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-[15px] font-medium text-slate-700">
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}