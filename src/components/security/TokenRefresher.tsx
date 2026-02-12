
import { useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';

interface TokenRefresherProps {
  children: ReactNode;
  refreshInterval?: number; // Intervalle de rafraîchissement en minutes
}

const TokenRefresher = ({ children, refreshInterval = 55 }: TokenRefresherProps) => {
  const { session, isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated || !session) return;
    
    const refreshIntervalMs = refreshInterval * 60 * 1000; // Conversion en millisecondes
    
    // Définir un intervalle pour rafraîchir la session avant son expiration
    const intervalId = setInterval(async () => {
      try {
        console.log('Attempting to refresh token...');
        
        // With cookie storage, refreshSession() will automatically update the HTTPOnly cookie
        const { data, error } = await supabase.auth.refreshSession();
        
        if (error) {
          console.error('Token refresh failed:', error);
        }
        
        if (data && data.session) {
          console.log('Token refreshed successfully');
        }
      } catch (error) {
        console.error('Error during token refresh:', error);
      }
    }, refreshIntervalMs);
    
    // Nettoyer l'intervalle lors du démontage du composant
    return () => {
      clearInterval(intervalId);
    };
  }, [isAuthenticated, session, refreshInterval]);
  
  return <>{children}</>;
};

export default TokenRefresher;
