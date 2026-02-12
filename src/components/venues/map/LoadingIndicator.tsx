
import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-vip-gold"></div>
    </div>
  );
};

export default LoadingIndicator;
