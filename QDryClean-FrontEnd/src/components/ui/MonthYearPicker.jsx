import { forwardRef } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { format, endOfMonth } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const PickerButton = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 shadow-none transition hover:border-slate-300"
  >
    <span>{value}</span>
    <CalendarDays className="h-4 w-4 text-slate-500" />
  </button>
));

PickerButton.displayName = 'PickerButton';

export default function MonthYearPicker({ value, onChange }) {
  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      dateFormat="MMMM yyyy"
      showMonthYearPicker
      maxDate={endOfMonth(new Date())}
      customInput={<PickerButton />}
      popperPlacement="bottom-end"
      calendarClassName="rounded-2xl border border-slate-200 shadow-xl"
    />
  );
}