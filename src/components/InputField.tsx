
import React, { forwardRef } from "react";
import { Label } from "./ui-main/label";
import { Input } from "./ui-main/input";

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string;
  error?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, id, error, className, ...props }, ref) => {
    return (
      <div className="space-y-2">
        <Label htmlFor={id} className="text-we-gray-700">
          {label}
        </Label>
        <Input
          id={id}
          ref={ref}
          className={`
            bg-white border-we-gray-300 text-we-gray-900 placeholder:text-we-gray-500 focus:border-we-gold focus:ring-we-gold/20 h-11",
            error && "border-red-500",
            ${className}`}
          {...props}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
