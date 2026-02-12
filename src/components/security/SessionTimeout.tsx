
import React, { useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const WARN_BEFORE_MS = 5 * 60 * 1000; // 5 minutes before timeout

interface SessionTimeoutProps {
  children?: ReactNode;
}

export const SessionTimeout: React.FC<SessionTimeoutProps> = ({ children }) => {
  const { logout, isAuthenticated } = useAuth();
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) return;

    const startTime = Number(localStorage.getItem('sessionStartTime') || Date.now());
    localStorage.setItem('sessionStartTime', startTime.toString());

    const checkSession = () => {
      const elapsedTime = Date.now() - startTime;
      const remaining = SESSION_TIMEOUT_MS - elapsedTime;

      if (remaining <= 0) {
        logout();
        toast({
          title: "Session expirée",
          description: "Votre session a expiré. Veuillez vous reconnecter.",
          variant: "destructive"
        });
        return;
      }

      if (remaining <= WARN_BEFORE_MS && !showWarning) {
        setShowWarning(true);
        setTimeRemaining(Math.round(remaining / 1000 / 60));
      }

      if (remaining > WARN_BEFORE_MS) {
        setShowWarning(false);
      }
    };

    const intervalId = setInterval(checkSession, 60000); // Check every minute
    checkSession(); // Initial check

    return () => clearInterval(intervalId);
  }, [isAuthenticated, logout, showWarning]);

  const handleExtendSession = () => {
    localStorage.setItem('sessionStartTime', Date.now().toString());
    setShowWarning(false);
  };

  if (!showWarning) {
    return <>{children}</>;
  }

  return (
    <>
      {children}
      <AlertDialog open={showWarning}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Votre session va bientôt expirer</AlertDialogTitle>
            <AlertDialogDescription>
              Votre session se termine dans {timeRemaining} minute{timeRemaining !== 1 ? 's' : ''}.
              Voulez-vous prolonger votre session ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={logout}>Se déconnecter</AlertDialogCancel>
            <AlertDialogAction onClick={handleExtendSession}>
              Prolonger la session
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SessionTimeout;
