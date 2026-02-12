
import React from "react";
import { Loader2 } from "lucide-react";

export const MediaLoadingFallback = () => {
  return (
    <div className="flex items-center justify-center w-full h-full min-h-[200px] bg-muted animate-pulse">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  );
};
