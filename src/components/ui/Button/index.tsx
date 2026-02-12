import React from "react";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
  iconStart?: ReactNode;
  iconEnd?: ReactNode;
  loading?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  variant = "primary",
  size = "medium",
  fullWidth = false,
  className = "",
  style = {},
  iconStart = null,
  iconEnd = null,
  loading = false,
  ...rest
}) => {
  const isDisabled = disabled || loading;

  // Tailwind classes for variant
  const variantClasses: Record<string, string> = {
    primary: "bg-secondary text-white capitalize hover:bg-tertiary dark:bg-white dark:text-mainclr",
    secondary: "bg-tertiary text-white capitalize hover:bg-secondary dark:bg-white dark:text-mainclr",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline:
      "bg-transparent hover:bg-secondary dark:bg-secondary dark:hover:bg-tertiary border border-secondary text-secondary dark:text-white hover:text-white",
  };

  // Tailwind classes for size
  const sizeClasses: Record<string, string> = {
    small: "px-3 py-1 text-sm",
    medium: "px-5 py-2 text-base",
    large: "px-6 py-3 text-lg",
  };

  const buttonClass = `
    rounded-lg text-center transition-all duration-300 ease-in-out
    ${variantClasses[variant]} 
    ${sizeClasses[size]}
    ${fullWidth ? "w-full" : ""}
    ${isDisabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}
    ${className}
  `.trim();

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={buttonClass}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {loading ? (
        <div className="flex items-center justify-center space-x-2">
          <span>Veuillez patienter</span>
          <span className="flex space-x-1">
            <span className="animate-ping w-2 h-2 bg-white rounded-full" />
            <span className="animate-ping w-2 h-2 bg-white rounded-full delay-150" />
            <span className="animate-ping w-2 h-2 bg-white rounded-full delay-300" />
          </span>
        </div>
      ) : (
        <div className="flex items-center justify-center gap-1">
          {iconStart && <span className="mr-2">{iconStart}</span>}
          {children}
          {iconEnd && <span className="ml-2">{iconEnd}</span>}
        </div>
      )}
    </button>
  );
};

export default Button;
