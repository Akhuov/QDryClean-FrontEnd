export const revenueData = [
  { day: 'MON', current: 520, previous: 460 },
  { day: 'TUE', current: 680, previous: 590 },
  { day: 'WED', current: 430, previous: 510 },
  { day: 'THU', current: 560, previous: 500 },
  { day: 'FRI', current: 740, previous: 620 },
  { day: 'SAT', current: 480, previous: 450 },
  { day: 'SUN', current: 610, previous: 530 },
];

export const statusData = [
  { name: 'Processing', value: 45, color: '#2563eb' },
  { name: 'Ready', value: 24, color: '#c2410c' },
  { name: 'Created', value: 12, color: '#93c5fd' },
  { name: 'Cancelled', value: 6, color: '#d1d5db' },
];

export const recentOrders = [
  {
    id: '#1024',
    customer: 'Alexander Mitchell',
    status: 'Ready',
    payment: 'Paid',
    amount: '$42.50',
    date: 'Oct 24, 2023',
  },
  {
    id: '#1023',
    customer: 'Sophia Chen',
    status: 'In Progress',
    payment: 'Partial',
    amount: '$128.00',
    date: 'Oct 24, 2023',
  },
  {
    id: '#1022',
    customer: 'Marcus Thorne',
    status: 'Created',
    payment: 'Unpaid',
    amount: '$24.00',
    date: 'Oct 23, 2023',
  },
];

export const workflowStages = [
  { label: 'Accepted', value: 12, color: 'bg-sky-300', text: 'text-sky-700' },
  { label: 'Processing', value: 45, color: 'bg-blue-600', text: 'text-blue-700' },
  { label: 'Ready', value: 24, color: 'bg-orange-200', text: 'text-orange-700' },
  { label: 'Issued', value: 233, color: 'bg-gray-300', text: 'text-gray-600' },
];

export function getStatusBadge(status) {
  switch (status) {
    case 'Ready':
      return 'bg-orange-100 text-orange-700';
    case 'In Progress':
      return 'bg-blue-100 text-blue-700';
    case 'Created':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
}

export function getPaymentBadge(payment) {
  switch (payment) {
    case 'Paid':
      return 'bg-green-100 text-green-700';
    case 'Partial':
      return 'bg-amber-100 text-amber-700';
    case 'Unpaid':
      return 'bg-red-100 text-red-700';
    default:
      return 'bg-muted text-muted-foreground';
  }
}