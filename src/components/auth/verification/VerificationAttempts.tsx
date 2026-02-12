
import React from "react";
import { useVerification } from "@/contexts/VerificationContext";

const VerificationAttempts: React.FC = () => {
  const { attempts, hasReachedMaxAttempts } = useVerification();
  
  if (attempts === 0) {
    return null;
  }

  return (
    <div className="text-sm text-amber-600">
      Tentatives: {attempts}/{hasReachedMaxAttempts ? attempts : attempts + 1}
    </div>
  );
};

export default VerificationAttempts;
