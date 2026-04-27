export const statusMap = {
  0: { 
    label: "Не оплачено", 
    badge: "bg-red-100 text-red-800 border border-red-300" 
  },
  
  1: { 
    label: "Частично оплачено", 
    badge: "bg-amber-100 text-amber-800 border border-amber-300" 
  },

  2: { 
    label: "Оплачено", 
    badge: "bg-green-100 text-green-800 border border-green-300" 
  },
};

export default function PaymentStatusBadge({ status }) {
  const meta = statusMap[status] ?? { label: `Status ${status}`, badge: 'bg-muted text-muted-foreground' };
  return <span className={`px-3 py-1 rounded-full text-sm ${meta.badge}`}>{meta.label}</span>;
}
