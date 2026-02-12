// components/CustomDatePicker.js
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const CustomDatePicker = ({
  selected,
  onChange,
  placeholderText = "Select date",
  dateFormat = "dd/MM/yyyy",
  minDate,
  maxDate,
  isClearable = true,
  showTimeSelect = false,
  className = "",
  ...props
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      placeholderText={placeholderText}
      dateFormat={dateFormat}
      minDate={minDate}
      maxDate={maxDate  || null}
      isClearable={isClearable}
      showTimeSelect={showTimeSelect}
      className={`w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border border-inputborder dark:border-neutral-700  bg-inputbg dark:bg-neutral-800 rounded-lg focus:border-secondary  dark:text-neutral-300   ${className}`}
      {...props}
      
    />
  );
};

export default CustomDatePicker;
