import React, { forwardRef, type ForwardedRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { Input } from "./Input";
import { Calendar, X } from "lucide-react";

type DateTimePickerProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const CustomDateTimeInput = forwardRef<
  HTMLInputElement,
  {
    value?: string;
    onClick?: () => void;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear?: () => void;
  }
>(
  (
    { value, onClick, onChange, onClear },
    ref: ForwardedRef<HTMLInputElement>
  ) => (
    <div className="relative w-full">
      <Input
        ref={ref}
        value={value}
        onClick={onClick}
        onChange={onChange}
        placeholder="Select date & time"
        icon={<Calendar className="w-5 h-5 text-gray-400 dark:text-gray-300" />}
        isDateTime={true}
        readOnly
      />
      {value && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (onClear) onClear();
          }}
          className="absolute inset-y-0 right-12 flex items-center text-gray-500 dark:text-white hover:text-gray-600 dark:hover:text-gray-300"
          aria-label="Clear date"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  )
);
CustomDateTimeInput.displayName = "CustomDateTimeInput";

const DateTimePicker: React.FC<DateTimePickerProps> = ({ value, onChange }) => {
  const handleClear = () => {
    onChange(null);
  };

  return (
    <DatePicker
      selected={value}
      onChange={onChange}
      showTimeSelect
      timeFormat="HH:mm"
      timeIntervals={15}
      timeCaption="Time"
      dateFormat="yyyy LLL dd / HH:mm"
      customInput={<CustomDateTimeInput onClear={handleClear} />}
      popperPlacement="bottom-start"
    />
  );
};

export default DateTimePicker;
