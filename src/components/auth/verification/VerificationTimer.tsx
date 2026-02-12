
import React from "react";
import { useVerification } from "@/contexts/VerificationContext";

const VerificationTimer: React.FC = () => {
  const { timeLeft, isExpired } = useVerification();
  
  // Format remaining time
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  return (
    <div className={`text-sm ${isExpired ? 'text-red-500' : 'text-gray-500'}`}>
      {isExpired 
        ? "Le code a expiré, veuillez demander un nouveau code." 
        : `Le code expire dans ${formatTime(timeLeft)}.`}
    </div>
  );
};

export default VerificationTimer;
