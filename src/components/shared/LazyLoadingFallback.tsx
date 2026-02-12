import React from "react";
import { Loader2 } from "lucide-react";

const LazyLoadingFallback: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-[200px]">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};

export { LazyLoadingFallback };
export default LazyLoadingFallback;
