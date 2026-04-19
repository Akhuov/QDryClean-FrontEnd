const tabs = [
  { key: 'orders', label: 'Orders & Reports' },
  { key: 'inventory', label: 'Inventory & Utilities' },
];

export default function DashboardTabs({ activeDashboard, onChange }) {
  return (
    <div className="inline-flex flex-wrap gap-2">
      {tabs.map((tab) => {
        const isActive = activeDashboard === tab.key;

        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onChange(tab.key)}
            className={`rounded-2xl px-5 py-3 text-sm font-medium transition ${
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
  );
}