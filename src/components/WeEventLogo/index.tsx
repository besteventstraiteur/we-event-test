
import React from "react";
import { Link } from "react-router-dom";
import Logoimage from '../../assets/images/logo-transparent.png'

interface LogoProps {
  asButton?: boolean;
  size?: "small" | "medium" | "large";
  withText?: boolean;
}

const WeEventLogo: React.FC<LogoProps> = ({ 
  asButton = false,
  size = "medium",
}) => {
  // Définir les dimensions en fonction de la taille (quadruplées par rapport à l'original)
  const dimensions = {
    small: { logo: "h-24", text: "text-base" },
    medium: { logo: "h-32", text: "text-xl" },
    large: { logo: "h-40", text: "text-2xl" },
  };

  const LogoContent = (
    <div className="flex items-center gap-2">
      <img 
        src={Logoimage}
        alt="We Event Logo" 
        className="max-w-48"
        // className={`${dimensions[size].logo}`}
      />
    </div>
  );

  if (asButton) {
    return (
      <Link to="/" className="no-underline flex items-center">
        {LogoContent}
      </Link>
    );
  }

  return LogoContent;
};

export default WeEventLogo;
