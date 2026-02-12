
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SavedPaymentMethods from './SavedPaymentMethods';
import { PaymentMethod } from '@/services/PaymentService';

interface PaymentMethodSelectorProps {
  userId: string;
  onSelectSaved: (method: PaymentMethod) => void;
  onSelectNew: () => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  userId,
  onSelectSaved,
  onSelectNew
}) => {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  
  const handleSelect = (method: PaymentMethod | null) => {
    setSelectedMethod(method);
    if (method) {
      onSelectSaved(method);
    }
  };

  return (
    <Tabs defaultValue="saved" className="w-full" onValueChange={(value) => {
      if (value === 'new') {
        onSelectNew();
      }
    }}>
      <TabsList className="grid grid-cols-2 mb-4">
        <TabsTrigger value="saved">Cartes enregistrées</TabsTrigger>
        <TabsTrigger value="new">Nouvelle carte</TabsTrigger>
      </TabsList>
      
      <TabsContent value="saved">
        <SavedPaymentMethods 
          userId={userId} 
          onSelect={handleSelect}
          selectedId={selectedMethod?.id}
        />
      </TabsContent>
      
      <TabsContent value="new">
        <p className="text-sm text-gray-500 mb-4">
          Entrez les informations de votre carte ci-dessous
        </p>
      </TabsContent>
    </Tabs>
  );
};

export default PaymentMethodSelector;
