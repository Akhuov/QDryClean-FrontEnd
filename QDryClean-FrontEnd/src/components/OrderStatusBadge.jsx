export const statusMap = {
  0: { 
    label: "Draft", 
    badge: "bg-gray-100 text-gray-700 border border-gray-300" 
  },

  1: { 
    label: "Created", 
    badge: "bg-blue-100 text-blue-800 border border-blue-300" 
  },

  2: { 
    label: "InProgress", 
    badge: "bg-amber-100 text-amber-800 border border-amber-300" 
  },

  3: { 
    label: "Ready", 
    badge: "bg-cyan-100 text-cyan-800 border border-cyan-300" 
  },

  4: { 
    label: "Completed", 
    badge: "bg-green-100 text-green-800 border border-green-300" 
  },

  5: { 
    label: "Canceled", 
    badge: "bg-red-100 text-red-800 border border-red-300" 
  },

  6: { 
    label: "Donated", 
    badge: "bg-purple-100 text-purple-800 border border-purple-300" 
  },
};

export default function OrderStatusBadge({ status }) {
  const meta = statusMap[status] ?? { label: `Status ${status}`, badge: 'bg-muted text-muted-foreground' };
  return <span className={`px-3 py-1 rounded-full text-sm ${meta.badge}`}>{meta.label}</span>;
}
