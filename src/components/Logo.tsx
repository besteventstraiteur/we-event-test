
import React from "react";
import { Link } from "react-router-dom";

interface LogoProps {
  size?: "small" | "medium" | "large";
  asButton?: boolean;
}

const Logo: React.FC<LogoProps> = ({ size = "large", asButton = true }) => {
  const sizeClasses = {
    small: "h-24",
    medium: "h-32",
    large: "h-40"
  };

  const LogoContent = (
    <div className={`flex items-center`}>
      <img 
        src="/lovable-uploads/b9084086-687c-4556-8914-cc674205a61c.png" 
        alt="We Event Logo"
        className={`${sizeClasses[size]}`}
      />
    </div>
  );

  if (asButton) {
    return (
      <Link to="/" className="inline-flex hover:opacity-80 transition-opacity">
        {LogoContent}
      </Link>
    );
  }

  return LogoContent;
};

export default Logo;
