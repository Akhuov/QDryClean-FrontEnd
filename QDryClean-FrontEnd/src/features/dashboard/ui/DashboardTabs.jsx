const tabs = [
  { key: 'orders', label: 'Orders & Reports' },
  { key: 'inventory', label: 'Inventory & Utilities' },
];

export default function DashboardTabs({ activeDashboard, onChange }) {
  return (
    <div className="rounded-3xl bg-white p-2">
      <div className="flex flex-col gap-2 md:flex-row">
        {tabs.map((tab) => {
          const isActive = activeDashboard === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              onClick={() => onChange(tab.key)}
              className={`rounded-2xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-muted-foreground hover:bg-gray-100 hover:text-foreground'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}