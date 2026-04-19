import { forwardRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { CalendarDays } from 'lucide-react';
import { format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';

const PickerButton = forwardRef(({ value, onClick }, ref) => (
  <button
    type="button"
    onClick={onClick}
    ref={ref}
    className="flex h-11 w-full items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300"
  >
    <span className="truncate">{value || 'Select period'}</span>
    <CalendarDays className="h-4 w-4 shrink-0 text-slate-500" />
  </button>
));

PickerButton.displayName = 'PickerButton';

function formatRangeValue(startDate, endDate) {
  if (!startDate && !endDate) return 'Select period';
  if (startDate && !endDate) return `${format(startDate, 'dd.MM.yyyy')} - ...`;
  return `${format(startDate, 'dd.MM.yyyy')} - ${format(endDate, 'dd.MM.yyyy')}`;
}

export default function DateRangePicker({ value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, endDate] = value ?? [null, null];

  return (
    <DatePicker
      wrapperClassName="w-full"
      open={isOpen}
      onClickOutside={() => setIsOpen(false)}
      onInputClick={() => setIsOpen(true)}
      selected={startDate}
      onChange={(dates) => {
        const [from, to] = dates;
        onChange?.(dates);

        if (from && to) {
          setIsOpen(false);
        }
      }}
      startDate={startDate}
      endDate={endDate}
      selectsRange
      shouldCloseOnSelect={false}
      monthsShown={2}
      maxDate={new Date()}
      dateFormat="dd.MM.yyyy"
      popperPlacement="bottom-end"
      calendarClassName="rounded-2xl border border-slate-200 shadow-xl"
      customInput={
        <PickerButton
          value={formatRangeValue(startDate, endDate)}
        />
      }
    />
  );
}