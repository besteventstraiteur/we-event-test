
import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeEventButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "subtle" | "ghost";
  size?: "xs" | "sm" | "default" | "lg" | "icon";
  children: React.ReactNode;
}

const WeEventButton: React.FC<WeEventButtonProps> = ({ 
  variant = "default", 
  size = "default", 
  children, 
  className, 
  ...props 
}) => {
  const baseStyles = "font-body transition-all duration-200 ease-out";
  
  const variantStyles = {
    default: "bg-we-gold hover:bg-we-gold/90 text-we-black border border-transparent",
    outline: "border border-we-gold text-we-gold hover:bg-we-gold/10 bg-transparent",
    subtle: "bg-we-beige hover:bg-we-beige/80 text-we-green border-transparent",
    ghost: "text-we-green hover:bg-we-green/10 border-transparent bg-transparent"
  };
  
  const sizeStyles = {
    xs: "text-xs px-2 py-1 rounded-md",
    sm: "text-sm px-3 py-1.5 rounded-md",
    default: "px-4 py-2 rounded-md",
    lg: "text-base px-5 py-3 rounded-md",
    icon: "h-9 w-9 rounded-full p-0"
  };

  return (
    <Button
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
};

export default WeEventButton;
