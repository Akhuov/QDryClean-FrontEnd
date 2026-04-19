export default function AlertItem({ icon, title, subtitle, tone = 'blue' }) {
  const toneClasses = {
    red: 'bg-red-50 text-red-700',
    orange: 'bg-orange-50 text-orange-700',
    blue: 'bg-blue-50 text-blue-700',
  };

  return (
    <div className={`flex items-start gap-3 rounded-2xl p-4 ${toneClasses[tone]}`}>
      <div className="mt-0.5 rounded-full bg-white/80 p-2">{icon}</div>
      <div>
        <div className="text-sm font-semibold">{title}</div>
        <div className="text-xs opacity-80">{subtitle}</div>
      </div>
    </div>
  );
}