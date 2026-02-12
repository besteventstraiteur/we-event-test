
import React, { ReactNode } from "react";
import { useDeviceType } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
}

const MobileOptimizedLayout: React.FC<MobileOptimizedLayoutProps> = ({
  children,
  className,
  fullHeight = false,
}) => {
  const deviceType = useDeviceType();
  const isMobile = deviceType === 'mobile';
  
  return (
    <div 
      role="main"
      aria-label="Contenu principal"
      className={cn(
        "w-full max-w-full overflow-x-hidden",
        "focus:outline-none",
        "px-4 sm:px-6 md:px-8",
        isMobile && "mobile-view safe-area-top safe-area-bottom",
        fullHeight && "min-h-screen",
        className
      )}
      tabIndex={-1}
    >
      {children}
    </div>
  );
};

export default MobileOptimizedLayout;
