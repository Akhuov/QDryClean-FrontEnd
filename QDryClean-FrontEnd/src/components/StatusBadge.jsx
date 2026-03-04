export const statusMap = {
  0: { label: "Created", badge: "bg-zinc-200 text-zinc-900 border border-zinc-400" },
  1: { label: "Accepted", badge: "bg-sky-200 text-sky-900 border border-sky-400" },
  2: { label: "Ready", badge: "bg-yellow-200 text-yellow-950 border border-yellow-400" },
  3: { label: "Completed", badge: "bg-emerald-200 text-emerald-950 border border-emerald-400" },
  4: { label: "Canceled", badge: "bg-rose-200 text-rose-950 border border-rose-400" },
  5: { label: "Donated", badge: "bg-violet-200 text-violet-950 border border-violet-400" },
};

export default function StatusBadge({ status }) {
  const meta = statusMap[status] ?? { label: `Status ${status}`, badge: 'bg-muted text-muted-foreground' };
  return <span className={`px-3 py-1 rounded-full text-sm ${meta.badge}`}>{meta.label}</span>;
}
