
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Building2, Shield } from 'lucide-react';
import { useDemoLogin } from '@/hooks/auth/methods/useDemoLogin';

const DemoLoginButtons: React.FC = () => {
  const { loginAsDemo } = useDemoLogin();

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-center">Accès Démonstration</CardTitle>
        <p className="text-sm text-muted-foreground text-center">
          Choisissez un type d'utilisateur pour accéder aux interfaces
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button 
          onClick={() => loginAsDemo('client')}
          className="w-full justify-start bg-blue-600 hover:bg-blue-700"
        >
          <User className="mr-2 h-4 w-4" />
          Accéder en tant que Client
        </Button>
        
        <Button 
          onClick={() => loginAsDemo('partner')}
          className="w-full justify-start bg-green-600 hover:bg-green-700"
        >
          <Building2 className="mr-2 h-4 w-4" />
          Accéder en tant que Partenaire
        </Button>
        
        <Button 
          onClick={() => loginAsDemo('admin')}
          className="w-full justify-start bg-red-600 hover:bg-red-700"
        >
          <Shield className="mr-2 h-4 w-4" />
          Accéder en tant qu'Admin
        </Button>
      </CardContent>
    </Card>
  );
};

export default DemoLoginButtons;
