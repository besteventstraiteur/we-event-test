import React from "react";
import Select, {
  Props as SelectProps,
  SingleValue,
  MultiValue,
} from "react-select";

interface Option {
  value: string | number;
  label: string;
}

interface CustomSelectProps
  extends Omit<
    SelectProps<Option, boolean>,
    "options" | "value" | "onChange" | "isMulti"
  > {
  options: Option[];
  value?: Option | Option[] | null;
  onChange: (value: SingleValue<Option> | MultiValue<Option>) => void;
  isMulti?: boolean;
  isDisabled?: boolean;
  placeholder?: string;
  name?: string;
  label?: string;
  error?: string;
  className?: string;
}

const customStyles = {
  control: (provided, state) => ({
    ...provided,
    minHeight: "36px",
    height: "36px",
    boxShadow: "none",
    paddingTop: "2px",
    fontSize: "15px",
    borderColor: state.isFocused ? "#d4d7e3" : "#d4d7e3",
    "&:hover": { borderColor: "#d4d7e3" },
  }),
};

const CustomSelect: React.FC<CustomSelectProps> = ({
  options = [],
  value,
  onChange,
  isMulti = false,
  isDisabled = false,
  placeholder = "Select...",
  name,
  label,
  error,
  filterOption,
  className = "",
  ...rest
}) => {
  return (
    <div className={`custom-select-container ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300"
        >
          {label}
        </label>
      )}
      <Select
        inputId={name}
        name={name}
        options={options}
        value={value}
        onChange={onChange}
        isMulti={isMulti}
        isDisabled={isDisabled}
        placeholder={placeholder}
        className="custom-select"
        filterOption={() => true}
        classNames={{
          control: () =>
            `border rounded-full py-[6px] px-3 text-sm sm:text-base outline-none focus:outline-none ${
              error ? "border-red-500" : "border-inputborder dark:border-neutral-700"
            }`,
          menu: () => "z-50 mt-1 bg-white shadow-lg rounded-md",
          option: (state) =>
            `p-2 cursor-pointer ${
              state.isSelected ? "bg-secondary text-white" : "text-gray-800"
            } hover:bg-blue-100`,
        }}
        {...rest}
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default CustomSelect;
