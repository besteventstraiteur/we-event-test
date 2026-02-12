import React from "react";
import type { FieldError } from "react-hook-form";

interface InputGroupProps {
  label?: string;
  type?: string;
  placeholder?: string;
  className?: string;
  error?: FieldError;
  defaultValue?: string | number;
  disabled?: boolean;
  onChange?: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement
  >; // pass register here
  rows?: number;
}

const InputGroup: React.FC<InputGroupProps> = ({
  label,
  type = "text",
  placeholder = "",
  className = "",
  error,
  inputProps = {},
  defaultValue,
  disabled = false,
  rows = 4,
  onChange,
}) => {
  const baseClass = `w-full px-3 py-3 sm:text-base outline-none placeholder:text-[#8897AD] border bg-inputbg rounded-lg focus:border-secondary dark:bg-neutral-800 dark:text-neutral-300 ${className} ${
    error ? "border-red-500" : "border-inputborder dark:border-neutral-700"
  }`;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (inputProps?.onChange) {
      inputProps.onChange(e);
    }
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <>
      {label && (
        <label className="block mb-2 text-base font-medium text-mainclr dark:text-neutral-300">
          {label}
        </label>
      )}

      {type === "textarea" ? (
        <textarea
          {...inputProps}
          placeholder={placeholder}
          className={baseClass}
          rows={rows}
          onChange={handleChange}
          disabled={disabled}
          defaultValue={defaultValue}
        />
      ) : (
        <input
          {...inputProps}
          type={type}
          placeholder={placeholder}
          className={baseClass}
          onChange={handleChange}
          disabled={disabled}
          defaultValue={defaultValue}
        />
      )}

      {error?.message && (
        <p className="text-red-500 text-sm mt-1">{error.message}</p>
      )}
    </>
  );
};

export default InputGroup;
