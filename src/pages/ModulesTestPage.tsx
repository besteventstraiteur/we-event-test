import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

interface ModuleTest {
  name: string;
  endpoint: string;
  status: 'pending' | 'success' | 'error';
  data?: any;
  error?: string;
}

const modules: Omit<ModuleTest, 'status'>[] = [
  { name: '1. Photos', endpoint: '/api/events/event-1/photos' },
  { name: '2. Videos', endpoint: '/api/events/event-1/videos' },
  { name: '3. Inspirations', endpoint: '/api/inspirations' },
  { name: '4. Playlists', endpoint: '/api/playlists' },
  { name: '5. Menu Items', endpoint: '/api/menu-items' },
  { name: '6. Room Plans', endpoint: '/api/room-plans' },
  { name: '7. Podcasts', endpoint: '/api/podcasts' },
  { name: '8. Badges', endpoint: '/api/badges' },
  { name: '9. Mini-sites', endpoint: '/api/events/demo-event/site' },
  { name: '10. Ambassadors', endpoint: '/api/ambassadors' },
  { name: '11. Disputes', endpoint: '/api/disputes' },
  { name: '12. Contracts', endpoint: '/api/bookings/booking-1/contracts' },
  { name: '13. Invoices', endpoint: '/api/bookings/booking-1/invoices' },
];

export default function ModulesTestPage() {
  const [results, setResults] = useState<ModuleTest[]>(
    modules.map(m => ({ ...m, status: 'pending' as const }))
  );
  const [testing, setTesting] = useState(false);

  const testAllModules = async () => {
    setTesting(true);
    
    for (let i = 0; i < modules.length; i++) {
      const module = modules[i];
      
      try {
        const response = await fetch(`${API_BASE_URL}${module.endpoint}`);
        const data = await response.json();
        
        setResults(prev => prev.map((r, idx) => 
          idx === i 
            ? { ...r, status: data.success ? 'success' : 'error', data, error: data.success ? undefined : data.message }
            : r
        ));
      } catch (error: any) {
        setResults(prev => prev.map((r, idx) => 
          idx === i 
            ? { ...r, status: 'error', error: error.message }
            : r
        ));
      }
      
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    setTesting(false);
  };

  useEffect(() => {
    // Auto-test on mount
    testAllModules();
  }, []);

  const successCount = results.filter(r => r.status === 'success').length;
  const errorCount = results.filter(r => r.status === 'error').length;
  const pendingCount = results.filter(r => r.status === 'pending').length;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🧪 Test des 13 Modules</h1>
        <p className="text-muted-foreground">
          Backend API: <code className="bg-muted px-2 py-1 rounded">{API_BASE_URL}</code>
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Résultats des Tests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-center">
            <Badge variant="default" className="text-lg py-2 px-4">
              <CheckCircle className="w-5 h-5 mr-2" />
              {successCount} Réussis
            </Badge>
            <Badge variant="destructive" className="text-lg py-2 px-4">
              <XCircle className="w-5 h-5 mr-2" />
              {errorCount} Erreurs
            </Badge>
            {pendingCount > 0 && (
              <Badge variant="secondary" className="text-lg py-2 px-4">
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                {pendingCount} En cours
              </Badge>
            )}
            <Button 
              onClick={testAllModules} 
              disabled={testing}
              className="ml-auto"
            >
              {testing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Test en cours...
                </>
              ) : (
                'Retester Tous les Modules'
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((result, index) => (
          <Card key={index} className={
            result.status === 'success' ? 'border-green-500' :
            result.status === 'error' ? 'border-red-500' :
            'border-gray-300'
          }>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>{result.name}</span>
                {result.status === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
                {result.status === 'error' && <XCircle className="w-5 h-5 text-red-500" />}
                {result.status === 'pending' && <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="mb-2">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">{result.endpoint}</code>
              </div>
              
              {result.status === 'success' && result.data && (
                <div className="text-green-600">
                  ✓ {Array.isArray(result.data.data) ? `${result.data.data.length} éléments` : 'Données reçues'}
                </div>
              )}
              
              {result.status === 'error' && (
                <div className="text-red-600 text-xs">
                  ✗ {result.error || 'Erreur inconnue'}
                </div>
              )}
              
              {result.status === 'pending' && (
                <div className="text-gray-400">
                  En attente...
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {successCount === modules.length && (
        <Card className="mt-6 border-green-500 bg-green-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                🎉 Tous les modules fonctionnent !
              </h2>
              <p className="text-green-600">
                Les 13 modules sont opérationnels et connectés au backend.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
