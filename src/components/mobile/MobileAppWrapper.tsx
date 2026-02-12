
import React, { useEffect, useState } from 'react';
import { Capacitor } from '@capacitor/core';
import { useIsMobile, useDeviceType, useOrientation } from '@/hooks/use-mobile';
import { NetworkStatus } from '../app/NetworkStatus';
import { QuickActions } from '../app/QuickActions';

interface MobileAppWrapperProps {
  children: React.ReactNode;
  type: "client" | "partner" | "admin" | "guest";
}

const MobileAppWrapper = ({ children, type }: MobileAppWrapperProps) => {
  const [isNative, setIsNative] = useState(false);
  const isMobile = useIsMobile();
  const deviceType = useDeviceType();
  const orientation = useOrientation();
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  
  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    
    if (isMobile) {
      const metaViewport = document.querySelector('meta[name=viewport]');
      if (metaViewport) {
        metaViewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
      }
      
      document.documentElement.style.overflowX = 'hidden';
      document.body.style.overflowX = 'hidden';
      
      document.body.classList.add('safe-area-top');
      document.body.classList.add('safe-area-bottom');
      
      document.addEventListener('touchstart', function() {}, {passive: true});
    }

    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    });

    return () => {
      if (isMobile) {
        document.removeEventListener('touchstart', function() {}, {passive: true} as EventListenerOptions);
      }
    };
  }, [isMobile]);

  return (
    <div className={`app-container ${isNative ? 'native-app' : 'web-app'} ${isMobile ? 'mobile-view' : ''} ${orientation === 'portrait' ? 'portrait' : 'landscape'} w-full max-w-full overflow-x-hidden`} data-app-type={type}>
      {isNative && (
        <div className="status-bar-spacer h-6 bg-white w-full"></div>
      )}
      
      {isMobile && !localStorage.getItem('mobile-optimized-notice-shown') && (
        <div 
          className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-vip-gold text-white px-4 py-2 rounded-lg shadow-lg z-50 max-w-[90%]"
          onClick={() => {
            localStorage.setItem('mobile-optimized-notice-shown', 'true');
            document.body.removeChild(document.querySelector('.mobile-optimize-notice')!);
          }}
        >
          <p className="text-center text-sm">Cette application est optimisée pour mobile</p>
        </div>
      )}
      
      <NetworkStatus />
      {isMobile && (
        <QuickActions
          isInstallable={isInstallable}
          installPrompt={installPrompt}
          setInstallPrompt={setInstallPrompt}
          setIsInstallable={setIsInstallable}
        />
      )}
      {children}
    </div>
  );
};

export default MobileAppWrapper;
